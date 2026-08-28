import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { PrismaClient } from "./generated/prisma/index.js";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || "development-secret-change-me";
const paypalBaseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.paypal.com";
const paypalBusinessEmail = process.env.PAYPAL_BUSINESS_EMAIL;

const allowedOrigins = new Set([
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.has(origin)) return callback(null, true);
  return callback(new Error("Origin is not allowed"));
} }));
app.use(express.json());

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: "7d" });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function publicProduct(product) {
  return { ...product, status: product.stock === 0 ? "Out of Stock" : product.stock < 15 ? "Low Stock" : "Active", rating: 4.5, reviews: 0, badge: "New", colors: [], sizes: ["One Size"] };
}

function authRequired(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    req.userId = jwt.verify(token, jwtSecret).sub;
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired" });
  }
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

async function paypalAccessToken() {
  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error("PayPal authentication failed");
  return (await response.json()).access_token;
}

app.post("/api/paypal/orders", async (req, res, next) => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) return res.status(503).json({ message: "PayPal is not configured on the server" });
    const token = await paypalAccessToken();
    const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ ...(paypalBusinessEmail && { payee: { email_address: paypalBusinessEmail } }), amount: { currency_code: "ZAR", value: Number(req.body.total).toFixed(2) } }] }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ message: data.message || "PayPal could not create the order" });
    res.status(201).json({ id: data.id });
  } catch (error) { next(error); }
});

app.post("/api/paypal/orders/:id/capture", async (req, res, next) => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) return res.status(503).json({ message: "PayPal is not configured on the server" });
    const token = await paypalAccessToken();
    const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${encodeURIComponent(req.params.id)}/capture`, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ message: data.message || "PayPal could not capture the payment" });
    res.json({ status: data.status, id: data.id });
  } catch (error) { next(error); }
});

app.get("/api/products", async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ products: products.map(publicProduct) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/products", authRequired, async (req, res, next) => {
  try {
    const { name, category, price, oldPrice, stock, image, emoji, grad } = req.body;
    if (!String(name || "").trim() || !String(category || "").trim()) return res.status(400).json({ message: "Name and category are required" });
    const product = await prisma.product.create({ data: {
      name: String(name).trim(), category: String(category).trim(), price: Number(price) || 0,
      oldPrice: Number(oldPrice) || 0, stock: Number(stock) || 0, image: image || null,
      emoji: emoji || "🛍️", grad: grad || "from-amber-400 to-amber-600",
    } });
    res.status(201).json({ product: publicProduct(product) });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/products/:id", authRequired, async (req, res, next) => {
  try {
    const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data: {
      ...(req.body.name !== undefined && { name: String(req.body.name).trim() }),
      ...(req.body.category !== undefined && { category: String(req.body.category).trim() }),
      ...(req.body.price !== undefined && { price: Number(req.body.price) || 0 }),
      ...(req.body.oldPrice !== undefined && { oldPrice: Number(req.body.oldPrice) || 0 }),
      ...(req.body.stock !== undefined && { stock: Number(req.body.stock) || 0 }),
      ...(req.body.image !== undefined && { image: req.body.image || null }),
    } });
    res.json({ product: publicProduct(product) });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/products/:id", authRequired, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/api/shop-content/:kind", async (req, res, next) => {
  try {
    const records = await prisma.shopContent.findMany({ where: { kind: req.params.kind }, orderBy: { createdAt: "desc" } });
    res.json({ items: records.map((record) => ({ id: record.itemKey, ...record.data })) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/orders", authRequired, async (_req, res, next) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { date: "desc" } });
    res.json({ orders });
  } catch (error) { next(error); }
});

app.post("/api/orders", async (req, res, next) => {
  try {
    const order = await prisma.order.create({ data: {
      id: String(req.body.id), customer: String(req.body.customer), date: new Date(req.body.date),
      items: Number(req.body.items) || 1, total: Number(req.body.total) || 0,
      status: String(req.body.status || "Pending"), delivery: String(req.body.delivery || "Courier Guy"), payment: String(req.body.payment || "Card"),
    } });
    res.status(201).json({ order });
  } catch (error) { next(error); }
});

app.patch("/api/orders/:id", authRequired, async (req, res, next) => {
  try {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: String(req.body.status || "Pending") } });
    res.json({ order });
  } catch (error) { next(error); }
});

app.post("/api/shop-content/:kind", authRequired, async (req, res, next) => {
  try {
    const itemKey = String(req.body.id || crypto.randomUUID());
    const { id: _id, ...data } = req.body;
    const record = await prisma.shopContent.create({ data: { kind: req.params.kind, itemKey, data } });
    res.status(201).json({ item: { id: record.itemKey, ...record.data } });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/shop-content/:kind/:id", authRequired, async (req, res, next) => {
  try {
    const current = await prisma.shopContent.findUnique({ where: { kind_itemKey: { kind: req.params.kind, itemKey: req.params.id } } });
    const { id: _id, ...changes } = req.body;
    const record = await prisma.shopContent.update({ where: { kind_itemKey: { kind: req.params.kind, itemKey: req.params.id } }, data: { data: { ...current.data, ...changes } } });
    res.json({ item: { id: record.itemKey, ...record.data } });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/shop-content/:kind/:id", authRequired, async (req, res, next) => {
  try {
    await prisma.shopContent.delete({ where: { kind_itemKey: { kind: req.params.kind, itemKey: req.params.id } } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/signup", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2) return res.status(400).json({ message: "Please enter your full name" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "An account with that email already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });
    return res.status(201).json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user && await bcrypt.compare(password, user.passwordHash);

    if (!valid) return res.status(401).json({ message: "Email or password is incorrect" });
    return res.json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", authRequired, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(401).json({ message: "Your account no longer exists" });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(port, () => console.log(`Auth API listening on http://localhost:${port}`));

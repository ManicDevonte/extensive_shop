import { getToken } from "./authApi.js";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Shop request failed");
  return data;
}

export async function getProducts() {
  return (await request("/api/products")).products;
}

export async function createProduct(product) {
  return (await request("/api/products", { method: "POST", body: JSON.stringify(product) })).product;
}

export async function updateProduct(id, product) {
  return (await request(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(product) })).product;
}

export async function deleteProduct(id) {
  await request(`/api/products/${id}`, { method: "DELETE" });
}

export async function getShopContent(kind) {
  return (await request(`/api/shop-content/${kind}`)).items;
}

export async function createShopContent(kind, item) {
  return (await request(`/api/shop-content/${kind}`, { method: "POST", body: JSON.stringify(item) })).item;
}

export async function updateShopContent(kind, id, item) {
  return (await request(`/api/shop-content/${kind}/${id}`, { method: "PATCH", body: JSON.stringify(item) })).item;
}

export async function deleteShopContent(kind, id) {
  await request(`/api/shop-content/${kind}/${id}`, { method: "DELETE" });
}

export async function getOrders() {
  return (await request("/api/orders")).orders;
}

export async function createOrder(order) {
  return (await request("/api/orders", { method: "POST", body: JSON.stringify(order) })).order;
}

export async function updateOrderStatus(id, status) {
  return (await request(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })).order;
}

export async function createPaypalOrder(total) {
  return (await request("/api/paypal/orders", { method: "POST", body: JSON.stringify({ total }) })).id;
}

export async function capturePaypalOrder(id) {
  return request(`/api/paypal/orders/${id}/capture`, { method: "POST" });
}
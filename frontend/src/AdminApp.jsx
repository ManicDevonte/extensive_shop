import React, { useState, useMemo } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct, getShopContent, createShopContent, updateShopContent, deleteShopContent, getOrders, createOrder, updateOrderStatus } from "./shopApi.js";
import AuthPage from "./AuthPage.jsx";
import { getCurrentUser } from "./authApi.js";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Zap, Image as ImageIcon,
  Truck, MapPin, Star, Bell, Shield, Search, Plus, Pencil, Trash2, X, Check,
  TrendingUp, CircleDollarSign, Menu, LogOut, Send,
  AlertCircle, CheckCircle2, Sun, Moon, BarChart3, Percent, Leaf, Flag,
  UserPlus, Clock
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

/* ---------------------------------- DATA ---------------------------------- */

const fmt = (n) => `R${Math.round(n).toLocaleString("en-ZA")}`;

const CATEGORY_NAMES = ["Hair", "Sneakers", "T-Shirts", "Jeans", "Hoodies", "iPhones", "Electronics", "Curtains", "Bedding", "Beauty"];

const seedProducts = [
  { id: 1, name: "Silk Press Bundle Hair, 3-Pack", category: "Hair", price: 899, oldPrice: 1299, stock: 12, sales: 214, status: "Active", emoji: "💇🏾‍♀️", grad: "from-fuchsia-400 to-purple-500" },
  { id: 2, name: "Cloudform Running Sneakers", category: "Sneakers", price: 1249, oldPrice: 1799, stock: 34, sales: 532, status: "Active", emoji: "👟", grad: "from-orange-400 to-red-500" },
  { id: 3, name: "Essential Oversized Tee", category: "T-Shirts", price: 249, oldPrice: 349, stock: 88, sales: 891, status: "Active", emoji: "👕", grad: "from-sky-400 to-blue-500" },
  { id: 4, name: "Straight Fit Denim Jeans", category: "Jeans", price: 599, oldPrice: 899, stock: 21, sales: 176, status: "Active", emoji: "👖", grad: "from-indigo-400 to-blue-600" },
  { id: 5, name: "Heavyweight Pullover Hoodie", category: "Hoodies", price: 749, oldPrice: 999, stock: 45, sales: 340, status: "Active", emoji: "🧥", grad: "from-slate-400 to-slate-600" },
  { id: 6, name: "Pro 15 Smartphone, 256GB", category: "iPhones", price: 18999, oldPrice: 21999, stock: 9, sales: 1204, status: "Low Stock", emoji: "📱", grad: "from-gray-400 to-gray-600" },
  { id: 7, name: "Studio Wireless ANC Headphones", category: "Electronics", price: 1899, oldPrice: 2599, stock: 27, sales: 402, status: "Active", emoji: "🎧", grad: "from-cyan-400 to-teal-500" },
  { id: 8, name: "Blackout Weave Curtain Pair", category: "Curtains", price: 449, oldPrice: 649, stock: 0, sales: 98, status: "Out of Stock", emoji: "🪟", grad: "from-amber-300 to-orange-400" },
  { id: 9, name: "Egyptian Cotton Duvet Set", category: "Bedding", price: 899, oldPrice: 1199, stock: 18, sales: 156, status: "Active", emoji: "🛏️", grad: "from-rose-300 to-pink-500" },
  { id: 10, name: "Glow Vitamin C Serum, 30ml", category: "Beauty", price: 329, oldPrice: 459, stock: 63, sales: 677, status: "Active", emoji: "💄", grad: "from-pink-400 to-fuchsia-500" },
];

const seedOrders = [
  { id: "EA-73104", customer: "Thandiwe Mabaso", date: "2026-07-16", items: 2, total: 1748, status: "Packed", delivery: "Courier Guy", payment: "PayFast" },
  { id: "EA-73098", customer: "Sipho Ndlovu", date: "2026-07-16", items: 1, total: 899, status: "Shipped", delivery: "PAXI", payment: "Ozow" },
  { id: "EA-73081", customer: "Amahle Khumalo", date: "2026-07-15", items: 3, total: 3248, status: "Delivered", delivery: "Courier Guy", payment: "Card" },
  { id: "EA-73076", customer: "Bongani Radebe", date: "2026-07-15", items: 1, total: 18999, status: "Pending", delivery: "Courier Guy", payment: "Payflex" },
  { id: "EA-73065", customer: "Naledi Sithole", date: "2026-07-14", items: 4, total: 2140, status: "Delivered", delivery: "PAXI", payment: "PayFast" },
  { id: "EA-73052", customer: "Kagiso Tau", date: "2026-07-14", items: 1, total: 249, status: "Cancelled", delivery: "Courier Guy", payment: "Card" },
  { id: "EA-73041", customer: "Zanele Dube", date: "2026-07-13", items: 2, total: 1148, status: "Delivered", delivery: "PAXI", payment: "Ozow" },
];

const seedCustomers = [
  { id: 1, name: "Thandiwe Mabaso", email: "thandiwe.m@example.co.za", orders: 8, spent: 12480, joined: "2025-11-02", tier: "Gold" },
  { id: 2, name: "Sipho Ndlovu", email: "sipho.n@example.co.za", orders: 3, spent: 3120, joined: "2026-02-14", tier: "Silver" },
  { id: 3, name: "Amahle Khumalo", email: "amahle.k@example.co.za", orders: 14, spent: 24990, joined: "2025-06-20", tier: "Gold" },
  { id: 4, name: "Bongani Radebe", email: "bongani.r@example.co.za", orders: 1, spent: 18999, joined: "2026-07-10", tier: "Bronze" },
  { id: 5, name: "Naledi Sithole", email: "naledi.s@example.co.za", orders: 6, spent: 5680, joined: "2025-09-05", tier: "Silver" },
];

const seedCoupons = [
  { code: "SAVE10", type: "Percent", value: "10%", uses: 342, limit: 1000, active: true, expires: "2026-08-31" },
  { code: "WELCOME50", type: "Flat", value: "R50", uses: 891, limit: null, active: true, expires: "No expiry" },
  { code: "FREESHIP", type: "Free Shipping", value: "—", uses: 156, limit: 500, active: true, expires: "2026-07-31" },
  { code: "WINTER25", type: "Percent", value: "25%", uses: 0, limit: 300, active: false, expires: "2026-06-01" },
];

const seedFlashSale = [
  { id: 1, name: "Silk Press Bundle Hair, 3-Pack", price: 899, oldPrice: 1299, endsIn: "05:12:44" },
  { id: 6, name: "Pro 15 Smartphone, 256GB", price: 18999, oldPrice: 21999, endsIn: "05:12:44" },
  { id: 10, name: "Glow Vitamin C Serum, 30ml", price: 329, oldPrice: 459, endsIn: "05:12:44" },
];

const seedBanners = [
  { id: 1, title: "Winter Assortment Drop", subtitle: "Fashion, tech & home — up to 45% off", cta: "Shop Flash Sale", grad: "from-amber-400 to-amber-600", active: true },
  { id: 2, title: "New Season Sneakers", subtitle: "Fresh drops every Friday", cta: "Explore Sneakers", grad: "from-orange-400 to-red-500", active: true },
  { id: 3, title: "Beauty Essentials", subtitle: "Glow up for less this month", cta: "Shop Beauty", grad: "from-pink-400 to-fuchsia-500", active: false },
];

const seedPickupPoints = [
  { id: 1, name: "PAXI Point – East London CBD", suburb: "Quigney", active: true },
  { id: 2, name: "PAXI Point – Vincent Park", suburb: "Vincent", active: true },
  { id: 3, name: "PAXI Point – Beacon Bay", suburb: "Beacon Bay", active: true },
  { id: 4, name: "PAXI Point – Gonubie", suburb: "Gonubie", active: false },
];

const seedReviews = [
  { id: 1, product: "Cloudform Running Sneakers", customer: "Sipho N.", rating: 2, text: "Sole started coming apart after two weeks of light use.", status: "Flagged" },
  { id: 2, product: "Pro 15 Smartphone, 256GB", customer: "Amahle K.", rating: 5, text: "Excellent phone, battery lasts all day. Highly recommend!", status: "Pending" },
  { id: 3, product: "Glow Vitamin C Serum, 30ml", customer: "Naledi S.", rating: 4, text: "Nice texture, noticed a difference within a couple weeks.", status: "Pending" },
];

const seedAdminUsers = [
  { id: 1, name: "Dumisani Mangqishe", email: "dumisani@extensiveassortment.co.za", role: "Super Admin" },
  { id: 2, name: "Lerato Mokoena", email: "lerato@extensiveassortment.co.za", role: "Store Manager" },
  { id: 3, name: "Ayanda Zulu", email: "ayanda@extensiveassortment.co.za", role: "Support Agent" },
];

const revenueTrend = [
  { day: "Mon", revenue: 18400 },
  { day: "Tue", revenue: 22100 },
  { day: "Wed", revenue: 19800 },
  { day: "Thu", revenue: 26400 },
  { day: "Fri", revenue: 31200 },
  { day: "Sat", revenue: 38900 },
  { day: "Sun", revenue: 29600 },
];

const categoryBreakdown = [
  { name: "Electronics", value: 32000 },
  { name: "Fashion", value: 27500 },
  { name: "Beauty", value: 14200 },
  { name: "Home", value: 11800 },
  { name: "Hair", value: 9600 },
];

const PIE_COLORS = ["#10B981", "#F59E0B", "#F472B6", "#38BDF8", "#A78BFA"];

const STATUS_COLORS = {
  Active: "bg-amber-500/15 text-amber-600",
  "Low Stock": "bg-amber-500/15 text-amber-500",
  "Out of Stock": "bg-rose-500/15 text-rose-500",
  Pending: "bg-amber-500/15 text-amber-500",
  Packed: "bg-sky-500/15 text-sky-500",
  Shipped: "bg-indigo-500/15 text-indigo-500",
  Delivered: "bg-amber-500/15 text-amber-600",
  Cancelled: "bg-rose-500/15 text-rose-500",
  Flagged: "bg-rose-500/15 text-rose-500",
  Approved: "bg-amber-500/15 text-amber-600",
};

/* ------------------------------- THEME TOKENS ------------------------------ */

function useTokens(theme) {
  const dark = theme === "dark";
  return {
    dark,
    page: dark ? "bg-gray-950 text-gray-50" : "bg-slate-50 text-gray-900",
    muted: dark ? "text-gray-400" : "text-gray-500",
    glass: dark ? "bg-white/[0.06] backdrop-blur-xl border border-white/10" : "bg-white/70 backdrop-blur-xl border border-white/60",
    glassStrong: dark ? "bg-white/[0.08] backdrop-blur-2xl border border-white/10" : "bg-white/85 backdrop-blur-2xl border border-white/70",
    hover: dark ? "hover:bg-white/[0.08]" : "hover:bg-gray-100",
    shadow: dark ? "shadow-2xl shadow-black/50" : "shadow-xl shadow-gray-300/40",
    border: dark ? "border-white/10" : "border-gray-200/70",
    input: dark ? "bg-white/[0.06] border border-white/10 placeholder-gray-500 text-gray-100" : "bg-white border border-gray-200 placeholder-gray-400 text-gray-900",
    row: dark ? "border-white/5 hover:bg-white/[0.04]" : "border-gray-100 hover:bg-gray-50",
  };
}

/* --------------------------------- HELPERS ---------------------------------- */

function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold whitespace-nowrap ${STATUS_COLORS[status] || "bg-gray-500/15 text-gray-400"}`}>{status}</span>;
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-gray-900" : "bg-gray-400/30"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

function StatCard({ t, icon: Icon, label, value, sub, tint }) {
  return (
    <div className={`rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${tint}`}><Icon size={16} /></div>
      </div>
      <p className="text-xl font-extrabold">{value}</p>
      <p className={`text-xs font-medium ${t.muted}`}>{label}</p>
      {sub && <p className="text-[10px] mt-1 text-amber-600 font-semibold">{sub}</p>}
    </div>
  );
}

function Modal({ t, title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className={`relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] ${t.glassStrong} ${t.shadow} border p-5 sm:p-6`}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold">{title}</p>
          <button onClick={onClose} className={`grid h-8 w-8 place-items-center rounded-full ${t.hover}`}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ t, label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-1.5">{label}</p>
      {children}
    </div>
  );
}

const inputCls = (t) => `w-full rounded-xl px-3 py-2.5 text-xs outline-none ${t.input}`;

/* ---------------------------------- SIDEBAR ---------------------------------- */

const NAV_SECTIONS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: BarChart3 },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "coupons", label: "Coupons & Promotions", icon: Tag },
  { id: "flashsales", label: "Flash Sales", icon: Zap },
  { id: "banners", label: "Banner Management", icon: ImageIcon },
  { id: "shipping", label: "Shipping & Pickup", icon: Truck },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team & Roles", icon: Shield },
];

function AdminToastStack({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed z-[80] top-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
      {toasts.map((tst) => (
        <div
          key={tst.id}
          role="status"
          className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-gray-900 text-white pl-2.5 pr-4 py-2.5 shadow-2xl shadow-black/30 border border-amber-400/30 animate-[adminToastIn_0.25s_ease-out] max-w-[92vw] sm:max-w-sm"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-500 text-gray-900">
            {tst.kind === "delete" ? <Trash2 size={12} strokeWidth={2.5} /> : <Check size={13} strokeWidth={2.5} />}
          </span>
          <span className="text-xs font-semibold leading-tight">{tst.message}</span>
        </div>
      ))}
      <style>{`@keyframes adminToastIn { from { opacity: 0; transform: translateY(-8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}

function Sidebar({ t, page, setPage, open, setOpen }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 ${t.glassStrong} border-r ${t.border} p-4 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-black/20">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold leading-tight">Extensive Assortment</p>
            <p className={`text-[10px] ${t.muted}`}>Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setPage(id); setOpen(false); }}
              className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${page === id ? "bg-gray-900 text-white shadow-md shadow-black/20" : t.hover}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => { if (window.confirm("Sign out of the admin console?")) { setPage("dashboard"); setOpen(false); } }}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium ${t.muted} ${t.hover}`}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>
    </>
  );
}

function Topbar({ t, theme, setTheme, setSidebarOpen, setPage, title }) {
  return (
    <header className={`sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-6 py-4 ${t.glassStrong} border-b ${t.border}`}>
      <button onClick={() => setSidebarOpen((o) => !o)} className={`grid h-9 w-9 place-items-center rounded-xl lg:hidden ${t.hover}`}><Menu size={18} /></button>
      <h1 className="text-base sm:text-lg font-extrabold tracking-tight flex-1">{title}</h1>
      <div className="hidden sm:flex items-center relative">
        <Search size={14} className={`absolute left-3 ${t.muted}`} />
        <input placeholder="Search admin..." className={`rounded-full pl-8 pr-4 py-2 text-xs outline-none w-52 ${t.input}`} />
      </div>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`grid h-9 w-9 place-items-center rounded-full ${t.hover}`}>
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <button onClick={() => setPage("notifications")} aria-label="View notifications" className={`grid h-9 w-9 place-items-center rounded-full ${t.hover} relative`}>
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
      </button>
      <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-500/15 text-amber-600 text-xs font-bold">DM</div>
    </header>
  );
}

/* -------------------------------- DASHBOARD ---------------------------------- */

function DashboardPage({ t, products, orders }) {
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock < 15).length;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard t={t} icon={CircleDollarSign} label="Revenue (7 days)" value={fmt(revenue)} sub="+12.4% vs last week" tint="bg-amber-500/15 text-amber-600" />
        <StatCard t={t} icon={ShoppingBag} label="Orders" value={orders.length} sub="+3 today" tint="bg-sky-500/15 text-sky-500" />
        <StatCard t={t} icon={Users} label="Customers" value={seedCustomers.length} sub="+1 this week" tint="bg-fuchsia-500/15 text-fuchsia-500" />
        <StatCard t={t} icon={AlertCircle} label="Low Stock Alerts" value={lowStock} tint="bg-amber-500/15 text-amber-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 rounded-3xl p-5 ${t.glass} border ${t.shadow}`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold">Revenue this week</p>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600"><TrendingUp size={12} /> Trending up</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.dark ? "#ffffff15" : "#00000010"} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: t.dark ? "#9ca3af" : "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: t.dark ? "#9ca3af" : "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R${v / 1000}k`} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: "#10B981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow}`}>
          <p className="text-sm font-bold mb-4">Revenue by category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryBreakdown.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-[10px]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className={t.muted}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold">Recent Orders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`text-left ${t.muted} border-b ${t.border}`}>
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className={`border-b last:border-0 ${t.row}`}>
                  <td className="py-2.5 font-semibold">{o.id}</td>
                  <td className="py-2.5">{o.customer}</td>
                  <td className="py-2.5 font-medium text-amber-600">{fmt(o.total)}</td>
                  <td className="py-2.5"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- PRODUCTS ---------------------------------- */

function resizeImageFile(file, maxDim = 900, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
          else { width = Math.round((width * maxDim) / height); height = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function ImageUploadField({ t, image, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputId = React.useId();

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file"); return; }
    setError(null);
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      onChange(dataUrl);
    } catch {
      setError("Couldn't process that image — try a different file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold mb-1.5">Product Photo</p>
      {image ? (
        <div className="relative h-32 w-32 rounded-2xl overflow-hidden border border-dashed border-gray-400/40">
          <img src={image} alt="Product preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed cursor-pointer ${t.border} ${t.hover} transition-colors`}
        >
          {uploading ? (
            <span className={`text-[10px] ${t.muted}`}>Uploading...</span>
          ) : (
            <>
              <ImageIcon size={18} className={t.muted} />
              <span className={`text-[10px] font-semibold ${t.muted}`}>Upload photo</span>
            </>
          )}
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        disabled={uploading}
        className="hidden"
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
      />
      {error && <p className="text-[10px] text-rose-500 mt-1.5">{error}</p>}
      {!image && !error && <p className={`text-[10px] mt-1.5 ${t.muted}`}>PNG or JPG, auto-resized. Falls back to the emoji tile if left empty.</p>}
    </div>
  );
}

function ProductsPage({ t, products, setProducts, categories, pushToast, saveProduct, removeProduct }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', product }
  const [form, setForm] = useState({ name: "", category: "Hair", price: "", oldPrice: "", stock: "", image: null });

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ name: "", category: "Hair", price: "", oldPrice: "", stock: "", image: null }); setModal({ mode: "add" }); };
  const openEdit = (p) => { setForm({ name: p.name, category: p.category, price: p.price, oldPrice: p.oldPrice, stock: p.stock, image: p.image || null }); setModal({ mode: "edit", id: p.id }); };

  const save = async () => {
    if (!form.name.trim()) return;
    const details = { name: form.name, category: form.category, price: Number(form.price) || 0, oldPrice: Number(form.oldPrice) || 0, stock: Number(form.stock) || 0, image: form.image || null };
    try {
      const saved = modal.mode === "add" ? await saveProduct(details) : await saveProduct(details, modal.id);
      setProducts((prev) => modal.mode === "add" ? [saved, ...prev] : prev.map((p) => (p.id === modal.id ? saved : p)));
      pushToast?.(`${form.name} ${modal.mode === "add" ? "added to storefront" : "updated"}`);
      setModal(null);
    } catch (error) {
      pushToast?.(error.message, "delete");
    }
  };

  const remove = async (id) => {
    const p = products.find((pr) => pr.id === id);
    if (!window.confirm(`Remove ${p?.name || "this product"} from the storefront?`)) return;
    try {
      await removeProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      pushToast?.(`${p?.name || "Product"} deleted`, "delete");
    } catch (error) {
      pushToast?.(error.message, "delete");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.muted}`} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className={`w-full rounded-full pl-9 pr-4 py-2.5 text-xs outline-none ${t.input}`} />
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-black/20">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className={`rounded-3xl ${t.glass} border ${t.shadow} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`text-left ${t.muted} border-b ${t.border}`}>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Sales</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={`border-b last:border-0 ${t.row}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="h-9 w-9 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${p.grad} flex items-center justify-center text-base shrink-0`}>{p.emoji}</div>
                      )}
                      <span className="font-medium max-w-[180px] line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 font-medium text-amber-600">{fmt(p.price)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">{p.sales}</td>
                  <td className="p-4"><StatusBadge status={p.status} /></td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(p)} className={`grid h-7 w-7 place-items-center rounded-lg ${t.hover}`}><Pencil size={13} /></button>
                      <button onClick={() => remove(p.id)} className={`grid h-7 w-7 place-items-center rounded-lg ${t.hover} text-rose-500`}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal t={t} title={modal.mode === "add" ? "Add Product" : "Edit Product"} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <ImageUploadField t={t} image={form.image} onChange={(image) => setForm({ ...form, image })} />
            <FormField t={t} label="Product Name">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls(t)} placeholder="e.g. Cloudform Running Sneakers" />
            </FormField>
            <FormField t={t} label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls(t)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField t={t} label="Price (R)"><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls(t)} /></FormField>
              <FormField t={t} label="Was Price (R)"><input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className={inputCls(t)} /></FormField>
            </div>
            <FormField t={t} label="Stock Quantity"><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputCls(t)} /></FormField>
            <button onClick={save} className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 mt-2">
              {modal.mode === "add" ? "Add Product" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------- CATEGORIES ---------------------------------- */

function CategoriesPage({ t, products, setProducts, categories, setCategories, pushToast }) {
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', original?, value }
  const counts = categories.map((name) => ({ name, count: products.filter((p) => p.category === name).length }));

  const openAdd = () => setModal({ mode: "add", value: "" });
  const openEdit = (name) => setModal({ mode: "edit", original: name, value: name });

  const save = () => {
    const value = modal.value.trim();
    if (!value) return;
    if (modal.mode === "add") {
      if (!categories.includes(value)) { setCategories((prev) => [...prev, value]); pushToast?.(`${value} category added`); }
    } else {
      setCategories((prev) => prev.map((c) => (c === modal.original ? value : c)));
      setProducts((prev) => prev.map((p) => (p.category === modal.original ? { ...p, category: value } : p)));
      pushToast?.(`Category renamed to ${value}`);
    }
    setModal(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className={`text-xs ${t.muted}`}>{categories.length} categories</p>
        <button onClick={openAdd} className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-black/20"><Plus size={14} /> Add Category</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {counts.map((c) => (
          <div key={c.name} className={`flex items-center justify-between rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
            <div>
              <p className="text-sm font-bold">{c.name}</p>
              <p className={`text-[10px] ${t.muted}`}>{c.count} products</p>
            </div>
            <button onClick={() => openEdit(c.name)} className={`grid h-8 w-8 place-items-center rounded-lg ${t.hover}`}><Pencil size={14} /></button>
          </div>
        ))}
      </div>

      {modal && (
        <Modal t={t} title={modal.mode === "add" ? "Add Category" : "Rename Category"} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <FormField t={t} label="Category Name">
              <input value={modal.value} onChange={(e) => setModal({ ...modal, value: e.target.value })} className={inputCls(t)} placeholder="e.g. Watches" />
            </FormField>
            <button onClick={save} className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 mt-2">
              {modal.mode === "add" ? "Add Category" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------------- ORDERS ------------------------------------ */

function OrdersPage({ t, orders, setOrders, pushToast, saveOrderStatus }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Packed", "Shipped", "Delivered", "Cancelled"];
  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = async (id, status) => {
    const updated = await saveOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    pushToast?.(`${id} marked as ${status}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${filter === s ? "bg-gray-900 text-white" : `${t.glass} border`}`}>{s}</button>
        ))}
      </div>
      <div className={`rounded-3xl ${t.glass} border ${t.shadow} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`text-left ${t.muted} border-b ${t.border}`}>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Delivery</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className={`border-b last:border-0 ${t.row}`}>
                  <td className="p-4 font-semibold">{o.id}</td>
                  <td className="p-4">{o.customer}</td>
                  <td className="p-4">{o.date}</td>
                  <td className="p-4 flex items-center gap-1.5">{o.delivery === "PAXI" ? <MapPin size={12} className="text-amber-600" /> : <Truck size={12} className="text-amber-600" />}{o.delivery}</td>
                  <td className="p-4 font-medium text-amber-600">{fmt(o.total)}</td>
                  <td className="p-4">
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className={`rounded-lg px-2 py-1 text-[10px] font-bold outline-none border-0 ${STATUS_COLORS[o.status]}`}>
                      {["Pending", "Packed", "Shipped", "Delivered", "Cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- CUSTOMERS ------------------------------------ */

function CustomersPage({ t }) {
  return (
    <div className="p-4 sm:p-6">
      <div className={`rounded-3xl ${t.glass} border ${t.shadow} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`text-left ${t.muted} border-b ${t.border}`}>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Total Spent</th>
                <th className="p-4 font-medium">Tier</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {seedCustomers.map((c) => (
                <tr key={c.id} className={`border-b last:border-0 ${t.row}`}>
                  <td className="p-4">
                    <p className="font-semibold">{c.name}</p>
                    <p className={`text-[10px] ${t.muted}`}>{c.email}</p>
                  </td>
                  <td className="p-4">{c.orders}</td>
                  <td className="p-4 font-medium text-amber-600">{fmt(c.spent)}</td>
                  <td className="p-4"><span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] font-bold text-amber-500">{c.tier}</span></td>
                  <td className="p-4">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- COUPONS ------------------------------------ */

function CouponsPage({ t, coupons, setCoupons, pushToast, saveContent, removeContent }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ code: "", type: "Percent", value: "" });

  const toggleActive = async (code) => {
    const next = coupons.find((c) => c.code === code);
    const updated = { ...next, active: !next.active };
    await saveContent("coupons", code, updated);
    setCoupons((prev) => prev.map((c) => (c.code === code ? updated : c)));
    pushToast?.(`${code} ${next?.active ? "deactivated" : "activated"}`);
  };
  const addCoupon = () => {
    if (!form.code.trim()) return;
    const code = form.code.toUpperCase();
    const coupon = { id: code, code, type: form.type, value: form.type === "Free Shipping" ? "—" : form.type === "Percent" ? `${form.value}%` : `R${form.value}`, uses: 0, limit: null, active: true, expires: "No expiry" };
    saveContent("coupons", null, coupon).then((saved) => setCoupons((prev) => [saved, ...prev]));
    setForm({ code: "", type: "Percent", value: "" });
    setModal(false);
    pushToast?.(`Coupon ${code} created`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-black/20"><Plus size={14} /> New Coupon</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {coupons.map((c) => (
          <div key={c.code} className={`rounded-2xl p-4 ${t.glass} border border-dashed ${t.shadow}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={15} className="text-amber-500" />
                <p className="text-sm font-bold font-mono">{c.code}</p>
              </div>
              <Toggle on={c.active} onChange={() => toggleActive(c.code)} />
            </div>
            <p className={`text-xs mt-1.5 ${t.muted}`}>{c.type} · {c.value}</p>
            <div className="flex items-center justify-between mt-3 text-[10px]">
              <span className={t.muted}>{c.uses} uses{c.limit ? ` / ${c.limit}` : ""}</span>
              <span className={t.muted}>Expires: {c.expires}</span>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal t={t} title="New Coupon" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <FormField t={t} label="Coupon Code"><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={inputCls(t)} placeholder="e.g. SPRING20" /></FormField>
            <FormField t={t} label="Discount Type">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls(t)}>
                <option>Percent</option><option>Flat</option><option>Free Shipping</option>
              </select>
            </FormField>
            {form.type !== "Free Shipping" && (
              <FormField t={t} label={form.type === "Percent" ? "Percent Off" : "Amount Off (R)"}>
                <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputCls(t)} />
              </FormField>
            )}
            <button onClick={addCoupon} className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 mt-2">Create Coupon</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------- FLASH SALES ------------------------------------ */

function FlashSalesPage({ t, products, flashSale, setFlashSale }) {
  const [selected, setSelected] = useState("");

  const addToFlash = () => {
    const p = products.find((pr) => pr.id === Number(selected));
    if (!p || flashSale.some((f) => f.id === p.id)) return;
    setFlashSale((prev) => [...prev, { id: p.id, name: p.name, price: Math.round(p.price * 0.8), oldPrice: p.price, endsIn: "05:12:44" }]);
    setSelected("");
  };
  const remove = (id) => setFlashSale((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow} flex items-center gap-3 flex-wrap`}>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-400/15"><Zap size={18} className="text-amber-500 fill-amber-500" /></div>
        <div className="flex-1 min-w-[160px]">
          <p className="text-sm font-bold">Active Flash Sale</p>
          <p className={`text-[10px] ${t.muted}`}>Ends in 05:12:44 · {flashSale.length} products included</p>
        </div>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className={`rounded-xl px-3 py-2 text-xs outline-none ${t.input}`}>
          <option value="">Add product...</option>
          {products.filter((p) => !flashSale.some((f) => f.id === p.id)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button onClick={addToFlash} className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white shrink-0">Add</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {flashSale.map((f) => (
          <div key={f.id} className={`rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold max-w-[160px] line-clamp-2">{f.name}</p>
              <button onClick={() => remove(f.id)} className="text-rose-500 shrink-0"><X size={14} /></button>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-sm font-bold text-amber-600">{fmt(f.price)}</span>
              <span className="text-[11px] text-gray-400 line-through">{fmt(f.oldPrice)}</span>
            </div>
            <p className={`text-[10px] mt-1 flex items-center gap-1 ${t.muted}`}><Clock size={10} /> Ends in {f.endsIn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- BANNERS ------------------------------------ */

const BANNER_GRADIENTS = [
  "from-amber-400 to-amber-600",
  "from-orange-400 to-red-500",
  "from-pink-400 to-fuchsia-500",
  "from-sky-400 to-blue-600",
  "from-amber-300 to-orange-500",
];

function BannersPage({ t, banners, setBanners, pushToast, saveContent, removeContent }) {
  const toggleActive = async (id) => {
    const b = banners.find((bn) => bn.id === id);
    const updated = { ...b, active: !b.active };
    await saveContent("banners", id, updated);
    setBanners((prev) => prev.map((bn) => (bn.id === id ? updated : bn)));
    pushToast?.(b?.active ? "Banner hidden" : "Banner is now live");
  };
  const remove = async (id) => {
    await removeContent("banners", id);
    setBanners((prev) => prev.filter((b) => b.id !== id));
    pushToast?.("Banner deleted", "delete");
  };
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', id?, title, subtitle, cta, grad }

  const openAdd = () => setModal({ mode: "add", title: "", subtitle: "", cta: "Shop Now", grad: BANNER_GRADIENTS[0] });
  const openEdit = (b) => setModal({ mode: "edit", id: b.id, title: b.title, subtitle: b.subtitle, cta: b.cta, grad: b.grad });

  const save = async () => {
    if (!modal.title.trim()) return;
    if (modal.mode === "add") {
      const banner = await saveContent("banners", null, { id: crypto.randomUUID(), title: modal.title, subtitle: modal.subtitle, cta: modal.cta || "Shop Now", grad: modal.grad, active: true });
      setBanners((prev) => [...prev, banner]);
      pushToast?.("Banner added");
    } else {
      const banner = await saveContent("banners", modal.id, { ...modal, id: modal.id });
      setBanners((prev) => prev.map((b) => (b.id === modal.id ? banner : b)));
      pushToast?.("Banner updated");
    }
    setModal(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-3">
      {banners.map((b) => (
        <div key={b.id} className={`rounded-3xl overflow-hidden ${t.glass} border ${t.shadow}`}>
          <div className={`h-24 bg-gradient-to-r ${b.grad} flex items-center px-5 relative`}>
            <div>
              <p className="text-sm font-extrabold text-white">{b.title}</p>
              <p className="text-[11px] text-white/80">{b.subtitle}</p>
            </div>
            <span className="ml-auto rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">{b.cta}</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-2">
              <Toggle on={b.active} onChange={() => toggleActive(b.id)} />
              <span className={`text-[10px] font-semibold ${b.active ? "text-amber-600" : t.muted}`}>{b.active ? "Live on homepage" : "Hidden"}</span>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => openEdit(b)} className={`grid h-7 w-7 place-items-center rounded-lg ${t.hover}`}><Pencil size={13} /></button>
              <button onClick={() => remove(b.id)} className={`grid h-7 w-7 place-items-center rounded-lg ${t.hover} text-rose-500`}><Trash2 size={13} /></button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={openAdd} className={`w-full flex items-center justify-center gap-2 rounded-2xl p-4 border-2 border-dashed ${t.border} text-xs font-semibold ${t.muted} hover:border-amber-400 hover:text-amber-600 transition-colors`}>
        <Plus size={14} /> Add New Banner
      </button>

      {modal && (
        <Modal t={t} title={modal.mode === "add" ? "Add Banner" : "Edit Banner"} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <FormField t={t} label="Title"><input value={modal.title} onChange={(e) => setModal({ ...modal, title: e.target.value })} className={inputCls(t)} placeholder="e.g. Summer Sneaker Drop" /></FormField>
            <FormField t={t} label="Subtitle"><input value={modal.subtitle} onChange={(e) => setModal({ ...modal, subtitle: e.target.value })} className={inputCls(t)} placeholder="e.g. Fresh styles, up to 30% off" /></FormField>
            <FormField t={t} label="CTA Label"><input value={modal.cta} onChange={(e) => setModal({ ...modal, cta: e.target.value })} className={inputCls(t)} /></FormField>
            <FormField t={t} label="Colour">
              <div className="flex gap-2">
                {BANNER_GRADIENTS.map((g) => (
                  <button key={g} onClick={() => setModal({ ...modal, grad: g })} className={`h-9 w-9 rounded-full bg-gradient-to-br ${g} border-2 ${modal.grad === g ? "border-gray-900 dark:border-white" : "border-transparent"}`} />
                ))}
              </div>
            </FormField>
            <button onClick={save} className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 mt-2">
              {modal.mode === "add" ? "Add Banner" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------- SHIPPING ------------------------------------ */

function ShippingPage({ t, orders, pickupPoints, setPickupPoints }) {
  const [tab, setTab] = useState("courier");
  const courierOrders = orders.filter((o) => o.delivery === "Courier Guy");
  const paxiOrders = orders.filter((o) => o.delivery === "PAXI");
  const toggleActive = (id) => setPickupPoints((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className={`flex gap-1 rounded-2xl p-1 ${t.glass} border w-fit`}>
        <button onClick={() => setTab("courier")} className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${tab === "courier" ? "bg-gray-900 text-white" : t.muted}`}>Courier Guy ({courierOrders.length})</button>
        <button onClick={() => setTab("paxi")} className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${tab === "paxi" ? "bg-gray-900 text-white" : t.muted}`}>PAXI ({paxiOrders.length})</button>
      </div>

      {tab === "courier" && (
        <div className={`rounded-3xl ${t.glass} border ${t.shadow} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className={`text-left ${t.muted} border-b ${t.border}`}><th className="p-4 font-medium">Order</th><th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">Status</th></tr></thead>
              <tbody>{courierOrders.map((o) => (
                <tr key={o.id} className={`border-b last:border-0 ${t.row}`}>
                  <td className="p-4 font-semibold">{o.id}</td>
                  <td className="p-4">{o.customer}</td>
                  <td className="p-4"><StatusBadge status={o.status} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "paxi" && (
        <div className="space-y-4">
          <div className={`rounded-3xl ${t.glass} border ${t.shadow} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className={`text-left ${t.muted} border-b ${t.border}`}><th className="p-4 font-medium">Order</th><th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">Status</th></tr></thead>
                <tbody>{paxiOrders.map((o) => (
                  <tr key={o.id} className={`border-b last:border-0 ${t.row}`}>
                    <td className="p-4 font-semibold">{o.id}</td>
                    <td className="p-4">{o.customer}</td>
                    <td className="p-4"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <p className="text-xs font-bold px-1">Pickup Points</p>
          <div className="space-y-2">
            {pickupPoints.map((p) => (
              <div key={p.id} className={`flex items-center justify-between rounded-2xl p-3.5 ${t.glass} border ${t.shadow}`}>
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-amber-600" />
                  <div><p className="text-xs font-semibold">{p.name}</p><p className={`text-[10px] ${t.muted}`}>{p.suburb}</p></div>
                </div>
                <Toggle on={p.active} onChange={() => toggleActive(p.id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- REVIEWS ------------------------------------ */

function ReviewsPage({ t, reviews, setReviews, saveContent }) {
  const setStatus = async (id, status) => {
    const updated = { ...reviews.find((r) => r.id === id), status };
    await saveContent("reviews", id, updated);
    setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };
  return (
    <div className="p-4 sm:p-6 space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className={`rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold">{r.product}</p>
              <p className={`text-[10px] ${t.muted}`}>{r.customer} · {r.rating}★</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
          <p className={`text-xs mt-2 ${t.muted}`}>{r.text}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setStatus(r.id, "Approved")} className="flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 px-3 py-1.5 text-[10px] font-bold"><CheckCircle2 size={12} /> Approve</button>
            <button onClick={() => setStatus(r.id, "Flagged")} className="flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-500 px-3 py-1.5 text-[10px] font-bold"><Flag size={12} /> Flag</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ NOTIFICATIONS -------------------------------- */

function NotificationsPage({ t }) {
  const [sent, setSent] = useState([
    { id: 1, title: "Winter Sale is live!", audience: "All customers", date: "2026-07-15" },
    { id: 2, title: "Your PAXI pickup point is ready", audience: "PAXI customers", date: "2026-07-14" },
  ]);
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("All customers");

  const send = () => {
    if (!title.trim()) return;
    setSent((prev) => [{ id: Date.now(), title, audience, date: new Date().toISOString().slice(0, 10) }, ...prev]);
    setTitle("");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow} space-y-3`}>
        <p className="text-sm font-bold">Compose Notification</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Flash sale ends tonight!" className={inputCls(t)} />
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className={inputCls(t)}>
          <option>All customers</option><option>PAXI customers</option><option>Gold tier members</option><option>Abandoned carts</option>
        </select>
        <button onClick={send} className="flex items-center gap-1.5 rounded-2xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-black/20"><Send size={13} /> Send Notification</button>
      </div>
      <div className="space-y-2">
        {sent.map((n) => (
          <div key={n.id} className={`flex items-center justify-between rounded-2xl p-3.5 ${t.glass} border ${t.shadow}`}>
            <div>
              <p className="text-xs font-semibold">{n.title}</p>
              <p className={`text-[10px] ${t.muted}`}>{n.audience} · {n.date}</p>
            </div>
            <Bell size={14} className="text-amber-600" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- TEAM & ROLES -------------------------------- */

function TeamPage({ t }) {
  const [users, setUsers] = useState(seedAdminUsers);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Support Agent" });

  const invite = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setUsers((prev) => [...prev, { id: Date.now(), ...form }]);
    setForm({ name: "", email: "", role: "Support Agent" });
    setModal(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-black/20"><UserPlus size={14} /> Invite Team Member</button>
      </div>
      <div className={`rounded-3xl ${t.glass} border ${t.shadow} overflow-hidden`}>
        <table className="w-full text-xs">
          <thead><tr className={`text-left ${t.muted} border-b ${t.border}`}><th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Role</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className={`border-b last:border-0 ${t.row}`}>
                <td className="p-4 font-semibold">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4"><span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold text-amber-600">{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal t={t} title="Invite Team Member" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <FormField t={t} label="Full Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls(t)} /></FormField>
            <FormField t={t} label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls(t)} /></FormField>
            <FormField t={t} label="Role">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls(t)}>
                <option>Store Manager</option><option>Support Agent</option><option>Marketing</option>
              </select>
            </FormField>
            <button onClick={invite} className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 mt-2">Send Invite</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ----------------------------------- APP -------------------------------------- */

export default function AdminConsole() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState(seedProducts);
  const [categories, setCategories] = useState(CATEGORY_NAMES);
  const [orders, setOrders] = useState(seedOrders);
  const [coupons, setCoupons] = useState(seedCoupons);
  const [flashSale, setFlashSale] = useState(seedFlashSale);
  const [banners, setBanners] = useState(seedBanners);
  const [pickupPoints, setPickupPoints] = useState(seedPickupPoints);
  const [reviews, setReviews] = useState(seedReviews);
  const [toasts, setToasts] = useState([]);
  const pushToast = (message, kind = "check") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((tt) => tt.id !== id)), 2600);
  };
  const t = useTokens(theme);

  React.useEffect(() => {
    getCurrentUser().then(setUser).finally(() => setAuthChecked(true));
  }, []);

  const saveContent = async (kind, id, item) => id
    ? updateShopContent(kind, id, item)
    : createShopContent(kind, item);
  const removeContent = (kind, id) => deleteShopContent(kind, id);

  React.useEffect(() => {
    if (!user) return;
    getProducts().then((catalog) => {
      if (catalog.length) setProducts(catalog);
    }).catch(() => {});
    getOrders().then((saved) => {
      if (saved.length) return setOrders(saved.map((order) => ({ ...order, date: String(order.date).slice(0, 10) })));
      return Promise.all(seedOrders.map((order) => createOrder(order))).then(setOrders);
    }).catch(() => {});
    const load = async (kind, seed, setter) => {
      try {
        const saved = await getShopContent(kind);
        if (saved.length) return setter(saved);
        const seeded = await Promise.all(seed.map((item) => createShopContent(kind, { ...item, id: String(item.id || item.code) })));
        setter(seeded);
      } catch {}
    };
    load("coupons", seedCoupons, setCoupons);
    load("banners", seedBanners, setBanners);
    load("reviews", seedReviews, setReviews);
  }, [user]);

  if (!authChecked) return <div className={`min-h-screen grid place-items-center ${t.page}`}>Checking your admin session...</div>;
  if (!user) {
    return <div className={t.page}><AuthPage t={t} mode="login" onAuthenticated={setUser} setPage={(target) => { if (target === "signup") window.location.href = "/signup"; }} /></div>;
  }

  const saveProduct = (details, id) => id ? updateProduct(id, details) : createProduct(details);
  const saveOrderStatus = (id, status) => updateOrderStatus(id, status);

  const titles = {
    dashboard: "Dashboard", products: "Products", categories: "Categories", orders: "Orders",
    customers: "Customers", coupons: "Coupons & Promotions", flashsales: "Flash Sales",
    banners: "Banner Management", shipping: "Shipping & Pickup Points", reviews: "Reviews Management",
    notifications: "Notifications", team: "Team & Roles",
  };

  return (
    <div className={`min-h-screen flex ${t.page} font-sans transition-colors duration-300`} style={{ colorScheme: theme }}>
      <style>{`
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, [tabindex]:focus-visible {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
          border-radius: 6px;
        }
        button:not(:disabled):active, a:active { transform: scale(0.97); }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme === "dark" ? "#3f3f46" : "#d1d5db"}; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: #d4af37; }
      `}</style>
      <Sidebar t={t} page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />
      <AdminToastStack toasts={toasts} />
      <div className="flex-1 min-w-0">
        <Topbar t={t} theme={theme} setTheme={setTheme} setSidebarOpen={setSidebarOpen} setPage={setPage} title={titles[page]} />
        {page === "dashboard" && <DashboardPage t={t} products={products} orders={orders} />}
        {page === "products" && <ProductsPage t={t} products={products} setProducts={setProducts} categories={categories} pushToast={pushToast} saveProduct={saveProduct} removeProduct={deleteProduct} />}
        {page === "categories" && <CategoriesPage t={t} products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} pushToast={pushToast} />}
        {page === "orders" && <OrdersPage t={t} orders={orders} setOrders={setOrders} pushToast={pushToast} saveOrderStatus={saveOrderStatus} />}
        {page === "customers" && <CustomersPage t={t} />}
        {page === "coupons" && <CouponsPage t={t} coupons={coupons} setCoupons={setCoupons} pushToast={pushToast} saveContent={saveContent} removeContent={removeContent} />}
        {page === "flashsales" && <FlashSalesPage t={t} products={products} flashSale={flashSale} setFlashSale={setFlashSale} />}
        {page === "banners" && <BannersPage t={t} banners={banners} setBanners={setBanners} pushToast={pushToast} saveContent={saveContent} removeContent={removeContent} />}
        {page === "shipping" && <ShippingPage t={t} orders={orders} pickupPoints={pickupPoints} setPickupPoints={setPickupPoints} />}
        {page === "reviews" && <ReviewsPage t={t} reviews={reviews} setReviews={setReviews} saveContent={saveContent} />}
        {page === "notifications" && <NotificationsPage t={t} />}
        {page === "team" && <TeamPage t={t} />}
      </div>
    </div>
  );
}

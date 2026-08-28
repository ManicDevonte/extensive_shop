import React, { useState, useMemo } from "react";
import AuthPage from "./AuthPage.jsx";
import { clearToken, getCurrentUser } from "./authApi.js";
import { capturePaypalOrder, createOrder, createPaypalOrder, getProducts } from "./shopApi.js";
import {
  Search, Heart, ShoppingCart, User, Home as HomeIcon, Grid3x3, Star,
  ChevronRight, ChevronLeft, Sun, Moon, X, Plus, Minus, MapPin, Truck,
  CreditCard, Check, Sparkles, Zap, Leaf, ArrowRight, Package,
  Clock, ShieldCheck, Gift, Eye, PackageCheck, CheckCircle2, Tag,
  RotateCw, ZoomIn, HelpCircle, ThumbsUp, Trophy, Pencil, Scale,
  ClipboardList, Building2, Users2, Copy, Headphones, Award,
  Facebook, Instagram, Youtube
} from "lucide-react";

/* ---------------------------------- DATA ---------------------------------- */

const CATEGORIES = [
  { id: "hair", name: "Hair", emoji: "💇🏾‍♀️", from: "from-fuchsia-400", to: "to-purple-500", image: "https://images.unsplash.com/photo-1649312555826-e42566d05d15?w=200&h=200&fit=crop&auto=format&q=70" },
  { id: "sneakers", name: "Sneakers", emoji: "👟", from: "from-orange-400", to: "to-red-500", image: "https://images.unsplash.com/photo-1676379827610-c380c52db0c6?w=200&h=200&fit=crop&auto=format&q=70" },
  { id: "tshirts", name: "T-Shirts", emoji: "👕", from: "from-sky-400", to: "to-blue-500", image: "https://images.unsplash.com/photo-1620799139652-715e4d5b232d?w=200&h=200&fit=crop&auto=format&q=70" },
  { id: "jeans", name: "Jeans", emoji: "👖", from: "from-indigo-400", to: "to-blue-600", image: "https://images.unsplash.com/photo-1605518215584-5ba74df5dfd8?w=200&h=200&fit=crop&auto=format&q=70" },
  { id: "hoodies", name: "Hoodies", emoji: "🧥", from: "from-slate-400", to: "to-slate-600", image: "https://images.unsplash.com/photo-1590759483822-b2fee5aa6bd3?w=200&h=200&fit=crop&auto=format&q=70" },
  { id: "iphones", name: "iPhones", emoji: "📱", from: "from-gray-400", to: "to-gray-600", image: "https://images.unsplash.com/photo-1541591708423-9001fe827349?w=200&h=200&fit=crop&auto=format&q=70" },
  { id: "electronics", name: "Electronics", emoji: "🎧", from: "from-cyan-400", to: "to-teal-500", image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=200&h=200&fit=crop&auto=format&q=70" },
  { id: "curtains", name: "Curtains", emoji: "🪟", from: "from-amber-300", to: "to-orange-400", image: "https://images.pexels.com/photos/462197/pexels-photo-462197.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
  { id: "bedding", name: "Bedding", emoji: "🛏️", from: "from-rose-300", to: "to-pink-500", image: "https://cdn.pixabay.com/photo/2016/03/28/09/34/bedroom-1285156_640.jpg" },
  { id: "beauty", name: "Beauty", emoji: "💄", from: "from-pink-400", to: "to-fuchsia-500", image: "https://images.pexels.com/photos/29977128/pexels-photo-29977128.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
];

const PRODUCTS = [
  { id: 1, name: "Silk Press Bundle Hair, 3-Pack", category: "hair", price: 899, oldPrice: 1299, rating: 4.8, reviews: 214, emoji: "💇🏾‍♀️", grad: "from-fuchsia-400 to-purple-500", image: "https://images.unsplash.com/photo-1649312555826-e42566d05d15?w=700&h=700&fit=crop&auto=format&q=75", badge: "Flash Sale", colors: ["#1F2937", "#7C3AED"], sizes: ["16\"", "18\"", "20\""], stock: 12 },
  { id: 2, name: "Cloudform Running Sneakers", category: "sneakers", price: 1249, oldPrice: 1799, rating: 4.6, reviews: 532, emoji: "👟", grad: "from-orange-400 to-red-500", image: "https://images.unsplash.com/photo-1676379827610-c380c52db0c6?w=700&h=700&fit=crop&auto=format&q=75", badge: "Best Seller", colors: ["#F8FAFC", "#1F2937", "#10B981"], sizes: ["6", "7", "8", "9", "10"], stock: 34 },
  { id: 3, name: "Essential Oversized Tee", category: "tshirts", price: 249, oldPrice: 349, rating: 4.5, reviews: 891, emoji: "👕", grad: "from-sky-400 to-blue-500", image: "https://images.unsplash.com/photo-1620799139652-715e4d5b232d?w=700&h=700&fit=crop&auto=format&q=75", badge: "New", colors: ["#F8FAFC", "#1F2937"], sizes: ["S", "M", "L", "XL"], stock: 88 },
  { id: 4, name: "Straight Fit Denim Jeans", category: "jeans", price: 599, oldPrice: 899, rating: 4.4, reviews: 176, emoji: "👖", grad: "from-indigo-400 to-blue-600", image: "https://images.unsplash.com/photo-1605518215584-5ba74df5dfd8?w=700&h=700&fit=crop&auto=format&q=75", badge: "Trending", colors: ["#1E3A8A", "#111827"], sizes: ["28", "30", "32", "34"], stock: 21 },
  { id: 5, name: "Heavyweight Pullover Hoodie", category: "hoodies", price: 749, oldPrice: 999, rating: 4.7, reviews: 340, emoji: "🧥", grad: "from-slate-400 to-slate-600", image: "https://images.unsplash.com/photo-1590759483822-b2fee5aa6bd3?w=700&h=700&fit=crop&auto=format&q=75", badge: "Trending", colors: ["#111827", "#6B7280", "#10B981"], sizes: ["S", "M", "L", "XL"], stock: 45 },
  { id: 6, name: "Pro 15 Smartphone, 256GB", category: "iphones", price: 18999, oldPrice: 21999, rating: 4.9, reviews: 1204, emoji: "📱", grad: "from-gray-400 to-gray-600", image: "https://images.unsplash.com/photo-1541591708423-9001fe827349?w=700&h=700&fit=crop&auto=format&q=75", badge: "Flash Sale", colors: ["#111827", "#F8FAFC", "#D4AF37"], sizes: ["128GB", "256GB", "512GB"], stock: 9 },
  { id: 7, name: "Studio Wireless ANC Headphones", category: "electronics", price: 1899, oldPrice: 2599, rating: 4.6, reviews: 402, emoji: "🎧", grad: "from-cyan-400 to-teal-500", image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=700&h=700&fit=crop&auto=format&q=75", badge: "Best Seller", colors: ["#111827", "#F8FAFC"], sizes: ["One Size"], stock: 27 },
  { id: 8, name: "Blackout Weave Curtain Pair", category: "curtains", price: 449, oldPrice: 649, rating: 4.3, reviews: 98, emoji: "🪟", grad: "from-amber-300 to-orange-400", image: "https://images.pexels.com/photos/462197/pexels-photo-462197.jpeg?auto=compress&cs=tinysrgb&w=700&h=700&fit=crop", badge: "New", colors: ["#78350F", "#1F2937", "#F8FAFC"], sizes: ["230cm", "270cm"], stock: 40 },
  { id: 9, name: "Egyptian Cotton Duvet Set", category: "bedding", price: 899, oldPrice: 1199, rating: 4.7, reviews: 156, emoji: "🛏️", grad: "from-rose-300 to-pink-500", image: "https://cdn.pixabay.com/photo/2016/03/28/09/34/bedroom-1285156_640.jpg", badge: "Trending", colors: ["#F8FAFC", "#D4AF37", "#10B981"], sizes: ["Queen", "King"], stock: 18 },
  { id: 10, name: "Glow Vitamin C Serum, 30ml", category: "beauty", price: 329, oldPrice: 459, rating: 4.8, reviews: 677, emoji: "💄", grad: "from-pink-400 to-fuchsia-500", image: "https://images.pexels.com/photos/29977128/pexels-photo-29977128.jpeg?auto=compress&cs=tinysrgb&w=700&h=700&fit=crop", badge: "Flash Sale", colors: ["Natural"], sizes: ["30ml"], stock: 63 },
  { id: 11, name: "Retro Court Leather Sneakers", category: "sneakers", price: 999, oldPrice: 1399, rating: 4.5, reviews: 289, emoji: "👟", grad: "from-orange-400 to-red-500", image: "https://images.unsplash.com/photo-1575176648002-f2021e56b375?w=700&h=700&fit=crop&auto=format&q=75", badge: "New", colors: ["#F8FAFC", "#111827"], sizes: ["6", "7", "8", "9"], stock: 30 },
  { id: 12, name: "Bantu Knot Wig, Curly", category: "hair", price: 649, oldPrice: 949, rating: 4.6, reviews: 133, emoji: "💇🏾‍♀️", grad: "from-fuchsia-400 to-purple-500", image: "https://images.unsplash.com/photo-1759865775535-7e4e3d2bbf3a?w=700&h=700&fit=crop&auto=format&q=75", badge: "Best Seller", colors: ["#1F2937"], sizes: ["One Size"], stock: 15 },
];

let ACTIVE_PRODUCTS = PRODUCTS;

const PICKUP_POINTS = [
  { name: "PAXI Point – East London CBD", suburb: "Quigney", eta: "2–4 days" },
  { name: "PAXI Point – Vincent Park", suburb: "Vincent", eta: "2–4 days" },
  { name: "PAXI Point – Beacon Bay", suburb: "Beacon Bay", eta: "3–5 days" },
];

const fmt = (n) => `R${Math.round(n).toLocaleString("en-ZA")}`;

const HERO_IMAGE = "/hero.jpg";

const PROMO_CODES = {
  SAVE10: { type: "percent", value: 10, label: "10% off your order" },
  WELCOME50: { type: "flat", value: 50, label: "R50 off your order" },
  FREESHIP: { type: "freeship", value: 0, label: "Free shipping" },
};

function computeDiscount(promo, subtotal) {
  if (!promo) return 0;
  if (promo.type === "percent") return Math.round((subtotal * promo.value) / 100);
  if (promo.type === "flat") return Math.min(promo.value, subtotal);
  return 0;
}

const REVIEW_NAMES = ["Thandiwe M.", "Sipho N.", "Amahle K.", "Lindiwe P.", "Bongani R.", "Naledi S.", "Kagiso T.", "Zanele D."];

function generateReviews(product) {
  const templates = [
    { rating: 5, text: "Really happy with this one — quality feels premium and it arrived faster than expected.", days: "2 weeks ago", helpful: 24 },
    { rating: 4, text: "Good value for the price. Runs slightly small, so I'd size up if you're in between.", days: "1 month ago", helpful: 11 },
    { rating: 5, text: "Exactly as described on the listing. Packaging was solid too, no damage on arrival.", days: "1 month ago", helpful: 8 },
    { rating: 3, text: "Does the job, but I expected a bit more for the price. Not bad though.", days: "2 months ago", helpful: 3 },
  ];
  return templates.map((r, i) => ({ ...r, name: REVIEW_NAMES[(product.id + i * 3) % REVIEW_NAMES.length] }));
}

function generateQA(product) {
  return [
    { q: "Does this come with a warranty?", a: "Yes — all items ship with a 6-month manufacturer warranty against defects.", days: "3 weeks ago" },
    { q: `How long does delivery to Cape Town usually take?`, a: "Courier Guy typically delivers within 3–5 business days nationwide.", days: "1 month ago" },
    { q: "Can I return it if it doesn't fit?", a: "Absolutely, you have a 30-day return window from the date of delivery.", days: "6 weeks ago" },
  ];
}

const ORDER_HISTORY = [
  { id: "EA-73104", date: "2026-06-28", status: "Delivered", total: 1748, items: 2 },
  { id: "EA-71982", date: "2026-06-11", status: "Delivered", total: 899, items: 1 },
  { id: "EA-69540", date: "2026-05-22", status: "Delivered", total: 3248, items: 3 },
];

const SAVED_ADDRESSES = [
  { id: 1, label: "Home", type: "home", name: "Dumisani Mangqishe", line: "14 Quigney Street, East London, 5201", isDefault: true },
  { id: 2, label: "Work", type: "work", name: "Dumisani Mangqishe", line: "22 Vincent Park Road, East London, 5247", isDefault: false },
];

const REWARD_TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 1000 },
  { name: "Gold", min: 5000 },
];

function ratingBreakdown(reviews) {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => counts[r.rating - 1]++);
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({ star, pct: Math.round((counts[star - 1] / total) * 100) }));
}

const FAQ_DATA = [
  {
    category: "Orders & Delivery",
    icon: Truck,
    items: [
      { q: "How long does delivery take?", a: "Courier Guy home delivery typically takes 2–5 business days depending on your location. PAXI pickup-point orders follow a similar window once they reach your chosen point, and you'll get an SMS the moment it's ready to collect." },
      { q: "Can I change my delivery method after ordering?", a: "Reach out to support as soon as possible via WhatsApp or email — we can usually amend orders that haven't shipped yet, but once a courier has collected the parcel we're not able to redirect it." },
      { q: "How do I track my order?", a: "Head to Account → Orders, or use the tracking link sent to you in your order confirmation email. Live tracking is available for both Courier Guy and PAXI deliveries from the moment your order ships." },
      { q: "Do you deliver nationwide?", a: "Yes — we deliver across all nine provinces via Courier Guy and to over 2,500 PAXI pickup points, including many rural and township areas." },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: RotateCw,
    items: [
      { q: "What's your returns window?", a: "You have 30 days from the date of delivery to return most items for a full refund or exchange, provided they're unused, unworn, and in their original packaging with tags attached." },
      { q: "How do I start a return?", a: "Go to Account → Orders, select the order you'd like to return, and follow the prompts — or contact support with your order number and we'll guide you through it." },
      { q: "How long do refunds take?", a: "Once we've received and inspected your returned item, refunds are issued to your original payment method within 5–7 business days." },
      { q: "Are all items returnable?", a: "Most items qualify, but sale and clearance items may be final sale — this will always be clearly flagged on the product page before you buy." },
    ],
  },
  {
    category: "Payments",
    icon: CreditCard,
    items: [
      { q: "What payment methods do you accept?", a: "We accept PayFast, Ozow (instant EFT), Yoco (card payments), and Payflex (buy now, pay later in 4 interest-free instalments)." },
      { q: "Is it safe to pay on Extensive Assortment?", a: "Yes — all payments are processed through PCI-compliant, bank-grade payment gateways. We never store your card details on our own servers." },
      { q: "Can I pay in instalments?", a: "Yes, through Payflex at checkout you can split your purchase into 4 equal, interest-free payments over 6 weeks, subject to approval." },
      { q: "Will I get a receipt?", a: "A tax invoice is emailed to you automatically as soon as your payment is confirmed, and it's also available anytime under Account → Orders." },
    ],
  },
  {
    category: "Account & Support",
    icon: User,
    items: [
      { q: "Do I need an account to order?", a: "You can check out as a guest, but creating an account lets you track orders, save addresses, earn rewards, and check out faster next time." },
      { q: "How do I contact support?", a: "The fastest way is WhatsApp — tap the chat button in the bottom-right corner of any page. You can also email support@extensiveassortment.co.za, available every day from 8am–8pm SAST." },
      { q: "How do I reset my password?", a: "From the login screen, tap \"Forgot password\" and we'll send a reset link to your registered email address." },
    ],
  },
];

const INFO_CONTENT = {
  about: {
    title: "About Us",
    body: [
      "Extensive Assortment is South Africa's next-generation online marketplace, built to bring Shein's fashion pace, Amazon's depth, and Takealot's local convenience into one premium, trustworthy shopping experience.",
      "We're based in East London and ship nationwide via Courier Guy and PAXI, with a catalogue spanning fashion, electronics, beauty, and home essentials.",
      "Our mission is simple: everything you need, nothing you don't — at prices and delivery speeds South African shoppers can rely on.",
    ],
  },
  careers: {
    title: "Careers",
    body: [
      "We're growing across engineering, operations, and customer support — and we're always looking for people who care about building a genuinely great local shopping experience.",
      "Open roles are posted here as they become available. In the meantime, feel free to reach out via Contact Us with your CV and a note on where you'd like to contribute.",
    ],
  },
  seller: {
    title: "Become a Seller",
    body: [
      "Extensive Assortment is opening its marketplace to South African brands and independent sellers. List your products alongside our curated catalogue and reach shoppers nationwide, with fulfilment support via Courier Guy and PAXI.",
      "Seller onboarding covers catalogue setup, payout scheduling, and access to the same admin tools our internal team uses to manage inventory and orders.",
    ],
  },
  blog: {
    title: "Blog",
    body: [
      "Style guides, product deep-dives, and behind-the-scenes looks at how we source and ship — our blog is where we share the stories behind the catalogue.",
      "New posts go live weekly. Check back soon, or subscribe to our newsletter to get them in your inbox.",
    ],
  },
  contact: {
    title: "Contact Us",
    body: [
      "Our support team is available every day to help with orders, returns, and general questions.",
      "Email: support@extensiveassortment.co.za",
      "WhatsApp & Live Chat: available in-app, 8am–8pm SAST",
      "Head Office: East London, Eastern Cape, South Africa",
    ],
  },
  faqs: {
    title: "Frequently Asked Questions",
    body: [
      "How long does delivery take? Courier Guy typically delivers within 2–5 business days; PAXI pickup orders follow a similar window once they reach your chosen point.",
      "Can I change my delivery method after ordering? Reach out to support as soon as possible — we can usually amend orders that haven't shipped yet.",
      "What's your returns window? 30 days from delivery on most items — see our Returns Policy for full details.",
      "How do I track my order? Visit Account → Orders, or use the tracking link sent in your confirmation email.",
    ],
  },
  returns: {
    title: "Returns Policy",
    body: [
      "You may return most items within 30 days of delivery for a full refund or exchange, provided they're unused and in their original packaging.",
      "To start a return, go to Account → Orders and select the order you'd like to return, or contact support with your order number.",
      "Refunds are issued to your original payment method within 5–7 business days of us receiving the returned item. Sale and clearance items may be final sale — this will be flagged on the product page.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    body: [
      "We deliver nationwide via Courier Guy (home delivery) and PAXI (pickup point), with live tracking available for both from the moment your order ships.",
      "Courier Guy: 2–5 business days depending on location; free above R1,000, otherwise a flat R99.",
      "PAXI: 2–5 business days to your chosen pickup point; flat R59, with an SMS notification and pickup code once your parcel arrives.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the information needed to process your orders, improve your shopping experience, and communicate with you about purchases and (if opted in) promotions.",
      "We never sell your personal information to third parties. Payment details are handled directly by our payment partners (PayFast, Ozow, Yoco, and others) and are never stored on our servers.",
      "You can request a copy of, or the deletion of, your personal data at any time via Account → Settings or by contacting support.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By using Extensive Assortment, you agree to shop in good faith, provide accurate delivery and payment information, and use the platform in accordance with South African consumer protection law.",
      "Prices and availability are subject to change without notice. Flash sale and promotional pricing is valid only for the stated period or while stock lasts.",
      "We reserve the right to cancel orders in cases of pricing errors, suspected fraud, or stock unavailability, with a full refund issued in such cases.",
    ],
  },
};

/* ------------------------------- THEME TOKENS ------------------------------ */

function useTokens(theme) {
  const dark = theme === "dark";
  return {
    dark,
    page: dark ? "bg-gray-950 text-gray-50" : "bg-slate-50 text-gray-900",
    muted: dark ? "text-gray-400" : "text-gray-500",
    glass: dark
      ? "bg-white/[0.06] backdrop-blur-xl border border-white/10"
      : "bg-white/70 backdrop-blur-xl border border-white/60",
    glassStrong: dark
      ? "bg-white/[0.08] backdrop-blur-2xl border border-white/10"
      : "bg-white/85 backdrop-blur-2xl border border-white/70",
    hover: dark ? "hover:bg-white/[0.1]" : "hover:bg-white/95",
    shadow: dark ? "shadow-2xl shadow-black/50" : "shadow-xl shadow-gray-300/40",
    border: dark ? "border-white/10" : "border-gray-200/70",
    input: dark
      ? "bg-white/[0.06] border border-white/10 placeholder-gray-500 text-gray-100"
      : "bg-white border border-gray-200 placeholder-gray-400 text-gray-900",
  };
}

/* --------------------------------- HELPERS --------------------------------- */

function Stars({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-400"}
        />
      ))}
    </div>
  );
}

function BadgePill({ children }) {
  return (
    <span className="absolute top-3 left-3 z-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-900 shadow-lg shadow-amber-500/30">
      {children}
    </span>
  );
}

/**
 * Renders a real product photo with a lazy-loaded fade-in, and falls back to the
 * gradient + emoji tile if the image fails to load or none is set. Swap `product.image`
 * for real product photography URLs in production.
 */
function ProductImage({ product, className = "", imgClassName = "", emojiSize = "text-5xl", eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const showImage = product.image && !errored;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${product.grad} ${className} ${showImage && !loaded ? "animate-pulse" : ""}`}>
      <div className={`absolute inset-0 flex items-center justify-center ${emojiSize} transition-opacity duration-300 ${showImage && loaded ? "opacity-0" : "opacity-100"}`}>
        {product.emoji}
      </div>
      {showImage && (
        <img
          src={product.image}
          alt={product.name}
          loading={eager ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        />
      )}
    </div>
  );
}

/* ------------------------------- PRODUCT CARD ------------------------------- */

function ProductCard({ p, t, wishlist, toggleWishlist, openProduct, addToCart, openQuickView, compareList, toggleCompare, fullWidth = false }) {
  const [hovered, setHovered] = useState(false);
  const inWishlist = wishlist.includes(p.id);
  const inCompare = compareList?.includes(p.id);
  const discount = Math.round(100 - (p.price / p.oldPrice) * 100);

  return (
    <div
      className={`group relative flex-shrink-0 ${fullWidth ? "w-full" : "w-[168px] sm:w-[200px]"} rounded-3xl ${t.glass} ${t.shadow} overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-black/10`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openProduct(p)}
    >
      <BadgePill>{p.badge}</BadgePill>
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); openQuickView(p); }}
          className="grid h-8 w-8 place-items-center rounded-full bg-black/20 backdrop-blur-md transition-transform hover:scale-110"
          aria-label="Quick view"
        >
          <Eye size={14} className="text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
          className="grid h-8 w-8 place-items-center rounded-full bg-black/20 backdrop-blur-md transition-transform hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart size={15} className={inWishlist ? "fill-rose-500 text-rose-500" : "text-white"} />
        </button>
        {toggleCompare && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleCompare(p.id); }}
            className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition-transform hover:scale-110 ${inCompare ? "bg-gray-900" : "bg-black/20"}`}
            aria-label="Add to compare"
          >
            <Scale size={14} className="text-white" />
          </button>
        )}
      </div>
      <div
        className="relative h-36 sm:h-44 w-full transition-transform duration-500"
        style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
      >
        <ProductImage product={p} className="h-full w-full" />
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs font-medium leading-snug line-clamp-2 h-8">{p.name}</p>
        <Stars rating={p.rating} />
        <p className={`text-[10px] ${t.muted}`}>{p.reviews} reviews · {p.stock < 15 ? `Only ${p.stock} left` : "In stock"}</p>
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="text-sm font-bold text-amber-600">{fmt(p.price)}</span>
          <span className="text-[11px] text-gray-400 line-through">{fmt(p.oldPrice)}</span>
          <span className="text-[10px] font-semibold text-amber-500">-{discount}%</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(p, 1); }}
          className="mt-1.5 w-full rounded-xl bg-gray-900 py-1.5 text-xs font-semibold text-white shadow-md shadow-black/20 transition-colors hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function Rail({ title, icon, products, t, setPage, seeAllBadge, ...cardProps }) {
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight">
          {icon}{title}
        </h2>
        <button onClick={() => setPage("category", null, seeAllBadge)} className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700">
          See all <ChevronRight size={14} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => <ProductCard key={p.id} p={p} t={t} {...cardProps} />)}
      </div>
    </section>
  );
}

/* ------------------------------ WHATSAPP FLOATING CTA ------------------------------ */

const WHATSAPP_NUMBER = "27664449092";

function WhatsAppGlyph({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path
        fill="currentColor"
        d="M16.004 3C9.377 3 4 8.373 4 15c0 2.303.646 4.455 1.766 6.29L4 29l7.897-1.723A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7a9.63 9.63 0 0 1-4.914-1.35l-.352-.21-4.686 1.023 1.005-4.57-.23-.372A9.62 9.62 0 0 1 5.3 15c0-5.907 4.797-10.7 10.704-10.7 5.906 0 10.696 4.793 10.696 10.7 0 5.906-4.79 10.7-10.696 10.7Z"
      />
      <path
        fill="currentColor"
        d="M21.62 17.68c-.302-.152-1.786-.882-2.063-.983-.277-.101-.478-.152-.68.152-.2.303-.78.983-.956 1.185-.176.202-.352.227-.654.076-.302-.152-1.276-.47-2.43-1.5-.898-.802-1.505-1.792-1.681-2.095-.176-.303-.019-.466.133-.617.136-.136.302-.353.453-.53.15-.176.2-.302.302-.504.1-.202.05-.379-.025-.53-.076-.152-.68-1.64-.932-2.245-.245-.588-.494-.508-.68-.517l-.578-.01c-.2 0-.53.076-.807.379-.277.303-1.06 1.036-1.06 2.524s1.086 2.926 1.237 3.129c.15.202 2.137 3.263 5.178 4.575.724.313 1.288.5 1.728.64.726.231 1.386.199 1.908.121.582-.087 1.786-.73 2.038-1.435.252-.706.252-1.311.176-1.436-.075-.126-.277-.202-.579-.353Z"
      />
    </svg>
  );
}

function WhatsAppButton({ t }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Extensive Assortment! I'd like some help with an order.")}`;
  const bg = t.dark ? "bg-white text-gray-900" : "bg-gray-900 text-white";
  const ping = t.dark ? "bg-white" : "bg-gray-900";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-[55] bottom-24 right-4 sm:bottom-6 sm:right-6 group"
    >
      <span className={`absolute inset-0 rounded-full opacity-60 animate-ping ${ping}`} />
      <span className={`relative grid h-14 w-14 place-items-center rounded-full shadow-xl shadow-black/20 border border-amber-400/40 transition-transform group-hover:scale-105 ${bg}`}>
        <WhatsAppGlyph size={26} />
      </span>
      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden lg:group-hover:flex items-center rounded-full bg-gray-900 text-white text-xs font-semibold px-3 py-2 whitespace-nowrap shadow-lg">
        Chat with us
      </span>
    </a>
  );
}

/* ------------------------------ TOAST FEEDBACK ------------------------------ */

const TOAST_ICONS = { check: Check, cart: ShoppingCart, heart: Heart, tag: Tag, info: Sparkles };

function ToastStack({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed z-[80] top-4 inset-x-0 flex flex-col items-center gap-2 px-4 pointer-events-none sm:top-20 sm:right-6 sm:left-auto sm:items-end">
      {toasts.map((tst) => {
        const Icon = TOAST_ICONS[tst.icon] || Check;
        return (
          <div
            key={tst.id}
            role="status"
            className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-gray-900 text-white pl-2.5 pr-4 py-2.5 shadow-2xl shadow-black/30 border border-amber-400/30 animate-[toastIn_0.25s_ease-out] max-w-[92vw] sm:max-w-sm"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-500 text-gray-900">
              <Icon size={13} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-semibold leading-tight">{tst.message}</span>
          </div>
        );
      })}
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(-8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}

function CookieConsent({ t, visible, onAccept, onDecline }) {
  if (!visible) return null;
  return (
    <div className="fixed z-[90] bottom-0 inset-x-0 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-lg px-3 pb-3 sm:px-0 sm:pb-0">
      <div className={`relative overflow-hidden rounded-[26px] ${t.glassStrong} border ${t.shadow} shadow-2xl`} style={{ animation: "privacyIn 500ms cubic-bezier(.22,1,.36,1) both" }}>
        <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-amber-400/15 blur-2xl" />
        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gray-900 text-amber-400 shadow-lg shadow-gray-900/20">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Privacy, in plain English</p>
                <p className="mt-1 text-base font-black tracking-tight">You’re in control.</p>
              </div>
            </div>
            <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${t.border} ${t.muted}`}>
              <Sparkles size={11} className="text-amber-500" /> POPIA-aware
            </span>
          </div>

          <p className={`mt-4 max-w-xl text-xs leading-relaxed ${t.muted}`}>
            We use cookies to keep your cart working, remember your preferences, and improve the shop. Choose what feels right for you.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-semibold">
            <div className={`rounded-xl border px-3 py-2.5 ${t.border}`}><span className="mr-1.5 text-emerald-500">●</span>Cart & account essentials</div>
            <div className={`rounded-xl border px-3 py-2.5 ${t.border}`}><span className="mr-1.5 text-amber-500">●</span>Helpful shopping insights</div>
          </div>

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <button onClick={onDecline} className={`flex-1 rounded-xl border px-4 py-3 text-xs font-bold transition-colors ${t.border} ${t.hover}`}>
              Essentials only
            </button>
            <button onClick={onAccept} className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-gray-900/20 transition-transform hover:-translate-y-0.5 hover:bg-gray-800">
              Accept all cookies <span className="ml-1 text-amber-400">→</span>
            </button>
          </div>
          <p className={`mt-3 text-[10px] ${t.muted}`}>Read our privacy policy for the full picture.</p>
        </div>
      </div>
      <style>{`@keyframes privacyIn { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}

/* ------------------------------ QUICK VIEW MODAL ----------------------------- */

function QuickViewModal({ t, product, onClose, wishlist, toggleWishlist, addToCart, openProduct }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const inWishlist = wishlist.includes(product.id);
  const discount = Math.round(100 - (product.price / product.oldPrice) * 100);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] ${t.glassStrong} ${t.shadow} border p-5 sm:p-6`}
      >
        <button onClick={onClose} className={`absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full ${t.hover} z-10 bg-black/10`}>
          <X size={16} />
        </button>

        <div className="relative rounded-2xl h-48 sm:h-56">
          <ProductImage product={product} className="h-full w-full rounded-2xl" emojiSize="text-6xl" eager />
          <BadgePill>{product.badge}</BadgePill>
        </div>

        <h2 className="text-base font-extrabold tracking-tight mt-4 pr-8">{product.name}</h2>
        <div className="flex items-center gap-2 mt-1.5">
          <Stars rating={product.rating} size={13} />
          <span className={`text-xs ${t.muted}`}>{product.rating} · {product.reviews} reviews</span>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-xl font-extrabold text-amber-600">{fmt(product.price)}</span>
          <span className="text-xs text-gray-400 line-through">{fmt(product.oldPrice)}</span>
          <span className="text-[11px] font-bold text-amber-500">-{discount}%</span>
        </div>
        <p className={`text-xs mt-1 ${product.stock < 15 ? "text-amber-500" : "text-amber-600"} font-medium`}>
          {product.stock < 15 ? `Only ${product.stock} left in stock` : "In stock, ready to ship"}
        </p>

        {product.colors[0] !== "Natural" && (
          <div className="mt-4">
            <p className="text-xs font-semibold mb-1.5">Colour</p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`h-7 w-7 rounded-full border-2 ${color === c ? "border-amber-500" : "border-transparent"}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs font-semibold mb-1.5">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`rounded-xl px-3 py-1.5 text-xs font-medium border ${size === s ? "bg-gray-900 text-white border-amber-500" : `${t.glass} ${t.border}`}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <p className="text-xs font-semibold">Qty</p>
          <div className={`flex items-center rounded-xl ${t.glass} border`}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus size={13} /></button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="p-2"><Plus size={13} /></button>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => { addToCart(product, qty, { color, size }); onClose(); }}
            className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
          <button onClick={() => toggleWishlist(product.id)} className={`grid place-items-center rounded-2xl px-4 border ${t.glass} ${inWishlist ? "text-rose-500" : ""}`}>
            <Heart size={18} className={inWishlist ? "fill-rose-500" : ""} />
          </button>
        </div>
        <button
          onClick={() => { openProduct(product); onClose(); }}
          className="w-full text-center text-xs font-semibold text-amber-600 mt-3 py-1"
        >
          View full details
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- HEADER ---------------------------------- */

function Header({ t, theme, setTheme, cartCount, wishlistCount, setPage, search, setSearch, openProduct }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const suggestions = search.trim().length >= 2
    ? ACTIVE_PRODUCTS.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 5)
    : [];
  const pickSuggestion = (p) => {
    openProduct(p);
    setSearch("");
    setSearchOpen(false);
  };

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  React.useEffect(() => {
    const onKeyDown = (e) => { if (e.key === "Escape") setSearchOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!searchOpen) return;
    const onClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [searchOpen]);

  return (
    <div ref={headerRef}>
      {/* Desktop */}
      <header className={`hidden md:flex sticky top-0 z-40 items-center gap-6 px-8 lg:px-10 py-3 ${t.glassStrong} border-b relative transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-black/10" : "shadow-none"}`}>
        <button onClick={() => setPage("home")} className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-black/20">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">Extensive <span className="text-amber-600">Assortment</span></span>
        </button>

        <nav className="flex items-center gap-5 text-sm font-medium">
          <button onClick={() => setPage("home")} className="hover:text-amber-600 transition-colors">Home</button>
          <button onClick={() => setPage("category")} className="hover:text-amber-600 transition-colors">Shop</button>
          <div className="group relative">
            <button onClick={() => setPage("category")} className="hover:text-amber-600 transition-colors">Categories</button>
            <div className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] grid grid-cols-2 gap-1 rounded-2xl p-3 transition-all ${t.glassStrong} ${t.shadow} border`}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setPage("category", c.id)} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs ${t.hover}`}>
                  <span>{c.emoji}</span>{c.name}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setPage("category", null, "New")} className="hover:text-amber-600 transition-colors">New In</button>
          <button onClick={() => setPage("category", null, "Flash Sale")} className="hover:text-amber-600 transition-colors">Deals</button>
          <button onClick={() => setPage("info", "about")} className="hover:text-amber-600 transition-colors">About Us</button>
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setSearchOpen((o) => !o)} aria-label="Toggle search" className={`grid h-10 w-10 place-items-center rounded-full ${searchOpen ? "bg-gray-900 text-white" : t.hover}`}>
            <Search size={18} />
          </button>
          <button aria-label="Switch colour theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`grid h-10 w-10 place-items-center rounded-full ${t.hover}`}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`} onClick={() => setPage("wishlist")} className={`grid h-10 w-10 place-items-center rounded-full ${t.hover} relative`}>
            <Heart size={18} />
            {wishlistCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-amber-400 text-[9px] font-bold text-gray-900 grid place-items-center">{wishlistCount}</span>}
          </button>
          <button aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`} onClick={() => setPage("cart")} className={`grid h-10 w-10 place-items-center rounded-full ${t.hover} relative`}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-gray-900 text-[9px] font-bold text-white grid place-items-center">{cartCount}</span>}
          </button>
          <button aria-label="Account" onClick={() => setPage("profile")} className={`grid h-10 w-10 place-items-center rounded-full ${t.hover}`}>
            <User size={18} />
          </button>
        </div>

        {searchOpen && (
          <div className={`absolute top-full left-0 right-0 px-8 lg:px-10 py-4 ${t.glassStrong} ${t.shadow} border-b`}>
            <div className="relative max-w-2xl mx-auto">
              <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${t.muted}`} />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearchOpen(false)}
                placeholder="Search products, brands..."
                className={`w-full rounded-full py-3 pl-10 pr-10 text-sm outline-none ${t.input} focus:border-amber-400 transition-colors`}
              />
              <button onClick={() => setSearchOpen(false)} className={`absolute right-3.5 top-1/2 -translate-y-1/2 grid place-items-center ${t.muted} hover:text-rose-500`}>
                <X size={16} />
              </button>
              {suggestions.length > 0 && (
                <div className={`absolute top-full mt-2 left-0 right-0 rounded-2xl overflow-hidden ${t.glassStrong} border ${t.shadow}`}>
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => pickSuggestion(p)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${t.hover}`}
                    >
                      <img src={p.image} alt="" className="h-9 w-9 rounded-lg object-cover shrink-0" />
                      <span className="text-xs font-medium flex-1 truncate">{p.name}</span>
                      <span className="text-xs font-bold text-amber-600 shrink-0">{fmt(p.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile */}
      <header className={`md:hidden sticky top-0 z-40 ${t.glassStrong} border-b transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-black/10" : "shadow-none"}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
              <Leaf size={15} className="text-white" />
            </div>
            <span className="text-sm font-extrabold">Extensive <span className="text-amber-600">Assortment</span></span>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen((o) => !o)} aria-label="Toggle search" className={`grid h-9 w-9 place-items-center rounded-full ${searchOpen ? "bg-gray-900 text-white" : t.hover}`}>
              <Search size={16} />
            </button>
            <button aria-label="Switch colour theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`grid h-9 w-9 place-items-center rounded-full ${t.hover}`}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button aria-label="Account" onClick={() => setPage("profile")} className={`grid h-9 w-9 place-items-center rounded-full ${t.hover}`}>
              <User size={16} />
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="px-4 pb-3 relative">
            <Search size={15} className={`absolute left-7 top-1/2 -translate-y-1/2 ${t.muted}`} />
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearchOpen(false)}
              placeholder="Search Extensive Assortment"
              className={`w-full rounded-full py-2.5 pl-9 pr-9 text-base sm:text-xs outline-none ${t.input}`}
            />
            <button onClick={() => setSearchOpen(false)} className={`absolute right-7 top-1/2 -translate-y-1/2 ${t.muted} hover:text-rose-500`}>
              <X size={14} />
            </button>
            {suggestions.length > 0 && (
              <div className={`mt-2 rounded-2xl overflow-hidden ${t.glassStrong} border ${t.shadow}`}>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => pickSuggestion(p)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left ${t.hover}`}
                  >
                    <img src={p.image} alt="" className="h-8 w-8 rounded-lg object-cover shrink-0" />
                    <span className="text-xs font-medium flex-1 truncate">{p.name}</span>
                    <span className="text-xs font-bold text-amber-600 shrink-0">{fmt(p.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

function BottomNav({ t, page, setPage, cartCount, wishlistCount }) {
  const items = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "category", label: "Categories", icon: Grid3x3 },
    { id: "wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    { id: "cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <nav className={`md:hidden fixed bottom-0 inset-x-0 z-40 ${t.glassStrong} border-t ${t.shadow} px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]`}>
      <div className="grid grid-cols-5">
        {items.map(({ id, label, icon: Icon, badge }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => setPage(id)} className="relative flex flex-col items-center gap-1 py-1">
              <div className={`relative grid h-8 w-8 place-items-center rounded-xl transition-colors ${active ? "bg-amber-500/15" : ""}`}>
                <Icon size={18} className={active ? "text-amber-600" : t.muted} />
                {badge > 0 && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 text-[8px] font-bold text-gray-900 grid place-items-center">{badge}</span>}
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-amber-600" : t.muted}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------------------------------- HOME ------------------------------------ */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

function CountUp({ value, duration = 1400 }) {
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const ref = React.useRef(null);
  const startedRef = React.useRef(false);
  const [display, setDisplay] = useState(target === null ? value : 0);

  React.useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  if (target === null) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{display}{suffix}</span>;
}

function Hero({ t, setPage }) {
  const trustItems = [
    { icon: Award, title: "Quality Products", sub: "Premium & Durable" },
    { icon: Truck, title: "Fast Delivery", sub: "Nationwide Shipping" },
    { icon: ShieldCheck, title: "Secure Payment", sub: "100% Safe & Secure" },
  ];
  const socials = [Facebook, Instagram, Youtube];

  return (
    <section className="pt-5">
      {/* Mobile: full-bleed image with readable content overlaid */}
      <div className={`lg:hidden relative min-h-[680px] overflow-hidden ${t.shadow} border-y ${t.border}`}>
        <img
          src={HERO_IMAGE}
          alt="Curated edit of sneakers, watches, hair, and accessories"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/35 via-gray-950/30 to-gray-950/95" />

        <div className="relative flex min-h-[680px] flex-col justify-between px-6 pt-8 pb-5 text-white">
          <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={12} className="text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Shop. Style. Live Better</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-[1.05]">
            Everything
            <br />
            You Love,
            <br />
            <span className="text-amber-500">All in One Place</span>
          </h1>
          <p className={`mt-3 text-sm ${t.muted}`}>
            Hair, watches, sunglasses, sneakers, hoodies, sweaters, bedding &amp; curtains.
          </p>
          <button
            onClick={() => setPage("category")}
            className={`mt-5 flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold shadow-lg transition-opacity hover:opacity-90 ${
              t.dark ? "bg-white text-gray-900" : "bg-gray-900 text-white"
            }`}
          >
            Shop Now <ArrowRight size={16} />
          </button>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-0.5">
              {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={13} className="text-amber-500 fill-amber-500" />)}
            </div>
            <span className="text-xs font-semibold text-white/75">4.8/5 from 1,200+ South African shoppers</span>
          </div>
          </div>

        <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-5">
          {trustItems.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-1.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber-500/40 text-amber-500">
                <Icon size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold leading-tight">{title}</p>
                <p className="text-[10px] leading-tight text-white/70">{sub}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Desktop: full-bleed image with text overlaid */}
      <div className={`hidden lg:block relative overflow-hidden rounded-none ${t.shadow} border-y ${t.border}`}>
        <div className="relative min-h-[660px]">
          <img
            src={HERO_IMAGE}
            alt="Curated edit of sneakers, watches, hair, and accessories"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          <div
            className={`absolute inset-0 ${
              t.dark
                ? "bg-gradient-to-r from-gray-950 via-gray-950/75 to-gray-950/10"
                : "bg-gradient-to-r from-white via-white/80 to-white/10"
            }`}
          />

          <div className="relative h-full flex flex-col justify-center px-14 py-12 max-w-xl">
            <div className="flex items-center gap-1.5 mb-4">
              <Sparkles size={13} className="text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">Shop. Style. Live Better</span>
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight leading-[1.05]">
              Everything
              <br />
              You Love,
              <br />
              <span className="text-amber-500">All in One Place</span>
            </h1>
            <p className={`mt-4 text-base max-w-md ${t.muted}`}>
              Hair, watches, sunglasses, sneakers, hoodies, sweaters, bedding &amp; curtains.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setPage("category")}
                className={`flex w-fit items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold shadow-lg transition-opacity hover:opacity-90 ${
                  t.dark ? "bg-white text-gray-900" : "bg-gray-900 text-white"
                }`}
              >
                Shop Now <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setPage("category")}
                className={`flex w-fit items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold border-2 transition-colors ${
                  t.dark ? "border-white/30 text-white hover:bg-white/10" : "border-gray-900/20 text-gray-900 hover:bg-gray-900/5"
                }`}
              >
                Explore Categories
              </button>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <div className="flex -space-x-0.5">
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={14} className="text-amber-500 fill-amber-500" />)}
              </div>
              <span className={`text-xs font-semibold ${t.muted}`}>4.8/5 from 1,200+ South African shoppers</span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-9">
              {trustItems.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-amber-500/40 text-amber-500">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{title}</p>
                    <p className={`text-[10px] ${t.muted}`}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <span className={`text-xs ${t.muted}`}>Follow Us</span>
              {socials.map((Icon, i) => (
                <div key={i} className={`grid h-7 w-7 place-items-center rounded-full ${t.glass} border`}>
                  <Icon size={13} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-3xl bg-gray-900 px-6 sm:px-10 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users2, value: "1000+", label: "Happy Customers" },
          { icon: Package, value: "5000+", label: "Quality Products" },
          { icon: Star, value: "Trusted", label: "By Thousands" },
          { icon: Headphones, value: "24/7", label: "Customer Support" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amber-400/40 text-amber-400">
              <Icon size={16} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white"><CountUp value={value} /></p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FlashSaleBanner({ t, setPage }) {
  const [target] = useState(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  });
  const [remaining, setRemaining] = useState(() => Math.max(0, target.getTime() - Date.now()));

  React.useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, target.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");

  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-6">
      <button
        onClick={() => setPage("category", null, "Flash Sale")}
        className="w-full text-left rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-amber-950/40 border border-amber-400/20 p-5 sm:p-6 flex items-center justify-between overflow-hidden relative hover:border-amber-400/40 transition-colors"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-400/15">
            <Zap size={20} className="text-amber-400 fill-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Flash Sale ends in</p>
            <p className="text-xs text-gray-400">Up to 45% off — today only</p>
          </div>
        </div>
        <div className="relative flex gap-1.5">
          {[hh, mm, ss].map((v, i) => (
            <div key={i} className="rounded-lg bg-white/10 px-2.5 py-1.5 text-center backdrop-blur-md">
              <span className="text-sm font-mono font-bold text-white">{v}</span>
            </div>
          ))}
        </div>
      </button>
    </section>
  );
}

function CategoryTile({ c, setPage }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button onClick={() => setPage("category", c.id)} className="flex flex-col items-center gap-1.5 group">
      <div className={`relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden bg-gradient-to-br ${c.from} ${c.to} shadow-lg transition-transform group-hover:scale-105 group-hover:-translate-y-0.5 ring-1 ring-black/5 ${!loaded ? "animate-pulse" : ""}`}>
        <img
          src={c.image}
          alt={c.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">{c.name}</span>
    </button>
  );
}

function CategoryGrid({ t, setPage }) {
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-6">
      <h2 className="text-base sm:text-lg font-bold tracking-tight mb-3">Top Categories</h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
        {CATEGORIES.map((c) => <CategoryTile key={c.id} c={c} setPage={setPage} />)}
      </div>
    </section>
  );
}

function TrustStrip({ t }) {
  const items = [
    { icon: Truck, label: "Nationwide delivery", sub: "Courier Guy & PAXI" },
    { icon: ShieldCheck, label: "Secure checkout", sub: "PayPal wallet & cards" },
    { icon: Package, label: "Easy returns", sub: "30-day window" },
    { icon: Gift, label: "Reward points", sub: "On every order" },
  ];
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(({ icon: Icon, label, sub }, i) => (
          <div key={i} className={`flex items-center gap-3 rounded-2xl p-3.5 ${t.glass} border ${t.shadow}`}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/15">
              <Icon size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold">{label}</p>
              <p className={`text-[10px] ${t.muted}`}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Thandiwe M.", city: "Johannesburg", rating: 5, text: "Ordered sneakers on a Tuesday and they were on my doorstep by Thursday via Courier Guy. Packaging was solid and the sizing guide was spot on.", initials: "TM" },
  { name: "Sipho N.", city: "Durban", rating: 5, text: "Been using the PAXI pickup point near my work — so much easier than waiting around for a courier. Prices beat the malls too.", initials: "SN" },
  { name: "Amahle K.", city: "Cape Town", rating: 4, text: "Returned a hoodie that ran small and the refund landed in my account in under a week, no back and forth needed. Will shop here again.", initials: "AK" },
  { name: "Lerato P.", city: "Pretoria", rating: 5, text: "The hair bundles are genuinely as described in the photos — rare for online orders. Customer service on WhatsApp replied within minutes.", initials: "LP" },
];

function Testimonials({ t }) {
  const trackRef = React.useRef(null);
  const pausedRef = React.useRef(false);
  const [active, setActive] = useState(0);

  const scrollToIndex = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const idx = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    const child = track.children[idx];
    if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActive(idx);
  };

  React.useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => {
        const next = (prev + 1) % TESTIMONIALS.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={13} className="text-amber-500 fill-amber-500" />)}
            <span className={`text-xs font-semibold ${t.muted} ml-1`}>4.8 out of 5 · 1,200+ reviews</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">What shoppers are saying</h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scrollToIndex(active - 1)}
            aria-label="Previous testimonial"
            className={`grid h-9 w-9 place-items-center rounded-full ${t.glass} border ${t.hover}`}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scrollToIndex(active + 1)}
            aria-label="Next testimonial"
            className={`grid h-9 w-9 place-items-center rounded-full ${t.glass} border ${t.hover}`}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => (pausedRef.current = false)}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TESTIMONIALS.map((r) => (
          <div
            key={r.name}
            className={`snap-start shrink-0 w-[82%] sm:w-[46%] lg:w-[31%] xl:w-[23%] rounded-3xl p-5 ${t.glass} border ${t.shadow} flex flex-col`}
          >
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={13} className={n <= r.rating ? "text-amber-500 fill-amber-500" : `${t.muted} opacity-30`} />
              ))}
            </div>
            <p className="text-xs leading-relaxed flex-1">"{r.text}"</p>
            <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-current/10">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-900 text-white text-[10px] font-bold">
                {r.initials}
              </div>
              <div>
                <p className="text-xs font-semibold">{r.name}</p>
                <p className={`text-[10px] ${t.muted}`}>{r.city} · Verified buyer</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-5">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-amber-500" : `w-1.5 ${t.dark ? "bg-white/25" : "bg-gray-900/20"}`}`}
          />
        ))}
      </div>
    </section>
  );
}

function Footer({ t, setPage }) {
  const cols = [
    { title: "Company", links: [
      { label: "About Us", topic: "about" },
      { label: "Careers", topic: "careers" },
      { label: "Become a Seller", topic: "seller" },
      { label: "Blog", topic: "blog" },
    ] },
    { title: "Support", links: [
      { label: "Contact Us", topic: "contact" },
      { label: "FAQs", topic: "faqs" },
      { label: "Track Order", track: true },
      { label: "Returns Policy", topic: "returns" },
    ] },
    { title: "Legal", links: [
      { label: "Privacy Policy", topic: "privacy" },
      { label: "Terms & Conditions", topic: "terms" },
      { label: "Shipping Policy", topic: "shipping" },
    ] },
  ];
  return (
    <footer className={`mt-8 border-t ${t.border} px-4 sm:px-6 lg:px-10 py-10 pb-28 md:pb-10`}>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="col-span-2">
          <button onClick={() => setPage("home")} className="flex items-center gap-2 mb-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
              <Leaf size={15} className="text-white" />
            </div>
            <span className="text-sm font-extrabold">Extensive Assortment</span>
          </button>
          <p className={`text-xs ${t.muted} max-w-xs`}>South Africa's next-generation marketplace for fashion, tech, beauty and home — delivered nationwide.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3">{c.title}</p>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => (l.track ? setPage("tracking") : setPage("info", l.topic))}
                    className={`text-xs ${t.muted} hover:text-amber-600 transition-colors text-left`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={`text-[11px] ${t.muted} mt-8`}>© 2026 Extensive Assortment. All rights reserved.</p>
    </footer>
  );
}

function NotFoundPage({ t, setPage }) {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-16 max-w-lg mx-auto text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-amber-500/15">
        <PackageCheck size={26} className="text-amber-600" />
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-2">We couldn't find that product</h1>
      <p className={`text-sm ${t.muted} mb-7`}>
        It may have sold out or been removed from our catalogue. Have a look at what's trending instead.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setPage("home")}
          className="rounded-full bg-gray-900 text-white text-sm font-bold px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Back to Home
        </button>
        <button
          onClick={() => setPage("category")}
          className={`rounded-full border text-sm font-bold px-6 py-3 ${t.hover}`}
        >
          Browse All Products
        </button>
      </div>
    </div>
  );
}

function InfoPage({ t, topic, setPage }) {
  if (topic === "faqs") return <FAQPage t={t} setPage={setPage} />;
  const content = INFO_CONTENT[topic] || INFO_CONTENT.about;
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-4xl mx-auto">
      <button onClick={() => setPage("home")} className={`flex items-center gap-1 text-xs font-medium ${t.muted} mb-5 hover:text-amber-600`}>
        <ChevronLeft size={14} /> Back home
      </button>
      <div className={`rounded-3xl p-6 sm:p-8 lg:p-10 ${t.glass} border ${t.shadow}`}>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-5">{content.title}</h1>
        <div className="space-y-3 lg:columns-2 lg:gap-8">
          {content.body.map((line, i) => <p key={i} className={`text-sm leading-relaxed ${t.muted} break-inside-avoid mb-3`}>{line}</p>)}
        </div>
      </div>
    </div>
  );
}

function FAQPage({ t, setPage }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState(null);

  const categories = ["All", ...FAQ_DATA.map((g) => g.category)];

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_DATA
      .filter((g) => activeCategory === "All" || g.category === activeCategory)
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) => !q || it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, activeCategory]);

  const totalResults = filteredGroups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-5xl mx-auto">
      <button onClick={() => setPage("home")} className={`flex items-center gap-1 text-xs font-medium ${t.muted} mb-5 hover:text-amber-600`}>
        <ChevronLeft size={14} /> Back home
      </button>

      {/* Header */}
      <div className="text-center mb-7">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
          <HelpCircle size={22} className="text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Frequently Asked Questions</h1>
        <p className={`text-sm ${t.muted}`}>Answers about orders, delivery, returns, and payments — can't find yours? Chat to us on WhatsApp.</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search FAQs — try “returns” or “PAXI”"
          className={`w-full rounded-full pl-11 pr-4 py-3 text-base sm:text-sm outline-none ring-1 ring-transparent focus:ring-amber-500/50 transition-shadow ${t.input}`}
        />
        {query && (
          <button onClick={() => setQuery("")} className={`absolute right-3.5 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full ${t.hover}`} aria-label="Clear search">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              activeCategory === c ? "bg-gray-900 text-white" : `${t.glass} border ${t.hover}`
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {query && (
        <p className={`text-xs ${t.muted} mb-3`}>{totalResults} result{totalResults !== 1 ? "s" : ""} for "{query}"</p>
      )}

      {/* Groups */}
      <div className="space-y-7 lg:columns-2 lg:gap-6 lg:space-y-0 [column-fill:_balance]">
        {filteredGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.category} className="break-inside-avoid mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-amber-500/15 text-amber-600">
                  <GroupIcon size={14} />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wide">{group.category}</h2>
              </div>
              <div className={`rounded-3xl ${t.glass} border ${t.shadow} divide-y ${t.border} overflow-hidden`}>
                {group.items.map((item) => {
                  const id = `${group.category}__${item.q}`;
                  const isOpen = openId === id;
                  return (
                    <div key={id}>
                      <button
                        onClick={() => setOpenId(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className={`w-full flex items-center justify-between gap-4 text-left px-5 py-4 transition-colors ${t.hover}`}
                      >
                        <span className={`text-sm font-semibold ${isOpen ? "text-amber-600" : ""}`}>{item.q}</span>
                        <ChevronRight
                          size={16}
                          className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90 text-amber-600" : "opacity-50"}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <p className={`px-5 pb-4 text-sm leading-relaxed ${t.muted}`}>{item.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className={`text-center py-14 rounded-3xl ${t.glass} border ${t.shadow}`}>
            <p className="text-sm font-semibold mb-1">No matches for "{query}"</p>
            <p className={`text-xs ${t.muted}`}>Try a different search, or chat to us on WhatsApp for a direct answer.</p>
          </div>
        )}
      </div>

      {/* Still need help CTA */}
      <div className={`mt-8 rounded-3xl p-6 text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white`}>
        <p className="text-sm font-bold mb-1">Still need help?</p>
        <p className="text-xs text-white/70 mb-4">Our team typically replies within a few minutes, 8am–8pm SAST.</p>
        <button
          onClick={() => setPage("info", "contact")}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-gray-900 text-xs font-bold px-5 py-2.5 hover:bg-amber-400 transition-colors"
        >
          Contact Support <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- CATEGORY PAGE ------------------------------ */

function CategoryPage({ t, selectedCategory, setSelectedCategory, badge, ...cardProps }) {
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(20000);
  const filtered = useMemo(() => {
    let list = ACTIVE_PRODUCTS.filter((p) => (!selectedCategory || p.category === selectedCategory) && (!badge || p.badge === badge) && p.price <= maxPrice);
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [selectedCategory, badge, sort, maxPrice]);

  const catObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5 flex gap-6">
      <aside className={`hidden lg:block w-56 shrink-0 rounded-3xl ${t.glass} border ${t.shadow} p-4 h-fit sticky top-24`}>
        <p className="text-xs font-bold uppercase tracking-wide mb-3">Categories</p>
        <div className="space-y-1">
          <button onClick={() => setSelectedCategory(null)} className={`block w-full text-left rounded-xl px-3 py-2 text-xs ${!selectedCategory ? "bg-amber-500/15 text-amber-600 font-semibold" : t.hover}`}>All Products</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`flex items-center gap-2 w-full text-left rounded-xl px-3 py-2 text-xs ${selectedCategory === c.id ? "bg-amber-500/15 text-amber-600 font-semibold" : t.hover}`}>
              <span>{c.emoji}</span>{c.name}
            </button>
          ))}
        </div>
        <p className="text-xs font-bold uppercase tracking-wide mt-5 mb-3">Price Range</p>
        <input aria-label="Maximum product price" type="range" min="0" max="20000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-amber-500" />
        <div className="flex justify-between text-[10px] mt-1 opacity-60"><span>R0</span><span>{maxPrice === 20000 ? "R20,000+" : fmt(maxPrice)}</span></div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold tracking-tight">{catObj ? `${catObj.emoji} ${catObj.name}` : badge ? badge : "All Products"}</h1>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={`rounded-full text-xs px-3 py-2 outline-none ${t.input}`}>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        <div className="flex lg:hidden gap-2 overflow-x-auto pb-3 mb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button onClick={() => setSelectedCategory(null)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${!selectedCategory ? "bg-gray-900 text-white" : t.glass + " border"}`}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${selectedCategory === c.id ? "bg-gray-900 text-white" : t.glass + " border"}`}>{c.emoji} {c.name}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="w-full">
              <ProductCard p={p} t={t} fullWidth {...cardProps} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- PRODUCT PAGE -------------------------------- */

function ProductPage({ t, product, wishlist, toggleWishlist, addToCart, setPage, openProduct, compareList, toggleCompare, openQuickView }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [mode360, setMode360] = useState(false);
  const [rotation, setRotation] = useState(0);
  const dragRef = React.useRef({ dragging: false, lastX: 0 });
  const [tab, setTab] = useState("description");
  const [fbtSelected, setFbtSelected] = useState({});
  const [qaQuestion, setQaQuestion] = useState("");
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [votedHelpful, setVotedHelpful] = useState({});

  const inWishlist = wishlist.includes(product.id);
  const related = ACTIVE_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const fbtItems = ACTIVE_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 2);
  const reviews = useMemo(() => generateReviews(product), [product.id]);
  const qa = useMemo(() => generateQA(product), [product.id]);
  const breakdown = useMemo(() => ratingBreakdown(reviews), [reviews]);

  React.useEffect(() => {
    const ids = { [product.id]: true };
    fbtItems.forEach((p) => (ids[p.id] = true));
    setFbtSelected(ids);
  }, [product.id]);

  const fbtTotal = [product, ...fbtItems].reduce((s, p) => (fbtSelected[p.id] ? s + p.price : s), 0);
  const fbtCount = Object.values(fbtSelected).filter(Boolean).length;

  const startDrag = (clientX) => { dragRef.current = { dragging: true, lastX: clientX }; };
  const moveDrag = (clientX) => {
    if (!dragRef.current.dragging) return;
    const delta = clientX - dragRef.current.lastX;
    setRotation((r) => r + delta * 0.6);
    dragRef.current.lastX = clientX;
  };
  const endDrag = () => { dragRef.current.dragging = false; };

  const handleAskQuestion = () => {
    if (!qaQuestion.trim()) return;
    setAskedQuestions((prev) => [{ q: qaQuestion.trim(), a: null, days: "Just now" }, ...prev]);
    setQaQuestion("");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5">
      <button onClick={() => setPage("category", product.category)} className={`flex items-center gap-1 text-xs font-medium ${t.muted} mb-4 hover:text-amber-600`}>
        <ChevronLeft size={14} /> Back to {product.category}
      </button>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div
            className={`relative rounded-[28px] h-72 sm:h-96 ${t.shadow} overflow-hidden select-none ${mode360 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
            onClick={() => !mode360 && setZoomed(true)}
            onMouseDown={(e) => mode360 && startDrag(e.clientX)}
            onMouseMove={(e) => mode360 && moveDrag(e.clientX)}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={(e) => mode360 && startDrag(e.touches[0].clientX)}
            onTouchMove={(e) => mode360 && moveDrag(e.touches[0].clientX)}
            onTouchEnd={endDrag}
          >
            <div
              className="h-full w-full"
              style={{ transform: mode360 ? `perspective(900px) rotateY(${rotation}deg)` : "none", transition: dragRef.current.dragging ? "none" : "transform 0.2s ease" }}
            >
              <ProductImage product={product} className="h-full w-full" emojiSize="text-8xl" eager />
            </div>
            <BadgePill>{product.badge}</BadgePill>
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); setMode360((m) => !m); }}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold backdrop-blur-md transition-colors ${mode360 ? "bg-gray-900 text-white" : "bg-black/30 text-white"}`}
              >
                <RotateCw size={12} /> 360°
              </button>
              {!mode360 && (
                <button onClick={(e) => { e.stopPropagation(); setZoomed(true); }} className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                  <ZoomIn size={12} /> Zoom
                </button>
              )}
            </div>
            {mode360 && <p className="absolute top-3 right-3 text-[10px] font-medium text-white/80">Drag to rotate</p>}
          </div>
          <div className="flex gap-2 mt-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-16 w-16 rounded-2xl overflow-hidden ${i === 0 ? "" : "opacity-50"} ${t.glass} border`}>
                <ProductImage product={product} className="h-full w-full" emojiSize="text-xl" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Stars rating={product.rating} size={14} />
            <span className={`text-xs ${t.muted}`}>{product.rating} · {product.reviews} reviews</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl font-extrabold text-amber-600">{fmt(product.price)}</span>
            <span className="text-sm text-gray-400 line-through">{fmt(product.oldPrice)}</span>
            <span className="text-xs font-bold text-amber-500">Save {fmt(product.oldPrice - product.price)}</span>
          </div>
          <p className={`text-xs mt-1 ${product.stock < 15 ? "text-amber-500" : "text-amber-600"} font-medium`}>
            {product.stock < 15 ? `Only ${product.stock} left in stock` : "In stock, ready to ship"}
          </p>

          {product.colors[0] !== "Natural" && (
            <div className="mt-5">
              <p className="text-xs font-semibold mb-2">Colour</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-amber-500" : "border-transparent"}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="text-xs font-semibold mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`rounded-xl px-3.5 py-1.5 text-xs font-medium border ${size === s ? "bg-gray-900 text-white border-amber-500" : `${t.glass} ${t.border}`}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <p className="text-xs font-semibold">Qty</p>
            <div className={`flex items-center rounded-xl ${t.glass} border`}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus size={13} /></button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2"><Plus size={13} /></button>
            </div>
          </div>

          <div className={`mt-5 rounded-2xl p-3.5 ${t.glass} border flex items-center gap-3`}>
            <Truck size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold">Estimated delivery: 2–5 business days</p>
              <p className={`text-[10px] ${t.muted}`}>Courier Guy nationwide · PAXI pickup from R59</p>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={() => addToCart(product, qty, { color, size })} className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 hover:bg-gray-800 transition-colors">
              Add to Cart
            </button>
            <button onClick={() => { addToCart(product, qty, { color, size }); setPage("checkout"); }} className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors">
              Buy Now
            </button>
            <button onClick={() => toggleWishlist(product.id)} className={`grid place-items-center rounded-2xl px-4 border ${t.glass} ${inWishlist ? "text-rose-500" : ""}`}>
              <Heart size={18} className={inWishlist ? "fill-rose-500" : ""} />
            </button>
            {toggleCompare && (
              <button onClick={() => toggleCompare(product.id)} className={`grid place-items-center rounded-2xl px-4 border ${t.glass} ${compareList?.includes(product.id) ? "text-amber-600" : ""}`}>
                <Scale size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      {fbtItems.length > 0 && (
        <div className={`mt-10 rounded-3xl p-5 ${t.glass} border ${t.shadow}`}>
          <h2 className="text-base font-bold mb-4">Frequently Bought Together</h2>
          <div className="flex flex-wrap items-center gap-3">
            {[product, ...fbtItems].map((p, i) => (
              <React.Fragment key={p.id}>
                <label className={`flex items-center gap-2.5 rounded-2xl p-2.5 border cursor-pointer ${fbtSelected[p.id] ? "border-amber-500 bg-amber-500/5" : t.border}`}>
                  <input type="checkbox" checked={!!fbtSelected[p.id]} onChange={() => setFbtSelected((s) => ({ ...s, [p.id]: !s[p.id] }))} className="accent-amber-500 h-3.5 w-3.5" />
                  <div className="h-12 w-12 rounded-xl overflow-hidden">
                    <ProductImage product={p} className="h-full w-full" emojiSize="text-xl" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium max-w-[110px] line-clamp-2">{p.name}{i === 0 ? " (this item)" : ""}</p>
                    <p className="text-xs font-bold text-amber-600">{fmt(p.price)}</p>
                  </div>
                </label>
                {i < fbtItems.length && <Plus size={14} className={t.muted} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-gray-400/30">
            <p className="text-sm">Total for <span className="font-bold">{fbtCount} items</span>: <span className="font-bold text-amber-600">{fmt(fbtTotal)}</span></p>
            <button
              onClick={() => [product, ...fbtItems].forEach((p) => fbtSelected[p.id] && addToCart(p, 1))}
              className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-md shadow-black/20 hover:bg-gray-800 transition-colors"
            >
              Add Selected to Cart
            </button>
          </div>
        </div>
      )}

      {/* Tabs: Description / Reviews / Q&A */}
      <div className="mt-10">
        <div className={`flex gap-1 rounded-2xl p-1 ${t.glass} border w-fit`}>
          {[
            { id: "description", label: "Description" },
            { id: "reviews", label: `Reviews (${reviews.length})` },
            { id: "qa", label: `Q&A (${qa.length + askedQuestions.length})` },
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${tab === tb.id ? "bg-gray-900 text-white" : t.muted}`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-3xl p-5 ${t.glass} border ${t.shadow}`}>
          {tab === "description" && (
            <div className="space-y-3 text-xs leading-relaxed">
              <p className={t.muted}>
                The {product.name} is designed for everyday reliability without compromising on finish — a considered pick from our {CATEGORIES.find((c) => c.id === product.category)?.name.toLowerCase()} range.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2"><Check size={13} className="text-amber-600 shrink-0" /> Quality-checked before dispatch</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-amber-600 shrink-0" /> Ships within 24 hours of ordering</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-amber-600 shrink-0" /> 30-day hassle-free returns</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-amber-600 shrink-0" /> Covered by manufacturer warranty</li>
              </ul>
            </div>
          )}

          {tab === "reviews" && (
            <div>
              <div className="flex flex-col sm:flex-row gap-6 pb-5 border-b border-dashed border-gray-400/30">
                <div className="text-center sm:w-32 shrink-0">
                  <p className="text-3xl font-extrabold">{product.rating}</p>
                  <Stars rating={product.rating} size={13} />
                  <p className={`text-[10px] mt-1 ${t.muted}`}>{product.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {breakdown.map((b) => (
                    <div key={b.star} className="flex items-center gap-2">
                      <span className="text-[10px] w-8 shrink-0">{b.star} star</span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-400/20 overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className={`text-[10px] w-8 shrink-0 text-right ${t.muted}`}>{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-4">
                {reviews.map((r, i) => (
                  <div key={i} className="pb-4 border-b border-dashed border-gray-400/20 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">{r.name}</p>
                      <span className={`text-[10px] ${t.muted}`}>{r.days}</span>
                    </div>
                    <Stars rating={r.rating} size={11} />
                    <p className={`text-xs mt-1.5 ${t.muted}`}>{r.text}</p>
                    <button
                      onClick={() => setVotedHelpful((v) => ({ ...v, [i]: !v[i] }))}
                      className={`flex items-center gap-1 text-[10px] mt-1.5 transition-colors ${votedHelpful[i] ? "text-amber-600 font-semibold" : `${t.muted} hover:text-amber-600`}`}
                    >
                      <ThumbsUp size={11} className={votedHelpful[i] ? "fill-amber-600" : ""} /> Helpful ({r.helpful + (votedHelpful[i] ? 1 : 0)})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "qa" && (
            <div>
              <div className="flex gap-2 pb-4 border-b border-dashed border-gray-400/30">
                <input
                  value={qaQuestion}
                  onChange={(e) => setQaQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                  placeholder="Ask a question about this product"
                  className={`flex-1 rounded-xl px-3 py-2 text-base sm:text-xs outline-none ${t.input}`}
                />
                <button onClick={handleAskQuestion} className="rounded-xl bg-gray-900 px-3.5 text-xs font-semibold text-white shrink-0">Ask</button>
              </div>
              <div className="space-y-4 pt-4">
                {[...askedQuestions, ...qa].map((item, i) => (
                  <div key={i} className="pb-4 border-b border-dashed border-gray-400/20 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2">
                      <HelpCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold">{item.q}</p>
                        <span className={`text-[10px] ${t.muted}`}>{item.days}</span>
                      </div>
                    </div>
                    {item.a ? (
                      <p className={`text-xs mt-1.5 ml-6 ${t.muted}`}>{item.a}</p>
                    ) : (
                      <p className="text-[10px] mt-1.5 ml-6 text-amber-500 font-medium">Awaiting an answer from our team</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-base font-bold mb-3">Related Products</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {related.map((p) => <ProductCard key={p.id} p={p} t={t} wishlist={wishlist} toggleWishlist={toggleWishlist} openProduct={openProduct} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} toggleCompare={toggleCompare} />)}
          </div>
        </div>
      )}

      {zoomed && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6" onClick={() => setZoomed(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <button onClick={() => setZoomed(false)} className="absolute top-5 right-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"><X size={18} /></button>
          <div className="relative w-full max-w-lg aspect-square rounded-[28px] cursor-zoom-out">
            <ProductImage product={product} className="h-full w-full rounded-[28px]" emojiSize="text-[160px]" eager />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- CART ------------------------------------- */

function CartPage({ t, cart, products, updateQty, removeFromCart, setPage, promo, applyPromo, removePromo }) {
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState(null);
  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((item) => item.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.product.oldPrice - i.product.price) * i.qty, 0);
  const discount = computeDiscount(promo, subtotal);
  const freeShip = promo?.type === "freeship";
  const shipping = freeShip ? 0 : (subtotal - discount > 1000 || subtotal === 0 ? 0 : 99);
  const total = Math.max(0, subtotal - discount) + shipping;

  const handleApply = () => {
    const code = promoInput.trim();
    if (!code) return;
    const ok = applyPromo(code);
    if (ok) {
      setPromoMsg({ ok: true, text: `Applied: ${PROMO_CODES[code.toUpperCase()].label}` });
      setPromoInput("");
    } else {
      setPromoMsg({ ok: false, text: "That code isn't valid or has expired" });
    }
  };

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 flex flex-col items-center text-center gap-3">
        <div className={`grid h-20 w-20 place-items-center rounded-full ${t.glass} border`}><ShoppingCart size={28} className={t.muted} /></div>
        <p className="text-sm font-semibold">Your cart is empty</p>
        <p className={`text-xs ${t.muted} max-w-xs`}>Add products you love and they'll show up here.</p>
        <button onClick={() => setPage("home")} className="mt-2 rounded-full bg-gray-900 px-6 py-2.5 text-xs font-bold text-white">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-xl font-extrabold tracking-tight mb-2">Shopping Cart ({items.length})</h1>
        {items.map((i) => (
          <div key={i.id} className={`flex gap-3 rounded-2xl p-3 ${t.glass} border ${t.shadow}`}>
            <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden">
              <ProductImage product={i.product} className="h-full w-full" emojiSize="text-3xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{i.product.name}</p>
              <p className={`text-[10px] ${t.muted}`}>{i.options?.color && `Colour: ${i.options.color}`} {i.options?.size && `· Size: ${i.options.size}`}</p>
              <div className="flex items-center justify-between mt-2">
                <div className={`flex items-center rounded-lg ${t.glass} border`}>
                  <button onClick={() => updateQty(i.id, Math.max(1, i.qty - 1))} className="p-2.5" aria-label="Decrease quantity"><Minus size={11} /></button>
                  <span className="w-6 text-center text-xs font-semibold">{i.qty}</span>
                  <button onClick={() => updateQty(i.id, i.qty + 1)} className="p-2.5" aria-label="Increase quantity"><Plus size={11} /></button>
                </div>
                <span className="text-sm font-bold text-amber-600">{fmt(i.product.price * i.qty)}</span>
              </div>
            </div>
            <button onClick={() => removeFromCart(i.id)} className={`self-start ${t.muted} hover:text-rose-500`}><X size={15} /></button>
          </div>
        ))}
      </div>

      <div className={`h-fit rounded-3xl p-5 ${t.glass} border ${t.shadow} space-y-3 sticky top-24`}>
        <p className="text-sm font-bold">Order Summary</p>

        {promo ? (
          <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Tag size={13} className="text-amber-600 shrink-0" />
              <span className="text-xs font-semibold text-amber-700 truncate">{promo.code} — {promo.label}</span>
            </div>
            <button onClick={() => { removePromo(); setPromoMsg(null); }} className="shrink-0 text-gray-400 hover:text-rose-500"><X size={13} /></button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="Promo code"
                className={`flex-1 rounded-xl px-3 py-2 text-base sm:text-xs outline-none ${t.input}`}
              />
              <button onClick={handleApply} className="rounded-xl bg-gray-900 px-3.5 text-xs font-semibold text-white">Apply</button>
            </div>
            {promoMsg && <p className={`text-[10px] mt-1.5 ${promoMsg.ok ? "text-amber-600" : "text-rose-500"}`}>{promoMsg.text}</p>}
            <p className={`text-[10px] mt-1 ${t.muted}`}>Try SAVE10, WELCOME50 or FREESHIP</p>
          </div>
        )}

        <div className="space-y-1.5 text-xs pt-2 border-t border-dashed border-gray-400/30">
          <div className="flex justify-between"><span className={t.muted}>Subtotal</span><span className="font-medium">{fmt(subtotal)}</span></div>
          <div className="flex justify-between"><span className={t.muted}>You save</span><span className="font-medium text-amber-500">-{fmt(savings)}</span></div>
          {promo && discount > 0 && <div className="flex justify-between"><span className={t.muted}>Promo ({promo.code})</span><span className="font-medium text-amber-600">-{fmt(discount)}</span></div>}
          <div className="flex justify-between"><span className={t.muted}>Shipping</span><span className="font-medium">{shipping === 0 ? "Free" : fmt(shipping)}</span></div>
        </div>
        <div className="flex justify-between pt-2 border-t border-dashed border-gray-400/30 text-sm font-bold">
          <span>Total</span><span className="text-amber-600">{fmt(total)}</span>
        </div>
        <button onClick={() => setPage("checkout")} className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 hover:bg-gray-800 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- ORDER TRACKING -------------------------------- */

function TrackingPage({ t, order, setPage }) {
  if (!order) {
    return (
      <div className="px-4 py-16 flex flex-col items-center text-center gap-3">
        <div className={`grid h-20 w-20 place-items-center rounded-full ${t.glass} border`}><Package size={28} className={t.muted} /></div>
        <p className="text-sm font-semibold">No recent orders</p>
        <p className={`text-xs ${t.muted} max-w-xs`}>Place an order and its live status will show up here.</p>
        <button onClick={() => setPage("home")} className="mt-2 rounded-full bg-gray-900 px-6 py-2.5 text-xs font-bold text-white">Start Shopping</button>
      </div>
    );
  }

  const isPaxi = order.delivery === "paxi";
  const steps = isPaxi
    ? [
        { label: "Order Placed", icon: Package },
        { label: "Packed", icon: PackageCheck },
        { label: "Shipped to PAXI Point", icon: Truck },
        { label: "Ready for Pickup", icon: MapPin },
      ]
    : [
        { label: "Order Placed", icon: Package },
        { label: "Packed", icon: PackageCheck },
        { label: "Shipped", icon: Truck },
        { label: "Out for Delivery", icon: MapPin },
        { label: "Delivered", icon: CheckCircle2 },
      ];
  const current = 1; // demo state: order has just been packed

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5 max-w-4xl mx-auto">
      <button onClick={() => setPage("home")} className={`flex items-center gap-1 text-xs font-medium ${t.muted} mb-4 hover:text-amber-600`}>
        <ChevronLeft size={14} /> Back home
      </button>

      <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow} mb-5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600">Order {order.id}</p>
            <p className={`text-[11px] ${t.muted}`}>Placed {order.date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <span className="text-sm font-bold text-amber-600">{fmt(order.total)}</span>
        </div>
        {order.pickupCode && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-400/10 border border-amber-400/30 px-3 py-2">
            <Tag size={14} className="text-amber-500" />
            <span className="text-xs font-semibold">Pickup code: {order.pickupCode}</span>
          </div>
        )}
      </div>

      <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow}`}>
        <p className="text-sm font-bold mb-5">Delivery Status</p>
        <div>
          {steps.map((s, i) => {
            const done = i < current;
            const active = i === current;
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${done || active ? "bg-gray-900 text-white" : `${t.glass} border ${t.muted}`}`}>
                    <Icon size={15} />
                  </div>
                  {i < steps.length - 1 && <div className={`w-px flex-1 min-h-[28px] ${done ? "bg-gray-900" : "bg-gray-400/20"}`} />}
                </div>
                <div className="pb-7">
                  <p className={`text-xs font-semibold ${active ? "text-amber-600" : ""}`}>{s.label}</p>
                  <p className={`text-[10px] ${t.muted}`}>{active ? "In progress" : done ? "Completed" : "Pending"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`rounded-3xl p-5 mt-5 ${t.glass} border ${t.shadow}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold">Items</p>
          <span className={`text-[10px] ${t.muted}`}>{order.payment} · {isPaxi ? "PAXI pickup" : "Courier Guy"}</span>
        </div>
        <div className="space-y-2">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between text-xs">
              <span className={t.muted}>{i.product.name} × {i.qty}</span>
              <span className="font-medium">{fmt(i.product.price * i.qty)}</span>
            </div>
          ))}
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-xs mt-2 pt-2 border-t border-dashed border-gray-400/30">
            <span className={t.muted}>Promo discount</span>
            <span className="font-medium text-amber-600">-{fmt(order.discount)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ ACCOUNT DASHBOARD ------------------------------ */

function AccountDashboard({ t, user, lastOrder, wishlist, setPage, onSignOut }) {
  const [tab, setTab] = useState("overview");
  const points = 1240;
  const tier = [...REWARD_TIERS].reverse().find((tr) => points >= tr.min);
  const nextTier = REWARD_TIERS.find((tr) => tr.min > points);
  const progressPct = nextTier ? Math.round((points / nextTier.min) * 100) : 100;
  const [copiedCode, setCopiedCode] = useState(null);
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const [addressForm, setAddressForm] = useState(null); // { mode: 'add'|'edit', id?, label, name, line }

  const openAddAddress = () => setAddressForm({ mode: "add", label: "", name: "", line: "" });
  const openEditAddress = (a) => setAddressForm({ mode: "edit", id: a.id, label: a.label, name: a.name, line: a.line });
  const saveAddress = () => {
    if (!addressForm.label.trim() || !addressForm.line.trim()) return;
    if (addressForm.mode === "add") {
      setAddresses((prev) => [...prev, { id: Date.now(), label: addressForm.label, name: addressForm.name || user.name, line: addressForm.line, type: "home", isDefault: prev.length === 0 }]);
    } else {
      setAddresses((prev) => prev.map((a) => (a.id === addressForm.id ? { ...a, label: addressForm.label, name: addressForm.name, line: addressForm.line } : a)));
    }
    setAddressForm(null);
  };

  const allOrders = lastOrder
    ? [{ id: lastOrder.id, date: lastOrder.date.toISOString().slice(0, 10), status: "Processing", total: lastOrder.total, items: lastOrder.items.length }, ...ORDER_HISTORY]
    : ORDER_HISTORY;

  const copyCode = (code) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "rewards", label: "Rewards", icon: Trophy },
    { id: "coupons", label: "Coupons", icon: Tag },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      <div className={`rounded-3xl p-6 ${t.glass} border ${t.shadow} flex items-center gap-4 mb-5`}>
        <div className="grid h-14 w-14 place-items-center rounded-full bg-amber-500/15"><User size={22} className="text-amber-600" /></div>
        <div>
            <p className="text-sm font-bold">{user.name}</p>
            <p className={`text-[10px] ${t.muted}`}>{user.email}</p>
          <p className={`text-xs ${t.muted}`}>{tier.name} Member · {points.toLocaleString()} points</p>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${tab === id ? "bg-gray-900 text-white" : `${t.glass} border`}`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className={`rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
            <div className="flex items-center gap-2 mb-1"><ClipboardList size={15} className="text-amber-600" /><p className="text-xs font-bold">Orders</p></div>
            <p className="text-xl font-extrabold">{allOrders.length}</p>
            <p className={`text-[10px] ${t.muted}`}>Lifetime orders placed</p>
          </div>
          <div className={`rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
            <div className="flex items-center gap-2 mb-1"><Heart size={15} className="text-rose-500" /><p className="text-xs font-bold">Wishlist</p></div>
            <p className="text-xl font-extrabold">{wishlist.length}</p>
            <p className={`text-[10px] ${t.muted}`}>Items saved for later</p>
          </div>
          <div className={`rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
            <div className="flex items-center gap-2 mb-1"><Trophy size={15} className="text-amber-500" /><p className="text-xs font-bold">Reward Points</p></div>
            <p className="text-xl font-extrabold">{points.toLocaleString()}</p>
            <p className={`text-[10px] ${t.muted}`}>{tier.name} tier</p>
          </div>
          <div className={`rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
            <div className="flex items-center gap-2 mb-1"><MapPin size={15} className="text-amber-600" /><p className="text-xs font-bold">Addresses</p></div>
            <p className="text-xl font-extrabold">{addresses.length}</p>
            <p className={`text-[10px] ${t.muted}`}>Saved delivery locations</p>
          </div>
          {lastOrder && (
            <button onClick={() => setPage("tracking")} className={`sm:col-span-2 flex items-center justify-between rounded-2xl p-4 ${t.glass} border ${t.shadow} text-left`}>
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-500/15"><Truck size={16} className="text-amber-600" /></div>
                <div>
                  <p className="text-xs font-bold">Order {lastOrder.id} is on its way</p>
                  <p className={`text-[10px] ${t.muted}`}>Tap to view live delivery status</p>
                </div>
              </div>
              <ChevronRight size={16} className={t.muted} />
            </button>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-2.5">
          {allOrders.map((o) => (
            <div key={o.id} className={`flex items-center justify-between rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
              <div>
                <p className="text-xs font-bold">{o.id}</p>
                <p className={`text-[10px] ${t.muted}`}>{o.date} · {o.items} item{o.items > 1 ? "s" : ""}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-amber-600">{fmt(o.total)}</p>
                <span className={`text-[10px] font-semibold ${o.status === "Delivered" ? "text-amber-600" : "text-amber-500"}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "addresses" && (
        <div className="space-y-2.5">
          {addresses.map((a) => (
            <div key={a.id} className={`flex items-start gap-3 rounded-2xl p-4 ${t.glass} border ${t.shadow}`}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-500/15">
                {a.type === "home" ? <HomeIcon size={16} className="text-amber-600" /> : <Building2 size={16} className="text-amber-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold">{a.label}</p>
                  {a.isDefault && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-600">Default</span>}
                </div>
                <p className={`text-[10px] ${t.muted} mt-0.5`}>{a.name}</p>
                <p className={`text-[10px] ${t.muted}`}>{a.line}</p>
              </div>
              <button onClick={() => openEditAddress(a)} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${t.hover}`}><Pencil size={14} className={t.muted} /></button>
            </div>
          ))}
          <button onClick={openAddAddress} className={`w-full flex items-center justify-center gap-2 rounded-2xl p-3.5 border-2 border-dashed ${t.border} text-xs font-semibold ${t.muted} hover:border-amber-400 hover:text-amber-600 transition-colors`}>
            <Plus size={14} /> Add New Address
          </button>

          {addressForm && (
            <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center" onClick={() => setAddressForm(null)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <div onClick={(e) => e.stopPropagation()} className={`relative w-full sm:max-w-sm rounded-t-[28px] sm:rounded-[28px] ${t.glassStrong} ${t.shadow} border p-5 sm:p-6 space-y-3`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold">{addressForm.mode === "add" ? "Add New Address" : "Edit Address"}</p>
                  <button onClick={() => setAddressForm(null)} className={`grid h-8 w-8 place-items-center rounded-full ${t.hover}`}><X size={16} /></button>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1.5">Label</p>
                  <input value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} placeholder="e.g. Home, Work" className={`w-full rounded-xl px-3 py-2.5 text-base sm:text-xs outline-none ${t.input}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1.5">Recipient Name</p>
                  <input value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} className={`w-full rounded-xl px-3 py-2.5 text-base sm:text-xs outline-none ${t.input}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1.5">Address</p>
                  <input value={addressForm.line} onChange={(e) => setAddressForm({ ...addressForm, line: e.target.value })} placeholder="Street, suburb, city, postal code" className={`w-full rounded-xl px-3 py-2.5 text-base sm:text-xs outline-none ${t.input}`} />
                </div>
                <button onClick={saveAddress} className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 mt-1">
                  {addressForm.mode === "add" ? "Add Address" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "rewards" && (
        <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-amber-400/15"><Trophy size={20} className="text-amber-500" /></div>
            <div>
              <p className="text-sm font-bold">{tier.name} Member</p>
              <p className={`text-[10px] ${t.muted}`}>{points.toLocaleString()} points balance</p>
            </div>
          </div>
          {nextTier && (
            <div className="mb-5">
              <div className="flex justify-between text-[10px] mb-1.5">
                <span className={t.muted}>{points} / {nextTier.min} to {nextTier.name}</span>
                <span className="font-semibold text-amber-600">{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-400/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: `${Math.min(100, progressPct)}%` }} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 text-center">
            {REWARD_TIERS.map((tr) => (
              <div key={tr.name} className={`rounded-xl p-2.5 border ${tier.name === tr.name ? "border-amber-500 bg-amber-500/10" : t.border}`}>
                <p className="text-xs font-bold">{tr.name}</p>
                <p className={`text-[10px] ${t.muted}`}>{tr.min}+ pts</p>
              </div>
            ))}
          </div>
          <p className={`text-[10px] ${t.muted} mt-4`}>Earn 1 point for every R10 spent. Points can be redeemed for discounts at checkout.</p>
        </div>
      )}

      {tab === "coupons" && (
        <div className="space-y-2.5">
          {Object.entries(PROMO_CODES).map(([code, c]) => (
            <div key={code} className={`flex items-center justify-between rounded-2xl p-4 ${t.glass} border ${t.shadow} border-dashed`}>
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-400/15"><Tag size={16} className="text-amber-500" /></div>
                <div>
                  <p className="text-xs font-bold font-mono">{code}</p>
                  <p className={`text-[10px] ${t.muted}`}>{c.label}</p>
                </div>
              </div>
              <button onClick={() => copyCode(code)} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold ${copiedCode === code ? "bg-gray-900 text-white" : `${t.glass} border`}`}>
                {copiedCode === code ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
              </button>
            </div>
          ))}
          <p className={`text-[10px] ${t.muted} px-1`}>Apply a code at checkout under "Promo code" in your cart.</p>
        </div>
      )}
      <button onClick={onSignOut} className="mt-5 w-full rounded-xl border border-rose-500/30 py-3 text-xs font-bold text-rose-600">Sign out</button>
    </div>
  );
}

/* -------------------------------- COMPARE PAGE ---------------------------------- */

function ComparePage({ t, compareList, toggleCompare, clearCompare, addToCart, setPage, openProduct }) {
  const items = ACTIVE_PRODUCTS.filter((p) => compareList.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 flex flex-col items-center text-center gap-3">
        <div className={`grid h-20 w-20 place-items-center rounded-full ${t.glass} border`}><Scale size={28} className={t.muted} /></div>
        <p className="text-sm font-semibold">Nothing to compare yet</p>
        <p className={`text-xs ${t.muted} max-w-xs`}>Tap the scale icon on any product to add it here — compare up to 4 at once.</p>
        <button onClick={() => setPage("home")} className="mt-2 rounded-full bg-gray-900 px-6 py-2.5 text-xs font-bold text-white">Browse Products</button>
      </div>
    );
  }

  const rows = [
    { label: "Price", render: (p) => <span className="font-bold text-amber-600">{fmt(p.price)}</span> },
    { label: "Was", render: (p) => <span className="text-gray-400 line-through">{fmt(p.oldPrice)}</span> },
    { label: "Rating", render: (p) => <Stars rating={p.rating} size={12} /> },
    { label: "Reviews", render: (p) => `${p.reviews}` },
    { label: "Stock", render: (p) => (p.stock < 15 ? <span className="text-amber-500 font-semibold">Only {p.stock} left</span> : <span className="text-amber-600 font-semibold">In stock</span>) },
    { label: "Colours", render: (p) => (
      <div className="flex gap-1 justify-center">
        {p.colors[0] !== "Natural" ? p.colors.map((c) => <span key={c} className="h-4 w-4 rounded-full border border-white/30" style={{ backgroundColor: c }} />) : <span className={t.muted}>—</span>}
      </div>
    ) },
    { label: "Sizes", render: (p) => <span className="text-[10px]">{p.sizes.join(", ")}</span> },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-extrabold tracking-tight">Compare Products</h1>
        <button onClick={clearCompare} className={`text-xs font-semibold ${t.muted} hover:text-rose-500`}>Clear all</button>
      </div>
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="grid gap-3 min-w-[600px]" style={{ gridTemplateColumns: `140px repeat(${items.length}, 1fr)` }}>
          <div />
          {items.map((p) => (
            <div key={p.id} className={`relative rounded-2xl p-3 ${t.glass} border ${t.shadow}`}>
              <button onClick={() => toggleCompare(p.id)} aria-label="Remove from compare" className="absolute top-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-black/20"><X size={12} className="text-white" /></button>
              <div onClick={() => openProduct(p)} className="h-20 rounded-xl overflow-hidden cursor-pointer mb-2">
                <ProductImage product={p} className="h-full w-full" emojiSize="text-3xl" />
              </div>
              <p className="text-[11px] font-semibold leading-snug line-clamp-2 h-8">{p.name}</p>
              <button onClick={() => addToCart(p, 1)} className="w-full mt-2 rounded-lg bg-gray-900 py-1.5 text-[10px] font-bold text-white">Add to Cart</button>
            </div>
          ))}

          {rows.map((row) => (
            <React.Fragment key={row.label}>
              <div className={`flex items-center text-xs font-semibold ${t.muted}`}>{row.label}</div>
              {items.map((p) => (
                <div key={p.id + row.label} className={`flex items-center justify-center text-xs rounded-xl p-2.5 ${t.glass} border`}>
                  {row.render(p)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- CHECKOUT ------------------------------------ */

function PayPalCheckout({ t, total, onPaid, onError }) {
  const containerRef = React.useRef(null);
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  React.useEffect(() => {
    if (!clientId || !containerRef.current) return;
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=ZAR&intent=capture&components=buttons`;
    script.async = true;
    script.onload = () => {
      if (!window.paypal || !containerRef.current) return;
      window.paypal.Buttons({
        style: { layout: "vertical", shape: "rect", label: "paypal" },
        createOrder: () => createPaypalOrder(total),
        onApprove: async (data) => {
          try {
            await capturePaypalOrder(data.orderID);
            onPaid(data.orderID);
          } catch (error) { onError(error.message); }
        },
        onError,
      }).render(containerRef.current);
    };
    script.onerror = () => onError("PayPal could not load. Check your connection and PayPal client ID.");
    document.body.appendChild(script);
    return () => script.remove();
  }, [clientId, total, onPaid, onError]);

  if (!clientId) return <p className="rounded-xl bg-amber-500/10 px-3 py-2.5 text-xs text-amber-700">Add VITE_PAYPAL_CLIENT_ID to the frontend environment to enable PayPal checkout.</p>;
  return <div ref={containerRef} className={`rounded-xl p-3 ${t.glass} border`} />;
}

function CheckoutPage({ t, cart, products, setPage, promo, placeOrder, user }) {
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState("courier");
  const [pickup, setPickup] = useState(null);
  const [payment, setPayment] = useState("paypal");
  const [paymentError, setPaymentError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((item) => item.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = computeDiscount(promo, subtotal);
  const freeShip = promo?.type === "freeship";
  const shipCost = freeShip ? 0 : (delivery === "paxi" ? 59 : (subtotal - discount > 1000 ? 0 : 99));
  const total = Math.max(0, subtotal - discount) + shipCost;

  const steps = ["Delivery", "Payment", "Review"];

  const handlePlaceOrder = async (paypalOrderId) => {
    const order = await placeOrder({ delivery, pickup, payment, subtotal, discount, shipCost, total, paypalOrderId, user });
    setPlacedOrder(order);
    setStep(4);
  };

  if (step === 4 && placedOrder) {
    return (
      <div className="px-4 py-16 flex flex-col items-center text-center gap-3">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-amber-500/15">
          <Check size={32} className="text-amber-600" />
        </div>
        <h1 className="text-xl font-extrabold">Order Placed!</h1>
        <p className={`text-xs ${t.muted} max-w-xs`}>
          Your order #{placedOrder.id} is confirmed. {placedOrder.delivery === "paxi" ? "You'll get an SMS with your pickup code once it arrives." : "Track its progress any time."}
        </p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setPage("tracking")} className="rounded-full bg-gray-900 px-5 py-2.5 text-xs font-bold text-white">Track Order</button>
          <button onClick={() => setPage("home")} className={`rounded-full px-5 py-2.5 text-xs font-bold border ${t.glass}`}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-5 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${step > i ? "bg-gray-900 text-white" : step === i + 1 ? "bg-gray-900 text-white" : `${t.glass} border ${t.muted}`}`}>
                  {step > i + 1 ? <Check size={13} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${step === i + 1 ? "" : t.muted}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${step > i + 1 ? "bg-gray-900" : "bg-gray-400/20"}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow} space-y-4`}>
            <p className="text-sm font-bold">Choose delivery method</p>
            <button onClick={() => setDelivery("courier")} className={`w-full flex items-center gap-3 rounded-2xl p-4 border text-left ${delivery === "courier" ? "border-amber-500 bg-amber-500/10" : t.border}`}>
              <Truck size={20} className="text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold">Courier Guy — Home Delivery</p>
                <p className={`text-[10px] ${t.muted}`}>2–5 business days · Live tracking</p>
              </div>
              <span className="text-xs font-bold">{freeShip ? "Free" : subtotal - discount > 1000 ? "Free" : "R99"}</span>
            </button>
            <button onClick={() => setDelivery("paxi")} className={`w-full flex items-center gap-3 rounded-2xl p-4 border text-left ${delivery === "paxi" ? "border-amber-500 bg-amber-500/10" : t.border}`}>
              <MapPin size={20} className="text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold">PAXI — Pickup Point</p>
                <p className={`text-[10px] ${t.muted}`}>2–5 business days · SMS pickup code</p>
              </div>
              <span className="text-xs font-bold">{freeShip ? "Free" : "R59"}</span>
            </button>

            {delivery === "paxi" && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold">Select a pickup point</p>
                {PICKUP_POINTS.map((p) => (
                  <button key={p.name} onClick={() => setPickup(p.name)} className={`w-full flex items-center justify-between rounded-xl p-3 border text-left ${pickup === p.name ? "border-amber-500 bg-amber-500/10" : t.border}`}>
                    <div>
                      <p className="text-xs font-medium">{p.name}</p>
                      <p className={`text-[10px] ${t.muted}`}>{p.suburb} · ETA {p.eta}</p>
                    </div>
                    {pickup === p.name && <Check size={14} className="text-amber-600" />}
                  </button>
                ))}
              </div>
            )}

            <button
              disabled={delivery === "paxi" && !pickup}
              onClick={() => setStep(2)}
              className="w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white disabled:opacity-40 shadow-lg shadow-black/20"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow} space-y-3`}>
            <p className="text-sm font-bold mb-1">Choose payment method</p>
            {[
              { id: "paypal", label: "PayPal wallet" },
              { id: "paypal-card", label: "Debit or credit card via PayPal" },
            ].map((m) => (
              <button key={m.id} onClick={() => setPayment(m.id)} className={`w-full flex items-center gap-3 rounded-2xl p-3.5 border text-left ${payment === m.id ? "border-amber-500 bg-amber-500/10" : t.border}`}>
                <CreditCard size={16} className="text-amber-600" />
                <span className="text-xs font-semibold flex-1">{m.label}</span>
                {payment === m.id && <Check size={14} className="text-amber-600" />}
              </button>
            ))}
            <p className={`text-[10px] ${t.muted}`}>PayPal securely handles your payment. Cards are accepted through PayPal without us storing card details.</p>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep(1)} className={`flex-1 rounded-2xl py-3 text-sm font-bold ${t.glass} border`}>Back</button>
              <button onClick={() => setStep(3)} className="flex-1 rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white shadow-lg shadow-black/20">Review Order</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={`rounded-3xl p-5 ${t.glass} border ${t.shadow} space-y-4`}>
            <p className="text-sm font-bold">Review your order</p>
            <div className="space-y-2">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-xs">
                  <span className={t.muted}>{i.product.name} × {i.qty}</span>
                  <span className="font-medium">{fmt(i.product.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className={`rounded-xl p-3 text-xs ${t.glass} border flex items-center gap-2`}>
              {delivery === "paxi" ? <MapPin size={14} className="text-amber-600" /> : <Truck size={14} className="text-amber-600" />}
              {delivery === "paxi" ? `Pickup at ${pickup || "selected point"}` : "Home delivery via Courier Guy"}
            </div>
            <div className={`rounded-xl p-3 text-xs ${t.glass} border flex items-center gap-2`}>
              <CreditCard size={14} className="text-amber-600" /> Paying via {payment}
            </div>
            {promo && (
              <div className="rounded-xl p-3 text-xs bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                <Tag size={14} className="text-amber-600" /> Promo {promo.code} applied — {promo.label}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep(2)} className={`flex-1 rounded-2xl py-3 text-sm font-bold ${t.glass} border`}>Back</button>
              <div className="flex-1"><PayPalCheckout t={t} total={total} onPaid={handlePlaceOrder} onError={setPaymentError} /></div>
            </div>
            {paymentError && <p role="alert" className="text-xs text-rose-600">{paymentError}</p>}
          </div>
        )}
      </div>

      <div className={`h-fit rounded-3xl p-5 ${t.glass} border ${t.shadow} space-y-2 sticky top-24`}>
        <p className="text-sm font-bold mb-1">Order Total</p>
        <div className="flex justify-between text-xs"><span className={t.muted}>Subtotal</span><span>{fmt(subtotal)}</span></div>
        {promo && discount > 0 && <div className="flex justify-between text-xs"><span className={t.muted}>Promo ({promo.code})</span><span className="text-amber-600">-{fmt(discount)}</span></div>}
        <div className="flex justify-between text-xs"><span className={t.muted}>Shipping</span><span>{shipCost === 0 ? "Free" : fmt(shipCost)}</span></div>
        <div className="flex justify-between text-sm font-bold pt-2 border-t border-dashed border-gray-400/30"><span>Total</span><span className="text-amber-600">{fmt(total)}</span></div>
      </div>
    </div>
  );
}

/* ----------------------------------- APP -------------------------------------- */

function useSimpleRouter() {
  const getPath = () => (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  const [path, setPath] = useState(getPath);
  React.useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = (to) => {
    if (to === getPath()) return;
    window.history.pushState({}, "", to);
    setPath(to);
  };
  return { path, navigate };
}

const PAGE_TO_PATH = { home: "/", cart: "/cart", checkout: "/checkout", compare: "/compare", wishlist: "/wishlist", profile: "/account", tracking: "/track" };

function pageStateToPath(page, arg, extra) {
  if (page === "category") {
    let p = arg ? `/category/${encodeURIComponent(arg)}` : "/category";
    if (extra) p += `?badge=${encodeURIComponent(extra)}`;
    return p;
  }
  if (page === "info") return `/info/${arg || "about"}`;
  if (page === "product" && arg) return `/product/${arg}`;
  return PAGE_TO_PATH[page] || "/";
}

function parsePathToPageState(path) {
  const [pathname, search] = path.split("?");
  const parts = pathname.split("/").filter(Boolean);
  const params = new URLSearchParams(search ? `?${search}` : "");
  if (parts[0] === "product" && parts[1]) {
    const product = ACTIVE_PRODUCTS.find((p) => String(p.id) === parts[1]);
    return product
      ? { page: "product", product, category: product.category, badge: null, info: null }
      : { page: "not-found", category: null, badge: null, info: null, product: null };
  }
  if (parts[0] === "category") return { page: "category", category: parts[1] || null, badge: params.get("badge") || null, info: null, product: null };
  if (parts[0] === "info") return { page: "info", info: parts[1] || "about", category: null, badge: null, product: null };
  if (["login", "signup"].includes(parts[0])) return { page: "auth", authMode: parts[0], category: null, badge: null, info: null, product: null };
  if (parts[0] === "account") return { page: "profile", category: null, badge: null, info: null, product: null };
  if (parts[0] === "track") return { page: "tracking", category: null, badge: null, info: null, product: null };
  if (["cart", "checkout", "compare", "wishlist"].includes(parts[0])) return { page: parts[0], category: null, badge: null, info: null, product: null };
  return { page: "home", category: null, badge: null, info: null, product: null };
}

export default function ExtensiveAssortment() {
  const [theme, setTheme] = useState("light");
  const [, refreshCatalog] = useState(0);
  const { path, navigate: routerNavigate } = useSimpleRouter();
  const pageState = useMemo(() => parsePathToPageState(path), [path]);
  const [search, setSearchRaw] = useState("");
  const setSearch = (value) => {
    setSearchRaw(value);
    if (value.trim()) routerNavigate("/");
  };
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ea_cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ea_wishlist") || "[]"); } catch { return []; }
  });
  React.useEffect(() => {
    try { localStorage.setItem("ea_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);
  React.useEffect(() => {
    try { localStorage.setItem("ea_wishlist", JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [promo, setPromo] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [compareList, setCompareList] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ids = params.get("ids");
      if (window.location.pathname === "/compare" && ids) {
        return ids.split(",").map(Number).filter((id) => PRODUCTS.some((p) => p.id === id)).slice(0, 4);
      }
    } catch {}
    return [];
  });
  const [toasts, setToasts] = useState([]);
  const pushToast = (message, icon = "check") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, message, icon }]);
    setTimeout(() => setToasts((prev) => prev.filter((tt) => tt.id !== id)), 2600);
  };
  const t = useTokens(theme);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [cookieChoice, setCookieChoice] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  React.useEffect(() => {
    getCurrentUser().then(setUser).finally(() => setAuthChecked(true));
  }, []);

  React.useEffect(() => {
    getProducts().then((catalog) => {
      if (catalog.length) {
        ACTIVE_PRODUCTS = catalog;
        refreshCatalog((version) => version + 1);
      }
    }).catch(() => {});
  }, []);

  const onAuthenticated = (authenticatedUser) => {
    setUser(authenticatedUser);
    routerNavigate("/account");
  };

  const setPage = (page, arg, extra) => {
    if (page === "profile" && !user) {
      routerNavigate("/login");
      return;
    }
    routerNavigate(pageStateToPath(page, arg, extra));
    window?.scrollTo?.({ top: 0, behavior: "smooth" });
  };
  const openProduct = (product) => {
    routerNavigate(pageStateToPath("product", product.id));
    setRecentlyViewed((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 8));
    window?.scrollTo?.({ top: 0, behavior: "smooth" });
  };
  const setSelectedCategory = (cat) => routerNavigate(pageStateToPath("category", cat, null));

  React.useEffect(() => {
    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        const isProperty = name.startsWith("og:");
        tag.setAttribute(isProperty ? "property" : "name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    const brand = "Extensive Assortment";
    let title = brand;
    let desc = "South Africa's next-generation online marketplace for fashion, tech, beauty and home. Fast Courier Guy & PAXI delivery, secure PayFast/Ozow/Yoco checkout.";
    if (pageState.page === "not-found") {
      title = `Product Not Found | ${brand}`;
    } else if (pageState.page === "product" && pageState.product) {
      title = `${pageState.product.name} | ${brand}`;
      desc = `${pageState.product.name} — ${fmt(pageState.product.price)}. ${pageState.product.description || "Shop now with fast nationwide delivery."}`.slice(0, 160);
    } else if (pageState.page === "category") {
      const label = pageState.badge || (pageState.category ? pageState.category.charAt(0).toUpperCase() + pageState.category.slice(1) : "Shop");
      title = `${label} | ${brand}`;
      desc = `Browse ${label} at ${brand} — quality products, ZAR pricing, nationwide delivery across South Africa.`;
    } else if (pageState.page === "cart") {
      title = `Your Cart | ${brand}`;
    } else if (pageState.page === "checkout") {
      title = `Checkout | ${brand}`;
    } else if (pageState.page === "profile") {
      title = `My Account | ${brand}`;
    } else if (pageState.page === "wishlist") {
      title = `Wishlist | ${brand}`;
    } else if (pageState.page === "compare") {
      title = `Compare Products | ${brand}`;
    } else if (pageState.page === "tracking") {
      title = `Track Your Order | ${brand}`;
    } else if (pageState.page === "info") {
      const infoTitle = pageState.info === "faqs" ? "FAQs" : (INFO_CONTENT[pageState.info]?.title || "");
      title = infoTitle ? `${infoTitle} | ${brand}` : brand;
    }
    document.title = title;
    setMeta("description", desc);
    setMeta("og:title", title);
    setMeta("og:description", desc);
    setMeta("og:type", pageState.page === "product" ? "product" : "website");
    setMeta("og:image", pageState.page === "product" && pageState.product ? pageState.product.image : "/hero.jpg");
    setMeta("twitter:image", pageState.page === "product" && pageState.product ? pageState.product.image : "/hero.jpg");
  }, [path]);

  const addToCart = (product, qty = 1, options = {}) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) return prev.map((c) => (c.id === product.id ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { id: product.id, qty, options }];
    });
    pushToast(`${product.name} added to cart`, "cart");
  };
  const updateQty = (id, qty) => setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));
  const toggleWishlist = (id) => {
    const product = ACTIVE_PRODUCTS.find((p) => p.id === id);
    setWishlist((prev) => {
      const isIn = prev.includes(id);
      pushToast(isIn ? `Removed from wishlist` : `${product?.name || "Item"} added to wishlist`, "heart");
      return isIn ? prev.filter((w) => w !== id) : [...prev, id];
    });
  };

  const applyPromo = (codeRaw) => {
    const code = codeRaw.toUpperCase();
    const found = PROMO_CODES[code];
    if (!found) return false;
    setPromo({ code, ...found });
    pushToast(`Promo "${code}" applied`, "tag");
    return true;
  };
  const removePromo = () => setPromo(null);

  const placeOrder = async (details) => {
    const items = cart.map((c) => ({ ...c, product: ACTIVE_PRODUCTS.find((p) => p.id === c.id) }));
    const order = {
      id: `EA-${Math.floor(10000 + Math.random() * 89999)}`,
      date: new Date(),
      items,
      subtotal: details.subtotal,
      discount: details.discount,
      shipping: details.shipCost,
      total: details.total,
      delivery: details.delivery,
      pickup: details.pickup,
      payment: details.payment,
      pickupCode: details.delivery === "paxi" ? `PX-${Math.floor(10000 + Math.random() * 89999)}` : null,
    };
    await createOrder({
      id: order.id, customer: details.user?.name || "Guest customer", date: order.date.toISOString(),
      items: order.items.reduce((count, item) => count + item.qty, 0), total: order.total,
      status: "Pending", delivery: details.delivery === "paxi" ? "PAXI" : "Courier Guy", payment: "PayPal",
    });
    setLastOrder(order);
    setCart([]);
    setPromo(null);
    return order;
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const toggleCompare = (id) => setCompareList((prev) => {
    if (prev.includes(id)) return prev.filter((c) => c !== id);
    if (prev.length >= 4) {
      pushToast("You can compare up to 4 items", "info");
      return prev;
    }
    return [...prev, id];
  });
  const clearCompare = () => setCompareList([]);
  const signOut = () => {
    clearToken();
    setUser(null);
    routerNavigate("/");
    pushToast("You have been signed out", "check");
  };

  React.useEffect(() => {
    if (pageState.page !== "compare") return;
    const qs = compareList.length ? `?ids=${compareList.join(",")}` : "";
    const target = `/compare${qs}`;
    if (target !== window.location.pathname + window.location.search) {
      window.history.replaceState({}, "", target);
    }
  }, [compareList, pageState.page]);
  const cardProps = { wishlist, toggleWishlist, openProduct, addToCart, openQuickView: setQuickViewProduct, compareList, toggleCompare };

  const filteredHome = search
    ? ACTIVE_PRODUCTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className={`min-h-screen ${t.page} font-sans transition-colors duration-300`} style={{ colorScheme: theme }}>
      <style>{`
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, [tabindex]:focus-visible {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
          border-radius: 6px;
        }
        button:not(:disabled):active, a:active { transform: scale(0.97); }
        ::selection { background: #d4af37; color: #111827; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme === "dark" ? "#3f3f46" : "#d1d5db"}; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: #d4af37; }
      `}</style>
      <Header
        t={t} theme={theme} setTheme={setTheme}
        cartCount={cartCount} wishlistCount={wishlist.length}
        setPage={setPage} search={search} setSearch={setSearch} openProduct={openProduct}
      />

      <main className="pb-16 md:pb-0">
        {pageState.page === "home" && (
          filteredHome ? (
            <div className="px-4 sm:px-6 lg:px-10 py-6">
              <h1 className="text-lg font-bold mb-4">Results for "{search}"</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredHome.map((p) => <ProductCard key={p.id} p={p} t={t} {...cardProps} />)}
              </div>
              {filteredHome.length === 0 && <p className={`text-sm ${t.muted}`}>No products found. Try another search.</p>}
            </div>
          ) : (
            <>
              <Hero t={t} setPage={setPage} />
              <Reveal><FlashSaleBanner t={t} setPage={setPage} /></Reveal>
              <Reveal><CategoryGrid t={t} setPage={setPage} /></Reveal>
              <Reveal><Rail title="Flash Sale" icon={<Zap size={16} className="text-amber-400 fill-amber-400" />} products={ACTIVE_PRODUCTS.filter((p) => p.badge === "Flash Sale")} t={t} setPage={setPage} seeAllBadge="Flash Sale" {...cardProps} /></Reveal>
              <Reveal><Rail title="Best Sellers" icon={<Star size={16} className="text-amber-400 fill-amber-400" />} products={ACTIVE_PRODUCTS.filter((p) => p.badge === "Best Seller")} t={t} setPage={setPage} seeAllBadge="Best Seller" {...cardProps} /></Reveal>
              <Reveal><Rail title="Trending Now" icon={<Sparkles size={16} className="text-amber-600" />} products={ACTIVE_PRODUCTS.filter((p) => p.badge === "Trending")} t={t} setPage={setPage} seeAllBadge="Trending" {...cardProps} /></Reveal>
              <Reveal><TrustStrip t={t} /></Reveal>
              <Reveal><Testimonials t={t} /></Reveal>
              <Reveal><Rail title="New Arrivals" icon={<Clock size={16} className="text-amber-600" />} products={ACTIVE_PRODUCTS.filter((p) => p.badge === "New")} t={t} setPage={setPage} seeAllBadge="New" {...cardProps} /></Reveal>
              {recentlyViewed.length > 0 && (
                <Reveal>
                  <Rail
                    title="Recently Viewed"
                    icon={<Eye size={16} className="text-amber-600" />}
                    products={recentlyViewed.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)}
                    t={t} setPage={setPage} {...cardProps}
                  />
                </Reveal>
              )}
            </>
          )
        )}

        {pageState.page === "category" && (
          <CategoryPage t={t} selectedCategory={pageState.category} setSelectedCategory={setSelectedCategory} badge={pageState.badge} {...cardProps} />
        )}

        {pageState.page === "wishlist" && (
          <div className="px-4 sm:px-6 lg:px-10 py-6">
            <h1 className="text-lg font-bold mb-4">Your Wishlist ({wishlist.length})</h1>
            {wishlist.length === 0 ? (
              <p className={`text-sm ${t.muted}`}>Nothing here yet — tap the heart on any product to save it.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {ACTIVE_PRODUCTS.filter((p) => wishlist.includes(p.id)).map((p) => <ProductCard key={p.id} p={p} t={t} {...cardProps} />)}
              </div>
            )}
          </div>
        )}

        {pageState.page === "product" && pageState.product && (
          <ProductPage key={pageState.product.id} t={t} product={pageState.product} setPage={setPage} {...cardProps} />
        )}

        {pageState.page === "cart" && (
          <CartPage t={t} cart={cart} products={ACTIVE_PRODUCTS} updateQty={updateQty} removeFromCart={removeFromCart} setPage={setPage} promo={promo} applyPromo={applyPromo} removePromo={removePromo} />
        )}

        {pageState.page === "checkout" && (
          <CheckoutPage t={t} cart={cart} products={ACTIVE_PRODUCTS} setPage={setPage} promo={promo} placeOrder={placeOrder} user={user} />
        )}

        {pageState.page === "tracking" && (
          <TrackingPage t={t} order={lastOrder} setPage={setPage} />
        )}

        {pageState.page === "info" && (
          <InfoPage t={t} topic={pageState.info} setPage={setPage} />
        )}

        {pageState.page === "compare" && (
          <ComparePage t={t} compareList={compareList} toggleCompare={toggleCompare} clearCompare={clearCompare} addToCart={addToCart} setPage={setPage} openProduct={openProduct} />
        )}

        {pageState.page === "not-found" && (
          <NotFoundPage t={t} setPage={setPage} />
        )}

        {pageState.page === "profile" && (
          authChecked && user ? (
            <AccountDashboard t={t} user={user} lastOrder={lastOrder} wishlist={wishlist} setPage={setPage} onSignOut={signOut} />
          ) : authChecked ? (
            <AuthPage t={t} mode="login" onAuthenticated={onAuthenticated} setPage={setPage} />
          ) : (
            <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">Checking your account...</div>
          )
        )}

        {pageState.page === "auth" && (
          <AuthPage t={t} mode={pageState.authMode} onAuthenticated={onAuthenticated} setPage={setPage} />
        )}

        {!["product", "checkout", "cart", "tracking"].includes(pageState.page) && <Footer t={t} setPage={setPage} />}
      </main>

      <BottomNav t={t} page={pageState.page} setPage={setPage} cartCount={cartCount} wishlistCount={wishlist.length} />

      <WhatsAppButton t={t} />
      <ToastStack toasts={toasts} />
      <CookieConsent
        t={t}
        visible={cookieChoice === null}
        onAccept={() => { setCookieChoice("all"); pushToast("Cookie preferences saved", "check"); }}
        onDecline={() => { setCookieChoice("essential"); pushToast("Essentials-only mode saved", "check"); }}
      />

      {compareList.length > 0 && pageState.page !== "compare" && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-6 z-50 w-[calc(100%-2rem)] max-w-md">
          <div className={`flex items-center gap-3 rounded-2xl p-3 ${t.glassStrong} ${t.shadow} border`}>
            <div className="flex -space-x-2 shrink-0">
              {ACTIVE_PRODUCTS.filter((p) => compareList.includes(p.id)).slice(0, 4).map((p) => (
                <div key={p.id} className={`h-9 w-9 rounded-full overflow-hidden border-2 ${t.dark ? "border-gray-950" : "border-white"}`}>
                  <ProductImage product={p} className="h-full w-full" emojiSize="text-base" />
                </div>
              ))}
            </div>
            <p className="flex-1 text-xs font-semibold">{compareList.length} item{compareList.length > 1 ? "s" : ""} to compare</p>
            <button onClick={clearCompare} className={`text-xs ${t.muted} hover:text-rose-500`}><X size={16} /></button>
            <button onClick={() => setPage("compare")} className="rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-md shadow-black/20 shrink-0">Compare</button>
          </div>
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal
          t={t}
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          openProduct={openProduct}
        />
      )}
    </div>
  );
}

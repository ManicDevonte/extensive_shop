# Extensive Assortment

A South African eCommerce prototype — a customer-facing storefront and an internal admin console, built as a single Vite + React app with two routes.

- `/` — Storefront (home, categories, product detail, cart, checkout, account, tracking, comparison)
- `/admin` — Admin console (products, orders, customers, coupons, flash sales, banners, shipping, reviews, notifications, team)

## ⚠️ Important: this is a front-end prototype

Both apps run entirely in the browser on **in-memory mock data** — there is no backend, no database, and no real authentication or payment processing. Every order, product edit, or coupon you create will reset the moment you refresh the page. See `SPEC.md`-style notes in the project (or the separate technical specification document, if you have it) for what a production backend would need to cover.

## Getting started locally

Requires [Node.js](https://nodejs.org) 18 or later.

```bash
npm install
npm run dev
```

This starts a dev server (usually at `http://localhost:5173`) with hot reload. Visit `/admin` for the admin console.

## Project structure

```
├── index.html            # HTML entry point
├── src/
│   ├── main.jsx           # App entry point + routing (/ and /admin)
│   ├── index.css          # Tailwind entry stylesheet
│   ├── StorefrontApp.jsx  # Customer-facing storefront (single file, all components)
│   └── AdminApp.jsx       # Admin console (single file, all components)
├── public/
│   └── hero.jpg           # Hero banner image
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── vercel.json            # SPA rewrite rule so /admin works on refresh
```

Both `StorefrontApp.jsx` and `AdminApp.jsx` are intentionally single large files (each holds all of that app's components). If you plan to keep building this out, splitting them into a proper `components/` folder is a natural next step — nothing about the structure requires them to stay this way.

## Editing in VS Code

1. Open the project folder in VS Code.
2. Recommended extensions: **ES7+ React/Redux/React-Native snippets**, **Tailwind CSS IntelliSense**, **Prettier**.
3. Run `npm run dev` in the integrated terminal and edit `src/StorefrontApp.jsx` / `src/AdminApp.jsx` directly — changes hot-reload in the browser.

## Pushing to GitHub

From inside the project folder:

```bash
git init
git add .
git commit -m "Initial commit: Extensive Assortment storefront + admin"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo on GitHub first if you haven't — `github.com/new`.)

## Deploying on Vercel

**Option A — via the Vercel dashboard (easiest)**
1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo.
2. Vercel auto-detects Vite. Leave the defaults:
   - Build command: `vite build`
   - Output directory: `dist`
3. Click **Deploy**. Every future push to `main` will auto-deploy.

**Option B — via the CLI**
```bash
npm i -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # subsequent production deploys
```

The included `vercel.json` makes sure refreshing `/admin` (or any deep link) doesn't 404 — Vercel needs that rewrite rule for any client-side-routed single-page app.

## Known limitations to resolve before real production use

- **No backend** — replace the in-memory `useState` data with real API calls (see the data model / API reference in the project's technical specification, if provided).
- **No authentication** — the account dashboard and admin console are both open, unauthenticated.
- **No live payments** — checkout's payment method selection is UI-only; wire up PayFast/Ozow/Yoco/Payflex webhooks server-side.
- **Product photography** uses a mix of a bundled hero image and placeholder stock photos (`picsum.photos`) — swap in real product photos before launch.
- **Admin uploads** (product photos) are stored as base64 in browser memory only — they won't persist or sync to the storefront without a real backend + object storage.

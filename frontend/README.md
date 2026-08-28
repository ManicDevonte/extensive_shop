# Extensive Assortment

A South African eCommerce storefront and internal admin console, backed by an Express API and Prisma database.

- `/` — Storefront (home, categories, product detail, cart, checkout, account, tracking, comparison)
- `/admin` — Admin console (products, orders, customers, coupons, flash sales, banners, shipping, reviews, notifications, team)

The frontend is deployed as a Vite static build and uses the backend API for authentication, products, orders, shop content, and PayPal checkout.

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

The root `vercel.json` builds the frontend, deploys `backend/server.js` as a Node function, routes `/api/*` to the API, and preserves client-side routes such as `/admin`.

Set these Vercel environment variables before deploying:

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL` (your production site URL)
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and optionally `PAYPAL_BUSINESS_EMAIL`

## Production checks

- Run `npm run prisma:validate` from `backend`.
- Confirm the deployed `/api/health` endpoint returns `{ "ok": true }`.
- Test signup, login, product loading, an admin-authenticated action, and PayPal credentials in the production environment.

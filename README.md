# LLC Publication Online — Production-Grade MERN

Pixel-faithful rebuild of `llcpublicationonline.com` (Home, Resources, Article) + production API + Admin panel.

## Structure
```
llc-publication-online/
  backend/   Express + Mongoose API (orders, county pricing, articles, admin stats)
  frontend/  React + Vite (Home /, Resources /resources, Article /resources/:slug, Admin /admin)
  docker-compose.yml
```

## 1:1 pages
- `frontend/src/pages/HomePage.jsx` — hero, §206 strip, why/how/compare, live pricing grid, testimonials, **Place your publication order** form → `POST /api/orders`, FAQ, footer.
- `frontend/src/pages/ResourcesPage.jsx` — 9 article cards (live from API, fallback seed).
- `frontend/src/pages/ArticlePage.jsx` — full article renderer (How Much Does LLC Publication Cost… seeded).

Design tokens match original: navy `#0B1F3A`, gold `#C9A35B`, paper `#FAF7F1`.

## Quick start (Windows PowerShell)
```powershell
# Backend
cd llc-publication-online\backend
npm.cmd install
npm.cmd run seed   # seeds 62 counties + 9 articles into Atlas
npm.cmd run dev    # :5000

# Optional: sample orders so the admin dashboard has data to show
npm.cmd run seed:orders          # insert/refresh 24 demo orders (idempotent)
npm.cmd run seed:orders:clear    # delete the demo orders again

# Frontend (second terminal)
cd llc-publication-online\frontend
npm.cmd install
npm.cmd run dev    # :5173 (proxies /api → :5000)
```
Open http://localhost:5173 · Admin: http://localhost:5173/admin

## API
| Method | Route | Access |
|---|---|---|
| GET | /api/health | public |
| GET | /api/prices | public (pricing grid + order dropdown) |
| GET | /api/prices/all | admin |
| PUT | /api/prices/:county | admin (price update) |
| POST | /api/prices/bulk | admin (bulk price update) |
| POST | /api/orders | public (order form; price resolved server-side) |
| GET | /api/orders?page&limit&status&q | admin (submissions) |
| PATCH / DELETE | /api/orders/:id | admin |
| GET | /api/articles, /api/articles/:slug | public |
| POST / PUT / DELETE | /api/articles… | admin (publish management) |
| GET | /api/policies, /api/faqs | public |
| POST / PUT / DELETE | /api/policies…, /api/faqs… | admin |
| GET | /api/comparison | public (home page comparison table) |
| PUT /api/comparison, POST /api/comparison/reset | admin |
| GET | /api/admin/stats | admin (dashboard) |

## Admin panel (no auth — per request)
`/admin` tabs: **orders** (search, status/payment workflow, delete), **pricing** (edit all 62 counties inline, bulk save), **articles** (create/edit/publish/delete), **statements**, **comparison** (edit the home page comparison table with live preview), **faqs**. Table rows use a triple-dot actions menu.

Demo data: `npm.cmd run seed:orders` inserts 24 sample orders (all `@example.com`, safe to remove with `seed:orders:clear`). It is kept out of `seed.js` so the production seed never creates fake orders, and it refuses to run when `NODE_ENV=production` unless `ALLOW_DEMO_SEED=1`.

> Before public launch: put `/api/orders GET,PATCH,DELETE`, `/api/prices/*` (write), `/api/articles` (write), `/api/policies` + `/api/faqs` (write), `/api/comparison` (write), `/api/admin/*` behind auth (e.g. JWT + `requireAdmin` middleware stub point in `backend/src/middleware/`). Note the policies/FAQs `PUT` handlers currently `$set` possibly-undefined fields, and `contentHtml` is required.

## Production notes
- `helmet`, `cors` allowlist via `CORS_ORIGIN`, `morgan`, rate-limit on order creation, `zod` validation, central error handler (no stack leak in production).
- `DB_URI` already wired to Atlas (`llc_publication` db). Configure in root `.env`.
- Stripe: current order form records `paymentStatus: pending`; drop in Stripe PaymentIntent (frontend Elements + backend `/api/payments/intent`) before taking live cards — never post raw PAN to your API.

## VPS Deployment with Traefik

The project is pre-configured to deploy behind an existing Traefik reverse proxy using Docker Compose and a centralized root `.env` file.

### 1. Configure the root `.env`
Copy `.env.example` to `.env` (already created at project root) and configure your values:
```bash
cp .env.example .env
```
Key variables to check for your VPS:
- `DOMAIN`: Your production domain (e.g. `llcpublicationonline.com`)
- `TRAEFIK_NETWORK`: The Docker network Traefik is running on (default: `traefik_default`)
- `TRAEFIK_ENTRYPOINT`: The Traefik HTTPS entrypoint name (default: `websecure`)
- `TRAEFIK_CERTRESOLVER`: The Let's Encrypt resolver name defined in your Traefik setup (default: `letsencrypt`)
- `DB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for admin authentication

### 2. Deploy with Docker Compose
On your VPS, run:
```bash
docker compose up -d --build
```
This starts:
- **`web`**: Nginx serving the production React build on port 80 (routed via Traefik HTTPS router `llc-web` with auto Let's Encrypt SSL and HTTP-to-HTTPS redirect).
- **`api`**: Express backend on port 5000 (routed via Traefik router `llc-api` for `/api/*` and also proxied internally by Nginx).

### 3. Seed Admin on VPS (first-time only)
```bash
docker compose exec api node seedAdmin.js
```

### Local Development without Traefik
If you want to run the Docker containers locally on your development machine without Traefik:
```bash
docker compose -f docker-compose.local.yml up --build
```
This maps `web` to `http://localhost:80` and `api` to `http://localhost:5000`.

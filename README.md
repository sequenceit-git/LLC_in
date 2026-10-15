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
| GET | /api/admin/stats | admin (dashboard) |

## Admin panel (no auth — per request)
`/admin` tabs: **orders** (search, status/payment workflow, delete), **pricing** (edit all 62 counties inline, bulk save), **articles** (create/edit/publish/delete).
> Before public launch: put `/api/orders GET,PATCH,DELETE`, `/api/prices/*` (write), `/api/articles` (write), `/api/admin/*` behind auth (e.g. JWT + `requireAdmin` middleware stub point in `backend/src/middleware/`).

## Production notes
- `helmet`, `cors` allowlist via `CORS_ORIGIN`, `morgan`, rate-limit on order creation, `zod` validation, central error handler (no stack leak in production).
- `DB_URI` already wired to Atlas (`llc_publication` db). Override in `backend/.env`.
- Docker: `docker compose up --build` (api :5000, web :80).
- Stripe: current order form records `paymentStatus: pending`; drop in Stripe PaymentIntent (frontend Elements + backend `/api/payments/intent`) before taking live cards — never post raw PAN to your API.

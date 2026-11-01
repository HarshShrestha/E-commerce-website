# Forever — Original UI, Modular Store

A redesigned React storefront, React admin dashboard, and Express/MongoDB API based on [HarshShrestha/E-commerce-website](https://github.com/HarshShrestha/E-commerce-website). The original product and editorial photographs are retained.

---

## ✨ Features

### Storefront
- **Restored original Forever UI** — mobile navigation, consistent white visual theme, minimalist landing-page motion with reduced-motion support
- **Persistent favorites** — save/remove controls with dedicated favorites page
- **Advanced search & filtering** — category/type filters, price/newest sorting with shareable query-string state
- **Product detail pages** — image gallery, size validation, related products
- **Persistent shopping bag** — quantity validation, item removal, unavailable-item handling
- **Authentication** — registration/login with bcrypt-hashed passwords, expiring role-scoped JWTs, separate admin/customer sessions
- **Cash-on-delivery checkout** — validated addresses, server-calculated prices ($10 shipping, waived at $150+ subtotal)
- **Idempotent checkout** — duplicate product/size validation
- **Real order history** — status progress and manual status refresh (not hardcoded samples)

### Admin Dashboard
- **Product management** — search, creation with Cloudinary image uploads, deletion confirmation
- **Order management** — browsing, filtering, status updates
- **Newsletter subscriptions** — storage with validation and duplicate handling

### Technical
- Loading, error, retry, empty, and missing-page states
- In-memory demo mode with 52 sample products
- MongoDB persistence support
- Cloudinary image management with deduplication and checkpointing
- Comprehensive test suite (API, architecture, E2E, motion)

> ⚠️ **This is a tested local implementation, not a deployed or production-certified store.** No checkout charges a card or sends a fulfillment request. Demo orders are never fulfilled.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend (Storefront)** | React 18, Vite, React Router |
| **Admin Dashboard** | React 18, Vite, React Router |
| **Backend API** | Node.js, Express, MongoDB (Mongoose) |
| **Authentication** | JWT, bcrypt |
| **Image Management** | Cloudinary |
| **Testing** | Vitest, Playwright |
| **Styling** | CSS Modules, CSS Custom Properties |

---

## 📋 Requirements

- **Node.js 24+** and npm
- **MongoDB** (local or hosted) — for persistent storage
- **Cloudinary account** — for new product images
- **Playwright's Chromium** — for browser tests (or existing Chromium executable)

---

## 🚀 Quick Start

```bash
# From project root
npm ci
npm run setup
npm run dev
```

This starts three applications:

| Application | URL |
|-------------|-----|
| Storefront | http://localhost:5173 |
| Admin Dashboard | http://localhost:5174 |
| API Health | http://localhost:4000/api/health |

### Default Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `replace-with-a-long-unique-password` |

> **Security Notice:** These are public example values. Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` in `backend/.env` before exposing the API. Generate a secure secret:
> ```bash
> node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
> ```

---

## 🗄️ Enable MongoDB Persistence

Edit `backend/.env`:

```dotenv
DEMO_MODE=false
MONGODB_URI=mongodb://127.0.0.1:27017/forever
JWT_SECRET=YOUR_NEW_RANDOM_SECRET_WITH_AT_LEAST_32_CHARACTERS
ADMIN_EMAIL=YOUR_ADMIN_EMAIL
ADMIN_PASSWORD=YOUR_UNIQUE_ADMIN_PASSWORD
```

Use your full MongoDB connection string **including the database name**. Then:

```bash
npm run seed
npm run dev
```

The seed command inserts missing sample products by stable ID (does not delete existing). Photos served from `backend/public/catalog`; `backend/data/catalog.json` is the checked-in seed source.

> ⚠️ MongoDB integration is implemented but was not tested against a live instance. Run production-mode smoke tests in your environment before launch.

---

## ☁️ Cloudinary Setup

Configure in `backend/.env`:
```dotenv
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

### Initial Upload (bundled assets)
```bash
npm run images:upload -- --dry-run   # Preview (no credentials/network)
npm run images:upload                # Upload & rewrite URLs
```

### Sync Existing Persistent Catalog
```bash
npm run images:upload -- --sync-db   # Updates seeded products, preserves metadata
```
- Requires `DEMO_MODE=false` and `MONGODB_URI`
- Back up database first
- Admin "Add Product" form supports new Cloudinary uploads (up to 4 files, 5MB each, JPG/PNG/WebP)

See **[docs/CLOUDINARY-SETUP.md](docs/CLOUDINARY-SETUP.md)** for full setup, resume, rollback, and account-change procedures.

---

## ✅ Checks & Testing

```bash
# Lint, build, and unit/integration tests
npm run lint
npm run build
npm test
```

`npm test` runs 24 API regressions, 4 architecture checks, and 8 Cloudinary-initializer tests on an isolated in-memory API (port 4010) — does not touch your MongoDB or port 4000.

### End-to-End Tests
```bash
# First, start apps in demo mode
npm run dev

# In another terminal:
npx playwright install chromium
npm run test:e2e
```

With existing Chromium:
```bash
CHROMIUM_PATH=/path/to/chromium npm run test:e2e
```

If you changed admin credentials:
```bash
TEST_ADMIN_EMAIL=your@email.com TEST_ADMIN_PASSWORD=yourpass npm run test:e2e
```

### Motion Tests
```bash
CHROMIUM_PATH=/path/to/chromium npm run test:motion
```
Checks 1440px/390px viewports, section counts, responsive grids, finite reveals, and reduced-motion behavior.

See **[VERIFICATION.md](VERIFICATION.md)** for tested scope and limitations.

---

## 🚢 Production Deployment

Deploy **three separate applications**:

### 1. API (Node.js host)
- Working directory: `backend`
- `npm ci` → `npm start`
- Required env: `NODE_ENV=production`, `DEMO_MODE=false`, `MONGODB_URI`, new admin credentials, new `JWT_SECRET`, Cloudinary values
- Serve via HTTPS
- Include `backend/public/catalog`

### 2. Storefront (Static host)
- Working directory: `frontend`
- `npm ci` → `npm run build` → output `dist`
- Set `VITE_BACKEND_URL=https://YOUR_API_HOST` **before building**

### 3. Admin (Static host)
- Working directory: `admin`
- Same build/output settings and `VITE_BACKEND_URL`

### 4. Configure CORS
Set API `CORS_ORIGINS` to exact comma-separated HTTPS origins (no trailing slashes), then restart API.

### 5. Optional: Seed Catalog
```bash
npm run seed  # In configured environment
```

### Vercel Deployment
- Root `vercel.json` deploys storefront only
- For admin: create separate Vercel project with `admin` as root directory
- Both include SPA rewrites
- API **must be hosted separately** (not deployed by root Vercel config)

---

## ⚠️ Before Accepting Real Orders

- [ ] Configure merchant identity, support contact, delivery regions, return terms, privacy policy, tax handling
- [ ] Implement online payments (Stripe/Razorpay **not** included as working options) — use verified server-side webhooks
- [ ] Add transactional email, carrier tracking, fulfillment integrations
- [ ] Decide on inventory controls (current: size/quantity validation only, no reservation)
- [ ] Add password reset/email verification if needed
- [ ] Implement backups, monitoring, HTTPS, secret rotation, deployment-level rate limiting
- [ ] Confirm rights to all photographs and branding
- [ ] Run persistent-database, Cloudinary, cross-origin, and production deployment tests

---

## 📁 Project Structure

```
├── backend/
│   ├── server.js              # Start/stop executable
│   ├── app.js                 # Express composition
│   ├── config/                # Validated environment config
│   ├── constants/             # Product & order rules
│   ├── controllers/           # HTTP handlers
│   ├── routes/                # Endpoint & middleware wiring
│   ├── services/              # Auth, checkout, catalog, uploads
│   ├── repositories/          # MongoDB & in-memory adapters
│   ├── models/                # Mongoose schemas
│   ├── db/                    # Connection lifecycle
│   ├── middlewares/           # Auth, uploads, errors, security
│   ├── utils/                 # Validation, errors, JWT, async
│   ├── data/                  # Stable sample catalog
│   ├── scripts/               # Seed & catalog-generation
│   └── public/catalog/        # Bundled product photos
├── frontend/src/
│   ├── App.jsx                # Layout composition
│   ├── routes/                # Customer route table
│   ├── layouts/               # Store shell
│   ├── pages/                 # One screen per module
│   ├── components/            # Reusable UI
│   ├── hooks/                 # Cart, session, favorites, etc.
│   ├── context/               # Shared shop provider
│   ├── services/              # HTTP client
│   ├── constants/             # Display rules
│   ├── utils/                 # Money & storage helpers
│   └── styles/                # Tokens, global, layout CSS
├── admin/src/
│   ├── App.jsx                # Admin composition & routes
│   ├── layouts/               # Dashboard shell
│   ├── pages/                 # Login, products, orders
│   ├── components/            # Shared admin controls
│   ├── hooks/                 # Admin session lifecycle
│   ├── services/              # Admin HTTP client
│   ├── constants/             # Order statuses
│   ├── utils/                 # Money formatting
│   └── styles/                # Focused stylesheets
├── scripts/dev.mjs            # Local multi-app runner
└── tests/                     # API, architecture, browser tests
```

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for request flow and debugging/change map.

---

## 🎨 Original UI Restoration & Animation

Restored from the original deployment at https://e-commerce-website-theta-blush.vercel.app/:
- Black Forever logo with pink dot
- Centered Home/Collection/About/Contact navigation
- Bordered split "Latest Arrivals" hero
- Original Outfit/Prata typography
- 5-column desktop / 2-column mobile product grids
- "Latest Collections" and "Best Sellers" sections
- Three service icons, centered newsletter, white footer

**Removed:** H&M-style overlays, category navigation, membership banner, crimson monogram, broken auth, hardcoded orders, nonfunctional controls, unsupported discount promises.

**Motion Design** (intentionally restrained):
- Once-only 14px scroll reveals
- 45ms card stagger (capped at 180ms)
- Single hero-image settle, brief fades, gentle hover zoom
- CTA underline extension, service-icon lifts, button press feedback
- **No looping animations, flashing, scroll hijacking, or parallax**
- Content visible by default; animations as progressive enhancement
- Reduced-motion disables all motion (including active scripts)

Run motion tests:
```bash
CHROMIUM_PATH=/path/to/chromium npm run test:motion
```

Original fonts self-hosted under `frontend/public/fonts` (OFL licenses); no runtime Google Fonts needed.

See **[docs/UI-RESTORATION.md](docs/UI-RESTORATION.md)** for implementation details.

---

## 📦 Brand Assets

- `branding/original-logo.png` and each app's `public/brand/original-logo.png` — original Forever identity
- `BrandLogo` components reuse artwork in storefront and admin
- Favicon uses matching black "F" with pink dot
- Previous SVG concepts archived under `branding/alternatives/` (not displayed)

---

## 📄 License

This project is for educational and evaluation purposes. Original product and editorial photographs are retained from the source project — confirm usage rights before commercial deployment.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Request flow, debugging/change map |
| [VERIFICATION.md](VERIFICATION.md) | Tested scope & limitations |
| [docs/CLOUDINARY-SETUP.md](docs/CLOUDINARY-SETUP.md) | Cloudinary setup, resume, rollback |
| [docs/UI-RESTORATION.md](docs/UI-RESTORATION.md) | UI restoration implementation details |

---

## 🤝 Contributing

This is a personal portfolio/educational project. Issues and PRs are welcome for:
- Bug fixes
- Documentation improvements
- Accessibility enhancements
- Performance optimizations

Please ensure `npm run lint`, `npm run build`, and `npm test` pass before submitting.

---

**Built with care — restoring the original Forever aesthetic with modern, modular architecture.**
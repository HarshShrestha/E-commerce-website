# Architecture and debugging guide

## Backend request flow

`server.js` starts the application and handles shutdown. `app.js` composes global middleware and routes. No features belong in either file.

```text
request → global middleware → route → auth/upload middleware
        → controller → service → repository → Mongoose model → MongoDB
                                             ↘ demo memory adapter
        ← JSON response or centralized error middleware
```

- **Routes** declare URLs, authorization and middleware, then delegate to named controllers.
- **Controllers** map HTTP inputs/outputs and simple catalog CRUD. Multi-step auth, checkout and provider workflows live in **services**.
- **Services** enforce business rules. Checkout uses current server prices, validates sizes/quantities/address, calculates shipping and handles idempotent retries.
- **Repositories** hide storage details. The configured demo mode uses memory; persistent mode uses Mongoose models. Never silently fall back to memory after a database error.
- **Models** define persistence schemas and indexes, not HTTP responses.
- **db** owns connection lifecycle. **config** owns environment/provider initialization. **constants** owns enums, limits and shipping rules.
- **middlewares** owns auth, rate limits, uploads, headers and error translation. **utils** contains focused reusable helpers.

The sample catalog has stable IDs. MongoDB seeding inserts missing samples, not a destructive reset. Explicit demo mode is rejected in production.

## Customer application

`main.jsx` mounts the router/provider. `App.jsx` composes the store layout. `routes/AppRoutes.jsx` maps routes to pages.

- **layouts**: header/footer and shared page shell.
- **pages**: screen-specific form and rendering logic.
- **components**: reusable product cards, campaign banners, fields, summaries and feedback.
- **hooks**: isolated catalog, cart, favorites, customer session, filters, notices and order history behavior.
- **context**: wires those hooks together and exposes `useShop` to UI modules.
- **services**: HTTP requests, response errors and asset URL construction.
- **utils/constants**: storage, money formatting and shared values.
- **styles**: focused CSS files with shared tokens. The storefront is intentionally light, not dependent on OS color preference.

Cart and favorites persist in local storage. Customer tokens persist only in session storage. Treat local storage as untrusted; checkout revalidates all submitted values on the server.

## Admin application

A separate React application with its own session hook and API client. Its layout contains dashboard navigation; individual pages own product listing, creation and order management. Customer and admin authentication are intentionally distinct. An administrator changes fulfillment status manually; no carrier tracking is implied.

## Where to change or debug

| Change or symptom | Start here |
| --- | --- |
| API startup/configuration | backend/config/env.js, backend/db/connect.js, backend/server.js |
| Add an endpoint | backend/routes and backend/controllers; add a service for workflows |
| Login/roles | backend/services/auth.service.js, middlewares/auth.middleware.js, utils/tokens.js |
| Order totals/validation | backend/services/order.service.js and constants/order.constants.js |
| Mongo persistence/indexes | backend/repositories/mongo.repository.js and backend/models |
| Cloudinary upload | backend/services/image.service.js, config/cloudinary.js, middlewares/upload.middleware.js |
| Catalog fetch/retry | frontend/src/hooks/useCatalog.js and services/api.js |
| Search/sort/filter state | frontend/src/hooks/useCollectionFilters.js |
| Bag or saved favorites | frontend/src/hooks/useCart.js and useFavorites.js |
| Header, footer or product tile | frontend/src/components |
| Site-wide colors/type | frontend/src/styles/tokens.css and global.css |
| Admin session expiry | admin/src/hooks/useAdminSession.js and services/api.js |

## Checks and conventions

Run `npm run lint`, `npm run build` and `npm test` from the root. Start the demo apps before `npm run test:e2e`. Browser tests use synthetic users/demo orders, not production data. See README.md for environment setup and VERIFICATION.md for tested boundaries.

Keep modules cohesive, name exports by responsibility, never put credentials in client code, and add regression coverage when changing behavior. The architecture tests guard composition-only entry points and controller delegation; they do not replace code review.

## Cloudinary initialization

`backend/scripts/upload-images.js` is the command orchestrator. `utils/cloudinary-bootstrap.js` discovers/hashes assets and rewrites catalog URLs; `services/image-bootstrap.service.js` handles deduplicated, resumable uploads through an injected SDK function; `services/catalog-images.service.js` performs explicitly requested MongoDB image synchronization. The frontend's `services/editorial-images.js` uses the generated data map with local fallbacks. Read docs/CLOUDINARY-SETUP.md before running it.

## Branding

The active original raster logo lives in branding/original-logo.png and each app public/brand folder. Each React app has a small BrandLogo component. Previous custom SVG concepts are archived in branding/alternatives, not used by the app.

## Landing-page motion

`pages/Home.jsx` composes `HomeHero`, `SectionTitle`, product grids, `OurPolicy` and the working `Newsletter`. `hooks/useLandingMotion.js` observes reveal elements, animates once using the browser Web Animations API and cleans up observers/animations/listeners. It checks reduced-motion preferences and never requires CSS-hidden content. Product-loading changes re-register only new elements. `styles/motion.css` owns short hover/hero effects and the reduced-motion override. The original look is in `styles/home.css`, `layout.css` and the shared tokens; original fonts are self-hosted via `fonts.css`. `tests/motion.e2e.mjs` guards motion and grid behavior separately from the shopping suite.

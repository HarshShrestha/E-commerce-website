# Cloudinary images: initial upload and ongoing product creation

## 1. Configure your account locally

Install dependencies with `npm ci` and `npm run setup` from the project root if you have not already done so. Copy `backend/.env.example` to `backend/.env` if needed, then enter your own Cloudinary values:

```dotenv
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

Keep the API secret on the server. Never add it to a VITE variable or commit `.env`. No credentials are included in this delivery.

## 2. Preview without uploading

From the project root:

```bash
npm run images:upload -- --dry-run
```

This needs no credentials and makes no network requests or file/database changes. It lists the raster images discovered in `backend/public/catalog`, `frontend/src/assets` and `admin/src/assets`, recursively. In this delivery there are **134 references and 69 unique files**; identical copies upload once. This intentionally includes bundled ancillary icons/legacy raster artwork as well as product/editorial images, so initialization covers the supplied image assets. The active original logo and matching favicon remain local brand assets.

## 3. Upload and initialize the app

```bash
npm run images:upload
```

The command:

1. Uploads each unique image with the Cloudinary SDK using secure URLs.
2. Uses deterministic, content-hashed public IDs under `forever/bootstrap/`, with `overwrite: false`; existing assets are not overwritten or deleted.
3. Checkpoints successful uploads in `backend/data/cloudinary-manifest.json`. Repeated runs reuse matching content hashes, even for identical copies under different paths. Run only one initializer at a time.
4. After **all** uploads succeed, rewrites product/gallery URLs in `backend/data/catalog.json` and creates `frontend/src/data/cloudinary-images.json` for editorial images.
5. Saves the first catalog state as `backend/data/catalog.local-backup.json` for rollback. Local image files are retained.

The app's homepage hero, story, contact photo and homepage service icons automatically use the generated editorial map; they use local assets until initialization succeeds. Product cards, galleries, cart and orders accept the generated remote URLs through the existing image URL helper. New orders capture the current product image; historical order snapshots are intentionally not rewritten.

**Restart the API** so it reads the new catalog. In demo mode this resets temporary users/orders. Restart the storefront dev server if needed, or run `npm run build` and redeploy its new build. URLs are written into source/seed files, not injected into an already deployed app.

## 4. Existing MongoDB products

Ordinary seeding inserts missing products and does not overwrite existing records. To initialize a persistent store, set `DEMO_MODE=false` and a valid `MONGODB_URI` (including database name) in `backend/.env`, then run:

```bash
npm run images:upload -- --sync-db
```

This resumes uploads if already done, updates **only image arrays** on existing products with the seed's stable IDs, and inserts missing seed products. It preserves existing names, prices, descriptions, sizes and custom products. It never deletes records. Back up your database first. Mongo synchronization is sequential, not an all-or-nothing transaction: if interrupted, rerun to finish. The command refuses database synchronization in demo mode before starting any uploads.

## 5. Add new products later

Start the API and admin app, sign in as administrator, open **Add product**, choose up to four JPG/PNG/WebP files (5 MB each), complete the fields and publish. The existing protected upload endpoint sends the images to Cloudinary and stores their secure URLs with the product. No browser-side Cloudinary secret or unsigned upload preset is required.

## Recovery and account changes

- A failed upload exits with a nonzero status. Already successful uploads remain checkpointed; fix the network/quota/credential issue and rerun. Catalog/editorial URL generation begins only after uploads finish.
- If a bundled product photo changes, run `npm run catalog:build --prefix backend` to restore local seed references before uploading again, so the changed photo receives a new hash/URL. Without that regeneration, already-remote catalog URLs are intentionally preserved. Old Cloudinary assets are not deleted automatically.
- Do not manually delete Cloudinary assets referenced by your manifest or catalog. Cached entries assume those remote assets still exist. To force their recreation, back up and remove the manifest, then rerun (unchanged existing IDs are reused by Cloudinary).
- A manifest is locked to its Cloudinary cloud name; mixing accounts is rejected. To intentionally switch accounts, back up the manifest/catalog, restore local catalog URLs from the backup (or regenerate using `npm run catalog:build --prefix backend`), remove the old manifest, and rerun. The editorial map is replaced on success. Existing arbitrary remote URLs are preserved, not migrated between providers/accounts.
- The manifest/backups are ignored by Git but contain public URLs, not credentials. Keep them locally for resume. Commit/deploy the generated catalog and editorial map as appropriate; the uploader does not push or deploy them.
- For rollback restore the catalog backup, replace `frontend/src/data/cloudinary-images.json` with `{}`, restart/rebuild, and if necessary explicitly resynchronize MongoDB image arrays from the restored seed. No remote asset deletion is included.

## Verification boundary

Dry-run discovery and mocked tests cover deterministic IDs, deduplication, checkpoint/resume after a failure, secure URLs, catalog/gallery rewrite, unchanged metadata and demo-mode database protection. **No real Cloudinary account or live MongoDB was connected during this update.** Run the initialization in your own account, review its output, then verify product/gallery/editorial URLs and a new admin upload before launch. Cloudinary storage/bandwidth charges or account limits may apply.

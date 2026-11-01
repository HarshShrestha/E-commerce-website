import { uploadBundledImages } from "../services/image-bootstrap.service.js";
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import {
  discoverImages,
  rewriteCatalog,
} from "../utils/cloudinary-bootstrap.js";
const root = fileURLToPath(new URL("../../", import.meta.url));
const flags = new Set(process.argv.slice(2));
const allowed = new Set(["--dry-run", "--sync-db", "--help"]);
const manifestPath = path.join(root, "backend/data/cloudinary-manifest.json");
async function atomicJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = file + ".tmp";
  await writeFile(temporary, JSON.stringify(value, null, 2) + "\n");
  await rename(temporary, file);
}
async function main() {
  for (const flag of flags)
    if (!allowed.has(flag)) throw new Error(`Unknown option: ${flag}`);
  if (flags.has("--help")) {
    console.log(
      "npm run images:upload -- [--dry-run] [--sync-db]\nUploads bundled raster images, resumes from a manifest, rewrites seed/editorial URLs. --sync-db explicitly updates existing seeded MongoDB products.",
    );
    return;
  }
  const images = await discoverImages(root);
  const unique = new Set(images.map((image) => image.hash));
  console.log(
    `Found ${images.length} image references; ${unique.size} unique files (identical copies upload once).`,
  );
  if (flags.has("--dry-run")) {
    for (const image of images)
      console.log(`${image.key} (${image.bytes} bytes)`);
    console.log(
      "Dry run: no network requests, database changes or files written.",
    );
    return;
  }
  dotenv.config({ path: path.join(root, "backend/.env"), quiet: true });
  const cloudName = process.env.CLOUDINARY_NAME;
  const config = {
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true,
  };
  if (!config.cloud_name || !config.api_key || !config.api_secret)
    throw new Error(
      "Set CLOUDINARY_NAME, CLOUDINARY_API_KEY and CLOUDINARY_SECRET_KEY in backend/.env first.",
    );
  if (
    flags.has("--sync-db") &&
    (process.env.DEMO_MODE === "true" || !process.env.MONGODB_URI)
  )
    throw new Error(
      "--sync-db requires DEMO_MODE=false and a configured MONGODB_URI. No uploads started.",
    );
  cloudinary.config(config);
  let manifest = { version: 1, cloudName, files: {} };
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (
    manifest.version !== 1 ||
    !manifest.files ||
    manifest.cloudName !== cloudName
  )
    throw new Error(
      "Upload manifest belongs to another Cloudinary account or is invalid. Back it up and remove it before intentionally changing accounts.",
    );
  const uploadedCount = await uploadBundledImages({
    images,
    manifest,
    upload: (file, options) => cloudinary.uploader.upload(file, options),
    checkpoint: (data) => atomicJson(manifestPath, data),
    progress: (image, count) => console.log(`Uploaded ${count}: ${image.key}`),
  });
  const catalogPath = path.join(root, "backend/data/catalog.json");
  const original = JSON.parse(await readFile(catalogPath, "utf8"));
  const catalog = rewriteCatalog(original, manifest.files);
  // Keep the first local catalog as an explicit rollback backup.
  try {
    await writeFile(
      path.join(root, "backend/data/catalog.local-backup.json"),
      JSON.stringify(original, null, 2) + "\n",
      { flag: "wx" },
    );
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  await atomicJson(catalogPath, catalog);
  const assetMap = Object.fromEntries(
    Object.entries(manifest.files)
      .filter(([key]) => key.startsWith("frontend/src/assets/"))
      .map(([key, value]) => [path.posix.basename(key), value.url]),
  );
  await atomicJson(
    path.join(root, "frontend/src/data/cloudinary-images.json"),
    assetMap,
  );
  if (flags.has("--sync-db")) {
    const { syncCatalogImages } =
      await import("../services/catalog-images.service.js");
    const count = await syncCatalogImages(catalog);
    console.log(
      `Updated/inserted images for ${count} seeded MongoDB products; existing product metadata was preserved.`,
    );
  }
  console.log(
    `Complete: ${uploadedCount} new uploads. Seed and frontend image URLs updated. Restart the API and rebuild/restart the storefront. Existing MongoDB products require --sync-db.`,
  );
}
main().catch((error) => {
  // Provider error objects can contain request details. Never print credentials or the whole object.
  const message = error?.http_code
    ? `Cloudinary request failed (HTTP ${error.http_code}). Check account configuration, quota and network, then rerun.`
    : error.message;
  console.error(`Image initialization failed: ${message}`);
  console.error(
    "Completed uploads remain in the manifest. Fix the cause and rerun; application URLs are only rewritten after all uploads succeed.",
  );
  process.exitCode = 1;
});

import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
const extensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
export const imageHash = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
export function publicIdFor(file, hash) {
  const stem = path
    .basename(file, path.extname(file))
    .replace(/[^a-zA-Z0-9_-]/g, "-");
  return `forever/bootstrap/${stem}-${hash.slice(0, 20)}`;
}
export async function discoverImages(root) {
  const files = [];
  async function walk(relative) {
    for (const entry of await readdir(path.join(root, relative), {
      withFileTypes: true,
    })) {
      const key = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) await walk(key);
      else if (extensions.has(path.extname(entry.name).toLowerCase())) {
        const absolute = path.join(root, key);
        const bytes = await readFile(absolute);
        files.push({
          key,
          absolute,
          hash: imageHash(bytes),
          bytes: (await stat(absolute)).size,
        });
      }
    }
  }
  for (const directory of [
    "backend/public/catalog",
    "frontend/src/assets",
    "admin/src/assets",
  ])
    await walk(directory);
  return files.sort((a, b) => a.key.localeCompare(b.key));
}
export function rewriteCatalog(catalog, files) {
  return catalog.map((product) => ({
    ...product,
    images: product.images.map((url) => {
      // Preserve already-remote product images on repeat runs.
      if (/^https:\/\//.test(url)) return url;
      if (!url.startsWith("/catalog/"))
        throw new Error(`Unexpected catalog image: ${url}`);
      const uploaded = files[`backend/public${url}`];
      if (!uploaded?.url?.startsWith("https://res.cloudinary.com/"))
        throw new Error(`Missing upload for ${url}`);
      return uploaded.url;
    }),
  }));
}

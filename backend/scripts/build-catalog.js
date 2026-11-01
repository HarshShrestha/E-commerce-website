import fs from "node:fs";
// This build-only script reads trusted, checked-in product definitions; never user input.
let source = fs.readFileSync(
  new URL("../../frontend/src/assets/assets.js", import.meta.url),
  "utf8",
);
source = source.replace(
  /import\s+(\w+)\s+from\s+['"]\.\/([^'"]+)['"];?/g,
  (_match, name, file) => `const ${name}='/catalog/${file}';`,
);
source = source
  .replace("export const assets", "const assets")
  .replace("export const products", "const products");
const products = new Function(source + "; return products;")();
const catalog = products.map(({ _id, ...product }) => ({
  ...product,
  _id: String(
    Array.from(_id).reduce((n, c) => n * 26 + c.charCodeAt(0) - 97, 0) + 1,
  ).padStart(24, "0"),
  bestSeller: !!product.bestseller,
}));
fs.writeFileSync(
  new URL("../data/catalog.json", import.meta.url),
  JSON.stringify(catalog, null, 2) + "\n",
);
console.log(`Generated ${catalog.length} sample products.`);

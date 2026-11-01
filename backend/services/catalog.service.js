import catalog from "../data/catalog.json" with { type: "json" };
import { demo } from "../config/env.js";
import { store } from "../repositories/index.js";
export async function seedCatalog() {
  if (demo) return;
  for (const product of catalog)
    if (!(await store.get("products", product._id)))
      await store.insert("products", product);
}

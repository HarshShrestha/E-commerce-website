import mongoose from "mongoose";
import Product from "../models/product.model.js";
/** Explicit initializer only: change seeded image URLs, never delete products or replace merchant metadata. */
export async function syncCatalogImages(catalog) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    await Product.init();
    for (const product of catalog) {
      const { images, ...metadata } = product;
      await Product.updateOne(
        { _id: product._id },
        { $set: { images }, $setOnInsert: metadata },
        { upsert: true, runValidators: true },
      );
    }
    return catalog.length;
  } finally {
    await mongoose.disconnect();
  }
}

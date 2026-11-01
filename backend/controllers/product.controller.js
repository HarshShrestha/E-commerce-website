import {
  CATEGORIES,
  PRODUCT_TYPES,
  SIZES,
} from "../constants/product.constants.js";
import { store } from "../repositories/index.js";
import { fail } from "../utils/ApiError.js";
import { text } from "../utils/validation.js";
import { uploadProductImages } from "../services/image.service.js";

export const listProducts = async (_req, res) =>
  res.json({ success: true, products: await store.list("products") });

export const getProduct = async (req, res) => {
  const product = await store.get("products", req.body.productId);
  if (!product) throw fail(404, "Product not found.");
  res.json({ success: true, product });
};

export const addProduct = async (req, res) => {
  const b = req.body;
  let sizes;
  try {
    sizes = JSON.parse(b.sizes);
  } catch {
    throw fail(400, "Choose at least one valid size.");
  }
  const price = Number(b.price),
    name = text(b.name, 120),
    description = text(b.description, 3000),
    category = text(b.category),
    subCategory = text(b.subCategory);
  if (
    !name ||
    !description ||
    !b.price ||
    !Number.isFinite(price) ||
    price <= 0 ||
    price > 100000 ||
    !CATEGORIES.includes(category) ||
    !PRODUCT_TYPES.includes(subCategory) ||
    !Array.isArray(sizes) ||
    !sizes.length ||
    !sizes.every((s) => SIZES.includes(s))
  )
    throw fail(
      400,
      "Complete all product fields with a positive price and valid sizes.",
    );
  const images = await uploadProductImages(
    Object.values(req.files || {}).flat(),
  );
  const product = await store.insert("products", {
    name,
    description,
    price: Math.round(price * 100) / 100,
    images,
    category,
    subCategory,
    sizes: [...new Set(sizes)],
    bestSeller: b.bestSeller === "true",
    date: Date.now(),
  });
  res.status(201).json({ success: true, product, message: "Product added." });
};

export const removeProduct = async (req, res) => {
  if (!(await store.remove("products", req.body.id)))
    throw fail(404, "Product not found.");
  res.json({ success: true, message: "Product removed." });
};

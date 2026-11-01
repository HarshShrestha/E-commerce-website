import validator from "validator";
import { store } from "../repositories/index.js";
import { fail } from "../utils/ApiError.js";
import { text } from "../utils/validation.js";
import {
  addressFields,
  FREE_SHIPPING_CENTS,
  SHIPPING_FEE,
} from "../constants/order.constants.js";
export async function createCustomerOrder({ userId, body = {}, key }) {
  if (body.paymentMethod !== "cod")
    throw fail(400, "Only cash on delivery is currently available.");

  if (!/^[a-zA-Z0-9-]{16,100}$/.test(key))
    throw fail(400, "A valid checkout request key is required.");

  const [previous] = await store.list("orders", { userId, requestKey: key });
  if (previous) return { order: previous, created: false };
  const address = Object.fromEntries(
    addressFields.map((k) => [
      k,
      text(body.address?.[k], k === "street" ? 300 : 150),
    ]),
  );
  if (
    addressFields.some((k) => !address[k]) ||
    !validator.isEmail(address.email) ||
    !/^\+?[\d\s().-]{7,25}$/.test(address.phone)
  )
    throw fail(
      400,
      "Complete the delivery address with a valid email and phone number.",
    );
  if (
    !Array.isArray(body.items) ||
    !body.items.length ||
    body.items.length > 100
  )
    throw fail(400, "Add items to your bag before checkout.");
  const items = [],
    seen = new Set();
  let cents = 0;
  for (const row of body.items) {
    const product = await store.get("products", row.productId);
    if (!product)
      throw fail(
        409,
        "An item is no longer available. Please update your bag.",
      );
    if (
      !product.sizes.includes(row.size) ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 1 ||
      row.quantity > 99
    )
      throw fail(400, "Check product sizes and quantities (1–99).");
    const itemKey = `${row.productId}:${row.size}`;
    if (seen.has(itemKey))
      throw fail(400, "Duplicate product sizes are not allowed.");
    seen.add(itemKey);
    cents += Math.round(product.price * 100) * row.quantity;
    items.push({
      productId: String(product._id),
      name: product.name,
      image: product.images[0],
      size: row.size,
      quantity: row.quantity,
      price: product.price,
    });
  }
  const shipping = cents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_FEE;
  try {
    const order = await store.insert("orders", {
      userId,
      items,
      address,
      amount: cents / 100 + shipping,
      shipping,
      status: "Order placed",
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
      requestKey: key,
    });
    return { order, created: true };
  } catch (error) {
    if (error.code !== 11000) throw error;
    const [order] = await store.list("orders", { userId, requestKey: key });
    return { order, created: false };
  }
}

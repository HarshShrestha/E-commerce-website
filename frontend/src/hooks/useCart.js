import { useEffect, useMemo, useState } from "react";
import { readLocal, saveLocal } from "../utils/storage";
import {
  SHIPPING_FEE,
  FREE_SHIPPING_SUBTOTAL,
  MAX_ITEM_QUANTITY,
} from "../constants/shop";
export function useCart(products, notify) {
  const [cart, setCart] = useState(() => {
    const saved = readLocal("forever.cart", []);
    return Array.isArray(saved)
      ? saved.filter(
          (x) =>
            x &&
            typeof x.productId === "string" &&
            typeof x.size === "string" &&
            Number.isInteger(x.quantity) &&
            x.quantity > 0 &&
            x.quantity <= MAX_ITEM_QUANTITY,
        )
      : [];
  });
  useEffect(() => {
    saveLocal("forever.cart", cart);
  }, [cart]);
  const lines = useMemo(
    () =>
      cart.map((row) => ({
        ...row,
        product: products.find((p) => p._id === row.productId),
      })),
    [cart, products],
  );
  const subtotal = lines.reduce(
      (sum, row) => sum + (row.product?.price || 0) * row.quantity,
      0,
    ),
    shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_SUBTOTAL ? 0 : SHIPPING_FEE,
    count = cart.reduce((sum, row) => sum + row.quantity, 0);
  function add(product, size) {
    if (!product.sizes.includes(size)) return false;
    setCart((previous) => {
      const exists = previous.find(
        (x) => x.productId === product._id && x.size === size,
      );
      return exists
        ? previous.map((x) =>
            x === exists
              ? { ...x, quantity: Math.min(MAX_ITEM_QUANTITY, x.quantity + 1) }
              : x,
          )
        : [...previous, { productId: product._id, size, quantity: 1 }];
    });
    notify("Added to your bag.");
    return true;
  }
  function quantity(id, size, value) {
    if (!Number.isInteger(value) || value < 0 || value > MAX_ITEM_QUANTITY)
      return;
    setCart((previous) =>
      value === 0
        ? previous.filter((x) => x.productId !== id || x.size !== size)
        : previous.map((x) =>
            x.productId === id && x.size === size
              ? { ...x, quantity: value }
              : x,
          ),
    );
  }
  return { cart, setCart, lines, subtotal, shipping, count, add, quantity };
}

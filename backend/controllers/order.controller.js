import { createCustomerOrder } from "../services/order.service.js";
import { ORDER_STATUSES } from "../constants/order.constants.js";
import { store } from "../repositories/index.js";
import { fail } from "../utils/ApiError.js";
import { text } from "../utils/validation.js";
export const placeOrder = async (req, res) => {
  const result = await createCustomerOrder({
    userId: req.identity.id,
    body: req.body,
    key: text(req.headers["idempotency-key"], 100),
  });
  res
    .status(result.created ? 201 : 200)
    .json({ success: true, order: result.order });
};

export const listCustomerOrders = async (req, res) =>
  res.json({
    success: true,
    orders: (await store.list("orders", { userId: req.identity.id })).sort(
      (a, b) => b.date - a.date,
    ),
  });

export const listOrders = async (_req, res) =>
  res.json({
    success: true,
    orders: (await store.list("orders")).sort((a, b) => b.date - a.date),
  });

export const updateOrderStatus = async (req, res) => {
  if (!ORDER_STATUSES.includes(req.body.status))
    throw fail(400, "Invalid order status.");
  const order = await store.update("orders", req.body.orderId, {
    status: req.body.status,
  });
  if (!order) throw fail(404, "Order not found.");
  res.json({ success: true, order });
};

import { Router } from "express";
import {
  placeOrder,
  listCustomerOrders,
  listOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/place", auth("user"), asyncHandler(placeOrder));
router.get("/userorders", auth("user"), asyncHandler(listCustomerOrders));
router.get("/list", auth("admin"), asyncHandler(listOrders));
router.post("/status", auth("admin"), asyncHandler(updateOrderStatus));
export default router;

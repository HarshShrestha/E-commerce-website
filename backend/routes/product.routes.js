import { Router } from "express";
import {
  listProducts,
  getProduct,
  addProduct,
  removeProduct,
} from "../controllers/product.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "../middlewares/auth.middleware.js";
import { uploadFields } from "../middlewares/upload.middleware.js";
const router = Router();
router.get("/list", asyncHandler(listProducts));
router.post("/single", asyncHandler(getProduct));
router.post("/add", auth("admin"), uploadFields, asyncHandler(addProduct));
router.post("/remove", auth("admin"), asyncHandler(removeProduct));
export default router;

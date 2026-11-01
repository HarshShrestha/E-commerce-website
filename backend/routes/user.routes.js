import { Router } from "express";
import {
  registerUser,
  loginUser,
  loginAdmin,
  getProfile,
} from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "../middlewares/auth.middleware.js";
import { limiter } from "../middlewares/rateLimit.middleware.js";
const router = Router();
router.post("/register", limiter, asyncHandler(registerUser));
router.post("/login", limiter, asyncHandler(loginUser));
router.post("/admin", limiter, asyncHandler(loginAdmin));
router.get("/me", auth("user"), asyncHandler(getProfile));
export default router;

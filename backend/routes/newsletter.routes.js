import { Router } from "express";
import { subscribeNewsletter } from "../controllers/newsletter.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { limiter } from "../middlewares/rateLimit.middleware.js";
const router = Router();
router.post("/", limiter, asyncHandler(subscribeNewsletter));
export default router;

import multer from "multer";
import { fail } from "../utils/ApiError.js";
export const notFound = (_req, _res, next) =>
  next(fail(404, "API route not found."));
export function errorHandler(error, _req, res, _next) {
  const status =
    (error.code === 11000 ? 409 : error.status) ||
    (error instanceof multer.MulterError ? 400 : 500);
  if (status >= 500) console.error(error.message);
  res.status(status).json({
    success: false,
    message:
      status >= 500
        ? "The service is temporarily unavailable. Please try again."
        : error.message,
  });
}

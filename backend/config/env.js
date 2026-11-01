import "dotenv/config";
export const demo = process.env.DEMO_MODE === "true";
export const env = Object.freeze({
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  corsOrigins: (
    process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174"
  )
    .split(",")
    .map((x) => x.trim()),
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  },
});
if (!env.jwtSecret || env.jwtSecret.length < 32)
  throw new Error("JWT_SECRET must contain at least 32 characters.");
if (demo && env.nodeEnv === "production")
  throw new Error("DEMO_MODE is forbidden in production.");

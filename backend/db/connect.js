import mongoose from "mongoose";
import { env, demo } from "../config/env.js";
import { models } from "../models/index.js";
export async function connectDB() {
  if (demo) {
    console.warn("DEMO MODE: all data is in memory and resets on restart.");
    return;
  }
  if (!env.mongoUri)
    throw new Error(
      "Set MONGODB_URI or use DEMO_MODE=true for local evaluation.",
    );
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
  await Promise.all(Object.values(models).map((model) => model.init()));
}
export const disconnectDB = () => mongoose.disconnect();

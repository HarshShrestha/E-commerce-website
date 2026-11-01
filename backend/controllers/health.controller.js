import { demo } from "../config/env.js";

export const getHealth = (_req, res) =>
  res.json({ success: true, mode: demo ? "demo" : "production" });

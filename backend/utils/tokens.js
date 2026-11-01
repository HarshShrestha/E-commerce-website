import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const tokenOptions = {
  issuer: "forever-api",
  audience: "forever-client",
};
export const tokenFor = (id, role) =>
  jwt.sign({ id, role }, env.jwtSecret, { ...tokenOptions, expiresIn: "12h" });
export const verifyToken = (token) =>
  jwt.verify(token, env.jwtSecret, tokenOptions);

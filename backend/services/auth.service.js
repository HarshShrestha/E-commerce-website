import bcrypt from "bcrypt";
import validator from "validator";
import { env } from "../config/env.js";
import { store } from "../repositories/index.js";
import { fail } from "../utils/ApiError.js";
import { text } from "../utils/validation.js";
import { safeEqual } from "../utils/security.js";
import { tokenFor } from "../utils/tokens.js";
function session(user) {
  return {
    token: tokenFor(String(user._id), "user"),
    user: { name: user.name, email: user.email },
  };
}
export async function registerAccount(body = {}) {
  const name = text(body.name, 100),
    email = text(body.email, 254).toLowerCase(),
    password = body.password;
  if (
    name.length < 2 ||
    !validator.isEmail(email) ||
    typeof password !== "string" ||
    password.length < 8 ||
    Buffer.byteLength(password) > 72
  )
    throw fail(400, "Enter a name, valid email and password of 8–72 bytes.");
  if ((await store.list("users", { email })).length)
    throw fail(409, "An account already exists with this email.");
  return session(
    await store.insert("users", {
      name,
      email,
      password: await bcrypt.hash(password, 12),
    }),
  );
}
export async function authenticateAccount(body = {}) {
  const email = text(body.email, 254).toLowerCase(),
    password = body.password;
  if (typeof password !== "string" || Buffer.byteLength(password) > 72)
    throw fail(400, "Enter a valid email and password.");
  const [user] = await store.list("users", { email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw fail(401, "Email or password is incorrect.");
  return session(user);
}
export function authenticateAdmin(body = {}) {
  if (!env.adminEmail || !env.adminPassword)
    throw fail(503, "Admin sign-in is not configured.");
  if (
    !safeEqual(text(body.email).toLowerCase(), env.adminEmail.toLowerCase()) ||
    !safeEqual(body.password, env.adminPassword)
  )
    throw fail(401, "Email or password is incorrect.");
  return { token: tokenFor("admin", "admin") };
}
export async function getAccountProfile(id) {
  const user = await store.get("users", id);
  if (!user) throw fail(401, "Account not found. Please sign in again.");
  return { name: user.name, email: user.email };
}

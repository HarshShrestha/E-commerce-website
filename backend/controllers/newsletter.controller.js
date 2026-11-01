import { store } from "../repositories/index.js";
import { fail } from "../utils/ApiError.js";
import { text } from "../utils/validation.js";
import validator from "validator";

export const subscribeNewsletter = async (req, res) => {
  const email = text(req.body.email, 254).toLowerCase();
  if (!validator.isEmail(email)) throw fail(400, "Enter a valid email.");
  if (!(await store.list("subscriptions", { email })).length) {
    try {
      await store.insert("subscriptions", { email, date: Date.now() });
    } catch (e) {
      if (e.code !== 11000) throw e;
    }
  }
  res.json({
    success: true,
    message: "You’re on the list. Thank you for subscribing.",
  });
};

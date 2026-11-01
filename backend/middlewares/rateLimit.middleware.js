import { fail } from "../utils/ApiError.js"; // Process-local by design. Configure an edge/shared limiter for multi-instance deployment.
const attempts = new Map();
export function limiter(req, res, next) {
  const now = Date.now();
  for (const [k, v] of attempts) if (v.reset < now) attempts.delete(k);
  const entry = attempts.get(req.ip) || {
    count: 0,
    reset: now + 15 * 60 * 1000,
  };
  entry.count++;
  attempts.set(req.ip, entry);
  if (entry.count > 30)
    return next(fail(429, "Too many attempts. Try again in 15 minutes."));
  next();
}

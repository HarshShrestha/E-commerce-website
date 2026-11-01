import { verifyToken } from "../utils/tokens.js";
import { fail } from "../utils/ApiError.js";
export const auth = (role) => (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.replace(/^Bearer /, "") || req.headers.token;
    const identity = verifyToken(token);
    if (identity.role !== role) throw new Error();
    req.identity = identity;
    next();
  } catch {
    next(fail(401, "Your session has expired. Please sign in again."));
  }
};

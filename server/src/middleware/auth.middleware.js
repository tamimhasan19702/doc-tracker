import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** Verifies the Bearer JWT and attaches the user to req.user. */
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Not authorized, invalid or expired token");
  }

  const user = await User.findById(payload.sub).lean();
  if (!user) {
    throw new ApiError(401, "Not authorized, user no longer exists");
  }

  req.user = user;
  next();
});

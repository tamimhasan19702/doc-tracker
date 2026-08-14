import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** Signs a JWT for the given user.*/
const signToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

/**  verifies credentials, returns token + user. */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/** returns the current authenticated user. */
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").lean();
  res.json({ success: true, data: user });
});

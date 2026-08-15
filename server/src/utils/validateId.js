import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";

/** Throws 400 if id is not a valid MongoDB ObjectId. */
export function assertId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid id format");
  }
}

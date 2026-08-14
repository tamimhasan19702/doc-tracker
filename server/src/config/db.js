import mongoose from "mongoose";
import env from "./env.js";

/** Establishes the MongoDB connection. @returns {Promise<import("mongoose").Connection>} */
export async function connectDB() {
  await mongoose.connect(env.mongodbUri);
  console.log(`[db] connected to ${env.mongodbUri}`);
  return mongoose.connection;
}

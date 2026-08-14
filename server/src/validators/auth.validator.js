import { z } from "zod";

/** Login payload: valid email + password of at least 6 chars. */
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

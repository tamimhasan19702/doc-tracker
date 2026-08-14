import { z } from "zod";

/** Optional trimmed string; "" / undefined normalize to undefined. */
const optionalString = (max = 100) =>
  z
    .union([z.string().trim().max(max), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v));

/** Optional email; must be valid when present. */
const optionalEmail = () =>
  z
    .union([z.email(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v));

/** Create doctor payload. */
export const createDoctorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  specialization: optionalString(),
  hospital: optionalString(),
  phone: optionalString(30),
  email: optionalEmail(),
});

/** Updates allow any subset of create fields. */
export const updateDoctorSchema = createDoctorSchema.partial();

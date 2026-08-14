import { z } from "zod";

/** Optional trimmed string */
const optionalString = (max = 100) =>
  z
    .union([z.string().trim().max(max), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v));

/** Create patient payload. */
export const createPatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  age: z
    .union([z.literal(""), z.coerce.number().int().min(0).max(150)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  gender: z
    .union([z.literal(""), z.enum(["male", "female", "other"])])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  condition: optionalString(),
  phone: optionalString(30),
});

/** Updates allow any subset of create fields. */
export const updatePatientSchema = createPatientSchema.partial();

import { z } from "zod";

/** Optional trimmed string */
const optionalString = (max = 100) =>
  z
    .union([z.string().trim().max(max), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v));

/** MongoDB ObjectId reference to a Doctor. */
const doctorId = () =>
  z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid doctor id");

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
  doctor: doctorId().optional(),
});

/** Updates allow any subset of create fields. */
export const updatePatientSchema = createPatientSchema.partial();

import { ApiError } from "../utils/ApiError.js";

/** Validates req.body against a Zod schema; replaces it with sanitized data on success. */
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".") || "body"}: ${issue.message}`
    );
    return next(new ApiError(400, "Validation failed", errors));
  }
  req.body = result.data;
  next();
};

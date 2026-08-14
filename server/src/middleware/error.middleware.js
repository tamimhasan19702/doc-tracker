/** Central error handler — converts any error into { success, message, errors }. */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => e.message);
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
    errors = [`${field} already exists`];
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id format";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message, errors });
};

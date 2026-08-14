/** Parses & clamps page/limit query params (page >= 1, limit 1..100). */
export function getPagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/** Builds the standard list response with pagination metadata. */
export function paginateResponse(data, page, limit, total) {
  return {
    success: true,
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/** Escapes & compiles a search string into a case-insensitive substring regex. */
export function toRegex(value) {
  if (!value) return null;
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
}

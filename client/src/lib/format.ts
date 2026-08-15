/** Formats an ISO date string as a locale date. */
export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

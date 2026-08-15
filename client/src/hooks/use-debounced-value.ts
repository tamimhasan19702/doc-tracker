import { useEffect, useState } from "react";

/**
 * Returns `value` after it has stopped changing for `delay` ms.
 * The returned value only updates once the input has settled, so it is safe
 * to drive debounced side effects (e.g. API fetches) from it.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

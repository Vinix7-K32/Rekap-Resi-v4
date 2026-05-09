import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay (ms).
 * Returns the debounced value that only updates after the user stops
 * changing the original value for `delay` milliseconds.
 *
 * @param {*} value - The value to debounce.
 * @param {number} [delay=300] - Delay in milliseconds.
 * @returns {*} The debounced value.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

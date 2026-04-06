import { useState, useEffect } from "react";

/**
 * Returns a debounced version of `value` that only updates after
 * `delay` ms have elapsed since the last change.
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * // Use debouncedSearch in filters/queries instead of searchTerm
 */
export function useDebounce<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

import { useEffect, useState, Dispatch, SetStateAction } from "react";

/**
 * Custom hook for persisting state to localStorage
 * Handles JSON serialization/deserialization automatically
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(key);
        if (stored) {
          setValue(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
    }
    setIsLoaded(true);
  }, [key]);

  // Save to localStorage whenever value changes (after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to save ${key} to localStorage:`, error);
      }
    }
  }, [value, key, isLoaded]);

  return [value, setValue];
}

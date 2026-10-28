import { useEffect, useState } from "react";

// State yang tersimpan di localStorage (fallback aman bila storage diblokir).
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage penuh / private mode — abaikan */
    }
  }, [key, value]);

  return [value, setValue];
}

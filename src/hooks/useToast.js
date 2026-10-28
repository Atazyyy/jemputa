import { useCallback, useEffect, useRef, useState } from "react";

// Toast sederhana sekali tampil (otomatis hilang setelah 2,8 detik).
export default function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const show = useCallback((msg) => {
    setToast({ msg, id: Date.now() });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return { toast, show };
}

import { useCallback, useEffect, useRef, useState } from "react";

const MATCH_MS = 4200; // durasi "mencari pengemudi"
const ARRIVE_MS = 6500; // durasi "pengemudi menuju lokasi"

// Mesin status perjalanan: matching → arriving → ongoing → completed.
// Timmer hidup di level App sehingga perjalanan tetap jalan walau pindah tab.
export default function useActiveTrip(onFinalize) {
  const [trip, setTrip] = useState(null);
  const timer = useRef(null);
  const finalized = useRef(false);
  const tripRef = useRef(null);

  useEffect(() => {
    tripRef.current = trip;
  }, [trip]);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => {
    if (!trip) return;
    if (trip.phase === "matching") {
      timer.current = setTimeout(() => {
        setTrip((t) => (t ? { ...t, phase: "arriving", progress: 0 } : t));
      }, MATCH_MS);
    } else if (trip.phase === "arriving") {
      timer.current = setInterval(() => {
        setTrip((t) => {
          if (!t || t.phase !== "arriving") return t;
          const p = t.progress + 120 / ARRIVE_MS;
          if (p >= 1) return { ...t, phase: "ongoing", progress: 0 };
          return { ...t, progress: p };
        });
      }, 120);
    } else if (trip.phase === "ongoing") {
      timer.current = setInterval(() => {
        setTrip((t) => {
          if (!t || t.phase !== "ongoing") return t;
          const p = t.progress + 150 / t.rideMs;
          if (p >= 1) return { ...t, phase: "completed", progress: 1 };
          return { ...t, progress: p };
        });
      }, 150);
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.phase]);

  // Finalisasi sekali saat perjalanan selesai (bayar + catat riwayat).
  useEffect(() => {
    if (trip?.phase === "completed" && !finalized.current) {
      finalized.current = true;
      onFinalize(trip);
    }
  }, [trip, onFinalize]);

  const start = useCallback((draft) => {
    finalized.current = false;
    setTrip({ ...draft, phase: "matching", progress: 0, startedTs: Date.now() });
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    const t = tripRef.current;
    if (t && (t.phase === "matching" || t.phase === "arriving")) {
      finalized.current = true;
      onFinalize({ ...t, phase: "cancelled" });
    }
    setTrip(null);
  }, [onFinalize]);

  const clear = useCallback(() => {
    clearTimer();
    setTrip(null);
  }, []);

  return { trip, start, cancel, clear };
}

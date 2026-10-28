import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Booking from "./components/Booking";
import History from "./components/History";
import Wallet from "./components/Wallet";
import useLocalStorage from "./hooks/useLocalStorage";
import useActiveTrip from "./hooks/useActiveTrip";
import useToast from "./hooks/useToast";
import { SEED_TRIPS, SEED_WALLET } from "./data/seed";

// Ubah draft perjalanan aktif menjadi record riwayat.
function toRecord(t, status) {
  return {
    id: t.id,
    ts: t.startedTs,
    pickupName: t.pickup.name,
    destName: t.dest.name,
    serviceId: t.service.id,
    serviceName: t.service.name,
    km: t.km,
    fare: t.fare,
    discount: t.discount,
    total: t.total,
    payment: t.payment === "wallet" ? "Dompet Jemputa" : "Tunai",
    driverName: t.driver.name,
    driverPlate: t.driver.plate,
    driverPhoto: t.driver.photo,
    driverRating: t.driver.rating,
    rating: null,
    tags: [],
    status, // "selesai" | "dibatalkan"
  };
}

export default function App() {
  const [view, setView] = useState("pesan");
  const [trips, setTrips] = useLocalStorage("jemputa-trips-v1", SEED_TRIPS);
  const [wallet, setWallet] = useLocalStorage("jemputa-wallet-v1", SEED_WALLET);
  const { toast, show } = useToast();

  const navigate = (v) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  // Finalisasi perjalanan: catat riwayat + potong saldo bila bayar dompet.
  const finalizeTrip = useCallback(
    (t) => {
      if (t.phase === "cancelled") {
        setTrips((prev) => [toRecord(t, "dibatalkan"), ...prev]);
        show("Perjalanan dibatalkan. Tidak ada biaya.");
        return;
      }
      if (t.payment === "wallet") {
        setWallet((w) => ({
          ...w,
          balance: w.balance - t.total,
          mutasi: [
            {
              id: `m-${t.id}`,
              ts: Date.now(),
              type: "bayar",
              label: `${t.service.name} — ${t.pickup.name} → ${t.dest.name}`,
              amount: -t.total,
            },
            ...w.mutasi,
          ],
        }));
      }
      setTrips((prev) => [toRecord(t, "selesai"), ...prev]);
      show("Perjalanan selesai — beri rating pengemudimu!");
    },
    [setTrips, setWallet, show]
  );

  const activeTrip = useActiveTrip(finalizeTrip);

  const rateTrip = useCallback(
    (tripId, rating, tags) => {
      setTrips((prev) =>
        prev.map((t) => (t.id === tripId ? { ...t, rating, tags } : t))
      );
      show("Terima kasih atas ratingnya!");
    },
    [setTrips, show]
  );

  const topUp = useCallback(
    (amount, methodName) => {
      setWallet((w) => ({
        ...w,
        balance: w.balance + amount,
        mutasi: [
          {
            id: `m-${Date.now()}`,
            ts: Date.now(),
            type: "topup",
            label: `Top Up — ${methodName}`,
            amount,
          },
          ...w.mutasi,
        ],
      }));
      show("Top up berhasil — saldo dompet bertambah.");
    },
    [setWallet, show]
  );

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
      <Navbar
        view={view}
        onNavigate={navigate}
        balance={wallet.balance}
        tripActive={!!activeTrip.trip}
      />
      <main className="flex-1 pb-24 sm:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          {view === "pesan" && (
            <Booking
              trip={activeTrip.trip}
              onStart={activeTrip.start}
              onCancel={activeTrip.cancel}
              onClear={activeTrip.clear}
              onRate={rateTrip}
              wallet={wallet}
              trips={trips}
              onGoWallet={() => navigate("dompet")}
            />
          )}
          {view === "riwayat" && (
            <History
              trips={trips}
              onRate={rateTrip}
              onBook={() => navigate("pesan")}
            />
          )}
          {view === "dompet" && (
            <Wallet wallet={wallet} onTopUp={topUp} toast={show} />
          )}
        </div>
      </main>
      <Footer />

      {/* Toast global */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 24, x: "-50%" }}
            className="fixed bottom-20 left-1/2 z-50 sm:bottom-6"
          >
            <div className="whitespace-nowrap rounded-full border border-edge bg-card2 px-4 py-2.5 text-sm font-semibold text-ink shadow-xl shadow-black/40">
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

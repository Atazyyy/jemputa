import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Share2, Star, X } from "lucide-react";
import RatingBox from "./RatingBox";
import { VOUCHER } from "../data/seed";
import { rupiah, kmLabel, menitLabel } from "../utils/format";

const PHASE_META = {
  matching: {
    title: "Mencari pengemudi terdekat…",
    sub: "Biasanya kurang dari 10 detik",
  },
  arriving: {
    title: "Pengemudi menuju lokasimu",
    sub: "Bersiap di titik jemput, ya",
  },
  ongoing: {
    title: "Perjalanan berlangsung",
    sub: "Duduk manis — kamu sedang diantar",
  },
  completed: {
    title: "Perjalanan selesai!",
    sub: "Jangan lupa beri rating pengemudi",
  },
};

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-mute">{label}</span>
      <span className={accent ? "font-bold text-lime" : "font-semibold text-ink"}>
        {value}
      </span>
    </div>
  );
}

export default function TripStatus({ trip, onCancel, onClear, onRate }) {
  const meta = PHASE_META[trip.phase];
  const [rated, setRated] = useState(false);

  const cancelable = trip.phase === "matching" || trip.phase === "arriving";
  const remainTrip = Math.max(1, Math.round(trip.etaTrip * (1 - trip.progress)));
  const remainPickup = Math.max(
    1,
    Math.round(trip.etaPickup * (1 - trip.progress))
  );

  const shareText = `Sedang di perjalanan bareng Jemputa: ${trip.pickup.name} → ${trip.dest.name} (${trip.service.name}, pengemudi ${trip.driver.name}, plat ${trip.driver.plate}).`;
  const waShare = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-edge bg-card p-4 sm:p-5"
    >
      {/* Header status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-base font-extrabold text-ink">
            {trip.phase === "completed" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-lime" />
            ) : (
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
              </span>
            )}
            {meta.title}
          </p>
          <p className="mt-0.5 text-xs text-mute">{meta.sub}</p>
        </div>
        {cancelable && (
          <button
            onClick={onCancel}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-edge px-2.5 py-1.5 text-xs font-bold text-danger transition-colors hover:bg-danger-soft"
          >
            <X className="h-3.5 w-3.5" /> Batal
          </button>
        )}
      </div>

      {/* Fase: mencari pengemudi */}
      {trip.phase === "matching" && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-canvas2">
            <motion.div
              className="h-full w-1/3 rounded-full bg-lime"
              animate={{ x: ["-110%", "320%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="mt-2.5 text-xs text-mute">
            Mencari {trip.service.name} terdekat di sekitar {trip.pickup.name}…
          </p>
        </div>
      )}

      {/* Fase: pengemudi datang / berjalan */}
      {(trip.phase === "arriving" || trip.phase === "ongoing") && (
        <>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-edge bg-canvas2 p-3">
            <img
              src={trip.driver.photo}
              alt={trip.driver.name}
              loading="lazy"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-lime/60"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{trip.driver.name}</p>
              <p className="flex items-center gap-1 text-xs text-mute">
                <Star className="h-3 w-3 fill-gold text-gold" />
                {trip.driver.rating.toFixed(1)} · {trip.driver.vehicle}
              </p>
            </div>
            <span className="rounded-md bg-card px-2 py-1 font-mono text-xs font-bold tracking-wider text-lime ring-1 ring-edge">
              {trip.driver.plate}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-mute">
              <span>
                {trip.phase === "arriving"
                  ? "Menuju titik jemput"
                  : `Menuju ${trip.dest.name}`}
              </span>
              <span className="text-lime">
                {trip.phase === "arriving"
                  ? `${Math.round(trip.progress * 100)}% · ${menitLabel(remainPickup)}`
                  : `${Math.round(trip.progress * 100)}% · ${menitLabel(remainTrip)}`}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas2">
              <div
                className="h-full rounded-full bg-lime transition-[width] duration-150 ease-linear"
                style={{ width: `${trip.progress * 100}%` }}
              />
            </div>
          </div>

          <a
            href={waShare}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-edge py-2.5 text-sm font-bold text-ink transition-colors hover:border-lime hover:text-lime"
          >
            <Share2 className="h-4 w-4" /> Bagikan status perjalanan
          </a>

          {trip.phase === "ongoing" && (
            <p className="mt-2 text-center text-[11px] text-mute">
              Simulasi dipercepat untuk demo — perjalanan nyata terasa lebih lama.
            </p>
          )}
        </>
      )}

      {/* Fase: selesai */}
      {trip.phase === "completed" && (
        <>
          <div className="mt-4 rounded-xl border border-edge bg-canvas2 p-3.5 text-sm">
            <Row
              label={`${trip.service.name} · ${kmLabel(trip.km)}`}
              value={rupiah(trip.fare)}
            />
            {trip.discount > 0 && (
              <Row
                label={`Promo ${VOUCHER.code}`}
                value={`−${rupiah(trip.discount)}`}
                accent
              />
            )}
            <Row
              label="Metode bayar"
              value={trip.payment === "wallet" ? "Dompet Jemputa" : "Tunai"}
            />
            <div className="mt-2 flex items-center justify-between border-t border-edge pt-2 text-sm font-extrabold">
              <span>Total dibayar</span>
              <span className="text-lime">{rupiah(trip.total)}</span>
            </div>
          </div>

          {!rated ? (
            <div className="mt-4">
              <p className="text-sm font-bold text-ink">
                Beri rating untuk {trip.driver.name.split(" ")[0]}:
              </p>
              <RatingBox
                onSubmit={(stars, tags) => {
                  onRate(trip.id, stars, tags);
                  setRated(true);
                }}
              />
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-lime-soft px-3.5 py-2.5 text-sm font-bold text-lime">
              Rating terkirim — terima kasih!
            </p>
          )}

          <button
            onClick={onClear}
            className="mt-4 w-full rounded-xl bg-lime py-3 text-sm font-extrabold text-lime-ink transition-colors hover:bg-lime-deep"
          >
            Pesan perjalanan lagi
          </button>
        </>
      )}
    </motion.div>
  );
}

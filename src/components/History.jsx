import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, Navigation, Star, Wallet } from "lucide-react";
import RatingBox, { Stars } from "./RatingBox";
import { dayLabel, fmtTime, kmLabel, rupiah } from "../utils/format";

const FILTERS = [
  { id: "semua", label: "Semua" },
  { id: "selesai", label: "Selesai" },
  { id: "dibatalkan", label: "Dibatalkan" },
];

function TripCard({ t, onRate, rateId, setRateId }) {
  const canRate = t.status === "selesai" && !t.rating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-edge bg-card p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-mute">
            {dayLabel(t.ts)} · {fmtTime(t.ts)}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                t.status === "selesai"
                  ? "bg-lime-soft text-lime"
                  : "bg-card2 text-mute"
              }`}
            >
              {t.status === "selesai" ? "Selesai" : "Dibatalkan"}
            </span>
            <span className="text-[11px] font-semibold text-mute">{t.serviceName}</span>
          </div>
        </div>
        <p
          className={`text-sm font-extrabold ${
            t.status === "dibatalkan" ? "text-mute line-through" : "text-ink"
          }`}
        >
          {rupiah(t.total)}
        </p>
      </div>

      {/* Rute */}
      <div className="mt-3 flex items-stretch gap-2.5">
        <div className="flex flex-col items-center pt-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-lime" />
          <span className="my-0.5 min-h-3 w-px flex-1 border-l border-dashed border-edge" />
          <span className="h-2 w-2 shrink-0 rotate-45 bg-ink" />
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-sm font-bold text-ink">{t.pickupName}</p>
          <p className="text-sm font-bold text-ink">{t.destName}</p>
        </div>
      </div>

      {/* Chip info */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-canvas2 px-2.5 py-1 text-mute">{kmLabel(t.km)}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-canvas2 px-2.5 py-1 text-mute">
          {t.payment === "Tunai" ? (
            <Banknote className="h-3 w-3" />
          ) : (
            <Wallet className="h-3 w-3" />
          )}
          {t.payment}
        </span>
        {t.discount > 0 && (
          <span className="rounded-full bg-lime-soft px-2.5 py-1 font-bold text-lime">
            Promo −{rupiah(t.discount)}
          </span>
        )}
      </div>

      {/* Pengemudi + rating */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-edge pt-3">
        <div className="flex items-center gap-2.5">
          <img
            src={t.driverPhoto}
            alt={t.driverName}
            loading="lazy"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div>
            <p className="text-xs font-bold text-ink">
              {t.driverName} · <span className="font-mono">{t.driverPlate}</span>
            </p>
            <p className="flex items-center gap-1 text-[11px] text-mute">
              <Star className="h-3 w-3 fill-gold text-gold" />
              {t.driverRating.toFixed(1)} oleh Jemputa
            </p>
          </div>
        </div>
        {t.status === "selesai" &&
          (t.rating ? (
            <div className="flex flex-wrap items-center gap-2">
              <Stars value={t.rating} size="h-3.5 w-3.5" />
              {t.tags?.length > 0 && (
                <span className="text-[11px] text-mute">{t.tags.join(", ")}</span>
              )}
            </div>
          ) : (
            <button
              onClick={() => setRateId(rateId === t.id ? null : t.id)}
              className="rounded-lg bg-lime px-3 py-1.5 text-xs font-extrabold text-lime-ink transition-colors hover:bg-lime-deep"
            >
              Beri rating
            </button>
          ))}
        {t.status === "dibatalkan" && (
          <span className="text-xs font-semibold text-mute">Tanpa biaya</span>
        )}
      </div>

      {canRate && rateId === t.id && (
        <div className="mt-3">
          <RatingBox
            onSubmit={(stars, tags) => {
              onRate(t.id, stars, tags);
              setRateId(null);
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default function History({ trips, onRate, onBook }) {
  const [filter, setFilter] = useState("semua");
  const [rateId, setRateId] = useState(null);

  const list = trips.filter((t) => filter === "semua" || t.status === filter);
  const done = trips.filter((t) => t.status === "selesai");
  const totalSpend = done.reduce((s, t) => s + t.total, 0);
  const ratedTrips = done.filter((t) => t.rating);
  const avgRating = ratedTrips.length
    ? (ratedTrips.reduce((s, t) => s + t.rating, 0) / ratedTrips.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">Riwayat Perjalanan</h1>
        <p className="mt-1 text-sm text-mute">
          Semua perjalanan tersimpan di perangkatmu (localStorage).
        </p>
      </div>

      {/* Stat ringkas */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="rounded-xl border border-edge bg-card px-3 py-2.5">
          <p className="text-[11px] font-medium text-mute">Perjalanan selesai</p>
          <p className="mt-0.5 text-sm font-extrabold text-ink sm:text-base">{done.length}</p>
        </div>
        <div className="rounded-xl border border-edge bg-card px-3 py-2.5">
          <p className="text-[11px] font-medium text-mute">Total belanja</p>
          <p className="mt-0.5 text-sm font-extrabold text-ink sm:text-base">
            {rupiah(totalSpend)}
          </p>
        </div>
        <div className="rounded-xl border border-edge bg-card px-3 py-2.5">
          <p className="text-[11px] font-medium text-mute">Rating rata-rata</p>
          <p className="mt-0.5 flex items-center gap-1 text-sm font-extrabold text-ink sm:text-base">
            {avgRating}
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === f.id
                ? "border-lime bg-lime text-lime-ink"
                : "border-edge text-mute hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Daftar */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-edge py-12 text-center">
          <Navigation className="h-8 w-8 text-mute" />
          <p className="text-sm font-semibold text-mute">Belum ada perjalanan di sini.</p>
          <button
            onClick={onBook}
            className="rounded-xl bg-lime px-5 py-2.5 text-sm font-extrabold text-lime-ink transition-colors hover:bg-lime-deep"
          >
            Pesan sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <TripCard
              key={t.id}
              t={t}
              onRate={onRate}
              rateId={rateId}
              setRateId={setRateId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

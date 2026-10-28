import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Banknote,
  Bike,
  Car,
  Check,
  Crown,
  Info,
  TicketPercent,
  Wallet,
} from "lucide-react";
import MapSvg from "./MapSvg";
import LocationPicker from "./LocationPicker";
import TripStatus from "./TripStatus";
import { DRIVERS, LOCATIONS, SERVICES, VOUCHER } from "../data/seed";
import {
  buildRoute,
  calcDiscount,
  calcFare,
  etaPickupMin,
  etaTripMin,
  manhattanKm,
  pointAlong,
} from "../utils/geo";
import { kmLabel, menitLabel, rupiah } from "../utils/format";

const SERVICE_ICONS = { moto: Bike, car: Car, prio: Crown };

function pickDriver(serviceId) {
  const pool = DRIVERS.filter((d) => d.serviceId === serviceId);
  return pool[Math.floor(Math.random() * pool.length)];
}

function StatCard({ label, value, onClick }) {
  const cls = `rounded-xl border border-edge bg-card px-3 py-2.5 text-left ${
    onClick ? "transition-colors hover:border-lime" : ""
  }`;
  return onClick ? (
    <button onClick={onClick} className={cls}>
      <StatInner label={label} value={value} />
    </button>
  ) : (
    <div className={cls}>
      <StatInner label={label} value={value} />
    </div>
  );
}

function StatInner({ label, value }) {
  return (
    <>
      <p className="text-[11px] font-medium text-mute">{label}</p>
      <p className="mt-0.5 truncate text-sm font-extrabold text-ink sm:text-base">
        {value}
      </p>
    </>
  );
}

export default function Booking({
  trip,
  onStart,
  onCancel,
  onClear,
  onRate,
  wallet,
  trips,
  onGoWallet,
}) {
  const [pickupId, setPickupId] = useState("alka");
  const [destId, setDestId] = useState(null);
  const [serviceId, setServiceId] = useState("moto");
  const [usePromo, setUsePromo] = useState(false);
  const [payment, setPayment] = useState("wallet");

  const pickup = LOCATIONS.find((l) => l.id === pickupId);
  const dest = LOCATIONS.find((l) => l.id === destId) ?? null;
  const service = SERVICES.find((s) => s.id === serviceId);

  const samePoint = !!dest && dest.id === pickup.id;
  const km = dest && !samePoint ? manhattanKm(pickup, dest) : 0;
  const fare = dest && !samePoint ? calcFare(service, km) : 0;
  const discount = dest && !samePoint && usePromo ? calcDiscount(fare, VOUCHER) : 0;
  const total = Math.max(0, fare - discount);
  const etaPickup = dest && !samePoint ? etaPickupMin(service, pickup, dest) : 0;
  const etaTrip = dest && !samePoint ? etaTripMin(km, service) : 0;
  const insufficient = payment === "wallet" && total > wallet.balance;

  const route = useMemo(
    () => (dest && !samePoint ? buildRoute(pickup, dest) : null),
    [pickup, dest, samePoint]
  );

  // Posisi pengemudi di peta sesuai fase perjalanan aktif.
  let driverPos = null;
  if (trip) {
    if (trip.phase === "arriving") driverPos = pointAlong(trip.driverRoute, trip.progress);
    else if (trip.phase === "ongoing") driverPos = pointAlong(trip.route, trip.progress);
    else if (trip.phase === "completed") driverPos = { x: trip.dest.x, y: trip.dest.y };
  }

  const swap = () => {
    if (!dest) return;
    setPickupId(destId);
    setDestId(pickupId);
  };

  const start = () => {
    if (!dest || samePoint) return;
    const origin = {
      x: Math.min(114, Math.max(6, pickup.x - 20)),
      y: Math.min(84, Math.max(6, pickup.y + 14)),
    };
    onStart({
      id: `t-${Date.now()}`,
      pickup,
      dest,
      service,
      km,
      fare,
      discount,
      total,
      payment, // "wallet" | "cash"
      route: buildRoute(pickup, dest),
      driverRoute: buildRoute(origin, pickup),
      rideMs: Math.min(14000, Math.max(7000, km * 1300)),
      etaPickup,
      etaTrip,
      driver: pickDriver(service.id),
    });
  };

  const mapPhase = trip
    ? trip.phase
    : dest && !samePoint
      ? "draft"
      : "idle";

  return (
    <div className="space-y-5">
      {/* Stat ringkas */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <StatCard label="Saldo Dompet" value={rupiah(wallet.balance)} onClick={onGoWallet} />
        <StatCard
          label="Perjalanan Selesai"
          value={String(trips.filter((t) => t.status === "selesai").length)}
        />
        <StatCard
          label="Hemat dari Promo"
          value={rupiah(trips.reduce((s, t) => s + (t.discount ?? 0), 0))}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Peta */}
        <MapSvg
          pickup={trip ? trip.pickup : pickup}
          dest={trip ? trip.dest : dest}
          route={trip ? trip.route : route}
          driverRoute={trip?.driverRoute}
          driverPos={driverPos}
          phase={mapPhase}
          driverIcon={trip ? SERVICE_ICONS[trip.service.id] : null}
        />

        {/* Panel kanan: status perjalanan ATAU form pemesanan */}
        {trip ? (
          <TripStatus trip={trip} onCancel={onCancel} onClear={onClear} onRate={onRate} />
        ) : (
          <div className="rounded-2xl border border-edge bg-card p-4 sm:p-5">
            <h1 className="text-lg font-extrabold text-ink sm:text-xl">
              Mau ke mana hari ini?
            </h1>
            <p className="mt-1 text-sm text-mute">
              Pilih titik jemput &amp; tujuan — tarif dihitung otomatis dari jarak rute.
            </p>

            {/* Pemilih lokasi */}
            <div className="mt-4 space-y-2">
              <LocationPicker
                label="Titik jemput"
                value={pickup}
                onSelect={setPickupId}
                excludeId={destId}
              />
              <div className="flex justify-center">
                <button
                  onClick={swap}
                  title="Tukar jemput &amp; tujuan"
                  className="rounded-full border border-edge bg-canvas2 p-2 text-mute transition-colors hover:border-lime hover:text-lime"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </div>
              <LocationPicker
                label="Tujuan"
                value={dest}
                onSelect={setDestId}
                excludeId={pickupId}
              />
            </div>

            {/* Pilihan layanan */}
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-mute">
              Pilih layanan
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {SERVICES.map((s) => {
                const Icon = SERVICE_ICONS[s.id];
                const active = s.id === serviceId;
                const price = dest && !samePoint ? calcFare(s, km) : null;
                return (
                  <button
                    key={s.id}
                    onClick={() => setServiceId(s.id)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      active ? "border-lime bg-lime-soft/40" : "border-edge hover:border-mute"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`h-5 w-5 ${active ? "text-lime" : "text-mute"}`} />
                      <span className="text-[10px] font-bold text-mute">
                        {s.seats} kursi
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-extrabold text-ink">{s.name}</p>
                    <p className="text-[11px] leading-snug text-mute">{s.tagline}</p>
                    {price != null && (
                      <>
                        <p
                          className={`mt-1.5 text-sm font-extrabold ${active ? "text-lime" : "text-ink"}`}
                        >
                          {rupiah(price)}
                        </p>
                        <p className="text-[10px] text-mute">
                          jemput {menitLabel(etaPickupMin(s, pickup, dest))}
                        </p>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Ringkasan tarif */}
            {dest && !samePoint && (
              <div className="mt-4 space-y-2 rounded-xl border border-edge bg-canvas2 p-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-mute">Jarak rute</span>
                  <span className="font-bold text-ink">{kmLabel(km)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-mute">Estimasi</span>
                  <span className="font-bold text-ink">
                    jemput {menitLabel(etaPickup)} · tiba {menitLabel(etaPickup + etaTrip)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-mute">Tarif {service.name}</span>
                  <span className="font-bold text-ink">{rupiah(fare)}</span>
                </div>

                {/* Voucher promo */}
                <button
                  onClick={() => setUsePromo(!usePromo)}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-lime/50 bg-lime-soft/20 px-3 py-2 text-left"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      usePromo ? "border-lime bg-lime text-lime-ink" : "border-mute"
                    }`}
                  >
                    {usePromo && <Check className="h-3 w-3" />}
                  </span>
                  <TicketPercent className="h-4 w-4 shrink-0 text-lime" />
                  <span className="flex-1 text-xs font-semibold text-ink">
                    Pakai voucher {VOUCHER.code}{" "}
                    <span className="font-normal text-mute">— 20% maks Rp15.000</span>
                  </span>
                </button>
                {usePromo && discount === 0 && (
                  <p className="text-[11px] text-mute">
                    Tarif belum mencapai minimal {rupiah(VOUCHER.minSpend)} — voucher belum
                    aktif.
                  </p>
                )}
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-mute">Promo {VOUCHER.code}</span>
                    <span className="font-bold text-lime">−{rupiah(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-edge pt-2 font-extrabold text-ink">
                  <span>Total</span>
                  <span className="text-lime">{rupiah(total)}</span>
                </div>
              </div>
            )}

            {/* Metode bayar */}
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-mute">
              Metode bayar
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPayment("wallet")}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  payment === "wallet" ? "border-lime bg-lime-soft/40" : "border-edge hover:border-mute"
                }`}
              >
                <Wallet className="h-4 w-4 text-lime" />
                <p className="mt-1 text-sm font-bold text-ink">Dompet Jemputa</p>
                <p
                  className={`text-xs ${total > wallet.balance ? "font-bold text-danger" : "text-mute"}`}
                >
                  {rupiah(wallet.balance)}
                </p>
              </button>
              <button
                onClick={() => setPayment("cash")}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  payment === "cash" ? "border-lime bg-lime-soft/40" : "border-edge hover:border-mute"
                }`}
              >
                <Banknote className="h-4 w-4 text-lime" />
                <p className="mt-1 text-sm font-bold text-ink">Tunai</p>
                <p className="text-xs text-mute">Bayar ke pengemudi</p>
              </button>
            </div>

            {/* CTA */}
            <button
              onClick={!dest || samePoint ? undefined : insufficient ? onGoWallet : start}
              disabled={!dest || samePoint}
              className={`mt-4 w-full rounded-xl py-3.5 text-sm font-extrabold transition-colors ${
                !dest || samePoint
                  ? "cursor-not-allowed bg-card2 text-mute"
                  : insufficient
                    ? "bg-danger-soft text-danger hover:ring-1 hover:ring-danger"
                    : "bg-lime text-lime-ink hover:bg-lime-deep"
              }`}
            >
              {!dest
                ? "Pilih titik tujuan dulu"
                : samePoint
                  ? "Titik jemput & tujuan sama"
                  : insufficient
                    ? `Saldo kurang ${rupiah(total - wallet.balance)} — isi dompet`
                    : `Pesan ${service.name} — ${rupiah(total)}`}
            </button>
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-mute">
              <Info className="h-3 w-3 shrink-0" />
              Simulasi demo — pengemudi, tarif, dan perjalanan bersifat fiktif.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { LOCATIONS } from "../data/seed";

const PX = (v, max) => `${(v / max) * 100}%`;

// Blok kota dekoratif (koordinat viewBox 120 x 90, fiktif).
const BLOCKS = [
  { x: 12, y: 4, w: 12, h: 14 },
  { x: 42, y: 4, w: 14, h: 14 },
  { x: 60, y: 4, w: 10, h: 14 },
  { x: 90, y: 4, w: 12, h: 14 },
  { x: 12, y: 24, w: 12, h: 8 },
  { x: 28, y: 24, w: 10, h: 8 },
  { x: 42, y: 24, w: 14, h: 8 },
  { x: 60, y: 24, w: 10, h: 8 },
  { x: 90, y: 24, w: 12, h: 8 },
  { x: 12, y: 36, w: 12, h: 12 },
  { x: 28, y: 36, w: 10, h: 12 },
  { x: 42, y: 36, w: 14, h: 12 },
  { x: 60, y: 36, w: 10, h: 12 },
  { x: 74, y: 36, w: 12, h: 12 },
  { x: 90, y: 36, w: 12, h: 12 },
  { x: 12, y: 52, w: 12, h: 8 },
  { x: 28, y: 52, w: 10, h: 8 },
  { x: 42, y: 52, w: 14, h: 8 },
  { x: 60, y: 52, w: 10, h: 8 },
  { x: 74, y: 52, w: 12, h: 8 },
  { x: 90, y: 52, w: 12, h: 8 },
  { x: 12, y: 64, w: 12, h: 8 },
  { x: 28, y: 64, w: 10, h: 8 },
  { x: 60, y: 64, w: 10, h: 8 },
  { x: 74, y: 64, w: 12, h: 8 },
  { x: 90, y: 64, w: 12, h: 8 },
];

const pathD = (r) =>
  r.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

function Marker({ x, y, smooth, children }) {
  return (
    <div
      className={`pointer-events-none absolute z-10 ${
        smooth ? "transition-[left,top] duration-150 ease-linear" : ""
      }`}
      style={{ left: PX(x, 120), top: PX(y, 90), transform: "translate(-50%, -50%)" }}
    >
      {children}
    </div>
  );
}

// Peta SVG buatan sendiri: blok kota, jalan, sungai, taman + rute & marker.
// Bukan peta nyata — murni ilustrasi dengan koordinat mock.
export default function MapSvg({
  pickup,
  dest,
  route,
  driverRoute,
  driverPos,
  phase,
  driverIcon: DriverIcon,
}) {
  const badge =
    phase === "matching"
      ? "Mencari pengemudi…"
      : phase === "arriving"
        ? "Pengemudi datang"
        : phase === "ongoing"
          ? "Berjalan"
          : phase === "completed"
            ? "Selesai"
            : null;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-edge bg-canvas2 sm:aspect-[16/10]">
      <svg
        viewBox="0 0 120 90"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        {/* taman */}
        <rect x="42" y="62" width="14" height="10" rx="1.5" className="fill-lime-soft opacity-70" />
        <rect x="74" y="4" width="12" height="14" rx="1.5" className="fill-lime-soft opacity-40" />

        {/* blok kota */}
        {BLOCKS.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="1.2"
            className={i % 4 === 0 ? "fill-card" : "fill-card2"}
          />
        ))}

        {/* sungai */}
        <path
          d="M0 84 C 18 78, 30 88, 50 82 C 70 76, 84 88, 104 80 C 110 77.5, 116 78, 120 80"
          fill="none"
          className="stroke-river"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* jalan minor */}
        {[10, 40, 72, 104].map((x) => (
          <line key={`vx${x}`} x1={x} y1="0" x2={x} y2="90" className="stroke-road" strokeWidth="1.6" />
        ))}
        {[34, 62].map((y) => (
          <line key={`hy${y}`} x1="0" y1={y} x2="120" y2={y} className="stroke-road" strokeWidth="1.6" />
        ))}

        {/* jalan utama */}
        {[26, 58, 88].map((x) => (
          <line key={`mvx${x}`} x1={x} y1="0" x2={x} y2="90" className="stroke-road" strokeWidth="3" />
        ))}
        {[22, 50, 74].map((y) => (
          <line key={`mhy${y}`} x1="0" y1={y} x2="120" y2={y} className="stroke-road" strokeWidth="3" />
        ))}

        {/* marka jalan utama */}
        {[26, 58, 88].map((x) => (
          <line key={`dvx${x}`} x1={x} y1="0" x2={x} y2="90" className="stroke-edge" strokeWidth="0.45" strokeDasharray="2 3" />
        ))}
        {[22, 50, 74].map((y) => (
          <line key={`dhy${y}`} x1="0" y1={y} x2="120" y2={y} className="stroke-edge" strokeWidth="0.45" strokeDasharray="2 3" />
        ))}

        {/* titik lokasi lain */}
        {LOCATIONS.map((l) => (
          <circle key={l.id} cx={l.x} cy={l.y} r="0.9" className="fill-mute opacity-40" />
        ))}

        {/* jalur pengemudi menuju titik jemput */}
        {driverRoute && phase === "arriving" && (
          <path
            d={pathD(driverRoute)}
            fill="none"
            className="stroke-sky"
            strokeWidth="1"
            strokeDasharray="1.6 1.6"
            opacity="0.7"
          />
        )}

        {/* rute perjalanan (glow + garis berjalan) */}
        {route && (phase === "draft" || phase === "ongoing" || phase === "completed") && (
          <>
            <path
              d={pathD(route)}
              fill="none"
              className="stroke-lime opacity-25"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d={pathD(route)}
              fill="none"
              className="stroke-lime route-dash"
              strokeWidth="1.3"
              strokeDasharray="2.6 2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      {/* Marker titik jemput */}
      {pickup && (
        <Marker x={pickup.x} y={pickup.y}>
          <div className="flex flex-col items-center">
            <span className="mb-1 whitespace-nowrap rounded-md border border-edge bg-canvas/90 px-1.5 py-0.5 text-[10px] font-bold text-ink shadow-lg shadow-black/40">
              {pickup.name}
            </span>
            <span className="h-3.5 w-3.5 rounded-full border-2 border-canvas bg-lime shadow" />
          </div>
        </Marker>
      )}

      {/* Marker tujuan */}
      {dest && (
        <Marker x={dest.x} y={dest.y}>
          <div className="flex flex-col items-center">
            <span className="mb-1 whitespace-nowrap rounded-md border border-edge bg-canvas/90 px-1.5 py-0.5 text-[10px] font-bold text-ink shadow-lg shadow-black/40">
              {dest.name}
            </span>
            <span className="h-3.5 w-3.5 rotate-45 border-2 border-canvas bg-ink shadow" />
          </div>
        </Marker>
      )}

      {/* Radar "mencari pengemudi" */}
      {phase === "matching" && pickup && (
        <Marker x={pickup.x} y={pickup.y}>
          <span className="relative flex h-4 w-4">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full border-2 border-lime"
              animate={{ scale: [0.6, 2.6], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full border-2 border-lime"
              animate={{ scale: [0.6, 2.6], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
            />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-lime" />
          </span>
        </Marker>
      )}

      {/* Marker pengemudi bergerak */}
      {driverPos && DriverIcon && (
        <Marker x={driverPos.x} y={driverPos.y} smooth>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime shadow-lg shadow-lime/30 ring-2 ring-canvas">
            <DriverIcon className="h-4 w-4 text-lime-ink" />
          </div>
        </Marker>
      )}

      {/* Legenda / status */}
      <div className="absolute bottom-2 left-2 rounded-md bg-canvas/85 px-2 py-1 text-[10px] font-medium text-mute backdrop-blur">
        Peta ilustrasi — koordinat fiktif, bukan peta nyata
      </div>
      {badge && (
        <div className="absolute right-2 top-2 rounded-md bg-lime-soft px-2 py-1 text-[10px] font-bold text-lime">
          {badge}
        </div>
      )}
    </div>
  );
}

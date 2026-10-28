import { History, MessageCircle, Navigation, Wallet } from "lucide-react";
import { WA_LINK } from "../data/seed";
import { rupiah } from "../utils/format";

const NAV = [
  { id: "pesan", label: "Pesan", icon: Navigation },
  { id: "riwayat", label: "Riwayat", icon: History },
  { id: "dompet", label: "Dompet", icon: Wallet },
];

export default function Navbar({ view, onNavigate, balance, tripActive }) {
  return (
    <>
      {/* Bar atas */}
      <header className="sticky top-0 z-30 border-b border-edge bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
          <button
            onClick={() => onNavigate("pesan")}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime">
              <Navigation className="h-5 w-5 text-lime-ink" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-ink">
              Jemputa<span className="text-lime">.</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            {tripActive && view !== "pesan" && (
              <button
                onClick={() => onNavigate("pesan")}
                className="hidden items-center gap-1.5 rounded-full bg-lime-soft px-3 py-1.5 text-xs font-bold text-lime sm:inline-flex"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                Perjalanan aktif
              </button>
            )}
            <nav className="hidden items-center gap-1 rounded-full bg-card p-1 sm:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onNavigate(n.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    view === n.id
                      ? "bg-lime text-lime-ink shadow-sm"
                      : "text-mute hover:text-ink"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </nav>
            <button
              onClick={() => onNavigate("dompet")}
              className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-card px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-lime"
              title="Saldo dompet"
            >
              <Wallet className="h-3.5 w-3.5 text-lime" />
              {rupiah(balance)}
            </button>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-edge bg-card px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-lime hover:text-lime lg:inline-flex"
            >
              <MessageCircle className="h-4 w-4 text-lime" />
              62812-3456-7890
            </a>
          </div>
        </div>
      </header>

      {/* Tab bawah mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-edge bg-canvas/95 backdrop-blur sm:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onNavigate(n.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold ${
              view === n.id ? "text-lime" : "text-mute"
            }`}
          >
            <n.icon className="h-5 w-5" />
            {n.label}
          </button>
        ))}
      </nav>
    </>
  );
}

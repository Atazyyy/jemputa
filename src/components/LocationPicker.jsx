import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MapPin, Search, SearchX } from "lucide-react";
import { LOCATIONS } from "../data/seed";

// Dropdown pemilih lokasi dengan pencarian.
export default function LocationPicker({ label, value, onSelect, excludeId }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const list = LOCATIONS.filter(
    (l) =>
      l.id !== excludeId &&
      `${l.name} ${l.type}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          setQ("");
        }}
        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
          open ? "border-lime bg-lime-soft/20" : "border-edge bg-canvas2 hover:border-mute"
        }`}
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            label === "Tujuan" ? "bg-ink" : "bg-lime"
          }`}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-mute">
            {label}
          </span>
          <span className="block truncate text-sm font-bold text-ink">
            {value ? value.name : "Pilih lokasi…"}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-mute transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
              aria-label="Tutup pilihan lokasi"
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute inset-x-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-edge bg-card shadow-2xl shadow-black/50"
            >
              <div className="flex items-center gap-2 border-b border-edge px-3">
                <Search className="h-4 w-4 shrink-0 text-mute" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari lokasi…"
                  className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-mute"
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-1.5">
                {list.length === 0 && (
                  <p className="flex items-center gap-2 px-3 py-4 text-sm text-mute">
                    <SearchX className="h-4 w-4" /> Lokasi tidak ditemukan.
                  </p>
                )}
                {list.map((l) => {
                  const active = value?.id === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        onSelect(l.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-canvas2 ${
                        active ? "bg-lime-soft/40" : ""
                      }`}
                    >
                      <MapPin
                        className={`h-4 w-4 shrink-0 ${active ? "text-lime" : "text-mute"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {l.name}
                        </span>
                        <span className="block text-[11px] text-mute">{l.type}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

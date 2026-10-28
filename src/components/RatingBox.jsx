import { useState } from "react";
import { Star } from "lucide-react";
import { RATING_TAGS } from "../data/seed";

// Deret bintang — mode tampil (read-only) atau pilih (onPick).
export function Stars({ value, size = "h-5 w-5", onPick }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onPick}
          onClick={() => onPick?.(n)}
          className={onPick ? "transition-transform hover:scale-110" : "cursor-default"}
          aria-label={`${n} bintang`}
        >
          <Star
            className={`${size} ${n <= value ? "fill-gold text-gold" : "text-mute opacity-50"}`}
          />
        </button>
      ))}
    </div>
  );
}

// Form rating: bintang + tag cepat + kirim.
export default function RatingBox({ onSubmit }) {
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState([]);

  const toggle = (t) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="mt-2 rounded-xl border border-edge bg-canvas2 p-3.5">
      <Stars value={stars} onPick={setStars} />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {RATING_TAGS.map((t) => (
          <button
            key={t}
            onClick={() => toggle(t)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
              tags.includes(t)
                ? "border-lime bg-lime-soft text-lime"
                : "border-edge text-mute hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <button
        disabled={stars === 0}
        onClick={() => onSubmit(stars, tags)}
        className="mt-3 w-full rounded-lg bg-lime py-2 text-sm font-extrabold text-lime-ink transition-colors hover:bg-lime-deep disabled:bg-card2 disabled:text-mute"
      >
        {stars > 0 ? `Kirim ${stars} bintang` : "Pilih bintang dulu"}
      </button>
    </div>
  );
}

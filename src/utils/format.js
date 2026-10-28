// Util format angka & tanggal ala Indonesia.

export const rupiah = (n) => `Rp${(n ?? 0).toLocaleString("id-ID")}`;

export const kmLabel = (km) => `${km.toFixed(1).replace(".", ",")} km`;

export const menitLabel = (m) => `±${m} mnt`;

export const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDateTime = (ts) => `${fmtDate(ts)}, ${fmtTime(ts)}`;

// Label hari relatif: Hari ini / Kemarin / x hari lalu / tanggal
export const dayLabel = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const startOf = (x) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(now) - startOf(d)) / 86400000);
  if (diff <= 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  if (diff < 7) return `${diff} hari lalu`;
  return fmtDate(ts);
};

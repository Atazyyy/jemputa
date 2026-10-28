// Util geometri peta mock — jarak dihitung dari koordinat ilustrasi (Manhattan,
// menyerupai jalan perkotaan), bukan peta nyata.

export const KM_PER_UNIT = 0.14;

export const unitDist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const manhattanKm = (a, b) =>
  Math.round(unitDist(a, b) * KM_PER_UNIT * 10) / 10;

// Rute berbentuk "L" (belok sekali) — menyerupai jalan grid perkotaan.
export function buildRoute(a, b) {
  const mid =
    Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)
      ? { x: b.x, y: a.y }
      : { x: a.x, y: b.y };
  return [
    { x: a.x, y: a.y },
    mid,
    { x: b.x, y: b.y },
  ];
}

export function routeLength(route) {
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    total +=
      Math.abs(route[i].x - route[i - 1].x) +
      Math.abs(route[i].y - route[i - 1].y);
  }
  return total;
}

// Titik pada proporsi t (0..1) di sepanjang rute.
export function pointAlong(route, t) {
  const total = routeLength(route);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < route.length; i++) {
    const prev = route[i - 1];
    const cur = route[i];
    const seg = Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y);
    if (d <= seg || i === route.length - 1) {
      const r = seg === 0 ? 0 : d / seg;
      return {
        x: prev.x + (cur.x - prev.x) * r,
        y: prev.y + (cur.y - prev.y) * r,
      };
    }
    d -= seg;
  }
  return route[route.length - 1];
}

export const ceilFare = (n) => Math.ceil(n / 500) * 500;
export const floorFare = (n) => Math.floor(n / 500) * 500;

// Tarif = tarif per km × jarak, dibulatkan ke 500, minimal tarif dasar layanan.
export function calcFare(service, km) {
  return Math.max(service.minFare, ceilFare(service.perKm * km));
}

// Potongan voucher: 20% (dibulatkan ke bawah ke 500), dibatasi maksimum,
// berlaku bila tarif mencapai minimal belanja.
export function calcDiscount(fare, voucher) {
  if (!voucher || fare < voucher.minSpend) return 0;
  return Math.min(voucher.maxDisc, floorFare((fare * voucher.percent) / 100));
}

// Estimasi menit pengemudi menuju titik jemput (basis layanan + jitter
// deterministik dari pasangan lokasi agar tiap rasa rute sedikit berbeda).
export function etaPickupMin(service, a, b) {
  const h = `${a?.id ?? ""}${b?.id ?? ""}`
    .split("")
    .reduce((s, c) => s + c.charCodeAt(0), 0);
  return service.waitMin + (h % 3);
}

// Estimasi menit perjalanan = jarak × kecepatan efektif layanan.
export const etaTripMin = (km, service) =>
  Math.max(4, Math.round(km * service.minPerKm));

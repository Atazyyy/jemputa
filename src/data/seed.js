// Data seed & konfigurasi demo Jemputa.
// Seluruh nama lokasi, pengemudi, plat, dan angka bersifat FIKTIF.

import { manhattanKm, calcFare } from "../utils/geo";

export const WA_NUMBER = "6281234567890";

export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Halo Jemputa! Saya mau tanya layanan transportasi."
)}`;

const avatar = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=160&h=160&q=70`;

// Titik lokasi di peta ilustrasi (viewBox 120 x 90, koordinat fiktif).
export const LOCATIONS = [
  { id: "alka", name: "Alun-Alun Kirana", type: "Landmark", x: 58, y: 50 },
  { id: "kopn", name: "Kopi Nara Pojok", type: "Kafe", x: 55, y: 45 },
  { id: "stnt", name: "Stasiun Naga Timur", type: "Stasiun", x: 34, y: 40 },
  { id: "gran", name: "Mall Granit City", type: "Mal", x: 72, y: 34 },
  { id: "sury", name: "Bandara Suryalaya", type: "Bandara", x: 104, y: 74 },
  { id: "andr", name: "Kampus Andira Teknologi", type: "Kampus", x: 88, y: 22 },
  { id: "medi", name: "RS Medika Pratama", type: "Rumah Sakit", x: 46, y: 68 },
  { id: "lego", name: "Pasar Baru Legok", type: "Pasar", x: 26, y: 62 },
  { id: "gria", name: "Griya Asri Blok C", type: "Perumahan", x: 16, y: 30 },
  { id: "cibe", name: "Hutan Kota Cibeles", type: "Taman", x: 40, y: 16 },
  { id: "maleb", name: "Kawasan Industri Maleber", type: "Industri", x: 96, y: 56 },
  { id: "lavd", name: "Hotel Lavenda Indah", type: "Hotel", x: 64, y: 80 },
  { id: "skyb", name: "Skyline Bistro Rooftop", type: "Restoran", x: 82, y: 64 },
  { id: "smkc", name: "SMK Cendekia Utama", type: "Sekolah", x: 63, y: 58 },
];

// Layanan: tarif per km berbeda, begitu pula kecepatan & waktu tunggu.
export const SERVICES = [
  {
    id: "moto",
    name: "JempuMoto",
    vehicle: "Sepeda motor",
    seats: 1,
    perKm: 2000,
    minFare: 10000,
    waitMin: 3,
    minPerKm: 2.3,
    tagline: "Lincah lewat macet, paling hemat",
  },
  {
    id: "car",
    name: "JempuCar",
    vehicle: "Mobil 4 kursi",
    seats: 4,
    perKm: 3500,
    minFare: 20000,
    waitMin: 6,
    minPerKm: 3.2,
    tagline: "Ber-AC, pas untuk keluarga",
  },
  {
    id: "prio",
    name: "Jempu Priority",
    vehicle: "Mobil premium",
    seats: 4,
    perKm: 5500,
    minFare: 35000,
    waitMin: 4,
    minPerKm: 2.9,
    tagline: "Pengemudi rating tertinggi, tanpa antre",
  },
];

// Satu voucher promo — bisa diaktifkan di form pemesanan.
export const VOUCHER = {
  code: "JEMPUHEMAT",
  label: "Promo Hemat Jempu",
  percent: 20,
  maxDisc: 15000,
  minSpend: 15000,
  desc: "Potongan 20% maksimum Rp15.000 per perjalanan (tarif minimal Rp15.000).",
  image:
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&h=420&q=70",
};

// Armada pengemudi fiktif (foto dari Unsplash, nama & plat rekaan).
export const DRIVERS = [
  {
    id: "d1",
    name: "Budi Santosa",
    serviceId: "moto",
    plate: "D 4211 KX",
    rating: 4.9,
    trips: 3128,
    vehicle: "Motor matic hitam",
    photo: avatar("1560250097-0b93528c311a"),
  },
  {
    id: "d2",
    name: "Ratna Wulandari",
    serviceId: "moto",
    plate: "D 5882 QF",
    rating: 4.8,
    trips: 2410,
    vehicle: "Motor matic biru dongker",
    photo: avatar("1573496359142-b8d87734a5a2"),
  },
  {
    id: "d3",
    name: "Agus Prasetyo",
    serviceId: "car",
    plate: "D 1209 TR",
    rating: 4.9,
    trips: 4102,
    vehicle: "MPV silver",
    photo: avatar("1599566150163-29194dcaad36"),
  },
  {
    id: "d4",
    name: "Dewi Lestari",
    serviceId: "car",
    plate: "D 9834 YU",
    rating: 4.7,
    trips: 1876,
    vehicle: "Hatchback putih",
    photo: avatar("1580489944761-15a19d654956"),
  },
  {
    id: "d5",
    name: "Rizky Fadillah",
    serviceId: "car",
    plate: "D 7712 HB",
    rating: 4.8,
    trips: 3320,
    vehicle: "Sedan abu-abu",
    photo: avatar("1535713875002-d1d0cf377fde"),
  },
  {
    id: "d6",
    name: "Sari Melati",
    serviceId: "prio",
    plate: "D 5501 CW",
    rating: 5.0,
    trips: 5120,
    vehicle: "Sedan premium hitam",
    photo: avatar("1494790108377-be9c29b29330"),
  },
  {
    id: "d7",
    name: "Hendra Gunawan",
    serviceId: "prio",
    plate: "D 3028 LS",
    rating: 4.9,
    trips: 4455,
    vehicle: "SUV krem",
    photo: avatar("1472099645785-5658abf4ff4e"),
  },
  {
    id: "d8",
    name: "Yanto Ramli",
    serviceId: "moto",
    plate: "D 6617 MN",
    rating: 4.6,
    trips: 990,
    vehicle: "Motor matic merah",
    photo: avatar("1633332755192-727a05c4013d"),
  },
];

export const RATING_TAGS = [
  "Ramah",
  "Aman",
  "Cepat",
  "Kendaraan bersih",
  "Rute mantap",
];

export const TOPUP_PRESETS = [25000, 50000, 100000, 200000];

export const TOPUP_METHODS = [
  { id: "va", name: "Virtual Account", detail: "Bank Nara" },
  { id: "ewallet", name: "E-Wallet", detail: "PayLok" },
  { id: "card", name: "Kartu", detail: "Debit / Kredit" },
];

const DAY = 86400000;
const now = Date.now();

// Dompet awal: saldo + mutasi contoh.
export const SEED_WALLET = {
  balance: 66500,
  mutasi: [
    {
      id: "s3",
      ts: now - 3 * DAY,
      type: "bayar",
      label: "Jempu Priority — Alun-Alun Kirana → Bandara Suryalaya",
      amount: -54000,
    },
    {
      id: "s2",
      ts: now - 5 * DAY,
      type: "topup",
      label: "Top Up — Virtual Account Bank Nara",
      amount: 150000,
    },
    {
      id: "s1",
      ts: now - 8 * DAY,
      type: "bayar",
      label: "JempuCar — Mall Granit City → RS Medika Pratama",
      amount: -29500,
    },
  ],
};

// Riwayat perjalanan contoh (tarif konsisten dengan kalkulasi geo.js).
export const SEED_TRIPS = [
  {
    id: "seed-1",
    ts: now - 3 * DAY,
    pickupName: "Alun-Alun Kirana",
    destName: "Bandara Suryalaya",
    serviceId: "prio",
    serviceName: "Jempu Priority",
    km: manhattanKm(LOCATIONS[0], LOCATIONS[4]), // 9,8 km
    fare: calcFare(SERVICES[2], manhattanKm(LOCATIONS[0], LOCATIONS[4])),
    discount: 0,
    total: 54000,
    payment: "Dompet Jemputa",
    driverName: "Sari Melati",
    driverPlate: "D 5501 CW",
    driverPhoto: avatar("1494790108377-be9c29b29330"),
    driverRating: 5.0,
    rating: 5,
    tags: ["Ramah", "Kendaraan bersih"],
    status: "selesai",
  },
  {
    id: "seed-2",
    ts: now - 5 * DAY,
    pickupName: "Stasiun Naga Timur",
    destName: "Mall Granit City",
    serviceId: "moto",
    serviceName: "JempuMoto",
    km: manhattanKm(LOCATIONS[2], LOCATIONS[3]), // 6,2 km
    fare: calcFare(SERVICES[0], manhattanKm(LOCATIONS[2], LOCATIONS[3])),
    discount: 0,
    total: 12500,
    payment: "Tunai",
    driverName: "Budi Santosa",
    driverPlate: "D 4211 KX",
    driverPhoto: avatar("1560250097-0b93528c311a"),
    driverRating: 4.9,
    rating: 4,
    tags: ["Cepat"],
    status: "selesai",
  },
  {
    id: "seed-3",
    ts: now - 8 * DAY,
    pickupName: "Mall Granit City",
    destName: "RS Medika Pratama",
    serviceId: "car",
    serviceName: "JempuCar",
    km: manhattanKm(LOCATIONS[3], LOCATIONS[6]), // 8,4 km
    fare: calcFare(SERVICES[1], manhattanKm(LOCATIONS[3], LOCATIONS[6])),
    discount: 0,
    total: 29500,
    payment: "Dompet Jemputa",
    driverName: "Dewi Lestari",
    driverPlate: "D 9834 YU",
    driverPhoto: avatar("1580489944761-15a19d654956"),
    driverRating: 4.7,
    rating: 5,
    tags: ["Aman", "Ramah"],
    status: "selesai",
  },
];

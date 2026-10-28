Kategori: Web App — Ride-hailing/Transportasi Online

# Jemputa — Pesan Perjalanan, Dompet & Promo

> **Kategori proyek: Web App — Ride-hailing/Transportasi Online.**
> Pelanggan memesan perjalanan motor/mobil/priority dengan estimasi tarif
> otomatis, melihat pengemudi bergerak di peta, membayar dari dompet digital,
> dan memberi rating — semua dalam satu aplikasi.

Aplikasi ride-hailing fiktif "Jemputa" — dari form pemesanan sampai dompet
dan riwayat perjalanan. Proyek ini adalah **concept demo** untuk portofolio
jasa pembuatan web app — seluruh nama, lokasi, pengemudi, plat, dan angka
bersifat fiktif. Nama "Jemputa" sengaja dibuat unik (belum dipakai entitas
mana pun di internet).

**Live:** https://jemputa.vercel.app

## Fitur

- **Pesan perjalanan**: pilih titik jemput & tujuan dari 14 lokasi (dengan
  pencarian), jarak dihitung otomatis dari koordinat mock (jarak Manhattan),
  tombol tukar jemput/tujuan.
- **3 layanan dengan tarif berbeda**: JempuMoto (motor), JempuCar (mobil),
  dan Jempu Priority — tarif per km + tarif minimal masing-masing, estimasi
  harga & waktu terhitung langsung.
- **Animasi status perjalanan**: mencari pengemudi (radar) → pengemudi datang
  (nama, plat, rating, foto) → berjalan → selesai, dengan **progres rute di
  peta SVG buatan sendiri** (marker pengemudi bergerak mengikuti rute).
- **Peta ilustrasi SVG custom**: blok kota, jalan utama/minor, sungai, taman,
  dan rute beranimasi — bukan peta nyata, tanpa API peta.
- **Riwayat perjalanan** tersimpan di **localStorage**: filter status,
  statistik total belanja & rating rata-rata, dan tombol "Beri rating" untuk
  perjalanan yang belum dinilai.
- **Dompet digital**: kartu saldo, top up simulasi (3 metode + nominal preset
  & bebas), dan mutasi masuk/keluar otomatis tiap transaksi.
- **1 voucher promo** (JEMPUHEMAT — 20% maks Rp15.000): bisa disalin dari
  halaman Dompet dan diaktifkan saat memesan.
- **Rating pengemudi**: bintang 1–5 + tag cepat (Ramah, Aman, Cepat, dll.),
  tersimpan permanen di riwayat.
- Responsif desktop + mobile (tab bawah di mobile), animasi halus Framer
  Motion, ikon Lucide, tanpa backend & tanpa API eksternal.

## Untuk siapa demo ini?

Operator transportasi online, armada taksi/antar-jemput, atau shuttle kantor
yang ingin aplikasi pemesanan bertema gelap modern dengan dompet dan sistem
rating bawaan.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4 (token tema `@theme`, tema charcoal + lime)
- Framer Motion
- Lucide Icons
- Peta & marker SVG custom (tanpa library peta/chart)

## Menjalankan

```bash
npm install
npm run dev      # development
npm run build    # production build ke folder dist/
npm run preview  # preview hasil build
```

---

Dibuat oleh [Agni Miftah Fauzi](https://github.com/Atazyyy) — jasa pembuatan
website & web app.

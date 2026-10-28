import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Copy,
  CreditCard,
  Landmark,
  Smartphone,
  TicketPercent,
  Wallet as WalletIcon,
} from "lucide-react";
import { TOPUP_METHODS, TOPUP_PRESETS, VOUCHER } from "../data/seed";
import { fmtDateTime, rupiah } from "../utils/format";

const METHOD_ICONS = { va: Landmark, ewallet: Smartphone, card: CreditCard };

export default function Wallet({ wallet, onTopUp, toast }) {
  const [method, setMethod] = useState("va");
  const [amount, setAmount] = useState("50000");
  const [copied, setCopied] = useState(false);

  const parsed = Number(String(amount).replace(/\D/g, "")) || 0;
  const valid = parsed >= 10000;
  const active = TOPUP_METHODS.find((m) => m.id === method);

  const submit = () => {
    if (!valid) return;
    onTopUp(parsed, `${active.name} — ${active.detail}`);
    setAmount("50000");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(VOUCHER.code);
    } catch {
      /* clipboard diblokir — toast tetap tampil */
    }
    setCopied(true);
    toast("Kode promo disalin — aktifkan saat memesan.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">Dompet Jemputa</h1>
        <p className="mt-1 text-sm text-mute">
          Saldo, top up, dan promo — simulasi tanpa uang nyata.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Kartu saldo */}
        <div className="relative overflow-hidden rounded-2xl border border-lime/30 bg-card2 p-5">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-lime/10 blur-2xl" />
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute">
            <WalletIcon className="h-4 w-4 text-lime" /> Saldo Dompet
          </p>
          <motion.p
            key={wallet.balance}
            initial={{ scale: 0.96, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            {rupiah(wallet.balance)}
          </motion.p>
          <p className="mt-2 text-xs text-mute">Jemputa Pay · demo tanpa uang nyata</p>
        </div>

        {/* Kartu voucher promo */}
        <div className="relative overflow-hidden rounded-2xl border border-edge">
          <img
            src={VOUCHER.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/85 to-canvas/40" />
          <div className="relative p-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime">
              <TicketPercent className="h-4 w-4" /> Voucher Promo
            </p>
            <p className="mt-2 text-lg font-extrabold text-ink">{VOUCHER.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-mute">{VOUCHER.desc}</p>
            <div className="mt-3 flex items-center gap-2">
              <code className="rounded-lg border border-dashed border-lime/60 bg-canvas/70 px-3 py-1.5 font-mono text-sm font-bold tracking-widest text-lime">
                {VOUCHER.code}
              </code>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1 rounded-lg bg-lime px-3 py-1.5 text-xs font-extrabold text-lime-ink transition-colors hover:bg-lime-deep"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top up */}
      <div className="rounded-2xl border border-edge bg-card p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-ink">
          <ArrowDownToLine className="h-4 w-4 text-lime" /> Top Up Saldo
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {TOPUP_METHODS.map((m) => {
            const Icon = METHOD_ICONS[m.id];
            const isActive = m.id === method;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  isActive ? "border-lime bg-lime-soft/40" : "border-edge hover:border-mute"
                }`}
              >
                <Icon className="h-4 w-4 text-lime" />
                <p className="mt-1.5 text-sm font-bold text-ink">{m.name}</p>
                <p className="text-xs text-mute">{m.detail}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPUP_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                parsed === p
                  ? "border-lime bg-lime text-lime-ink"
                  : "border-edge text-mute hover:text-ink"
              }`}
            >
              {rupiah(p)}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-edge bg-canvas2 px-3.5">
            <span className="text-sm font-bold text-mute">Rp</span>
            <input
              value={parsed ? parsed.toLocaleString("id-ID") : ""}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="numeric"
              placeholder="Nominal (min. Rp10.000)"
              className="w-full bg-transparent py-3 text-sm font-bold text-ink outline-none placeholder:font-medium placeholder:text-mute"
            />
          </div>
          <button
            onClick={submit}
            disabled={!valid}
            className="rounded-xl bg-lime px-6 py-3 text-sm font-extrabold text-lime-ink transition-colors hover:bg-lime-deep disabled:cursor-not-allowed disabled:bg-card2 disabled:text-mute"
          >
            Top Up Sekarang
          </button>
        </div>
      </div>

      {/* Mutasi */}
      <div className="rounded-2xl border border-edge bg-card p-4 sm:p-5">
        <h2 className="text-base font-extrabold text-ink">Mutasi Terakhir</h2>
        <div className="mt-3 divide-y divide-edge">
          {wallet.mutasi.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  m.amount > 0 ? "bg-lime-soft text-lime" : "bg-card2 text-mute"
                }`}
              >
                {m.amount > 0 ? (
                  <ArrowDownToLine className="h-4 w-4" />
                ) : (
                  <ArrowUpFromLine className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{m.label}</p>
                <p className="text-xs text-mute">{fmtDateTime(m.ts)}</p>
              </div>
              <p
                className={`shrink-0 text-sm font-extrabold ${
                  m.amount > 0 ? "text-lime" : "text-ink"
                }`}
              >
                {m.amount > 0 ? "+" : "−"}
                {rupiah(Math.abs(m.amount))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

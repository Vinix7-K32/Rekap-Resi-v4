"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  LuArrowRight,
  LuChartBar,
  LuCheck,
  LuPackageCheck,
  LuPlay,
  LuShieldCheck,
  LuSparkles,
  LuTrendingUp,
} from "react-icons/lu";
import LandingIcon from "./LandingIcon";

const QUICK_STATS = [
  {
    Icon: LandingIcon,
    val: "51",
    label: "Total Resi",
    iconClass: "text-blue-500",
    cardClass: "bg-blue-500/15",
  },
  {
    Icon: LuPackageCheck,
    val: "9",
    label: "Hari Ini",
    iconClass: "text-green-500",
    cardClass: "bg-green-500/15",
  },
  {
    Icon: LuTrendingUp,
    val: "94%",
    label: "Match Rate",
    iconClass: "text-amber-500",
    cardClass: "bg-amber-500/15",
  },
];

const CHART_BARS = [
  { heightClass: "h-[40%]", highlight: false },
  { heightClass: "h-[65%]", highlight: false },
  { heightClass: "h-[45%]", highlight: false },
  { heightClass: "h-[80%]", highlight: true },
  { heightClass: "h-[55%]", highlight: false },
  { heightClass: "h-[90%]", highlight: true },
  { heightClass: "h-[70%]", highlight: false },
  { heightClass: "h-[85%]", highlight: true },
  { heightClass: "h-[60%]", highlight: false },
  { heightClass: "h-[95%]", highlight: true },
  { heightClass: "h-[72%]", highlight: false },
  { heightClass: "h-[88%]", highlight: true },
  { heightClass: "h-[50%]", highlight: false },
  { heightClass: "h-[78%]", highlight: false },
];

const AVATAR_BADGES = [
  { label: "B", gradient: "from-blue-500 to-blue-500/70" },
  { label: "S", gradient: "from-violet-500 to-violet-500/70" },
  { label: "D", gradient: "from-pink-500 to-pink-500/70" },
  { label: "A", gradient: "from-amber-500 to-amber-500/70" },
];

function StatBadge({ icon: Icon, label, value, iconClass, bgClass }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-md ${bgClass}`}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/10">
        <Icon size={17} className={iconClass} />
      </div>
      <div>
        <p className="text-white text-[1.15rem] font-extrabold leading-none">{value}</p>
        <p className="text-[0.7rem] text-slate-300/70 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function MockResiRow({ no, status, statusClass, statusBgClass, mp }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <LandingIcon size={12} className="text-blue-400 shrink-0" />
        <span className="truncate text-[0.68rem] text-slate-300/80 font-mono">{no}</span>
      </div>
      <span className="text-[0.62rem] text-slate-400/50 shrink-0 ml-2">{mp}</span>
      <span className={`px-2 py-0.5 rounded-full shrink-0 ml-2 text-[0.6rem] font-semibold ${statusBgClass} ${statusClass}`}>
        {status}
      </span>
    </div>
  );
}

export default function LandingHero() {
  const perks = [
    "Gratis selamanya untuk paket dasar",
    "Setup kurang dari 5 menit",
    "Tidak perlu kartu kredit",
  ];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[linear-gradient(160deg,var(--ink-950)_0%,var(--ink-800)_55%,var(--ink-700)_100%)]"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] text-white" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.12] bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-blue-500 to-transparent blur-[60px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full opacity-[0.08] bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-violet-500 to-transparent blur-[60px]" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full opacity-[0.06] bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-cyan-500 to-transparent blur-[50px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-28 md:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6 bg-blue-500/15 border border-blue-500/30"
            >
              <LuSparkles size={13} className="text-blue-400" />
              <span className="text-[0.78rem] text-blue-300 font-semibold">
                Platform Logistik Return #1 untuk UMKM
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-white text-[clamp(2rem,5vw,3.25rem)] font-black leading-[1.12] tracking-[-0.03em]"
            >
              Kelola Resi Return{" "}
              <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Lebih Cepat
              </span>
              <br />& Lebih Akurat
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-5 text-slate-400/90 text-[clamp(0.95rem,2vw,1.1rem)] leading-[1.75] max-w-130"
            >
              Rekap Resi adalah sistem terpusat untuk mencatat, melacak, dan
              memverifikasi nomor resi pengembalian barang dari semua marketplace
              dalam satu dashboard.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-6 space-y-2.5"
            >
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <LuCheck size={16} className="text-green-400 shrink-0" />
                  <span className="text-[0.88rem] text-slate-300/80">
                    {p}
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/register"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-white transition-all hover:scale-105 hover:opacity-95 bg-linear-to-br from-blue-500 to-blue-700 shadow-[0_8px_24px_rgba(59,130,246,0.45)] text-[0.95rem] font-bold"
              >
                Mulai Gratis Sekarang <LuArrowRight size={17} />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl transition-all hover:bg-white/10 border-[1.5px] border-white/20 bg-white/5 text-slate-200/90 text-[0.95rem] font-semibold"
              >
                <LuPlay size={15} className="text-slate-200/90" />Lihat Demo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex items-center gap-6 flex-wrap"
            >
              {[
                { val: "50K+", label: "Resi diproses" },
                { val: "500+", label: "Pengguna aktif" },
                { val: "99.9%", label: "Uptime SLA" },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="text-white text-[1.35rem] font-extrabold leading-none">
                    {val}
                  </p>
                  <p className="text-[0.72rem] text-slate-400/60 mt-0.75">
                    {label}
                  </p>
                </div>
              ))}
              <div className="h-8 w-px bg-white/10" />
              <div className="flex -space-x-2">
                {AVATAR_BADGES.map((badge, i) => (
                  <div
                    key={badge.label}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-[0.65rem] font-bold bg-linear-to-br ${badge.gradient} border-(--ink-800)`}
                  >
                    {badge.label}
                  </div>
                ))}
                <div
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white/10 border-(--ink-800) text-slate-300/70 text-[0.6rem] font-semibold"
                >
                  +496
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="rounded-3xl p-5 relative overflow-hidden bg-[linear-gradient(145deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] border border-white/10 backdrop-blur-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-700">
                    <LandingIcon size={14} className="text-white" />
                  </div>
                  <span className="text-white text-[0.88rem] font-bold">
                    Dashboard Rekap Resi
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {QUICK_STATS.map(({ Icon, val, label, iconClass, cardClass }) => (
                  <div key={label} className={`rounded-xl p-3 text-center border border-white/10 ${cardClass}`}>
                    <Icon size={14} className={`mx-auto mb-1 ${iconClass}`} />
                    <p className="text-white text-[1rem] font-extrabold leading-none">{val}</p>
                    <p className="text-[0.6rem] text-slate-400/70 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-end justify-between gap-1.5 h-16">
                  {CHART_BARS.map((bar, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${bar.heightClass} ${bar.highlight ? "bg-linear-to-b from-blue-400 to-blue-500" : "bg-blue-500/30"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[0.6rem] text-slate-400/50">
                    14 hari terakhir
                  </span>
                  <div className="flex items-center gap-1">
                    <LuChartBar size={10} className="text-green-500" />
                    <span className="text-[0.6rem] text-green-400 font-semibold">
                      +12% vs minggu lalu
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[0.7rem] font-bold text-slate-400/60 mb-2 tracking-wider">
                  RESI TERBARU
                </p>
                <MockResiRow
                  no="JNE000000000001"
                  status="Diterima"
                  statusClass="text-green-500"
                  statusBgClass="bg-green-500/15"
                  mp="Shopee"
                />
                <MockResiRow
                  no="JP000000000003"
                  status="Dalam Proses"
                  statusClass="text-amber-500"
                  statusBgClass="bg-amber-500/15"
                  mp="Tokopedia"
                />
                <MockResiRow
                  no="SPXID0000004"
                  status="Menunggu"
                  statusClass="text-blue-500"
                  statusBgClass="bg-blue-500/15"
                  mp="Lazada"
                />
                <MockResiRow
                  no="ANT000000005"
                  status="Selesai"
                  statusClass="text-violet-500"
                  statusBgClass="bg-violet-500/15"
                  mp="TikTok Shop"
                />
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-14 top-1/4"
            >
              <StatBadge
                icon={LuShieldCheck}
                label="Verifikasi Cocok"
                value="94%"
                iconClass="text-green-400"
                bgClass="bg-(--ink-900)/0.88)"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-12 bottom-1/4"
            >
              <StatBadge
                icon={LuTrendingUp}
                label="Resi hari ini"
                value="+9"
                iconClass="text-blue-400"
                bgClass="bg-(--ink-900)/0.88"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-linear-to-b from-transparent to-white" />
    </section>
  );
}

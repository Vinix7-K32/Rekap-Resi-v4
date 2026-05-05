"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { LuArrowRight, LuCheck, LuLock, LuLogIn } from "react-icons/lu";
import LandingIcon from "./LandingIcon";

const CTA_PERKS = [
  "Gratis selamanya untuk paket dasar",
  "Import CSV tanpa batas",
  "Dukungan via email 24/7",
  "Tidak perlu kartu kredit",
];

export default function LandingCTA() {
  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden bg-[linear-gradient(160deg,var(--ink-950)_0%,var(--ink-800)_55%,var(--ink-700)_100%)]"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] text-white" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-blue-500 to-transparent blur-[60px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-[0.08] bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-violet-400 to-transparent blur-[50px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-700 shadow-[0_12px_36px_rgba(59,130,246,0.45)]">
            <LandingIcon size={30} className="text-white" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="text-white text-[clamp(1.8rem,4.5vw,3rem)] font-black tracking-[-0.03em] leading-[1.14]"
        >
          Mulai kelola resi return Anda{" "}
          <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            hari ini — gratis
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.14 }}
          className="mt-5 mx-auto text-base leading-[1.75] max-w-130 text-slate-400/90"
        >
          Bergabunglah dengan 500+ seller yang sudah membuktikan efisiensi rekap resi
          dengan Rekap Resi. Daftar dalam 1 menit, tanpa kartu kredit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 mt-7"
        >
          {CTA_PERKS.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <LuCheck size={15} className="text-green-400 shrink-0" />
              <span className="text-[0.85rem] text-slate-300/80">{p}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white transition-all hover:scale-105 hover:opacity-95 w-full sm:w-auto justify-center bg-linear-to-br from-blue-500 to-blue-700 shadow-[0_10px_30px_rgba(59,130,246,0.5)] text-[0.97rem] font-bold"
          >
            Daftar Gratis Sekarang <LuArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl transition-all hover:bg-white/12 w-full sm:w-auto justify-center border-[1.5px] border-white/20 bg-white/5 text-slate-200/90 text-[0.97rem] font-semibold"
          >
            <LuLogIn size={16} className="text-slate-200/90" /> Sudah punya akun? Masuk
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="mt-6 flex items-center justify-center gap-1.5 text-[0.75rem] text-slate-400/50"
        >
          <LuLock size={12} className="text-slate-400/60" />
          Data Anda aman dan terenkripsi · Tidak ada spam · Bisa batalkan kapan saja
        </motion.p>
      </div>
    </section>
  );
}

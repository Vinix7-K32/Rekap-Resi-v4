"use client";

import { motion } from "motion/react";
import { LuCheck, LuStore } from "react-icons/lu";

const MARKETPLACES = [
  {
    name: "Shopee",
    textClass: "text-orange-600",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-200",
  },
  {
    name: "Tokopedia",
    textClass: "text-green-500",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
  },
  {
    name: "Lazada",
    textClass: "text-blue-600",
    bgClass: "bg-blue-100",
    borderClass: "border-blue-200",
  },
  {
    name: "Bukalapak",
    textClass: "text-red-600",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
  },
  {
    name: "TikTok Shop",
    textClass: "text-violet-500",
    bgClass: "bg-violet-50",
    borderClass: "border-violet-200",
  },
];

const COURIERS = ["JNE", "J&T Express", "SiCepat", "Anteraja", "Pos Indonesia"];

export default function LandingMarketplaces() {
  return (
    <section
      id="marketplaces"
      className="py-16 md:py-20 bg-slate-50 border-y border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 bg-orange-50 text-orange-600 text-[0.78rem] font-bold">
            <LuStore size={13} className="text-orange-600" /> Integrasi Marketplace
          </span>
          <h2
            className="text-[clamp(1.4rem,3.5vw,2rem)] font-black tracking-[-0.02em] leading-[1.2] text-slate-900"
          >
            Dukung semua marketplace{" "}
            <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              terpopuler Indonesia
            </span>
          </h2>
          <p className="mt-2 text-[0.9rem] text-slate-500">
            Kelola resi return dari semua platform dalam satu sistem terpusat.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {MARKETPLACES.map((mp, i) => (
            <motion.div
              key={mp.name}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-default transition-all bg-white border-[1.5px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:scale-105 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] ${mp.borderClass}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${mp.bgClass} ${mp.borderClass}`}>
                <LuStore size={20} className={mp.textClass} />
              </div>
              <div>
                <p className={`text-[0.92rem] font-bold ${mp.textClass}`}>{mp.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <LuCheck size={11} className="text-green-500" />
                  <span className="text-[0.65rem] text-slate-400 font-medium">
                    Terintegrasi
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-10"
        >
          <p className="text-center mb-4 text-[0.8rem] font-bold text-slate-400 tracking-[0.06em]">
            JUGA MENDUKUNG KURIR
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {COURIERS.map((courier) => (
              <span
                key={courier}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-[0.82rem] font-semibold text-slate-700"
              >
                {courier}
              </span>
            ))}
            <span
              className="px-4 py-2 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-[0.82rem] font-semibold text-slate-400"
            >
              + Segera hadir
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

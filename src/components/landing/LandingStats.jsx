"use client";

import { motion } from "motion/react";
import { LuClock, LuTrendingUp, LuUsers } from "react-icons/lu";
import LandingIcon from "./LandingIcon";

const STATS = [
  {
    icon: LandingIcon,
    value: "50.000+",
    label: "Resi diproses",
    textClass: "text-blue-600",
    bgClass: "bg-blue-100",
    borderClass: "border-blue-200",
  },
  {
    icon: LuUsers,
    value: "500+",
    label: "Pengguna aktif",
    textClass: "text-green-500",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
  },
  {
    icon: LuTrendingUp,
    value: "94%",
    label: "Rata-rata match rate",
    textClass: "text-violet-500",
    bgClass: "bg-violet-50",
    borderClass: "border-violet-200",
  },
  {
    icon: LuClock,
    value: "99.9%",
    label: "Uptime SLA",
    textClass: "text-amber-600",
    bgClass: "bg-amber-100",
    borderClass: "border-amber-200",
  },
];

export default function LandingStats() {
  return (
    <section
      className="py-10 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${stat.bgClass} ${stat.borderClass}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <Icon size={18} className={stat.textClass} />
                </div>

                <div>
                  <p className={`text-[1.35rem] font-black leading-none ${stat.textClass}`}>
                    {stat.value}
                  </p>
                  <p className="text-[0.73rem] text-slate-500 mt-0.75 leading-[1.3]">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

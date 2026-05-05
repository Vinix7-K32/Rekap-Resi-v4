"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  LuArrowLeftRight,
  LuChartBar,
  LuChevronRight,
  LuFileSpreadsheet,
  LuPackagePlus,
} from "react-icons/lu";

const STEPS = [
  {
    num: 1,
    icon: LuPackagePlus,
    title: "Tambah Data Resi",
    desc: "Input nomor resi return dari marketplace lewat form manual, scan barcode, atau upload file CSV massal. Semua tersimpan otomatis di sistem.",
    iconClass: "text-blue-600",
    panelFromClass: "from-blue-100",
    borderClass: "border-blue-200",
    shadowClass: "shadow-[0_8px_24px_rgba(37,99,235,0.25)]",
    shadowMobileClass: "shadow-[0_6px_18px_rgba(37,99,235,0.25)]",
    badgeGradientClass: "from-blue-600 to-blue-600/80",
    badgeSolidClass: "bg-blue-600",
    tagClass: "bg-blue-100 text-blue-600 border-blue-200",
    lineClass: "bg-blue-200",
    note: "Manual / CSV / Scan",
  },
  {
    num: 2,
    icon: LuFileSpreadsheet,
    title: "Input Data Marketplace",
    desc: "Masukkan data resi dari sisi marketplace (Shopee, Tokopedia, dsb.) ke form perbandingan — bisa manual atau upload CSV ekspor marketplace.",
    iconClass: "text-violet-500",
    panelFromClass: "from-violet-50",
    borderClass: "border-violet-200",
    shadowClass: "shadow-[0_8px_24px_rgba(139,92,246,0.25)]",
    shadowMobileClass: "shadow-[0_6px_18px_rgba(139,92,246,0.25)]",
    badgeGradientClass: "from-violet-500 to-violet-500/80",
    badgeSolidClass: "bg-violet-500",
    tagClass: "bg-violet-50 text-violet-500 border-violet-200",
    lineClass: "bg-violet-200",
    note: "Form / Drag & Drop",
  },
  {
    num: 3,
    icon: LuArrowLeftRight,
    title: "Bandingkan & Verifikasi",
    desc: "Tekan tombol \"Bandingkan & Verifikasi\". Sistem akan mencocokkan data internal vs marketplace secara otomatis dan menandai statusnya.",
    iconClass: "text-amber-600",
    panelFromClass: "from-amber-100",
    borderClass: "border-amber-200",
    shadowClass: "shadow-[0_8px_24px_rgba(217,119,6,0.25)]",
    shadowMobileClass: "shadow-[0_6px_18px_rgba(217,119,6,0.25)]",
    badgeGradientClass: "from-amber-600 to-amber-600/80",
    badgeSolidClass: "bg-amber-600",
    tagClass: "bg-amber-100 text-amber-600 border-amber-200",
    lineClass: "bg-amber-200",
    note: "< 3 detik proses",
  },
  {
    num: 4,
    icon: LuChartBar,
    title: "Analisis & Export",
    desc: "Lihat summary match-rate, filter hasil per status, dan export laporan ke CSV. Data analitik tersedia langsung di dashboard utama.",
    iconClass: "text-green-500",
    panelFromClass: "from-green-50",
    borderClass: "border-green-200",
    shadowClass: "shadow-[0_8px_24px_rgba(34,197,94,0.25)]",
    shadowMobileClass: "shadow-[0_6px_18px_rgba(34,197,94,0.25)]",
    badgeGradientClass: "from-green-500 to-green-500/80",
    badgeSolidClass: "bg-green-500",
    tagClass: "bg-green-50 text-green-500 border-green-200",
    lineClass: "bg-green-200",
    note: "Export CSV",
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-white"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-violet-50 text-violet-500 text-[0.78rem] font-bold">
            <LuArrowLeftRight size={13} className="text-violet-500" /> Cara Kerja
          </span>
          <h2
            className="text-[clamp(1.6rem,4vw,2.4rem)] font-black tracking-[-0.03em] leading-[1.18] text-slate-900"
          >
            Mulai dalam{" "}
            <span className="bg-linear-to-r from-violet-500 to-blue-600 bg-clip-text text-transparent">
              4 langkah mudah
            </span>
          </h2>
          <p
            className="mt-4 mx-auto text-base leading-[1.72] max-w-130 text-slate-500"
          >
            Tidak perlu pelatihan khusus. Rekap Resi dirancang intuitif — seller baru bisa
            langsung paham dalam hitungan menit.
          </p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-4 gap-0 relative">
          <div className="absolute top-13 left-[12.5%] right-[12.5%] h-0.5 z-0 bg-[linear-gradient(90deg,rgb(191_219_254),rgb(221_214_254),rgb(253_230_138),rgb(187_247_208))]" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center px-4 z-10"
            >
              <div className={`w-17 h-17 rounded-2xl flex flex-col items-center justify-center mb-5 relative bg-linear-to-br ${step.panelFromClass} to-white border-2 ${step.borderClass} ${step.shadowClass}`}>
                <step.icon size={24} className={step.iconClass} />
                <span
                  className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[0.6rem] font-extrabold bg-linear-to-br ${step.badgeGradientClass}`}
                >
                  {step.num}
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded-full mb-3 text-[0.65rem] font-bold border ${step.tagClass}`}>
                {step.note}
              </span>

              <h3 className="text-[0.97rem] font-extrabold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-[0.82rem] text-slate-500 leading-[1.65]">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden space-y-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-4 relative"
            >
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative shrink-0 bg-linear-to-br ${step.panelFromClass} to-white border-2 ${step.borderClass} ${step.shadowMobileClass}`}>
                  <step.icon size={20} className={step.iconClass} />
                  <span
                    className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[0.6rem] font-extrabold ${step.badgeSolidClass}`}
                  >
                    {step.num}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 flex-1 my-2 min-h-7 ${step.lineClass}`} />
                )}
              </div>

              <div className="flex-1 pb-8">
                <span className={`inline-block px-2.5 py-1 rounded-full mb-2 text-[0.65rem] font-bold border ${step.tagClass}`}>
                  {step.note}
                </span>
                <h3 className="text-[0.97rem] font-extrabold text-slate-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[0.84rem] text-slate-500 leading-[1.65]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <p className="text-[0.92rem] text-slate-700">
              Siap mencoba? Setup selesai dalam{" "}
              <strong className="text-slate-900">kurang dari 5 menit.</strong>
            </p>
            <Link
              href="/register"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:scale-105 bg-linear-to-br from-blue-500 to-blue-700 shadow-[0_4px_14px_rgba(59,130,246,0.35)] text-[0.88rem] font-bold whitespace-nowrap"
            >
              Coba Sekarang <LuChevronRight size={15} className="text-white" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

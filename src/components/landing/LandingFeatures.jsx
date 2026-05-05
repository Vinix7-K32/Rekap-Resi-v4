"use client";

import { motion } from "motion/react";
import {
  LuArrowLeftRight,
  LuChartBar,
  LuBell,
  LuFileDown,
  LuFileSpreadsheet,
  LuPackagePlus,
  LuScan,
  LuStore,
} from "react-icons/lu";

const FEATURES = [
  {
    icon: LuPackagePlus,
    title: "Tambah Resi Manual",
    desc: "Input nomor resi satu per satu lewat form yang simpel. Dukung scan barcode langsung dari kamera perangkat Anda.",
    iconClass: "text-blue-500",
    iconBgClass: "bg-blue-100",
    iconBorderClass: "border-blue-200",
    tag: "Paling Sering Dipakai",
    tagClass: "bg-blue-100 text-blue-600",
    lineClass: "bg-blue-500",
  },
  {
    icon: LuFileSpreadsheet,
    title: "Import CSV Massal",
    desc: "Upload ratusan resi sekaligus lewat drag & drop file CSV. Cocok untuk seller volume tinggi saat akhir bulan.",
    iconClass: "text-green-500",
    iconBgClass: "bg-green-50",
    iconBorderClass: "border-green-200",
    tag: null,
    tagClass: "",
    lineClass: "bg-green-500",
  },
  {
    icon: LuArrowLeftRight,
    title: "Verifikasi Otomatis",
    desc: "Bandingkan data resi internal dengan data marketplace dalam hitungan detik. Langsung tahu mana yang Cocok, Tidak Cocok, atau Tidak Ditemukan.",
    iconClass: "text-violet-500",
    iconBgClass: "bg-violet-50",
    iconBorderClass: "border-violet-200",
    tag: "Fitur Unggulan",
    tagClass: "bg-violet-100 text-violet-500",
    lineClass: "bg-violet-500",
  },
  {
    icon: LuChartBar,
    title: "Analitik Real-time",
    desc: "Dashboard grafik interaktif yang menampilkan tren resi harian, mingguan, dan bulanan dengan area chart dan bar chart.",
    iconClass: "text-amber-600",
    iconBgClass: "bg-amber-100",
    iconBorderClass: "border-amber-200",
    tag: null,
    tagClass: "",
    lineClass: "bg-amber-600",
  },
  {
    icon: LuStore,
    title: "Multi-Marketplace",
    desc: "Mendukung Shopee, Tokopedia, Lazada, Bukalapak, dan TikTok Shop. Kelola semua platform dari satu tempat tanpa berpindah tab.",
    iconClass: "text-orange-600",
    iconBgClass: "bg-orange-50",
    iconBorderClass: "border-orange-200",
    tag: "5 Platform",
    tagClass: "bg-orange-100 text-orange-600",
    lineClass: "bg-orange-600",
  },
  {
    icon: LuFileDown,
    title: "Export Laporan",
    desc: "Ekspor data resi lengkap ke CSV kapan saja. Siap langsung untuk keperluan laporan operasional atau rekonsiliasi keuangan.",
    iconClass: "text-cyan-600",
    iconBgClass: "bg-cyan-50",
    iconBorderClass: "border-cyan-200",
    tag: null,
    tagClass: "",
    lineClass: "bg-cyan-600",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

export default function LandingFeatures() {
  return (
    <section
      id="features"
      className="py-20 md:py-28 bg-slate-100"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-blue-100 text-blue-700 text-[0.78rem] font-bold">
            <LuScan size={13} className="text-blue-700" /> Fitur Lengkap
          </span>
          <h2
            className="text-slate-900 text-[clamp(1.6rem,4vw,2.4rem)] font-black tracking-[-0.03em] leading-[1.18]"
          >
            Semua yang Anda butuhkan,{" "}
            <span className="bg-linear-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
              ada di sini
            </span>
          </h2>
          <p
            className="mt-4 mx-auto text-base leading-[1.72] max-w-140 text-slate-500"
          >
            Dari pencatatan manual hingga verifikasi otomatis, Rekap Resi hadir dengan fitur
            lengkap yang dirancang khusus untuk kebutuhan seller Indonesia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.article
              key={feat.title}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative rounded-2xl p-6 transition-all cursor-default bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
            >
              {feat.tag && (
                <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[0.65rem] font-bold ${feat.tagClass}`}>
                  {feat.tag}
                </span>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${feat.iconBgClass} ${feat.iconBorderClass}`}>
                <feat.icon size={22} className={feat.iconClass} />
              </div>

              <h3 className="text-[0.97rem] font-bold text-slate-900 mb-2">
                {feat.title}
              </h3>
              <p className="text-[0.85rem] text-slate-500 leading-[1.68]">
                {feat.desc}
              </p>

              <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${feat.lineClass}`} />
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <LuBell size={15} className="text-amber-500" />
            <p className="text-[0.83rem] text-slate-700">
              Notifikasi perubahan status resi dikirim{" "}
              <strong className="text-slate-900">real-time</strong> ke dashboard Anda.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

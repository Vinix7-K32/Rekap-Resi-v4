"use client";

import { motion } from "motion/react";
import { LuQuote, LuSparkles, LuStar } from "react-icons/lu";

const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    role: "Seller Shopee",
    company: "Toko Elektronik Budi",
    avatar: "BS",
    avatarGradClass: "from-blue-500 to-blue-700",
    marketplace: "Shopee",
    mpTextClass: "text-orange-600",
    mpBgClass: "bg-orange-50",
    rating: 5,
    text: "Sebelum pakai Rekap Resi, saya harus cek satu per satu resi return di spreadsheet. Sekarang tinggal upload CSV, langsung ketahuan mana yang cocok dan mana yang bermasalah. Hemat 2-3 jam kerja per hari!",
    highlight: "Hemat 2-3 jam kerja per hari",
  },
  {
    name: "Siti Rahayu",
    role: "Seller Tokopedia & Shopee",
    company: "SR Fashion Store",
    avatar: "SR",
    avatarGradClass: "from-pink-500 to-pink-700",
    marketplace: "Tokopedia",
    mpTextClass: "text-green-500",
    mpBgClass: "bg-green-50",
    rating: 5,
    text: "Fitur verifikasi otomatisnya luar biasa. Dulu saya sering pusing karena data resi tidak sinkron antara Tokopedia dan catatan internal. Sekarang bisa langsung tahu dengan sekali klik. Sangat rekomendasikan!",
    highlight: "Verifikasi dengan sekali klik",
  },
  {
    name: "Ahmad Fauzi",
    role: "Manager Operasional",
    company: "PT Distribusi Nusantara",
    avatar: "AF",
    avatarGradClass: "from-violet-400 to-violet-700",
    marketplace: "Multi-Platform",
    mpTextClass: "text-violet-500",
    mpBgClass: "bg-violet-50",
    rating: 5,
    text: "Kami mengelola return dari 4 marketplace sekaligus dengan volume ratusan resi per hari. Rekap Resi jadi tulang punggung operasional kami. Dashboard analitiknya juga membantu saya buat laporan ke manajemen.",
    highlight: "4 marketplace, 1 dashboard",
  },
];

const RATING_BARS = [
  { stars: 5, pct: 92, widthClass: "w-[92%]" },
  { stars: 4, pct: 6, widthClass: "w-[6%]" },
  { stars: 3, pct: 2, widthClass: "w-[2%]" },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar
          key={i}
          size={14}
          className={i < count ? "text-amber-500 fill-amber-500" : "text-slate-200 fill-transparent"}
        />
      ))}
    </div>
  );
}

export default function LandingTestimonials() {
  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-white"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-amber-100 text-amber-600 text-[0.78rem] font-bold">
            <LuStar size={13} className="text-amber-600" /> Testimoni Pengguna
          </span>
          <h2
            className="text-[clamp(1.6rem,4vw,2.4rem)] font-black tracking-[-0.03em] leading-[1.18] text-slate-900"
          >
            Dipercaya{" "}
            <span className="bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              500+ seller aktif
            </span>
          </h2>
          <p
            className="mt-4 mx-auto text-base leading-[1.72] max-w-125 text-slate-500"
          >
            Dari seller perorangan hingga tim operasional perusahaan distribusi,
            Rekap Resi hadir untuk semua skala bisnis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.48, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl p-6 flex flex-col gap-4 transition-all bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              <div className="absolute top-5 right-5 opacity-[0.07] text-slate-900">
                <LuQuote size={48} />
              </div>

              <div className="flex items-start justify-between gap-3">
                <StarRating count={t.rating} />
                <span className={`px-2.5 py-1 rounded-full shrink-0 text-[0.65rem] font-bold whitespace-nowrap ${t.mpBgClass} ${t.mpTextClass}`}>
                  {t.marketplace}
                </span>
              </div>

              <p className="text-[0.87rem] text-slate-700 leading-[1.72] flex-1">
                &quot;{t.text}&quot;
              </p>

              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[0.75rem] font-bold text-slate-900 flex items-center gap-1.5">
                  <LuSparkles size={12} className="text-amber-500" /> {t.highlight}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 text-[0.75rem] font-bold bg-linear-to-br ${t.avatarGradClass}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[0.88rem] font-bold text-slate-900">{t.name}</p>
                  <p className="text-[0.72rem] text-slate-400">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 py-5 px-8 rounded-2xl bg-amber-100 border border-amber-200"
        >
          <div className="text-center">
            <p className="text-[2.4rem] font-black text-amber-600 leading-none">
              4.9
            </p>
            <StarRating count={5} />
            <p className="text-[0.7rem] text-amber-900 mt-1">Rating rata-rata</p>
          </div>
          <div className="hidden sm:block w-px h-14 bg-amber-200" />
          <div className="space-y-1.5">
            {RATING_BARS.map(({ stars, pct, widthClass }) => (
              <div key={stars} className="flex items-center gap-2.5">
                <span className="text-[0.72rem] text-amber-900 w-10 inline-flex items-center gap-1">
                  {stars} <LuStar size={10} className="text-amber-600" />
                </span>
                <div className="w-32 h-2 rounded-full bg-amber-50">
                  <div className={`h-full rounded-full bg-amber-500 ${widthClass}`} />
                </div>
                <span className="text-[0.7rem] text-amber-900">{pct}%</span>
              </div>
            ))}
          </div>
          <div className="hidden sm:block w-px h-14 bg-amber-200" />
          <div className="text-center">
            <p className="text-[1.6rem] font-black text-amber-600 leading-none">500+</p>
            <p className="text-[0.72rem] text-amber-900 mt-1">Pengguna aktif</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

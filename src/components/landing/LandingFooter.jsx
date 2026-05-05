"use client";

import Link from "next/link";
import { LuHeart, LuMail, LuMapPin } from "react-icons/lu";
import LandingIcon from "./LandingIcon";

const FOOTER_COLUMNS = [
  {
    heading: "Produk",
    links: [
      { label: "Fitur", href: "#features" },
      { label: "Cara Kerja", href: "#how-it-works" },
      { label: "Integrasi Marketplace", href: "#marketplaces" },
      { label: "Design System", href: "/design-system" },
    ],
  },
  {
    heading: "Akun",
    links: [
      { label: "Daftar Gratis", href: "/register" },
      { label: "Masuk", href: "/login" },
      { label: "Dashboard", href: "/" },
      { label: "Tambah Resi", href: "/tambah" },
    ],
  },
  {
    heading: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Karir", href: "#" },
      { label: "Hubungi Kami", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Syarat & Ketentuan", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
      { label: "Keamanan Data", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

const FOOTER_MARKETPLACES = ["Shopee", "Tokopedia", "Lazada", "Bukalapak", "TikTok Shop"];

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const handleAnchor = (href) => {
    if (!href.startsWith("#")) return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="bg-[linear-gradient(180deg,var(--ink-900))_0%,var(--ink-950)_100%]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2 md:col-span-2">
            <Link href="/landing" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.35)]">
                <LandingIcon size={20} className="text-white" />
              </div>
              <span className="text-white font-bold text-[1.1rem] tracking-[-0.01em]">
                Rekap Resi
              </span>
            </Link>

            <p className="text-[0.84rem] text-slate-400/75 leading-[1.72] mb-4.5">
              Sistem manajemen resi pengembalian barang yang terpusat, cepat, dan akurat untuk semua seller Indonesia.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <LuMail size={13} className="text-blue-400 shrink-0" />
                <span className="text-[0.8rem] text-slate-400/70">
                  hello@rekapresi.id
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <LuMapPin size={13} className="text-blue-400 shrink-0" />
                <span className="text-[0.8rem] text-slate-400/70">
                  Jakarta, Indonesia
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-5">
              {FOOTER_MARKETPLACES.map((mp) => (
                <span
                  key={mp}
                  className="text-[0.62rem] font-semibold text-slate-400/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full"
                >
                  {mp}
                </span>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="col-span-1">
              <p className="text-[0.7rem] font-bold text-slate-400/50 tracking-[0.08em] mb-3.5">
                {col.heading.toUpperCase()}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <button
                        onClick={() => handleAnchor(link.href)}
                        className="text-[0.83rem] text-slate-400/70 text-left transition-colors hover:text-white"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[0.83rem] text-slate-400/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[0.78rem] text-slate-400/45">
          © {currentYear} Rekap Resi. Hak cipta dilindungi undang-undang.
        </p>

        <p className="flex items-center gap-1.5 text-[0.78rem] text-slate-400/45">
          Dibuat dengan <LuHeart size={12} className="text-red-500" /> untuk seller Indonesia
        </p>

        <div className="flex items-center gap-4">
          {["Privasi", "Ketentuan", "Cookie"].map((item) => (
            <button
              key={item}
              className="text-[0.76rem] text-slate-400/45 transition-colors hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

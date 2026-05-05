"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowRight, LuChevronRight, LuMenu, LuX } from "react-icons/lu";
import LandingIcon from "./LandingIcon";

const NAV_LINKS = [
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Marketplace", href: "#marketplaces" },
  { label: "Testimoni", href: "#testimonials" },
];

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-(--ink-900)/90 backdrop-blur-md border-white/10"
          : "bg-transparent border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/landing" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.35)]">
            <LandingIcon size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-[1.05rem] tracking-[-0.01em]">
            Rekap Resi
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <button
                onClick={() => handleAnchor(href)}
                className="px-4 py-2 rounded-lg transition-colors hover:bg-white/10 text-slate-300/85 text-[0.88rem] font-medium"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl transition-all hover:bg-white/10 text-slate-300/85 text-[0.88rem] font-medium"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 hover:scale-105 bg-linear-to-br from-blue-500 to-blue-700 shadow-[0_4px_14px_rgba(59,130,246,0.4)] text-[0.88rem] font-semibold"
          >
            Mulai Gratis <LuArrowRight size={14} />
          </Link>
        </div>

        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 text-slate-300/85"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden bg-(--ink-900) border-t border-white/10"
          >
            <div className="px-5 py-4 space-y-1">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleAnchor(href)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-white/10 text-slate-300/85 text-[0.9rem] font-medium"
                >
                  {label}
                  <LuChevronRight size={15} className="text-slate-700" />
                </button>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl transition-all hover:bg-white/10 text-slate-300/85 text-[0.9rem] font-medium border border-white/10"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl text-white transition-all hover:opacity-90 bg-linear-to-br from-blue-500 to-blue-700 text-[0.9rem] font-semibold"
                >
                  Mulai Gratis — Gratis Selamanya
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

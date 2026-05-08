"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Boxes,
  BarChart3,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { loginAction } from "../actions";

const FEATURES = [
  {
    icon: Boxes,
    title: "Kelola Resi Return",
    desc: "Catat dan pantau semua nomor resi pengembalian barang di satu tempat",
  },
  {
    icon: BarChart3,
    title: "Analitik Real-time",
    desc: "Grafik dan statistik pengiriman yang selalu diperbarui otomatis",
  },
  {
    icon: ShieldCheck,
    title: "Verifikasi Akurat",
    desc: "Cocokkan data marketplace dengan data internal secara instan",
  },
];

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [formState, formAction, isPending] = useActionState(loginAction, {
    error: "",
    fieldErrors: {},
  });

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between w-120 xl:w-130 shrink-0 relative overflow-hidden bg-linear-to-br from-(--ink-950) via-(--ink-900) to-(--ink-800)">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-radial from-blue-500/25 from-0% to-transparent to-70%" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-radial from-violet-500/20 from-0% to-transparent to-70%" />
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-l" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgb(255 255 255 / 0.12)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-l)" />
          </svg>
        </div>

        <div className="relative px-10 pt-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-700 shadow-[0_8px_24px_rgb(29_78_216/0.35)]">
              <Image src="/icon.svg" alt="Rekap Resi" width={24} height={24} />
            </div>
            <div>
              <p className="text-white text-[1.25rem] font-bold tracking-[-0.02em]">
                Rekap Resi
              </p>
              <p className="text-[0.72rem] text-slate-300">
                Sistem Manajemen Logistik
              </p>
            </div>
          </div>
        </div>

        <div className="relative px-10 py-8">
          <h2 className="text-white text-[2rem] font-extrabold tracking-[-0.02em] leading-tight">
            Kelola resi
            <br />
            <span className="bg-linear-to-r from-blue-300 to-violet-200 bg-clip-text text-transparent">
              lebih cerdas
            </span>
          </h2>
          <p className="mt-3 text-[0.92rem] text-slate-300 leading-relaxed">
            Platform terpusat untuk pelacakan resi pengembalian, sinkronisasi data
            marketplace, dan laporan logistik real-time.
          </p>

          <div className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl p-4 bg-white/5 border border-white/10"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/15 border border-blue-500/35">
                  <Icon size={17} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-[0.88rem] font-semibold text-white">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[0.76rem] text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-105">
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-700">
              <Image src="/icon.svg" alt="Rekap Resi" width={24} height={24} />
            </div>
            <span className="text-[1.2rem] font-bold text-slate-900">
              Rekap Resi
            </span>
          </div>

          <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_6px_var(--ink-900)/0.06,0_20px_60px_var(--ink-900)/0.12]">
            <div className="px-8 pt-8 pb-2">
              <h1 className="text-[1.55rem] font-extrabold tracking-[-0.02em] text-slate-900">
                Selamat datang!
              </h1>
              <p className="mt-1 text-[0.88rem] text-slate-500">
                Masuk ke akun Rekap Resi Anda
              </p>
            </div>

            <form action={formAction} className="px-8 pb-8 pt-4 space-y-4">
              <div>
                <label className="block mb-1.5 text-[0.82rem] font-semibold text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="email@contoh.com"
                    autoComplete="email"
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-10 text-[0.9rem] text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  />
                </div>
                {formState?.fieldErrors?.email && (
                  <p className="mt-1.5 text-[0.8rem] font-semibold text-red-500">
                    {formState.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[0.82rem] font-semibold text-slate-700">
                    Password
                  </label>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-[0.75rem] text-slate-500 hover:text-blue-600"
                  >
                    Lupa password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete="current-password"
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-12 text-[0.9rem] text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-500"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formState?.fieldErrors?.password && (
                  <p className="mt-1.5 text-[0.8rem] font-semibold text-red-500">
                    {formState.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none text-[0.82rem] text-slate-500">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(Boolean(checked))}
                  className="size-5 rounded-md border-slate-200 bg-slate-50 data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white focus-visible:ring-blue-600/30"
                />
                Ingat saya
              </label>

              {formState?.error && (
                <p className="text-[0.8rem] font-semibold text-red-500">
                  {formState.error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-xl text-[0.95rem] font-semibold text-white bg-linear-to-br from-blue-600 to-blue-700 shadow-[0_6px_20px_rgb(29_78_216/0.35)] hover:brightness-105 disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Spinner className="mr-2" />Memproses...
                  </>
                ) : (
                  <>
                    Masuk <ArrowRight className="ml-1 size-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-[0.84rem] text-slate-500">
                Belum punya akun?{" "}
                <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                  Daftar sekarang
                </Link>
              </p>
            </form>
          </div>

          <p className="text-center mt-6 text-[0.72rem] text-slate-400">
            (c) 2025 Rekap Resi · Sistem Manajemen Logistik Return
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  User,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { registerAction } from "../actions";

const PERKS = [
  "Gratis tanpa batas waktu",
  "Tidak perlu kartu kredit",
  "Data aman dan terenkripsi",
  "Dukungan 24/7",
];

const getPasswordStrength = (value) => {
  if (!value) {
    return { score: 0, label: "", textClass: "text-slate-400", barClass: "bg-slate-100" };
  }

  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (score <= 1) return { score, label: "Sangat Lemah", textClass: "text-red-500", barClass: "bg-red-500" };
  if (score === 2) return { score, label: "Lemah", textClass: "text-orange-600", barClass: "bg-orange-600" };
  if (score === 3) return { score, label: "Sedang", textClass: "text-amber-600", barClass: "bg-amber-600" };
  if (score === 4) return { score, label: "Kuat", textClass: "text-green-500", barClass: "bg-green-500" };
  return { score, label: "Sangat Kuat", textClass: "text-green-400", barClass: "bg-green-400" };
};

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [agree, setAgree] = useState(false);
  const [formState, formAction, isPending] = useActionState(registerAction, {
    error: "",
    success: "",
    fieldErrors: {},
  });

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between w-110 xl:w-120 shrink-0 relative overflow-hidden bg-linear-to-br from-(--ink-950) via-(--ink-900) to-(--ink-800)">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-radial from-violet-500/20 from-0% to-transparent to-70%" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-radial from-blue-500/20 from-0% to-transparent to-70%" />
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-r" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgb(255 255 255 / 0.12)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-r)" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 bg-violet-500/15 border border-violet-400/35">
            <Sparkles size={12} className="text-violet-200" />
            <span className="text-[0.72rem] font-semibold text-violet-200">
              Daftar 100% Gratis
            </span>
          </div>
          <h2 className="text-white text-[2rem] font-extrabold tracking-[-0.02em] leading-tight">
            Mulai perjalanan
            <br />
            <span className="bg-linear-to-r from-blue-300 to-violet-200 bg-clip-text text-transparent">
              logistik Anda
            </span>
          </h2>
          <p className="mt-3 text-[0.9rem] text-slate-300 leading-relaxed">
            Buat akun gratis dan mulai mengelola resi pengembalian Anda hari ini. Tidak
            perlu kartu kredit.
          </p>

          <div className="mt-8 space-y-3">
            {PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-green-500/20 border border-green-500/30">
                  <CheckCircle size={13} className="text-green-400" />
                </div>
                <p className="text-[0.88rem] text-slate-200">{perk}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { value: "50K+", label: "Resi Diproses" },
              { value: "99.9%", label: "Uptime" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl p-4 text-center bg-white/5 border border-white/10"
              >
                <p className="text-[1.4rem] font-extrabold text-white">{value}</p>
                <p className="mt-0.5 text-[0.72rem] text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative px-10 pb-10">
          <p className="text-[0.75rem] text-slate-400 leading-relaxed">
            Dengan mendaftar, Anda menyetujui{" "}
            <span className="text-slate-300 cursor-pointer">Syarat dan Ketentuan</span> dan{" "}
            <span className="text-slate-300 cursor-pointer">Kebijakan Privasi</span> kami.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10 overflow-y-auto">
        <div className="w-full max-w-107.5">
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-700">
              <Image src="/icon.svg" alt="Rekap Resi" width={24} height={24} />
            </div>
            <span className="text-[1.2rem] font-bold text-slate-900">
              Rekap Resi
            </span>
          </div>

          <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_6px_var(--ink-900)/0.06,0_20px_60px_var(--ink-900)/0.12]">
            <div className="px-8 pt-8 pb-5">
              <h1 className="text-[1.5rem] font-extrabold tracking-[-0.02em] text-slate-900">
                Buat akun baru
              </h1>
              <p className="mt-1 text-[0.87rem] text-slate-500">
                Gratis selamanya, daftar dalam 1 menit
              </p>
            </div>

            <form action={formAction} className="px-8 pb-8 space-y-4">
              {formState?.success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[0.85rem] font-semibold text-emerald-700">
                  {formState.success}
                </div>
              )}

              {formState?.error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[0.85rem] font-semibold text-red-600">
                  {formState.error}
                </div>
              )}

              <div>
                <label className="block mb-1.5 text-[0.82rem] font-semibold text-slate-700">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nama lengkap Anda"
                    autoComplete="name"
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-10 text-[0.9rem] text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  />
                </div>
                {formState?.fieldErrors?.name && (
                  <p className="mt-1.5 text-[0.8rem] font-semibold text-red-500">
                    {formState.fieldErrors.name[0]}
                  </p>
                )}
              </div>

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
                <label className="block mb-1.5 text-[0.82rem] font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
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

                {password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <div
                          key={index}
                          className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                            index <= strength.score ? strength.barClass : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p className={`text-[0.72rem] font-semibold ${strength.textClass}`}>
                        Kekuatan: {strength.label}
                      </p>
                    )}
                  </div>
                )}
                {formState?.fieldErrors?.password && (
                  <p className="mt-1.5 text-[0.8rem] font-semibold text-red-500">
                    {formState.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1.5 text-[0.82rem] font-semibold text-slate-700">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="confirm"
                    type={showConf ? "text" : "password"}
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder="Ulangi password Anda"
                    autoComplete="new-password"
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-12 text-[0.9rem] text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConf((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-500"
                  >
                    {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formState?.fieldErrors?.confirm && (
                  <p className="mt-1.5 text-[0.8rem] font-semibold text-red-500">
                    {formState.fieldErrors.confirm[0]}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none text-[0.82rem] text-slate-500">
                <Checkbox
                  checked={agree}
                  onCheckedChange={(checked) => setAgree(Boolean(checked))}
                  className="mt-0.5 size-5 rounded-md border-slate-200 bg-slate-50 data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white focus-visible:ring-blue-600/30"
                />
                <span className="leading-relaxed">
                  Saya setuju dengan{" "}
                  <span className="text-blue-600 font-semibold cursor-pointer">Syarat dan Ketentuan</span> dan{" "}
                  <span className="text-blue-600 font-semibold cursor-pointer">Kebijakan Privasi</span>
                </span>
              </label>

              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-xl text-[0.95rem] font-semibold text-white bg-linear-to-br from-violet-500 to-violet-700 shadow-[0_6px_20px_rgb(109_40_217/0.35)] hover:brightness-105 disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Spinner className="mr-2" />Membuat akun...
                  </>
                ) : (
                  <>
                    Buat Akun Gratis <ArrowRight className="ml-1 size-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck size={13} />
                <p className="text-[0.73rem]">Data Anda aman dan terenkripsi</p>
              </div>

              <p className="text-center text-[0.84rem] text-slate-500">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                  Masuk di sini
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

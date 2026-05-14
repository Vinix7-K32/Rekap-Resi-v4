"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import {
  INVALID_ORIGIN_MESSAGE,
  getTrustedRedirectUrl,
  isSameOriginRequest,
} from "@/lib/request-guards";
import {
  AUTH_RATE_LIMIT,
  RATE_LIMIT_MESSAGE,
  checkRateLimit,
  getClientIp,
} from "@/lib/rate-limit";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Password wajib diisi." }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: "Konfirmasi password tidak cocok.",
  path: ["confirm"],
});

export async function loginAction(previousState, formData) {
  void previousState;

  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    return { error: INVALID_ORIGIN_MESSAGE };
  }
  
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  
  const { email, password } = parsed.data;
  const rateLimit = checkRateLimit(
    `auth:login:${getClientIp(headerStore)}:${email.toLowerCase()}`,
    AUTH_RATE_LIMIT
  );

  if (!rateLimit.ok) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function registerAction(previousState, formData) {
  void previousState;

  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    return { error: INVALID_ORIGIN_MESSAGE };
  }
  
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const rateLimit = checkRateLimit(
    `auth:register:${getClientIp(headerStore)}:${email.toLowerCase()}`,
    AUTH_RATE_LIMIT
  );

  if (!rateLimit.ok) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const emailRedirectTo = getTrustedRedirectUrl(headerStore, "/login");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: name ? { name } : undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Cek email Anda untuk verifikasi akun." };
}

export async function logoutAction() {
  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    redirect("/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

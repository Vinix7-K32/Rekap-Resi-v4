"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { INVALID_ORIGIN_MESSAGE, isSameOriginRequest } from "@/lib/request-guards";
import {
  CREATE_RESI_RATE_LIMIT,
  MAX_RESI_PER_USER,
  RATE_LIMIT_MESSAGE,
  RESI_LIMIT_MESSAGE,
  checkRateLimit,
} from "@/lib/rate-limit";
import {
  KURIR_MESSAGE,
  MARKETPLACE_MESSAGE,
  NOMOR_RESI_MESSAGE,
  TEXT_FIELD_MAX_LENGTH,
  isAllowedKurir,
  isAllowedMarketplace,
  isValidNomorResi,
  normalizeNomorResi,
} from "@/lib/resi-validation";
import { serializeResi } from "@/lib/resi-serializers";

const tambahResiSchema = z.object({
  nomor_resi: z.string().transform(normalizeNomorResi).refine(isValidNomorResi, {
    message: NOMOR_RESI_MESSAGE,
  }),
  marketplace: z.string().trim().refine(isAllowedMarketplace, { message: MARKETPLACE_MESSAGE }),
  kurir: z.string().trim().refine(isAllowedKurir, { message: KURIR_MESSAGE }),
  tanggal: z
    .string()
    .trim()
    .min(1, { message: "Tanggal wajib diisi." })
    .max(10, { message: "Format tanggal tidak valid." })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal tidak valid.",
    }),
  nama_penerima: z
    .string()
    .trim()
    .max(TEXT_FIELD_MAX_LENGTH, { message: "Nama penerima maksimal 80 karakter." })
    .optional(),
});

async function enforceResiCreateLimits(userId, nomorResi) {
  const rateLimit = checkRateLimit(`resi:create:${userId}`, CREATE_RESI_RATE_LIMIT);

  if (!rateLimit.ok) {
    return RATE_LIMIT_MESSAGE;
  }

  const [existingResi, totalResi] = await prisma.$transaction([
    prisma.resi.findFirst({
      where: { user_id: userId, nomor_resi: nomorResi },
      select: { id: true },
    }),
    prisma.resi.count({ where: { user_id: userId } }),
  ]);

  if (existingResi) {
    return null;
  }

  if (totalResi >= MAX_RESI_PER_USER) {
    return RESI_LIMIT_MESSAGE;
  }

  return null;
}

export async function tambahResiAction(previousState, formData) {
  void previousState;

  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    return { error: INVALID_ORIGIN_MESSAGE, success: false };
  }
  
  const parsed = tambahResiSchema.safeParse(Object.fromEntries(formData));
  
  if (!parsed.success) {
    return { 
      fieldErrors: parsed.error.flatten().fieldErrors,
      success: false 
    };
  }

  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized.", success: false };
  }

  const { nomor_resi, marketplace, kurir, tanggal, nama_penerima } = parsed.data;
  const normalizedNomorResi = nomor_resi;
  const limitError = await enforceResiCreateLimits(user.sub, normalizedNomorResi);

  if (limitError) {
    return { error: limitError, success: false };
  }

  const parsedTanggal = new Date(tanggal);

  try {
    const created = await prisma.resi.create({
      data: {
        user_id: user.sub,
        nomor_resi: normalizedNomorResi,
        marketplace,
        kurir,
        status: "Diterima",
        tanggal: parsedTanggal,
        nama_penerima: nama_penerima || null,
      },
    });

    return { 
      success: true, 
      message: "Resi berhasil disimpan!", 
      data: serializeResi(created),
      fieldErrors: {}
    };
  } catch (error) {
    if (error?.code === "P2002") {
      return { error: "Nomor resi sudah terdaftar.", success: false };
    }
    return { error: "Gagal menyimpan resi.", success: false };
  }
}

/**
 * Server Action untuk alur scanner.
 * Menerima nomor_resi (string) — marketplace, kurir, tanggal default ke nilai generik.
 * Status selalu "Diterima".
 * Mengembalikan { duplicate: true, nomor_resi } jika P2002 agar page.js
 * bisa menampilkan item di tabel error sementara.
 */
export async function tambahResiByScanner(nomor_resi) {
  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    return { success: false, error: INVALID_ORIGIN_MESSAGE };
  }

  const trimmed = normalizeNomorResi(nomor_resi);

  if (!isValidNomorResi(trimmed)) {
    return { success: false, error: NOMOR_RESI_MESSAGE };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const limitError = await enforceResiCreateLimits(user.sub, trimmed);

  if (limitError) {
    return { success: false, error: limitError };
  }

  try {
    const created = await prisma.resi.create({
      data: {
        user_id: user.sub,
        nomor_resi: trimmed,
        marketplace: "-",
        kurir: "-",
        status: "Diterima",
        tanggal: new Date(),
        nama_penerima: null,
      },
    });

    return { success: true, data: serializeResi(created) };
  } catch (error) {
    if (error?.code === "P2002") {
      return { success: false, duplicate: true, nomor_resi: trimmed };
    }
    return { success: false, error: "Gagal menyimpan resi." };
  }
}

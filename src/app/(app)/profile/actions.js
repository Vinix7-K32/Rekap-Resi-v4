"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/server";
import { INVALID_ORIGIN_MESSAGE, isSameOriginRequest } from "@/lib/request-guards";
import {
  AUTH_RATE_LIMIT,
  RATE_LIMIT_MESSAGE,
  checkRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Nama minimal 2 karakter." })
    .max(80, { message: "Nama maksimal 80 karakter." }),
  phone: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z
      .string()
      .max(24, { message: "Nomor telepon maksimal 24 karakter." })
      .refine((value) => value === "" || /^[+\d\s-]+$/.test(value), {
        message: "Nomor telepon hanya boleh berisi +, angka, spasi, atau tanda hubung.",
      })
  ),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Password saat ini wajib diisi." }),
    newPassword: z.string().min(6, { message: "Password baru minimal 6 karakter." }),
    confirmPassword: z.string().min(1, { message: "Konfirmasi password wajib diisi." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const AVATAR_SIGNED_URL_TTL = 60 * 60;
const AVATAR_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function revalidateProfileConsumers() {
  revalidatePath("/profile");
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function updateProfileAction(previousState, formData) {
  void previousState;

  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    return { success: false, error: INVALID_ORIGIN_MESSAGE };
  }

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  const { name, phone } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      name,
      phone,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateProfileConsumers();

  return {
    success: true,
    message: "Profil berhasil diperbarui.",
    fieldErrors: {},
  };
}

function validateAvatarFile(file) {
  if (!file || typeof file !== "object" || !("size" in file) || !("type" in file)) {
    return { error: "File avatar wajib dipilih." };
  }

  if (file.size === 0) {
    return { error: "File avatar wajib dipilih." };
  }

  if (!AVATAR_TYPES[file.type]) {
    return { error: "Format avatar harus JPG, PNG, atau WebP." };
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return { error: "Ukuran avatar maksimal 2 MB." };
  }

  return { ext: AVATAR_TYPES[file.type] };
}

async function cleanupOldAvatarVariants(supabase, userId, currentPath) {
  const stalePaths = Object.values(AVATAR_TYPES)
    .map((ext) => `${userId}/avatar.${ext}`)
    .filter((path) => path !== currentPath);

  if (stalePaths.length === 0) return;

  try {
    await supabase.storage.from(AVATAR_BUCKET).remove(stalePaths);
  } catch {
    // Best-effort cleanup should not block a successful avatar update.
  }
}

export async function avatarUploadAction(previousState, formData) {
  void previousState;

  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    return { success: false, error: INVALID_ORIGIN_MESSAGE };
  }

  const file = formData.get("avatar");
  const validation = validateAvatarFile(file);

  if (validation.error) {
    return {
      success: false,
      error: validation.error,
      fieldErrors: {
        avatar: [validation.error],
      },
    };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  const userId = user.id ?? user.sub;
  const filePath = `${userId}/avatar.${validation.ext}`;
  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: true,
  });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(filePath, AVATAR_SIGNED_URL_TTL);

  if (signedUrlError) {
    return { success: false, error: signedUrlError.message };
  }

  const avatarUrl = signedUrlData?.signedUrl;
  if (!avatarUrl) {
    return { success: false, error: "Gagal membuat URL avatar sementara." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      avatar_path: filePath,
    },
  });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await cleanupOldAvatarVariants(supabase, userId, filePath);

  revalidateProfileConsumers();

  return {
    success: true,
    message: "Avatar berhasil diperbarui.",
    avatarUrl,
    fieldErrors: {},
  };
}

export async function updatePasswordAction(previousState, formData) {
  void previousState;

  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    return { success: false, error: INVALID_ORIGIN_MESSAGE };
  }

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
  }

  if (!user.email) {
    return { success: false, error: "Email akun tidak ditemukan." };
  }

  const { currentPassword, newPassword } = parsed.data;
  const rateLimit = checkRateLimit(
    `profile:password:${getClientIp(headerStore)}:${user.sub}`,
    AUTH_RATE_LIMIT
  );

  if (!rateLimit.ok) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, error: "Password saat ini tidak sesuai." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return {
    success: true,
    message: "Password berhasil diperbarui.",
    fieldErrors: {},
  };
}

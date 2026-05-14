"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { INVALID_ORIGIN_MESSAGE, isSameOriginRequest } from "@/lib/request-guards";
import {
  CREATE_MARKETPLACE_RESI_RATE_LIMIT,
  MARKETPLACE_RESI_LIMIT_MESSAGE,
  MAX_MARKETPLACE_RESI_PER_USER,
  RATE_LIMIT_MESSAGE,
  checkRateLimit,
} from "@/lib/rate-limit";
import {
  MARKETPLACE_MESSAGE,
  NOMOR_RESI_MESSAGE,
  isAllowedMarketplace,
  isValidNomorResi,
  normalizeNomorResi,
} from "@/lib/resi-validation";
import { serializeMarketplaceResi } from "@/lib/resi-serializers";

const addMarketplaceResiSchema = z.object({
  nomor_resi: z.string().transform(normalizeNomorResi).refine(isValidNomorResi, {
    message: NOMOR_RESI_MESSAGE,
  }),
  marketplace: z.string().trim().refine(isAllowedMarketplace, { message: MARKETPLACE_MESSAGE }),
});

async function enforceMarketplaceResiCreateLimits(userId, nomorResi) {
  const rateLimit = checkRateLimit(
    `marketplace-resi:create:${userId}`,
    CREATE_MARKETPLACE_RESI_RATE_LIMIT
  );

  if (!rateLimit.ok) {
    return RATE_LIMIT_MESSAGE;
  }

  const [existingResi, totalResi] = await prisma.$transaction([
    prisma.marketplaceResi.findFirst({
      where: { user_id: userId, nomor_resi: nomorResi },
      select: { id: true },
    }),
    prisma.marketplaceResi.count({ where: { user_id: userId } }),
  ]);

  if (existingResi) {
    return null;
  }

  if (totalResi >= MAX_MARKETPLACE_RESI_PER_USER) {
    return MARKETPLACE_RESI_LIMIT_MESSAGE;
  }

  return null;
}

export async function addMarketplaceResiAction(previousState, formData) {
  void previousState;

  const headerStore = await headers();
  if (!isSameOriginRequest(headerStore)) {
    return { error: INVALID_ORIGIN_MESSAGE, success: false };
  }

  const parsed = addMarketplaceResiSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      success: false,
    };
  }

  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized.", success: false };
  }

  const { nomor_resi, marketplace } = parsed.data;
  const normalizedNomorResi = nomor_resi;
  const limitError = await enforceMarketplaceResiCreateLimits(user.sub, normalizedNomorResi);

  if (limitError) {
    return { error: limitError, success: false };
  }

  try {
    const created = await prisma.marketplaceResi.create({
      data: {
        user_id: user.sub,
        nomor_resi: normalizedNomorResi,
        marketplace,
      },
    });

    return {
      success: true,
      data: serializeMarketplaceResi(created),
      fieldErrors: {},
    };
  } catch (error) {
    if (error?.code === "P2002") {
      return { error: "Nomor resi sudah terdaftar.", success: false };
    }
    return { error: "Gagal menyimpan data marketplace.", success: false };
  }
}

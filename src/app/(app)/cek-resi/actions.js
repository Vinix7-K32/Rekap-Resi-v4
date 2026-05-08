"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

const addMarketplaceResiSchema = z.object({
  nomor_resi: z.string().min(6, { message: "Nomor resi minimal 6 karakter." }).trim(),
  marketplace: z.string().min(1, { message: "Pilih marketplace." }),
});

export async function addMarketplaceResiAction(previousState, formData) {
  void previousState;

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

  try {
    const created = await prisma.marketplaceResi.create({
      data: {
        user_id: user.sub,
        nomor_resi: nomor_resi.toUpperCase(),
        marketplace,
      },
    });

    return {
      success: true,
      data: {
        ...created,
        created_at: created.created_at ? created.created_at.toISOString() : null,
        updated_at: created.updated_at ? created.updated_at.toISOString() : null,
      },
      fieldErrors: {},
    };
  } catch (error) {
    if (error?.code === "P2002") {
      return { error: "Nomor resi sudah terdaftar.", success: false };
    }
    return { error: "Gagal menyimpan data marketplace.", success: false };
  }
}

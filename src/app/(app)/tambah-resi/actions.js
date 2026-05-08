"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

const tambahResiSchema = z.object({
  nomor_resi: z.string().min(6, { message: "Nomor resi minimal 6 karakter." }).trim(),
  marketplace: z.string().min(1, { message: "Pilih marketplace." }),
  kurir: z.string().min(1, { message: "Pilih kurir." }),
  tanggal: z.string().min(1, { message: "Tanggal wajib diisi." }).refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid.",
  }),
  nama_penerima: z.string().optional(),
});

export async function tambahResiAction(previousState, formData) {
  void previousState;
  
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
  const parsedTanggal = new Date(tanggal);

  try {
    const created = await prisma.resi.create({
      data: {
        user_id: user.sub,
        nomor_resi: nomor_resi.toUpperCase(),
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
      data: created,
      fieldErrors: {}
    };
  } catch (error) {
    if (error?.code === "P2002") {
      return { error: "Nomor resi sudah terdaftar.", success: false };
    }
    return { error: "Gagal menyimpan resi.", success: false };
  }
}

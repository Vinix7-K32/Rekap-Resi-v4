import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = new Set(['Menunggu', 'Diterima', 'Selesai']);

const serializeResi = (resi) => ({
  ...resi,
  tanggal: resi.tanggal ? resi.tanggal.toISOString().split('T')[0] : null,
  created_at: resi.created_at ? resi.created_at.toISOString() : null,
  updated_at: resi.updated_at ? resi.updated_at.toISOString() : null,
});

export async function GET() {
  try {
    const data = await prisma.resi.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ data: data.map(serializeResi) });
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Gagal memuat data resi.' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const nomor_resi = `${payload?.nomor_resi ?? ''}`.trim().toUpperCase();
    const marketplace = `${payload?.marketplace ?? ''}`.trim();
    const kurir = `${payload?.kurir ?? ''}`.trim();
    const status = `${payload?.status ?? ''}`.trim() || 'Diterima';
    const nama_penerima = `${payload?.nama_penerima ?? ''}`.trim();
    const tanggal = `${payload?.tanggal ?? ''}`.trim();

    if (!nomor_resi || !marketplace || !kurir || !tanggal) {
      return NextResponse.json(
        { error: { message: 'Field wajib belum lengkap.' } },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: { message: 'Status resi tidak valid.' } },
        { status: 400 }
      );
    }

    const parsedTanggal = new Date(tanggal);
    if (Number.isNaN(parsedTanggal.getTime())) {
      return NextResponse.json(
        { error: { message: 'Format tanggal tidak valid.' } },
        { status: 400 }
      );
    }

    const created = await prisma.resi.create({
      data: {
        nomor_resi,
        marketplace,
        kurir,
        status,
        tanggal: parsedTanggal,
        nama_penerima: nama_penerima || null,
      },
    });

    return NextResponse.json({ data: serializeResi(created) }, { status: 201 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: { message: 'Nomor resi sudah terdaftar.' } },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: { message: 'Gagal menyimpan resi.' } },
      { status: 500 }
    );
  }
}

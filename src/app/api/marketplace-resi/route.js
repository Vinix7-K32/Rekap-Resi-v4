import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

const serializeMarketplaceResi = (resi) => ({
  ...resi,
  created_at: resi.created_at ? resi.created_at.toISOString() : null,
  updated_at: resi.updated_at ? resi.updated_at.toISOString() : null,
});

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'Unauthorized.' } }, { status: 401 });
  }

  try {
    const data = await prisma.marketplaceResi.findMany({
      where: { user_id: user.sub },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ data: data.map(serializeMarketplaceResi) });
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Gagal memuat data marketplace.' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'Unauthorized.' } }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const nomor_resi = `${payload?.nomor_resi ?? ''}`.trim().toUpperCase();
    const marketplace = `${payload?.marketplace ?? ''}`.trim();

    if (!nomor_resi || !marketplace) {
      return NextResponse.json(
        { error: { message: 'Nomor resi dan marketplace wajib diisi.' } },
        { status: 400 }
      );
    }

    const created = await prisma.marketplaceResi.create({
      data: {
        user_id: user.sub,
        nomor_resi,
        marketplace,
      },
    });

    return NextResponse.json(
      { data: serializeMarketplaceResi(created) },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: { message: 'Nomor resi marketplace sudah terdaftar.' } },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: { message: 'Gagal menyimpan resi marketplace.' } },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'Unauthorized.' } }, { status: 401 });
  }

  try {
    const deleted = await prisma.marketplaceResi.deleteMany({
      where: { user_id: user.sub },
    });
    return NextResponse.json({ data: { count: deleted.count } });
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Gagal menghapus data marketplace.' } },
      { status: 500 }
    );
  }
}

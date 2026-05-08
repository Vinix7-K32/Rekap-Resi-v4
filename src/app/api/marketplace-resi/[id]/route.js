import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

const serializeMarketplaceResi = (resi) => ({
  ...resi,
  created_at: resi.created_at ? resi.created_at.toISOString() : null,
  updated_at: resi.updated_at ? resi.updated_at.toISOString() : null,
});

export async function DELETE(request, { params }) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'Unauthorized.' } }, { status: 401 });
  }

  const { id } = (await params) ?? {};

  if (!id) {
    return NextResponse.json(
      { error: { message: 'Id resi marketplace wajib diisi.' } },
      { status: 400 }
    );
  }

  try {
    const deleted = await prisma.marketplaceResi.delete({
      where: { id, user_id: user.sub },
    });

    return NextResponse.json({ data: serializeMarketplaceResi(deleted) });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: { message: 'Resi marketplace tidak ditemukan.' } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: { message: 'Gagal menghapus resi marketplace.' } },
      { status: 500 }
    );
  }
}

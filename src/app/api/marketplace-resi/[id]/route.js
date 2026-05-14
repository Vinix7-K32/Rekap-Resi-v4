import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { INVALID_ORIGIN_MESSAGE, isSameOriginRequest } from '@/lib/request-guards';
import { serializeMarketplaceResi } from '@/lib/resi-serializers';

export async function DELETE(request, { params }) {
  if (!isSameOriginRequest(request.headers)) {
    return NextResponse.json({ error: { message: INVALID_ORIGIN_MESSAGE } }, { status: 403 });
  }

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

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { INVALID_ORIGIN_MESSAGE, isSameOriginRequest } from '@/lib/request-guards';
import { serializeMarketplaceResi } from '@/lib/resi-serializers';

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



export async function DELETE(request) {
  if (!isSameOriginRequest(request.headers)) {
    return NextResponse.json({ error: { message: INVALID_ORIGIN_MESSAGE } }, { status: 403 });
  }

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

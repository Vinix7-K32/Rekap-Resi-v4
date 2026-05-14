import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { serializeResi } from '@/lib/resi-serializers';

const VALID_STATUSES = new Set(['Menunggu', 'Diterima', 'Selesai']);

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: { message: 'Unauthorized.' } }, { status: 401 });
  }

  try {
    const data = await prisma.resi.findMany({
      where: { user_id: user.sub },
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

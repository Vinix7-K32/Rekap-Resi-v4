import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { INVALID_ORIGIN_MESSAGE, isSameOriginRequest } from '@/lib/request-guards';
import { serializeResi } from '@/lib/resi-serializers';

const VALID_STATUSES = new Set(['Menunggu', 'Diterima', 'Selesai']);

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
      { error: { message: 'Id resi wajib diisi.' } },
      { status: 400 }
    );
  }

  try {
    const deleted = await prisma.resi.delete({
      where: { id, user_id: user.sub },
    });

    return NextResponse.json({ data: serializeResi(deleted) });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: { message: 'Resi tidak ditemukan.' } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: { message: 'Gagal menghapus resi.' } },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
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
      { error: { message: 'Id resi wajib diisi.' } },
      { status: 400 }
    );
  }

  try {
    const payload = await request.json().catch(() => ({}));
    const status = `${payload?.status ?? ''}`.trim();

    if (!status) {
      return NextResponse.json(
        { error: { message: 'Status resi wajib diisi.' } },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: { message: 'Status resi tidak valid.' } },
        { status: 400 }
      );
    }

    const updated = await prisma.resi.update({
      where: { id, user_id: user.sub },
      data: { status },
    });

    return NextResponse.json({ data: serializeResi(updated) });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: { message: 'Resi tidak ditemukan.' } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: { message: 'Gagal memperbarui resi.' } },
      { status: 500 }
    );
  }
}

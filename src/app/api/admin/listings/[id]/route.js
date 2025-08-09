import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden (admin only)' }, { status: 403 });
  }

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    // If you don't have FK cascade, uncomment:
    // await prisma.photo.deleteMany({ where: { listingId: id } });

    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/admin/listings/[id] failed:', e);
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: 'Listing not found', code: 'P2025' }, { status: 404 });
    }
    if (e?.code === 'P2003') {
      return NextResponse.json({ error: 'Delete blocked by foreign key constraint', code: 'P2003' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error deleting listing' }, { status: 500 });
  }
}

// (Optional) quick test endpoint — remove after testing
export async function GET(_req, { params }) {
  return NextResponse.json({ ok: true, id: Number(params.id) });
}

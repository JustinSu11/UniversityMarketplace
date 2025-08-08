import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORY_IMAGE = {
  BOOKS: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
  ELECTRONICS: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
  FURNITURE: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef5?q=80&w=1600&auto=format&fit=crop',
  CLOTHING: 'https://images.unsplash.com/photo-1528701800489-20be3c2ea1b4?q=80&w=1600&auto=format&fit=crop',
  SPORTS: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1600&auto=format&fit=crop',
  MUSICAL_INSTRUMENTS: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1600&auto=format&fit=crop',
  OTHER: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600&auto=format&fit=crop',
};

export async function POST() {
  try {
    const listings = await prisma.listing.findMany({
      where: { OR: [{ images: null }, { images: '' }] },
      select: { id: true, category: true },
    });

    let updated = 0;
    for (const l of listings) {
      const url = CATEGORY_IMAGE[l.category] || CATEGORY_IMAGE.OTHER;
      await prisma.listing.update({
        where: { id: l.id },
        data: { images: JSON.stringify([url]) },
      });
      updated += 1;
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Error backfilling images:', error);
    return NextResponse.json({ success: false, error: 'Failed to backfill images' }, { status: 500 });
  }
}



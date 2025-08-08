import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  if (isNaN(parseInt(id, 10))) {
    return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true, // Include the seller's profile image
          },
        },
        photos: true, // Include all related photos
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // parse JSON tags
    const parsedListing = {
      ...listing,
      tags: listing.tags ? JSON.parse(listing.tags) : [],
    };

    return NextResponse.json(parsedListing);
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

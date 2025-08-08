import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/listings - Get all active listings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      status: 'ACTIVE',
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [rawListings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          photos: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    // Normalize tags from JSON string to array
    const listings = rawListings.map((listing) => {
      let tags = [];
      try {
        if (listing.tags) {
          tags = JSON.parse(listing.tags);
        }
      } catch (_) {
        // if parsing fails, keep it as an empty array
        tags = [];
      }
      return { ...listing, tags };
    });

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create a new listing
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, priceCents, category, condition, location, photos, tags, contactPreference } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Validate price
    if (priceCents && (typeof priceCents !== 'number' || priceCents < 0)) {
      return NextResponse.json(
        { error: 'Price must be a non-negative number' },
        { status: 400 }
      );
    }

    // Use the authenticated user's ID to create the listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        priceCents,
        category: category || 'OTHER',
        condition: condition || 'GOOD',
        location,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : null,
        contactPreference: contactPreference || 'EMAIL',
        sellerId: session.user.id,
        photos: {
          create: Array.isArray(photos) ? photos.map((url) => ({ url })) : [],
        },
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        photos: true,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
        if (error instanceof Prisma.PrismaClientValidationError) {
            return NextResponse.json({ error: 'Invalid data provided for listing creation.', details: error.message }, { status: 400 });
        }
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

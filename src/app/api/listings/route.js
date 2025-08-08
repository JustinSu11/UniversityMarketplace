import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    // Normalize JSON fields (images, tags) to arrays for clients
    const listings = rawListings.map((listing) => {
      let images = null;
      let tags = null;
      try {
        if (listing.images) {
          images = Array.isArray(listing.images)
            ? listing.images
            : JSON.parse(listing.images);
        }
      } catch (_) {
        images = null;
      }
      try {
        if (listing.tags) {
          tags = Array.isArray(listing.tags) ? listing.tags : JSON.parse(listing.tags);
        }
      } catch (_) {
        tags = null;
      }
      return { ...listing, images, tags };
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
  try {
    const body = await request.json();
    const {
      title,
      description,
      priceCents,
      category,
      condition,
      location,
      images,
      tags,
      sellerId,
    } = body;

    // Validate required fields
    if (!title || !sellerId) {
      return NextResponse.json(
        { error: 'Title and sellerId are required' },
        { status: 400 }
      );
    }

    // Validate price
    if (priceCents && priceCents < 0) {
      return NextResponse.json(
        { error: 'Price must be non-negative' },
        { status: 400 }
      );
    }

    // Create the listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        priceCents,
        category: category || 'OTHER',
        condition: condition || 'GOOD',
        location,
        images: images ? JSON.stringify(images) : null,
        tags: tags ? JSON.stringify(tags) : null,
        sellerId,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

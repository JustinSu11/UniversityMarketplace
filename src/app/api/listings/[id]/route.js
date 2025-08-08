import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/listings/[id] - Get a specific listing
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const listingId = parseInt(id);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    const raw = await prisma.listing.findUnique({
      where: { id: listingId },
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

    if (!raw) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Normalize JSON fields
    let images = null;
    let tags = null;
    try {
      if (raw.images) {
        images = Array.isArray(raw.images) ? raw.images : JSON.parse(raw.images);
      }
    } catch (_) {
      images = null;
    }
    try {
      if (raw.tags) {
        tags = Array.isArray(raw.tags) ? raw.tags : JSON.parse(raw.tags);
      }
    } catch (_) {
      tags = null;
    }

    return NextResponse.json({ ...raw, images, tags });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const listingId = parseInt(id);
    const body = await request.json();

    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    // Check if listing exists
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {};
    const allowedFields = [
      'title',
      'description',
      'priceCents',
      'category',
      'condition',
      'status',
      'location',
      'images',
      'tags',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'images' || field === 'tags') {
          updateData[field] = body[field] ? JSON.stringify(body[field]) : null;
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // Validate price if provided
    if (updateData.priceCents !== undefined && updateData.priceCents < 0) {
      return NextResponse.json(
        { error: 'Price must be non-negative' },
        { status: 400 }
      );
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: updateData,
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

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id] - Delete a listing (soft delete by setting status to DELETED)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const listingId = parseInt(id);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    // Check if listing exists
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to DELETED
    await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'DELETED' },
    });

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}

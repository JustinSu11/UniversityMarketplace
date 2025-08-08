import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

// GET /api/listings/[id] for a specific listing
export async function GET(request, { params }) {
  try {
    const listingId = parseInt(params.id, 10);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        photos: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Normalize the tags from a JSON string to an array
    let tags = [];
    try {
      if (listing.tags) {
        tags = JSON.parse(listing.tags);
      }
    } catch (_) {
      // if parsing fails, keep it as an empty array
      tags = [];
    }

    return NextResponse.json({ ...listing, tags });
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
    const body = await request.json();
    const listingId = parseInt(params.id, 10);

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
      'tags',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'tags') {
          updateData[field] = Array.isArray(body[field]) ? JSON.stringify(body[field]) : null;
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
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: 'Invalid data provided for listing update.', details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id] - Delete a listing (soft delete by setting status to DELETED)
export async function DELETE(request, { params }) {
  try {
    const listingId = parseInt(params.id, 10);

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

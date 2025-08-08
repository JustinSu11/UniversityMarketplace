import { NextResponse } from 'next/server';
import { seedListings } from '@/lib/seed-listings';

export async function POST() {
  try {
    const result = await seedListings();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

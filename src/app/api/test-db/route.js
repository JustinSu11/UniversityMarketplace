import { NextResponse } from 'next/server';
import { testDatabase } from '@/lib/test-db';

export async function GET() {
  try {
    const result = await testDatabase();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

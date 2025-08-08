import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function testDatabase() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test creating a listing
    const testListing = await prisma.listing.create({
      data: {
        title: 'Test Textbook - Introduction to Computer Science',
        description: 'Used textbook in good condition. Perfect for CS101 students.',
        priceCents: 2500, // $25.00
        category: 'BOOKS',
        condition: 'GOOD',
        location: 'Main Campus Library',
        sellerId: 1, // Assuming admin user exists
      },
    });

    console.log('✅ Test listing created:', testListing);

    // Test fetching listings
    const listings = await prisma.listing.findMany({
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

    console.log('✅ Fetched listings:', listings.length);

    // Clean up test listing
    await prisma.listing.delete({
      where: { id: testListing.id },
    });

    console.log('✅ Test listing cleaned up');

    await prisma.$disconnect();
    return { success: true, message: 'Database test completed successfully' };
  } catch (error) {
    console.error('❌ Database test failed:', error);
    await prisma.$disconnect();
    return { success: false, error: error.message };
  }
}

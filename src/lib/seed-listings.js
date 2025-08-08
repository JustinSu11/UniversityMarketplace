import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleListings = [
  {
    title: 'Calculus Textbook - Stewart 8th Edition',
    description: 'Excellent condition calculus textbook. Used for Math 101. No highlighting or writing inside.',
    priceCents: 3500, // $35.00
    category: 'BOOKS',
    condition: 'LIKE_NEW',
    location: 'Engineering Building',
    tags: JSON.stringify(['textbook', 'math', 'calculus']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop']),
    sellerId: 1,
  },
  {
    title: 'MacBook Air 2020 - 13 inch',
    description: 'Great laptop for students. 8GB RAM, 256GB SSD. Comes with charger and case.',
    priceCents: 75000, // $750.00
    category: 'ELECTRONICS',
    condition: 'GOOD',
    location: 'Computer Science Department',
    tags: JSON.stringify(['laptop', 'macbook', 'apple']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop']),
    sellerId: 1,
  },
  {
    title: 'Office Chair - Ergonomic',
    description: 'Comfortable office chair perfect for long study sessions. Adjustable height and backrest.',
    priceCents: 12000, // $120.00
    category: 'FURNITURE',
    condition: 'GOOD',
    location: 'Student Housing',
    tags: JSON.stringify(['chair', 'office', 'ergonomic']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1580480055273-228ff5388ef5?q=80&w=1600&auto=format&fit=crop']),
    sellerId: 1,
  },
  {
    title: 'Nike Running Shoes - Size 10',
    description: 'Lightweight running shoes. Perfect for gym or outdoor activities. Barely used.',
    priceCents: 4500, // $45.00
    category: 'CLOTHING',
    condition: 'LIKE_NEW',
    location: 'Athletic Center',
    tags: JSON.stringify(['shoes', 'nike', 'running']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1528701800489-20be3c2ea1b4?q=80&w=1600&auto=format&fit=crop']),
    sellerId: 1,
  },
  {
    title: 'Basketball - Official Size',
    description: 'Indoor/outdoor basketball. Good grip and bounce. Great for pickup games.',
    priceCents: 1500, // $15.00
    category: 'SPORTS',
    condition: 'GOOD',
    location: 'Recreation Center',
    tags: JSON.stringify(['basketball', 'sports', 'ball']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1600&auto=format&fit=crop']),
    sellerId: 1,
  },
  {
    title: 'Guitar - Acoustic',
    description: 'Beautiful acoustic guitar. Perfect for beginners. Includes case and extra strings.',
    priceCents: 8000, // $80.00
    category: 'MUSICAL_INSTRUMENTS',
    condition: 'FAIR',
    location: 'Music Department',
    tags: JSON.stringify(['guitar', 'acoustic', 'music']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1600&auto=format&fit=crop']),
    sellerId: 1,
  },
  {
    title: 'Physics Lab Manual',
    description: 'Complete lab manual for Physics 201. All experiments included with notes.',
    priceCents: 2000, // $20.00
    category: 'BOOKS',
    condition: 'GOOD',
    location: 'Physics Building',
    tags: JSON.stringify(['lab manual', 'physics', 'experiments']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600&auto=format&fit=crop']),
    sellerId: 1,
  },
  {
    title: 'iPad Pro 11 inch - 2021',
    description: 'Perfect for note-taking and digital art. Apple Pencil included. 128GB storage.',
    priceCents: 60000, // $600.00
    category: 'ELECTRONICS',
    condition: 'LIKE_NEW',
    location: 'Art Department',
    tags: JSON.stringify(['ipad', 'tablet', 'apple pencil']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1510557880182-3de6c0381c39?q=80&w=1600&auto=format&fit=crop']),
    sellerId: 1,
  },
];

export async function seedListings() {
  try {
    console.log('🌱 Starting to seed listings...');

    // Check if we already have listings
    const existingListings = await prisma.listing.count();
    if (existingListings > 0) {
      console.log(`⚠️  Database already has ${existingListings} listings. Skipping seed.`);
      return { success: true, message: 'Listings already exist' };
    }

    // Create sample listings
    const createdListings = await prisma.listing.createMany({
      data: sampleListings,
    });

    console.log(`✅ Created ${createdListings.count} sample listings`);

    // Fetch and display the created listings
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
      orderBy: { createdAt: 'desc' },
    });

    console.log('📋 Sample listings created:');
    listings.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.title} - $${(listing.priceCents / 100).toFixed(2)}`);
    });

    return { success: true, count: createdListings.count };
  } catch (error) {
    console.error('❌ Error seeding listings:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

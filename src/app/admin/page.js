import prisma from '@/lib/prisma';
import AdminListingTable from './AdminListingTable';

export default async function AdminPage() {
  // You’re already protected by middleware, but this runs server-side anyway.
  const listings = await prisma.listing.findMany({
    include: { seller: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin — Listings</h1>
      <AdminListingTable initialListings={listings} />
    </main>
  );
}

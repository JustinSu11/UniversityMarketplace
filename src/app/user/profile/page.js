import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import ProfileSidebar from '@/components/ProfileSidebar';
import UserListingCard from '@/components/UserListingCard';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userPayload = session?.user;

  if (!userPayload) {
    redirect('/api/auth/signin');
  }

  // Fetch user details and their listings in parallel
  const [user, listings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userPayload.id },
      select: { name: true, email: true, role: true, image: true },
    }),
    prisma.listing.findMany({
      where: { sellerId: userPayload.id, status: { not: 'DELETED' } },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: {
          take: 1,
        },
      },
    }),
  ]);

  if (!user) {
    // If user not found, redirect to sign-in (rare case)
    redirect('/api/auth/signin');
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar user={user} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            My Listings
          </h1>
          <Link
            href="/newListing"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create New Listing
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <UserListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">You have not created any listings yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
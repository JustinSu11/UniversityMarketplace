import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProfileSidebar from '@/components/ProfileSidebar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link'
import Image from 'next/image'


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
            listings.map((listing) => {
              const firstImage = Array.isArray(listing.photos) && listing.photos.length > 0 ? listing.photos[0].url : null;
              return (
                <Link href={`/detailedListing/${listing.id}`} key={listing.id} className="block group">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                    <div className="relative w-full bg-gray-100 dark:bg-gray-700" style={{ paddingTop: '56.25%' }}>
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-gray-400 text-4xl">📦</div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{listing.title}</h2>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                        {listing.priceCents ? `$${(listing.priceCents / 100).toFixed(2)}` : 'Free'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">You have not created any listings yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
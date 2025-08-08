import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProfileSidebar from '@/components/ProfileSidebar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  // The user object from the session contains the id and role
  const userPayload = session?.user;

  if (!userPayload) {
    //redirect to the sign-in page.
    redirect('/api/auth/signin');
  }

  // Fetch user details and their listings in parallel
  const [user, listings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userPayload.id },
      select: { name: true, email: true, role: true },
    }),
    prisma.listing.findMany({
      where: { sellerId: userPayload.id },
      orderBy: { createdAt: 'desc' },
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
          My Listings
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{listing.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 h-24 overflow-hidden text-ellipsis">{listing.description}</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-4">
                  ${(listing.priceCents / 100).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">You have not created any listings yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
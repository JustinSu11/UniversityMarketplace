import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';

async function getListing(id) {
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    return null;
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      seller: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
      photos: true,
    },
  });

  return listing;
}

export default async function DetailedListing({ params }) {
  const listing = await getListing(params.id);
  
  if (!listing) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Media */}
          <div className="mb-6">
            <div className="relative w-full bg-gray-100 rounded" style={{ paddingTop: '56.25%' }}>
              {Array.isArray(listing.photos) && listing.photos.length > 0 ? (
                <Image
                  src={listing.photos[0].url}
                  alt={listing.title}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400 text-6xl">📦</div>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
          <p className="text-gray-600 mb-4">{listing.description}</p>
          <div className="text-2xl font-bold text-blue-600 mb-4">
            {listing.priceCents ? `$${(listing.priceCents / 100).toFixed(2)}` : 'Price not available'}
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Seller Information</h2>
            {listing.seller ? (
              <div className="flex items-center space-x-4">
                <div className="text-gray-600 space-y-1">
                  <p>
                    <strong>Name:</strong> {listing.seller.name || 'N/A'}
                  </p>
                  {(listing.contactPreference === 'EMAIL' || listing.contactPreference === 'BOTH') && listing.seller.email && (
                    <p>
                      <strong>Email:</strong> <a href={`mailto:${listing.seller.email}`} className="text-blue-600 hover:underline">{listing.seller.email}</a>
                    </p>
                  )}
                  {(listing.contactPreference === 'PHONE' || listing.contactPreference === 'BOTH') && listing.seller.phoneNumber && (
                    <p>
                      <strong>Phone:</strong> <a href={`tel:${listing.seller.phoneNumber}`} className="text-blue-600 hover:underline">{listing.seller.phoneNumber}</a>
                    </p>
                  )}
                  {/* Fallback for older listings or if preference is somehow null, defaults to email. */}
                  {!listing.contactPreference && listing.seller.email && (
                     <p>
                      <strong>Email:</strong> <a href={`mailto:${listing.seller.email}`} className="text-blue-600 hover:underline">{listing.seller.email}</a>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Seller information is not available.</p>
            )}
          </div>
          <Button asChild className="mt-6">
            <Link href="/">Back to Listings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

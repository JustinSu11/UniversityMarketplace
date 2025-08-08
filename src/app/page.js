'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';


export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();


  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/listings');
        const data = await response.json();

        if (response.ok) {
          setListings(data.listings || []);
        } else {
          setError(data.error || 'Failed to fetch listings');
        }
      } catch (err) {
        setError('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Listings</h1>
        <p className="text-gray-600 mb-8">Found {listings.length} listings</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => {
            const firstImage = Array.isArray(listing.photos) && listing.photos.length > 0 ? listing.photos[0].url : null;
            return (
              <div key={listing.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative w-full bg-gray-100" style={{ paddingTop: '56.25%' }}>
                  {firstImage ? (
                    <Image
                      src={firstImage} // This now correctly uses the URL from the Photo model
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
                  <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
                  <p className="text-blue-600 font-bold mb-2">
                    ${(listing.priceCents / 100).toFixed(2)}
                  </p>
                  <Link
                    href={`/detailedListing/${listing.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      {status === 'authenticated' && (
        <Link
          href="/newListing"
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Create new listing"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
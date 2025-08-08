'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function DetailedListing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/listings/${params.id}`);
        const data = await response.json();

        if (response.ok) {
          setListing(data);
        } else {
          setError(data.error || 'Failed to fetch listing');
        }
      } catch (err) {
        setError('Failed to fetch listing');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
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
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Media */}
          <div className="mb-6">
            <div className="relative w-full bg-gray-100 rounded" style={{ paddingTop: '56.25%' }}>
              {Array.isArray(listing.images) && listing.images.length > 0 ? (
                <Image
                  src={listing.images[0]}
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
            ${(listing.priceCents / 100).toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 mb-4">ID: {params.id}</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    </div>
  );
}

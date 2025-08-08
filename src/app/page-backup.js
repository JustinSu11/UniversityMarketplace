'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { formatPrice, getCategoryDisplayName, getConditionDisplayName, parseJsonSafely } from '@/lib/listings';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/listings?${params}`);
      const data = await response.json();

      if (response.ok) {
        setListings(data.listings);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch listings');
      }
    } catch (err) {
      setError('Failed to fetch listings');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search]);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'BOOKS', label: 'Books' },
    { value: 'ELECTRONICS', label: 'Electronics' },
    { value: 'FURNITURE', label: 'Furniture' },
    { value: 'CLOTHING', label: 'Clothing' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'MUSICAL_INSTRUMENTS', label: 'Musical Instruments' },
    { value: 'OTHER', label: 'Other' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Listings</h1>
            <p className="text-gray-600">Find great deals from your fellow students</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search listings..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {listings.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.category
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a listing!'}
            </p>
            {!filters.search && !filters.category && (
              <Link
                href="/newListing"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Your First Listing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing }) {
  const tags = parseJsonSafely(listing.tags) || [];

  return (
    <Link href={`/detailedListing/${listing.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Image placeholder */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-4xl">📦</div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
            <span className="text-lg font-bold text-blue-600 ml-2">
              {formatPrice(listing.priceCents)}
            </span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {getCategoryDisplayName(listing.category)}
            </span>
            <span className="text-gray-500">{getConditionDisplayName(listing.condition)}</span>
          </div>

          {listing.location && (
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <span className="mr-1">📍</span>
              <span className="truncate">{listing.location}</span>
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>By {listing.seller.name || listing.seller.email}</span>
            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
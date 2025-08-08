'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function UserListingCard({ listing }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete listing.');
      }

      // Refresh the page to show the updated list of listings
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const firstImage = Array.isArray(listing.photos) && listing.photos.length > 0 ? listing.photos[0].url : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl group">
      <Link href={`/detailedListing/${listing.id}`} className="block">
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
      </Link>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will mark the listing as deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {error && <p className="px-4 pb-4 text-sm text-red-500">{error}</p>}
    </div>
  );
}


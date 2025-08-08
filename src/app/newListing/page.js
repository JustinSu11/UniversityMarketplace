'use client';

import { useRouter } from 'next/navigation';
import NewListingForm from '@/components/ui/NewListingForm';

export default function NewListingPage() {
  const router = useRouter();

  return (
    <div className="p-6 flex justify-center">
      <NewListingForm
        onSuccess={() => router.push('/')} // go back to home after creating
      />
    </div>
  );
}

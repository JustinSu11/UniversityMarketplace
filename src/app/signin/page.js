'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import SignInForm from '@/components/ui/SignInForm';

export default function SignInPage() {
  const router = useRouter();
  const search = useSearchParams();
  // default to after-login router
  const next = search.get('next') || '/after-login';

  return (
    <div className="p-6 flex justify-center">
      <SignInForm
        nextPath={next}
        onSwitchToSignUp={() => router.push(`/signup?next=${encodeURIComponent(next)}`)}
      />
    </div>
  );
}

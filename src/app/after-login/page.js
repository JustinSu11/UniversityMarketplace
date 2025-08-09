import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AfterLogin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/signin');
  }
  redirect(session.user.role === 'ADMIN' ? '/admin' : '/user');
}

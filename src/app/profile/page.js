import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if(!session) {
        redirect('/')
    }

    return (
        <div className='container mx-auto py-8 px-4'>
            <h1 className='text-3xl font-bold mb-6'>Your Profile</h1>
            <div className='flex items-center gap-6 p-6 bg-card text-card-foreground rounded-lg border'>
                {session.user.image && (
                    <Image src={session.user.image} alt='profile picture' width={80} height={80} className='rounded-full' />
                )}
                <div>
                    <h2 className='text-2xl font-semibold'>{session.user.name}</h2>
                    <p className='text-muted-foreground'>{session.user.email}</p>
                </div>
            </div>
        </div>
    )
}

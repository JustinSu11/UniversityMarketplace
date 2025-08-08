'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import styles from "./navbar.module.css";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import SignInForm from '@/components/ui/SignInForm';
import SignUpForm from '@/components/ui/SignUpForm';
import NewListingForm from '@/components/ui/NewListingForm';
import { useState } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react'
import Providers from '@/components/Providers'
import { cn, getRandomColor } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


function AppLayout({ children }) {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleSignInOpen = (open) => setIsSignInOpen(open);
  const handleSignUpOpen = (open) => setIsSignUpOpen(open);

  const switchToSignUp = () => {
    handleSignInOpen(false);
    handleSignUpOpen(true);
  };

  const switchToSignIn = () => {
    handleSignUpOpen(false);
    handleSignInOpen(true);
  };

  return (
    <>
      <header>
        <nav className={styles.navbar}>
          <Link href="/" className={styles.websiteTitle}>Campus Exchange</Link>
          <div className={styles.navLinks}>
            <Link href="/">Browse</Link>
            <AuthButtons
              isSignInOpen={isSignInOpen}
              isSignUpOpen={isSignUpOpen}
              handleSignInOpen={handleSignInOpen}
              handleSignUpOpen={handleSignUpOpen}
              switchToSignIn={switchToSignIn}
              switchToSignUp={switchToSignUp}
            />
          </div>
        </nav>
      </header>
      <Providers>{children}</Providers>
    </>
  );
}

//sign in and sign up buttons, once user is authenticated, show their name and a sign out button
function AuthButtons({ isSignInOpen, isSignUpOpen, handleSignInOpen, handleSignUpOpen, switchToSignIn, switchToSignUp }) {
    const { data: session, status } = useSession();
    const [isNewListingOpen, setIsNewListingOpen] = useState(false);

    if (status === 'loading') {
        return <div className='text-sm font-medium text-gray-500'>Loading...</div>;
    }

    if (session) {
        // get the user's first name, falling back to the email if the name isn't available. Was used for top right but replaced it with profile picture
        const displayName = session.user.name ? session.user.name.split(' ')[0] : session.user.email;
        const colorClass = getRandomColor(session.user.name || session.user.email);
        //Display profile picture if available, otherwise show first letter of name in a circle
        return (
            <div className="flex items-center gap-4">
                {/* New Listing Button & Modal */}
                <Dialog open={isNewListingOpen} onOpenChange={setIsNewListingOpen}>
                    <DialogTrigger asChild>
                        <button className={styles.navLinkButton}>New Listing</button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[600px] p-4'>
                        <NewListingForm onClose={() => setIsNewListingOpen(false)} />
                    </DialogContent>
                </Dialog>

                {/* Profile Link */}
                <Link href='/profile' className={styles.navLinkButton}>{displayName}</Link>

                {/* Sign Out */}
                <button onClick={() => signOut()} className={styles.navLinkButton}>Sign out</button>
                <Link href='/user/profile'>
                    {session.user.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || 'User profile picture'}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    ) : (
                        <div className={cn( // Use w-8 h-8 to match the Image component size
                            'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                            colorClass
                        )}>
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </Link>
            </div>
        );
    }

    // Show Sign In & Sign Up if not logged in
    return (
        <>
            <Dialog open={isNewListingOpen} onOpenChange={setIsNewListingOpen}>
        <DialogTrigger asChild>
        <button className={styles.navLinkButton}>New Listing</button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px] p-4'>
           <NewListingForm onClose={() => setIsNewListingOpen(false)} />
           </DialogContent>
            </Dialog>
            <Dialog open={isSignInOpen} onOpenChange={handleSignInOpen}>
                <DialogTrigger asChild>
                    <button className={styles.navLinkButton}>Sign In</button>
                </DialogTrigger>
                <DialogTitle className="sr-only">Sign In</DialogTitle>
                <DialogContent className='sm:max-w-[425px] p-0'>
                    <SignInForm onSwitchToSignUp={switchToSignUp} />
                </DialogContent>
            </Dialog>
            <Dialog open={isSignUpOpen} onOpenChange={handleSignUpOpen}>
                <DialogTrigger asChild>
                    <button className={styles.navLinkButton}>Sign Up</button>
                </DialogTrigger>
                <DialogTitle className="sr-only">Sign Up</DialogTitle>
                <DialogContent className='sm:max-w-[425px] p-0'>
                    <SignUpForm onSwitchToSignIn={switchToSignIn} />
                </DialogContent>
            </Dialog>
        </>
    );
}


// The RootLayout wraps the entire application with the SessionProvider.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <AppLayout>{children}</AppLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
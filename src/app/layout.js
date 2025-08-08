'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./navbar.module.css";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import SignInForm from '@/components/ui/SignInForm';
import SignUpForm from '@/components/ui/SignUpForm';
import { useState } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react'

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
      <main>{children}</main>
    </>
  );
}

//sign in and sign up buttons, once user is authenticated, show their name and a sign out button
function AuthButtons({ isSignInOpen, isSignUpOpen, handleSignInOpen, handleSignUpOpen, switchToSignIn, switchToSignUp }) {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <div className='text-sm font-medium text-gray-500'>Loading...</div>
    }

    if (session) {
        // Safely get the user's first name, falling back to the email if the name isn't available.
        const displayName = session.user.name ? session.user.name.split(' ')[0] : session.user.email;

        return (
            <div className="flex items-center gap-4">
                <Link href='/profile' className={styles.navLinkButton}>{displayName}</Link>
                <button onClick={() => signOut()} className={styles.navLinkButton}>Sign out</button>
            </div>
        )
    }

    return (
        <>
            <Dialog open={isSignInOpen} onOpenChange={handleSignInOpen}>
                <DialogTrigger asChild>
                    <button className={styles.navLinkButton}>Sign In</button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px] p-0'>
                    <SignInForm onSwitchToSignUp={switchToSignUp} />
                </DialogContent>
            </Dialog>
            <Dialog open={isSignUpOpen} onOpenChange={handleSignUpOpen}>
                <DialogTrigger asChild>
                    <button className={styles.navLinkButton}>Sign Up</button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px] p-0'>
                    <SignUpForm onSwitchToSignIn={switchToSignIn} />
                </DialogContent>
            </Dialog>
        </>
    )
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

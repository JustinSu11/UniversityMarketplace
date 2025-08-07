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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header>
          <nav className={styles.navbar}>
            <Link href="/" className={styles.websiteTitle}>Campus Exchange</Link>
            <div className={styles.navLinks}>
              <Link href="/">Browse</Link>
              <Dialog open={isSignInOpen} onOpenChange={handleSignInOpen}>
                <DialogTrigger asChild>
                    <button className={styles.navLinkButton}>Sign In</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-0">
                    <SignInForm onSwitchToSignUp={switchToSignUp} />
                </DialogContent>
              </Dialog>
              <Dialog open={isSignUpOpen} onOpenChange={handleSignUpOpen}>
                <DialogTrigger asChild>
                    <button className={styles.navLinkButton}>Sign Up</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-0">
                    <SignUpForm onSwitchToSignIn={switchToSignIn} />
                </DialogContent>
              </Dialog>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

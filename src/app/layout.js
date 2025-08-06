import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./navbar.module.css"; // ✅ import the styles

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Campus Exchange",
  description: "Your trusted campus marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header>
          <nav className={styles.navbar}>
            <Link href="/" className={styles.websiteTitle}>Campus Exchange</Link>
            <div className={styles.navLinks}>
              <Link href="/detailedlisting">Browse</Link>
              <Link href="/signin">Sign In</Link>
              <Link href="/signup">Sign Up</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

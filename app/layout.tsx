import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CAKE Oklahoma | Premium Cannabis Cultivator',
  description: 'Premium craft cannabis. Bold, clean, uncompromising. Oklahoma OMMA licensed cultivator.',
  keywords: ['cannabis', 'Oklahoma', 'CAKE', 'cultivator', 'premium', 'dispensary'],
  openGraph: {
    title: 'CAKE Oklahoma',
    description: 'Premium craft cannabis cultivator in Oklahoma',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-white`}>
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Main Content */}
        <main className="lg:ml-72 min-h-screen">
          <div className="pt-16 lg:pt-0">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

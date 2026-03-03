'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Genetics', href: '/' },
  { name: 'About CAKE', href: '/about' },
  { name: 'H&G Nutrients', href: '/partners' },
  { name: 'Lab Results', href: '/labs' },
  { name: 'Find Us', href: '/find-us' },
  { name: 'Contact Us', href: '/contact' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-black text-white p-4 flex items-center justify-between z-50">
        <Link href="/" className="text-2xl font-black">
          CAKE
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2"
          aria-label="Menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-40 pt-20">
          <nav className="p-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block py-3 px-4 rounded text-lg transition-colors',
                  pathname === item.href
                    ? 'bg-white text-black font-bold'
                    : 'text-white hover:bg-white/10'
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/request-samples"
              onClick={() => setIsOpen(false)}
              className="block mt-6 bg-red-600 text-white py-4 px-6 rounded font-bold text-center"
            >
              Request Samples
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

'use client';

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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-black text-white p-8 flex flex-col">
      {/* Logo */}
      <Link href="/" className="mb-12">
        <div className="text-4xl font-black tracking-tight">
          CAKE
          <div className="w-12 h-1 bg-red-600 mt-2" />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block py-2 px-4 rounded transition-colors',
              pathname === item.href
                ? 'bg-white text-black font-bold'
                : 'text-white hover:bg-white/10'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Request Samples CTA */}
      <Link
        href="/request-samples"
        className="mt-8 bg-red-600 text-white py-4 px-6 rounded font-bold text-center hover:bg-red-700 transition-colors"
      >
        Request Samples
      </Link>

      {/* Footer Info */}
      <div className="mt-8 text-xs text-gray-400">
        <p>Premium Oklahoma Cannabis</p>
        <p className="mt-1">OMMA Licensed Cultivator</p>
      </div>
    </aside>
  );
}

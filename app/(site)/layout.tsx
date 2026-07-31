import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';

/**
 * Chrome for the content pages (about, labs, find-us, partners, contact,
 * request-samples, strains/[slug]).
 *
 * This used to live in the root layout, which meant the marketing landing page
 * inherited a 288px sidebar offset. That breaks it: its pinned sections are
 * sized in `svh` against the full viewport, and the strain-name type is sized
 * in `cqw` against its own column, so narrowing the column silently reclaims
 * the truncation bug that `--name-fit` exists to prevent.
 *
 * `site-surface` restores the white/black treatment these pages were written
 * against — the root <body> is now the landing page's ink background.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-surface">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="pt-16 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}

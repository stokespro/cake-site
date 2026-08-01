import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

/**
 * Shared chrome for the content pages. Identical to the landing page's header
 * and footer so the whole site reads as one thing — this replaced the old
 * fixed 288px Sidebar + MobileNav pair.
 *
 * Surface-neutral on purpose: each page owns its own background (all now
 * `bg-ink`), which keeps this layout out of the way of per-page treatments.
 *
 * `pt-[71px]` clears the fixed header (68px bar + the 3px holo hairline).
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen pt-[71px]">{children}</main>
      <SiteFooter />
    </>
  );
}

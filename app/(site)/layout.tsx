import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

/**
 * Shared chrome for the content pages. Identical to the landing page's header
 * and footer so the whole site reads as one thing — this replaced the old
 * fixed 288px Sidebar + MobileNav pair.
 *
 * Surface-neutral on purpose: each page owns its own background. Pages still
 * on the original light treatment set `bg-white` on their own root, and
 * converted pages set `bg-ink`, so the two can coexist while the visual pass
 * works through them one at a time.
 *
 * `pt-[71px]` clears the fixed header (68px bar + the 3px holo hairline).
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-surface">
      <SiteNav />
      <main className="min-h-screen pt-[71px]">{children}</main>
      <SiteFooter />
    </div>
  );
}

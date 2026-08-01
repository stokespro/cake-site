import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="flex min-h-screen items-center justify-center px-5 pt-[71px]">
        <div className="max-w-2xl py-24 text-center">
          <span className="micro holo-text">404</span>
          <h1 className="display display-tight mt-6 text-[clamp(2.8rem,8vw,6rem)] text-white">
            Page Not Found
          </h1>
          <p className="mx-auto mt-7 max-w-[46ch] text-lg leading-relaxed text-white/70">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="holo-border mt-10 inline-block">
            <Link
              href="/"
              className="micro group inline-flex items-center gap-3 px-9 py-5 text-white transition-colors duration-300 hover:!bg-transparent hover:text-ink"
            >
              BACK TO HOME
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

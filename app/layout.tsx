import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

/**
 * Archivo is the typeface already used on the CAKE wholesale menu.
 *
 * The `wdth` axis MUST be present — `.display` in globals.css sets
 * font-stretch: 118% to match the menu master, and a static Archivo silently
 * ignores it. Do not "simplify" this to a weight-only font.
 *
 * Self-hosted (Fontsource's Archivo Variable, subset to Latin + the punctuation
 * this site actually uses, 90KB -> 51KB) so the page makes zero third-party
 * requests.
 *
 * The CSS variable is `--font-archivo`, NOT `--font-display`: the latter is a
 * Tailwind v4 `@theme` key in globals.css, and pointing it at itself would
 * resolve to nothing.
 */
const archivo = localFont({
  src: [{ path: './fonts/archivo-subset.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-archivo',
  display: 'swap',
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
});

export const metadata: Metadata = {
  title: 'CAKE — Indoor Craft Flower, Grown in Oklahoma',
  description:
    'Eight indoor strains. Hand-selected A-grade buds, full-panel lab tested, seed-to-sale tracked. Wholesale flower for Oklahoma dispensaries.',
  keywords: ['cannabis', 'Oklahoma', 'CAKE', 'cultivator', 'premium', 'dispensary', 'wholesale'],
  metadataBase: new URL('https://cakeoklahoma.com'),
  openGraph: {
    title: 'CAKE — Indoor Craft Flower, Grown in Oklahoma',
    description:
      'Eight indoor strains. Hand-selected A-grade buds, full-panel lab tested, seed-to-sale tracked.',
    url: 'https://cakeoklahoma.com',
    siteName: 'CAKE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${archivo.className}`}>
      <body>{children}</body>
    </html>
  );
}

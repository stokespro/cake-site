import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'H&G Nutrients Partnership | CAKE Oklahoma',
  description: 'CAKE Oklahoma partners with House & Garden Nutrients for premium plant nutrition.',
};

const ADVANTAGE = [
  {
    title: 'Clean Nutrition',
    body: 'Highly concentrated formulas mean less waste and cleaner feeding. No fillers, just results.',
  },
  {
    title: 'Proven Results',
    body: 'Used by top cultivators worldwide, H&G delivers consistent, repeatable excellence.',
  },
  {
    title: 'Full Spectrum',
    body: 'Complete nutrient line covering every stage of growth, from rooting to ripening.',
  },
];

const METHODOLOGY = [
  {
    title: 'Base Nutrients',
    body: 'H&G Soil A+B or Hydro A+B forms the foundation of our feeding program, providing essential macro and micro nutrients.',
  },
  {
    title: 'Growth Boosters',
    body: 'Amino Treatment and Roots Excelurator ensure vigorous vegetative growth and robust root development.',
  },
  {
    title: 'Flowering Enhancement',
    body: 'Top Booster, Shooting Powder, and Bud-XL maximize flower development, terpene production, and final weight.',
  },
  {
    title: 'Final Flush',
    body: 'Drip Clean throughout and a proper flush ensure clean, smooth-smoking flowers with full terpene expression.',
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-ink">
      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <span className="micro holo-text">CULTIVATION PARTNER</span>
        <h1 className="display display-tight mt-6 max-w-[14ch] text-[clamp(2.8rem,8vw,7rem)] text-white">
          House &amp; Garden Nutrients
        </h1>
        <p className="mt-8 max-w-[48ch] text-lg leading-relaxed text-white/70 md:text-xl">
          Premium nutrition for premium genetics.
        </p>
      </section>

      {/* Partnership Story */}
      <section className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
        <div className="grid gap-10 py-20 md:grid-cols-[minmax(0,20ch)_minmax(0,1fr)] md:gap-16">
          <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">
            Why House &amp; Garden
          </h2>
          <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed text-white/70">
            <p>
              When you&apos;re cultivating premium genetics, every input matters.
              That&apos;s why CAKE Oklahoma partners exclusively with House &amp; Garden
              Nutrients—a company that shares our commitment to quality and consistency.
            </p>
            <p>
              House &amp; Garden&apos;s nutrient line is designed for precision cannabis
              cultivation. Their formulations are clean, concentrated, and proven to
              deliver exceptional results across all growth stages.
            </p>
            <p>
              From vegetative growth through flowering and final flush, H&amp;G provides
              our plants with exactly what they need—nothing more, nothing less.
            </p>
          </div>
        </div>
      </section>

      {/* The H&G Advantage */}
      <section className="bg-smoke">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
          <span className="micro text-white/45">THE H&amp;G ADVANTAGE</span>
          <dl className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-3">
            {ADVANTAGE.map((item, i) => (
              <div key={item.title} className="border-t border-white/10 pt-7">
                <span className="micro text-white/35">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <dt className="display mt-3 text-xl text-white">{item.title}</dt>
                <dd className="mt-3 leading-relaxed text-white/65">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Growing Methodology */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">
          Our Growing Methodology
        </h2>
        <dl className="mt-12 space-y-10">
          {METHODOLOGY.map((item) => (
            <div
              key={item.title}
              className="grid gap-3 border-t border-white/10 pt-8 md:grid-cols-[minmax(0,24ch)_minmax(0,1fr)] md:gap-12"
            >
              <dt className="display text-xl text-white">{item.title}</dt>
              <dd className="max-w-[60ch] text-lg leading-relaxed text-white/70">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
        <div className="pt-16">
          <h2 className="display display-tight max-w-[16ch] text-[clamp(2rem,5vw,4rem)] text-white">
            See What We&apos;re Growing
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-white/70">
            Browse our full genetics library and request samples.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="holo-border">
              <Link
                href="/strains"
                className="micro group inline-flex items-center gap-3 px-9 py-5 text-white transition-colors duration-300 hover:!bg-transparent hover:text-ink"
              >
                VIEW OUR STRAINS
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <Link
              href="/request-samples"
              className="micro inline-flex items-center gap-3 border border-white/35 px-9 py-5 text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
            >
              REQUEST SAMPLES
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

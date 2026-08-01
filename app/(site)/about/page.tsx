import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About CAKE | Premium Oklahoma Cannabis',
  description: 'Learn about CAKE Oklahoma - artistry in agriculture, premium genetics, and transparent quality.',
};

const PROCESS = [
  {
    title: 'Indoor Cultivation',
    body: 'Complete environmental control ensures every plant receives optimal conditions throughout its entire life cycle.',
  },
  {
    title: 'Premium Nutrients',
    body: 'We partner with House & Garden to provide plants with the highest quality nutrition from seed to harvest.',
  },
  {
    title: 'Hand-Trimmed',
    body: 'Every flower is carefully hand-trimmed to preserve trichomes and maintain the integrity of each bud.',
  },
  {
    title: 'Proper Curing',
    body: 'Extended curing periods allow terpenes to fully develop, delivering maximum flavor and smooth smoke.',
  },
];

const COMMITMENT = [
  {
    title: 'Quality First',
    body: "We grow fewer strains than most cultivators—because we'd rather master seven genetics than rush fifty.",
  },
  {
    title: 'Full Transparency',
    body: "Every batch includes complete lab testing with downloadable COAs. You should know exactly what you're getting.",
  },
  {
    title: 'Consistency',
    body: 'Our processes are dialed in to deliver the same premium quality harvest after harvest.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink">
      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <span className="micro holo-text">ABOUT CAKE</span>
        <h1 className="display display-tight mt-6 max-w-[16ch] text-[clamp(2.8rem,8vw,7rem)] text-white">
          Artistry in Agriculture
        </h1>
        <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-white/70 md:text-xl">
          CAKE Oklahoma is a premium cannabis cultivator committed to quality,
          consistency, and transparency.
        </p>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
        <div className="grid gap-10 py-20 md:grid-cols-[minmax(0,20ch)_minmax(0,1fr)] md:gap-16">
          <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">Our Story</h2>
          <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed text-white/70">
            <p>
              In a market with over 7,000 licensed cultivators in Oklahoma, CAKE stands
              apart through uncompromising dedication to craft and quality.
            </p>
            <p>
              We believe cannabis cultivation is an art form. Every strain in our genetics
              library is carefully curated, not just for market trends, but for genuine
              excellence in flavor, effect, and consistency.
            </p>
            <p>
              Our name isn&apos;t about desserts—it&apos;s about premium quality that speaks
              for itself. Bold. Clean. Uncompromising.
            </p>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="bg-smoke">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
          <span className="micro text-white/45">HOW IT&apos;S GROWN</span>
          <h2 className="display mt-5 text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">
            Our Process
          </h2>
          <dl className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {PROCESS.map((item, i) => (
              <div key={item.title}>
                <span className="micro text-white/35">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <dt className="display mt-3 text-xl text-white">{item.title}</dt>
                <dd className="mt-3 max-w-[46ch] leading-relaxed text-white/65">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">
          Our Commitment
        </h2>
        <dl className="mt-12 space-y-10">
          {COMMITMENT.map((item) => (
            <div
              key={item.title}
              className="grid gap-3 border-t border-white/10 pt-8 md:grid-cols-[minmax(0,22ch)_minmax(0,1fr)] md:gap-12"
            >
              <dt className="display text-xl text-white">{item.title}</dt>
              <dd className="max-w-[60ch] text-lg leading-relaxed text-white/70">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* OMMA License */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="holo-border">
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <p className="micro text-white/45">Oklahoma Medical Marijuana Authority</p>
            <p className="display text-2xl text-white">Licensed Cultivator</p>
          </div>
        </div>
      </section>
    </div>
  );
}

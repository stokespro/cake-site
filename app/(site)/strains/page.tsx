import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ACTIVE_AVAILABILITY } from '@/lib/availability';
import { normalizeStrain } from '@/lib/strain-fields';
import { Strain } from '@/lib/types';
import { StrainCard } from '@/components/StrainCard';

export const metadata: Metadata = {
  title: 'Strains | CAKE Oklahoma',
  description:
    'The full CAKE genetics library. Indoor craft flower, hand-selected and full-panel lab tested.',
};

export const revalidate = 3600; // Revalidate every hour

async function getStrains(): Promise<Strain[]> {
  const { data, error } = await supabase
    .from('strains')
    .select('*')
    // Only active strains reach the site. This page previously rendered every
    // row regardless of availability, so a sold-out strain was still listed.
    // See lib/availability.ts — that list is the single source of the policy.
    .in('availability', ACTIVE_AVAILABILITY as unknown as string[])
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching strains:', error);
    return [];
  }

  // effects/flavor_notes are TEXT in Postgres but consumed as arrays.
  return (data || []).map(normalizeStrain);
}

export default async function StrainsPage() {
  const strains = await getStrains();

  return (
    <div className="min-h-screen bg-ink">
      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <span className="micro holo-text">GENETICS LIBRARY</span>
        <h1 className="display display-tight mt-6 max-w-[14ch] text-[clamp(2.8rem,8vw,7rem)] text-white">
          Premium Genetics
        </h1>
        <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-white/70 md:text-xl">
          Curated cannabis cultivated with precision. Every strain is hand-selected for
          excellence.
        </p>
        {strains.length > 0 && (
          <p className="micro mt-9 text-white/40">
            {String(strains.length).padStart(2, '0')} STRAINS IN ROTATION
          </p>
        )}
      </section>

      {/* Strain Grid */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
        {strains.length === 0 ? (
          <div className="mt-10 border border-white/10 px-6 py-20 text-center">
            <p className="display text-2xl text-white">Our genetics library is coming soon</p>
            <p className="mt-4 text-white/55">
              Check back soon for our full strain lineup.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {strains.map((strain) => (
              <StrainCard key={strain.id} strain={strain} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-smoke">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
          <h2 className="display display-tight max-w-[16ch] text-[clamp(2rem,5vw,4rem)] text-white">
            Want to Carry CAKE?
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-white/70">
            Request samples and connect with our sales team.
          </p>
          <div className="holo-border mt-10 inline-block">
            <Link
              href="/request-samples"
              className="micro group inline-flex items-center gap-3 px-9 py-5 text-white transition-colors duration-300 hover:!bg-transparent hover:text-ink"
            >
              REQUEST SAMPLES
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

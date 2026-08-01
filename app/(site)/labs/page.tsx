import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Strain, StrainBatch } from '@/lib/types';
import { formatDate, formatPercent } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Lab Results | CAKE Oklahoma',
  description: 'Full transparency - view all lab results and certificates of analysis (COA) for every CAKE batch.',
};

export const revalidate = 3600;

async function getLabResults(): Promise<{ strain: Strain; batches: StrainBatch[] }[]> {
  // Get all strains
  const { data: strains, error: strainsError } = await supabase
    .from('strains')
    .select('*')
    .order('name', { ascending: true });

  if (strainsError || !strains) return [];

  // Get batches for each strain
  const results = await Promise.all(
    strains.map(async (strain: Strain) => {
      const { data: batches } = await supabase
        .from('strain_batches')
        .select('*')
        .eq('strain_id', strain.id)
        .order('harvest_date', { ascending: false });

      return {
        strain,
        batches: batches || [],
      };
    })
  );

  // Filter out strains with no batches
  return results.filter(({ batches }) => batches.length > 0);
}

const WHY = [
  {
    title: 'Potency',
    body: "Know exactly what you're getting—THC, CBD, and total cannabinoids.",
  },
  {
    title: 'Safety',
    body: 'Testing ensures no pesticides, heavy metals, or contaminants.',
  },
  {
    title: 'Consistency',
    body: 'Batch-to-batch tracking proves our quality is repeatable.',
  },
];

export default async function LabsPage() {
  const labResults = await getLabResults();

  return (
    <div className="min-h-screen bg-ink">
      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <span className="micro holo-text">LABS / COAs</span>
        <h1 className="display display-tight mt-6 max-w-[14ch] text-[clamp(2.8rem,8vw,7rem)] text-white">
          Lab Results
        </h1>
        <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-white/70 md:text-xl">
          Complete transparency. Every batch is tested and documented. Download full
          COAs for any harvest.
        </p>
      </section>

      {/* Why This Matters */}
      <section className="bg-smoke">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
          <span className="micro text-white/45">WHY THIS MATTERS</span>
          <dl className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {WHY.map((item, i) => (
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

      {/* Lab Results by Strain */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        {labResults.length === 0 ? (
          <div className="border border-white/10 px-6 py-20 text-center">
            <p className="text-lg text-white/55">
              Lab results will be posted here as batches are harvested and tested.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {labResults.map(({ strain, batches }) => (
              <div key={strain.id}>
                <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
                <h2 className="display mt-8 text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">
                  {strain.name}
                </h2>
                <div className="mt-8 space-y-4">
                  {batches.map((batch) => (
                    <div
                      key={batch.id}
                      className="border border-white/12 p-6 transition-colors hover:border-white/35"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        {/* Batch Info */}
                        <div className="min-w-[200px] flex-1">
                          <p className="display text-lg text-white">{batch.batch_id}</p>
                          <p className="micro mt-2 text-white/40">
                            HARVESTED {formatDate(batch.harvest_date)}
                          </p>
                        </div>

                        {/* Cannabinoid Stats */}
                        <div className="flex gap-10">
                          <div>
                            <p className="display text-2xl text-white">
                              {formatPercent(batch.thc_percent)}
                            </p>
                            <p className="micro mt-1 text-white/40">THC</p>
                          </div>
                          <div>
                            <p className="display text-2xl text-white">
                              {formatPercent(batch.cbd_percent)}
                            </p>
                            <p className="micro mt-1 text-white/40">CBD</p>
                          </div>
                          {batch.total_cannabinoids && (
                            <div>
                              <p className="display text-2xl text-white">
                                {formatPercent(batch.total_cannabinoids)}
                              </p>
                              <p className="micro mt-1 text-white/40">TOTAL</p>
                            </div>
                          )}
                        </div>

                        {/* Download */}
                        {batch.coa_url ? (
                          <a
                            href={batch.coa_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="micro group inline-flex items-center gap-3 border border-white/35 px-6 py-4 text-white transition-colors hover:border-white hover:bg-white/10"
                          >
                            DOWNLOAD COA
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </a>
                        ) : (
                          <span className="micro inline-flex items-center border border-white/10 px-6 py-4 text-white/30">
                            COA PENDING
                          </span>
                        )}
                      </div>

                      {/* Terpene Profile */}
                      {batch.terpenes && Object.keys(batch.terpenes).length > 0 && (
                        <div className="mt-6 border-t border-white/10 pt-6">
                          <p className="micro text-white/35">TOP TERPENES</p>
                          <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
                            {Object.entries(batch.terpenes)
                              .sort(([, a], [, b]) => Number(b) - Number(a))
                              .slice(0, 5)
                              .map(([name, value]) => (
                                <span key={name} className="flex items-baseline gap-2">
                                  <span className="capitalize text-white/85">{name}</span>
                                  <span className="text-white/45">
                                    {Number(value).toFixed(2)}%
                                  </span>
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
        <div className="pt-14">
          <h2 className="display text-[clamp(1.6rem,3vw,2.4rem)] text-white">
            Questions About Our Testing?
          </h2>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-white/70">
            We&apos;re happy to discuss our quality control process and lab procedures.
          </p>
          <Link
            href="/contact"
            className="micro mt-8 inline-flex items-center gap-3 border border-white/35 px-9 py-5 text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            CONTACT US
          </Link>
        </div>
      </section>
    </div>
  );
}

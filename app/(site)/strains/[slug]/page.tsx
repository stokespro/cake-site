import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Strain, StrainBatch } from '@/lib/types';
import { formatDate, formatPercent } from '@/lib/utils';

export const revalidate = 3600;

async function getStrain(slug: string): Promise<Strain | null> {
  const { data, error } = await supabase
    .from('strains')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

async function getStrainBatches(strainId: string): Promise<StrainBatch[]> {
  const { data, error } = await supabase
    .from('strain_batches')
    .select('*')
    .eq('strain_id', strainId)
    .order('harvest_date', { ascending: false });

  if (error || !data) return [];
  return data;
}

export default async function StrainDetailPage({
  params,
}: {
  // Next 15+ passes params as a Promise. Reading `.slug` off it directly (as
  // this did) yields undefined, which made every strain detail page 404.
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const strain = await getStrain(slug);

  if (!strain) {
    notFound();
  }

  const batches = await getStrainBatches(strain.id);

  return (
    <div className="min-h-screen bg-ink">
      {/* Back Link */}
      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-10">
        <Link
          href="/strains"
          className="micro group inline-flex items-center gap-2 text-white/50 transition-colors hover:text-white"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          ALL STRAINS
        </Link>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10">
        <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden border border-white/10 bg-smoke">
            {strain.image_url ? (
              <Image
                src={strain.image_url}
                alt={strain.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="display text-[12rem] leading-none text-white/[0.06]">
                  {strain.name[0]}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="display display-tight text-[clamp(2.4rem,6vw,5rem)] text-white">
              {strain.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="micro border border-white/30 px-4 py-2 text-white">
                {strain.type}
              </span>
              {strain.availability && (
                <span className="micro text-white/45">{strain.availability}</span>
              )}
            </div>

            {/* Stats */}
            <dl className="mt-10 grid grid-cols-2 gap-4">
              <div className="border-t border-white/15 pt-4">
                <dd className="display text-3xl text-white">
                  {formatPercent(strain.thc_percent)}
                </dd>
                <dt className="micro mt-2 text-white/40">THC</dt>
              </div>
              <div className="border-t border-white/15 pt-4">
                <dd className="display text-3xl text-white">
                  {formatPercent(strain.cbd_percent)}
                </dd>
                <dt className="micro mt-2 text-white/40">CBD</dt>
              </div>
            </dl>

            {/* Quick Info */}
            <dl className="mt-10 space-y-7">
              {strain.lineage && (
                <div>
                  <dt className="micro text-white/35">LINEAGE</dt>
                  <dd className="mt-2 text-lg text-white/80">{strain.lineage}</dd>
                </div>
              )}

              {strain.effects && strain.effects.length > 0 && (
                <div>
                  <dt className="micro text-white/35">EFFECTS</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {strain.effects.map((effect) => (
                      <span
                        key={effect}
                        className="border border-white/12 px-3 py-1.5 text-sm text-white/75"
                      >
                        {effect}
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              {strain.flavor_notes && strain.flavor_notes.length > 0 && (
                <div>
                  <dt className="micro text-white/35">TERPENES &amp; FLAVOR</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {strain.flavor_notes.map((note) => (
                      <span
                        key={note}
                        className="border border-white/12 px-3 py-1.5 text-sm text-white/75"
                      >
                        {note}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            {/* CTAs */}
            <div className="mt-11 flex flex-wrap items-center gap-4">
              <div className="holo-border">
                <Link
                  href={`/request-samples?strain=${strain.slug}`}
                  className="micro group inline-flex items-center gap-3 px-9 py-5 text-white transition-colors duration-300 hover:!bg-transparent hover:text-ink"
                >
                  REQUEST SAMPLE
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
              {strain.coa_url && (
                <a
                  href={strain.coa_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="micro inline-flex items-center gap-3 border border-white/35 px-9 py-5 text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
                >
                  DOWNLOAD COA
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      {strain.description && (
        <section className="bg-smoke">
          <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
            <div className="grid gap-10 md:grid-cols-[minmax(0,20ch)_minmax(0,1fr)] md:gap-16">
              <h2 className="display text-[clamp(1.6rem,3vw,2.4rem)] text-white">
                About {strain.name}
              </h2>
              <p className="max-w-[62ch] text-lg leading-relaxed text-white/70">
                {strain.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Batch History */}
      {batches.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
          <h2 className="display text-[clamp(1.6rem,3vw,2.4rem)] text-white">
            Lab Results by Batch
          </h2>
          <div className="mt-8 space-y-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="border border-white/12 p-6 transition-colors hover:border-white/35"
              >
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="min-w-[180px] flex-1">
                    <p className="display text-lg text-white">{batch.batch_id}</p>
                    <p className="micro mt-2 text-white/40">
                      HARVESTED {formatDate(batch.harvest_date)}
                    </p>
                  </div>
                  <div className="flex gap-10">
                    <div>
                      <p className="display text-xl text-white">
                        {formatPercent(batch.thc_percent)}
                      </p>
                      <p className="micro mt-1 text-white/40">THC</p>
                    </div>
                    <div>
                      <p className="display text-xl text-white">
                        {formatPercent(batch.cbd_percent)}
                      </p>
                      <p className="micro mt-1 text-white/40">CBD</p>
                    </div>
                  </div>
                  {batch.coa_url && (
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
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

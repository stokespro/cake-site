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
  params: { slug: string };
}) {
  const strain = await getStrain(params.slug);

  if (!strain) {
    notFound();
  }

  const batches = await getStrainBatches(strain.id);
  const currentBatch = batches[0]; // Most recent batch

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Back Link */}
      <div className="px-6 py-6 lg:px-12 border-b">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Genetics
        </Link>
      </div>

      {/* Hero Section */}
      <section className="px-6 py-12 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
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
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <span className="text-9xl font-black text-white/10">
                  {strain.name[0]}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-8">
              <h1 className="text-5xl lg:text-7xl font-black leading-none mb-4">
                {strain.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="inline-block px-4 py-2 rounded bg-black text-white font-bold">
                  {strain.type}
                </span>
                {strain.availability && (
                  <span className="text-gray-600">{strain.availability}</span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">THC</p>
                <p className="text-3xl font-black">
                  {formatPercent(strain.thc_percent)}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">CBD</p>
                <p className="text-3xl font-black">
                  {formatPercent(strain.cbd_percent)}
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-6 mb-8">
              {strain.lineage && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Lineage
                  </h3>
                  <p className="text-lg">{strain.lineage}</p>
                </div>
              )}

              {strain.effects && strain.effects.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Effects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {strain.effects.map((effect) => (
                      <span
                        key={effect}
                        className="px-3 py-1 bg-gray-100 rounded text-sm"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {strain.flavor_notes && strain.flavor_notes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Terpenes & Flavor
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {strain.flavor_notes.map((note) => (
                      <span
                        key={note}
                        className="px-3 py-1 bg-gray-100 rounded text-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Link
                href={`/request-samples?strain=${strain.slug}`}
                className="block w-full bg-red-600 text-white py-4 px-6 rounded font-bold text-center hover:bg-red-700 transition-colors"
              >
                Request Sample
              </Link>
              {strain.coa_url && (
                <a
                  href={strain.coa_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border-2 border-black text-black py-4 px-6 rounded font-bold text-center hover:bg-black hover:text-white transition-colors"
                >
                  Download COA
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {strain.description && (
        <section className="px-6 py-12 lg:px-12 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-6">About {strain.name}</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              {strain.description}
            </p>
          </div>
        </section>
      )}

      {/* Batch History */}
      {batches.length > 0 && (
        <section className="px-6 py-12 lg:px-12 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-6">Lab Results by Batch</h2>
            <div className="space-y-4">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-lg">{batch.batch_id}</p>
                      <p className="text-sm text-gray-500">
                        Harvested {formatDate(batch.harvest_date)}
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-sm text-gray-500">THC</p>
                        <p className="font-bold text-xl">
                          {formatPercent(batch.thc_percent)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CBD</p>
                        <p className="font-bold text-xl">
                          {formatPercent(batch.cbd_percent)}
                        </p>
                      </div>
                    </div>
                    {batch.coa_url && (
                      <a
                        href={batch.coa_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border border-black rounded font-bold hover:bg-black hover:text-white transition-colors"
                      >
                        Download COA
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import { Metadata } from 'next';
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
    strains.map(async (strain: any) => {
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

export default async function LabsPage() {
  const labResults = await getLabResults();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="px-6 py-20 lg:px-12 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl lg:text-8xl font-black leading-none mb-8">
            Lab Results
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-600 leading-relaxed">
            Complete transparency. Every batch is tested and documented. 
            Download full COAs for any harvest.
          </p>
        </div>
      </section>

      {/* Why Lab Testing Matters */}
      <section className="px-6 py-12 lg:px-12 border-t bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-6">Why This Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Potency</h3>
              <p className="text-gray-700">
                Know exactly what you're getting—THC, CBD, and total cannabinoids.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Safety</h3>
              <p className="text-gray-700">
                Testing ensures no pesticides, heavy metals, or contaminants.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Consistency</h3>
              <p className="text-gray-700">
                Batch-to-batch tracking proves our quality is repeatable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Results by Strain */}
      <section className="px-6 py-12 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {labResults.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">
                Lab results will be posted here as batches are harvested and tested.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {labResults.map(({ strain, batches }) => (
                <div key={strain.id}>
                  <h2 className="text-4xl font-black mb-8">{strain.name}</h2>
                  <div className="space-y-4">
                    {batches.map((batch) => (
                      <div
                        key={batch.id}
                        className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          {/* Batch Info */}
                          <div className="flex-1 min-w-[200px]">
                            <p className="font-bold text-xl mb-1">
                              {batch.batch_id}
                            </p>
                            <p className="text-gray-500">
                              Harvested {formatDate(batch.harvest_date)}
                            </p>
                          </div>

                          {/* Cannabinoid Stats */}
                          <div className="flex gap-8">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">THC</p>
                              <p className="font-black text-2xl">
                                {formatPercent(batch.thc_percent)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">CBD</p>
                              <p className="font-black text-2xl">
                                {formatPercent(batch.cbd_percent)}
                              </p>
                            </div>
                            {batch.total_cannabinoids && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Total</p>
                                <p className="font-black text-2xl">
                                  {formatPercent(batch.total_cannabinoids)}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Download Button */}
                          {batch.coa_url ? (
                            <a
                              href={batch.coa_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-black text-white rounded font-bold hover:bg-gray-800 transition-colors"
                            >
                              Download COA
                            </a>
                          ) : (
                            <div className="px-6 py-3 border border-gray-300 text-gray-400 rounded font-bold">
                              COA Pending
                            </div>
                          )}
                        </div>

                        {/* Terpene Profile (if available) */}
                        {batch.terpenes && Object.keys(batch.terpenes).length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                              Top Terpenes
                            </p>
                            <div className="flex flex-wrap gap-4">
                              {Object.entries(batch.terpenes)
                                .sort(([, a], [, b]) => Number(b) - Number(a))
                                .slice(0, 5)
                                .map(([name, value]) => (
                                  <div key={name} className="flex items-baseline gap-2">
                                    <span className="font-medium capitalize">{name}</span>
                                    <span className="text-gray-600">
                                      {Number(value).toFixed(2)}%
                                    </span>
                                  </div>
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
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-20 lg:px-12 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">
            Questions About Our Testing?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're happy to discuss our quality control process and lab procedures.
          </p>
          <a
            href="/contact"
            className="inline-block border-2 border-black text-black px-8 py-4 rounded font-bold text-lg hover:bg-black hover:text-white transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}

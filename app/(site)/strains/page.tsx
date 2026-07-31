import { supabase } from '@/lib/supabase';
import { Strain } from '@/lib/types';
import { StrainCard } from '@/components/StrainCard';

export const revalidate = 3600; // Revalidate every hour

async function getStrains(): Promise<Strain[]> {
  const { data, error } = await supabase
    .from('strains')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching strains:', error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const strains = await getStrains();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-20 lg:px-12 lg:py-32 border-b border-gray-200">
        <div className="max-w-4xl">
          <h1 className="text-6xl lg:text-8xl font-black leading-none mb-6">
            Premium Genetics
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
            Curated cannabis cultivated with precision. Every strain is hand-selected 
            for excellence. See our full genetics library below.
          </p>
        </div>
      </section>

      {/* Vertical Strain Menu */}
      <section className="px-6 py-12 lg:px-12 lg:py-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {strains.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">
                Our genetics library is coming soon.
              </p>
              <p className="mt-4 text-gray-500">
                Check back soon for our full strain lineup.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {strains.map((strain) => (
                <StrainCard key={strain.id} strain={strain} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-12 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            Want to Carry CAKE?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Request samples and connect with our sales team.
          </p>
          <a
            href="/request-samples"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded font-bold text-lg hover:bg-red-700 transition-colors"
          >
            Request Samples
          </a>
        </div>
      </section>
    </div>
  );
}

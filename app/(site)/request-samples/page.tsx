import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Strain } from '@/lib/types';
import { SampleRequestForm } from '@/components/SampleRequestForm';

export const metadata: Metadata = {
  title: 'Request Samples | CAKE Oklahoma',
  description: 'Request CAKE cannabis samples for your dispensary. Connect with our sales team.',
};

async function getStrains(): Promise<Strain[]> {
  const { data, error } = await supabase
    .from('strains')
    .select('*')
    .order('name', { ascending: true });

  if (error || !data) return [];
  return data;
}

export default async function RequestSamplesPage({
  searchParams,
}: {
  searchParams: { strain?: string };
}) {
  const strains = await getStrains();
  const preselectedStrain = searchParams.strain;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="px-6 py-20 lg:px-12 lg:py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl lg:text-8xl font-black leading-none mb-8">
            Request Samples
          </h1>
          <p className="text-2xl text-gray-300 leading-relaxed">
            Interested in carrying CAKE products? Fill out the form below and 
            we'll connect you with our sales team within 24 hours.
          </p>
        </div>
      </section>

      {/* What to Expect */}
      <section className="px-6 py-12 lg:px-12 bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-6">What Happens Next</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-black text-red-600 mb-2">1</div>
              <h3 className="font-bold text-lg mb-2">We Review</h3>
              <p className="text-gray-700">
                Your request goes directly to our sales team for review.
              </p>
            </div>
            <div>
              <div className="text-4xl font-black text-red-600 mb-2">2</div>
              <h3 className="font-bold text-lg mb-2">We Connect</h3>
              <p className="text-gray-700">
                We'll reach out within 24 hours to discuss your needs.
              </p>
            </div>
            <div>
              <div className="text-4xl font-black text-red-600 mb-2">3</div>
              <h3 className="font-bold text-lg mb-2">Samples Delivered</h3>
              <p className="text-gray-700">
                We arrange delivery of your requested strain samples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-6 py-12 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SampleRequestForm strains={strains} preselectedStrain={preselectedStrain} />
        </div>
      </section>

      {/* Direct Contact */}
      <section className="px-6 py-12 lg:px-12 border-t bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Prefer to Talk Directly?</h2>
          <p className="text-xl text-gray-700 mb-6">
            Feel free to reach out to our sales team via email or phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block border-2 border-black text-black px-6 py-3 rounded font-bold hover:bg-black hover:text-white transition-colors"
            >
              Contact Information
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

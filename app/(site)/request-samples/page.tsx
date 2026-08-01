import { Metadata } from 'next';
import Link from 'next/link';
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

const STEPS = [
  { title: 'We Review', body: 'Your request goes directly to our sales team for review.' },
  { title: 'We Connect', body: "We'll reach out within 24 hours to discuss your needs." },
  { title: 'Samples Delivered', body: 'We arrange delivery of your requested strain samples.' },
];

export default async function RequestSamplesPage({
  searchParams,
}: {
  // Next 15+ passes searchParams as a Promise. Reading `.strain` off it
  // directly (as this did) silently yields undefined, so the ?strain=
  // deep link from a strain page never preselected anything.
  searchParams: Promise<{ strain?: string }>;
}) {
  const strains = await getStrains();
  const { strain: preselectedStrain } = await searchParams;

  return (
    <div className="min-h-screen bg-ink">
      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <span className="micro holo-text">WHOLESALE ORDERING</span>
        <h1 className="display display-tight mt-6 max-w-[14ch] text-[clamp(2.8rem,8vw,7rem)] text-white">
          Request Samples
        </h1>
        <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-white/70 md:text-xl">
          Interested in carrying CAKE products? Fill out the form below and we&apos;ll
          connect you with our sales team within 24 hours.
        </p>
      </section>

      {/* What Happens Next */}
      <section className="bg-smoke">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
          <span className="micro text-white/45">WHAT HAPPENS NEXT</span>
          <dl className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="border-t border-white/10 pt-7">
                <span className="micro text-white/35">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <dt className="display mt-3 text-xl text-white">{step.title}</dt>
                <dd className="mt-3 leading-relaxed text-white/65">{step.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <div className="max-w-[820px]">
          <SampleRequestForm strains={strains} preselectedStrain={preselectedStrain} />
        </div>
      </section>

      {/* Direct Contact */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
        <div className="pt-14">
          <h2 className="display text-[clamp(1.6rem,3vw,2.4rem)] text-white">
            Prefer to Talk Directly?
          </h2>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-white/70">
            Feel free to reach out to our sales team via email or phone.
          </p>
          <Link
            href="/contact"
            className="micro mt-8 inline-flex items-center gap-3 border border-white/35 px-9 py-5 text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            CONTACT INFORMATION
          </Link>
        </div>
      </section>
    </div>
  );
}

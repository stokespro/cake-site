import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { DispensaryLocation } from '@/lib/types';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Find Us | CAKE Oklahoma Dispensary Locations',
  description: 'Find CAKE Oklahoma products at premium dispensaries across the state.',
};

export const revalidate = 1800; // Revalidate every 30 minutes

async function getDispensaryLocations(): Promise<DispensaryLocation[]> {
  try {
    const { data, error } = await supabase
      .from('public_dispensary_locations')
      .select('*');

    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

// Group locations by city
function groupByCity(locations: DispensaryLocation[]): Map<string, DispensaryLocation[]> {
  const grouped = new Map<string, DispensaryLocation[]>();

  locations.forEach((location) => {
    const city = location.city || 'Other';
    if (!grouped.has(city)) {
      grouped.set(city, []);
    }
    grouped.get(city)!.push(location);
  });

  return grouped;
}

export default async function FindUsPage() {
  const locations = await getDispensaryLocations();
  const locationsByCity = groupByCity(locations);
  const cities = Array.from(locationsByCity.keys()).sort();

  return (
    <div className="min-h-screen bg-ink">
      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <span className="micro holo-text">WHERE TO BUY</span>
        <h1 className="display display-tight mt-6 max-w-[14ch] text-[clamp(2.8rem,8vw,7rem)] text-white">
          Find CAKE
        </h1>
        <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-white/70 md:text-xl">
          Discover premium dispensaries carrying CAKE products across Oklahoma.
        </p>
      </section>

      {/* Dispensary List */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        {locations.length === 0 ? (
          <div className="holo-border">
            <div className="px-6 py-20 text-center">
              <h2 className="display text-[clamp(1.6rem,3vw,2.4rem)] text-white">
                New Partnerships Coming Soon
              </h2>
              <p className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-white/70">
                We&apos;re expanding our retail network. Interested in carrying CAKE?
              </p>
              <Link
                href="/request-samples"
                className="micro mt-9 inline-flex items-center gap-3 border border-white/35 px-9 py-5 text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
              >
                REQUEST SAMPLES
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {cities.map((city) => {
              const cityLocations = locationsByCity.get(city) || [];
              return (
                <div key={city}>
                  <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
                  <h2 className="display mt-8 text-[clamp(1.6rem,3vw,2.4rem)] text-white">
                    {city}
                  </h2>
                  <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {cityLocations.map((location, index) => (
                      <div
                        key={`${location.omma_license}-${index}`}
                        className="border border-white/12 p-6 transition-colors hover:border-white/35"
                      >
                        <h3 className="display text-lg text-white">
                          {location.dispensary_name}
                        </h3>

                        <dl className="mt-5 space-y-3 text-white/70">
                          {location.address && (
                            <div>
                              <dt className="micro text-white/35">ADDRESS</dt>
                              <dd className="mt-1">
                                {location.address}
                                {location.city && `, ${location.city}`}
                              </dd>
                            </div>
                          )}

                          {location.phone && (
                            <div>
                              <dt className="micro text-white/35">PHONE</dt>
                              <dd className="mt-1">
                                <a
                                  href={`tel:${location.phone}`}
                                  className="text-white transition-colors hover:text-cake"
                                >
                                  {location.phone}
                                </a>
                              </dd>
                            </div>
                          )}

                          {location.email && (
                            <div>
                              <dt className="micro text-white/35">EMAIL</dt>
                              <dd className="mt-1">
                                <a
                                  href={`mailto:${location.email}`}
                                  className="text-white transition-colors hover:text-cake"
                                >
                                  {location.email}
                                </a>
                              </dd>
                            </div>
                          )}
                        </dl>

                        {location.address && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${location.dispensary_name} ${location.address} ${location.city || ''}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="micro group mt-6 inline-flex items-center gap-2 border border-white/25 px-5 py-3 text-white transition-colors hover:border-white hover:bg-white/10"
                          >
                            GET DIRECTIONS
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Map placeholder */}
      {locations.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
          <div className="flex aspect-video items-center justify-center border border-white/10 bg-smoke">
            <p className="micro text-white/30">INTERACTIVE MAP COMING SOON</p>
          </div>
        </section>
      )}

      {/* Dispensary Not Listed */}
      <section className="bg-smoke">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
          <div className="grid gap-10 md:grid-cols-[minmax(0,22ch)_minmax(0,1fr)] md:gap-16">
            <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">
              Dispensary Not Listed?
            </h2>
            <div>
              <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed text-white/70">
                <p>
                  If your favorite dispensary doesn&apos;t carry CAKE yet, let them know
                  you&apos;d like to see our products on their shelves. Word-of-mouth
                  recommendations from customers make a real difference.
                </p>
                <p>
                  For dispensary owners and buyers: we make it easy to add CAKE to your
                  inventory. Request samples and connect with our sales team.
                </p>
              </div>
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
          </div>
        </div>
      </section>
    </div>
  );
}

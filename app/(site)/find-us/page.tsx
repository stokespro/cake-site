import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { DispensaryLocation } from '@/lib/types';
import { DispensaryLocator } from '@/components/DispensaryLocator';
import { formatStoreAddress } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Find Us | CAKE Oklahoma Dispensary Locations',
  description: 'Find CAKE Oklahoma products at premium dispensaries across the state.',
};

export const revalidate = 1800; // Revalidate every 30 minutes

/**
 * Reads the dispensary view with the SERVICE ROLE, not the anon client.
 *
 * The view derives its rows from CRM state — active customers who have placed
 * an order (customers.has_orders, kept in sync by triggers on orders), plus
 * anyone force-included via show_on_map, minus explicit hide_from_map opt-outs.
 * `recent_strains` is what each store took delivery of in the last 90 days,
 * measured from query time. Nothing here needs maintaining: a dispensary
 * appears after its first order and its strain list decays on its own.
 *
 * `public_dispensary_locations` is defined with `security_invoker = on`, so it
 * runs with the caller's permissions rather than the owner's. The anon role has
 * no privilege on the underlying `customers` table — deliberately, since that
 * table holds ~1,900 CRM records — so an anon read fails with
 * "permission denied for table customers" no matter what is granted on the view
 * itself. The alternative was flipping the view to security-definer, which would
 * publish every opted-in dispensary's name, address, phone, email and OMMA
 * licence to anyone holding the public anon key.
 *
 * This runs server-side only: the page is an async Server Component with
 * `revalidate` below, so the service role key is never sent to the browser.
 * DO NOT add 'use client' to this file, and do not import this function into a
 * client component.
 */
async function getDispensaryLocations(): Promise<DispensaryLocation[]> {
  try {
    const { data, error } = await supabaseAdmin
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

const UNKNOWN_CITY = 'Other';

/**
 * Six rows carry a street fragment in the city column instead of a city — the
 * residue of a bad CRM import. Left alone they render as headings like
 * "W TH AVE" and "S ND ST" in the city list. The real city is recoverable from
 * the address, which always ends with it, so it is mapped here rather than
 * editing the CRM. Fix the source rows and these entries become dead code.
 */
const CITY_CORRECTIONS: Record<string, string> = {
  'E. STATE HIGHWAY': 'MUSTANG',
  'N MAIN ST': 'NEWCASTLE',
  'S ND ST': 'STILWELL',
  'S SOONER RD': 'MIDWEST CITY',
  'W LOCUST ST': 'STILWELL',
  'W TH AVE': 'STILLWATER',
};

/**
 * Normalise for grouping. The column mixes cases ("BARTLESVILLE" and
 * "Bartlesville" are both present), which without this produces two headings
 * for one town — and a case-sensitive sort then separates them, so
 * "Bartlesville" landed after "BROKEN ARROW".
 */
function cityKey(city: string | null): string {
  const raw = (city ?? '').trim().toUpperCase();
  if (!raw) return UNKNOWN_CITY;
  return CITY_CORRECTIONS[raw] ?? raw;
}

// Group locations by city
function groupByCity(locations: DispensaryLocation[]): Map<string, DispensaryLocation[]> {
  const grouped = new Map<string, DispensaryLocation[]>();

  locations.forEach((location) => {
    const city = cityKey(location.city);
    if (!grouped.has(city)) {
      grouped.set(city, []);
    }
    grouped.get(city)!.push(location);
  });

  return grouped;
}

/** Cities A-Z, with the no-city bucket parked at the end rather than under "O". */
function sortCities(cities: string[]): string[] {
  return cities.sort((a, b) => {
    if (a === UNKNOWN_CITY) return 1;
    if (b === UNKNOWN_CITY) return -1;
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  });
}

export default async function FindUsPage() {
  const locations = await getDispensaryLocations();
  const locationsByCity = groupByCity(locations);
  const cities = sortCities(Array.from(locationsByCity.keys()));
  const pinned = locations.filter((l) => l.latitude != null && l.longitude != null);
  const unpinned = locations.length - pinned.length;

  // Frame the map on the actual centroid of the stores rather than a fixed
  // point, so it stays sensible as the footprint grows.
  const initialView = pinned.length
    ? {
        longitude: pinned.reduce((s, l) => s + l.longitude!, 0) / pinned.length,
        latitude: pinned.reduce((s, l) => s + l.latitude!, 0) / pinned.length,
        zoom: 6.3,
      }
    : undefined;

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

      {/* Map */}
      {locations.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-16 md:px-10">
          <DispensaryLocator locations={locations} initialView={initialView} />
          {unpinned > 0 && (
            <p className="micro mt-4 text-white/35">
              {unpinned} {unpinned === 1 ? 'LOCATION' : 'LOCATIONS'} NOT YET MAPPED — SEE THE
              FULL LIST BELOW
            </p>
          )}
        </section>
      )}

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
                        key={`${location.dispensary_name}-${index}`}
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
                                {formatStoreAddress(location.address, location.city)}
                              </dd>
                            </div>
                          )}

                          {location.phone && (
                            <div>
                              <dt className="micro text-white/35">PHONE</dt>
                              <dd className="mt-1">
                                <a
                                  href={`tel:${location.phone.replace(/[^\d+]/g, '')}`}
                                  className="text-white transition-colors hover:text-cake"
                                >
                                  {location.phone}
                                </a>
                              </dd>
                            </div>
                          )}
                        </dl>

                        {/* "Stocked recently", not "in stock": this is what the
                            store took delivery of in the last 90 days, which is
                            the strongest claim the order data actually supports. */}
                        {location.recent_strains && location.recent_strains.length > 0 && (
                          <div className="mt-6 border-t border-white/10 pt-5">
                            <p className="micro text-white/35">STOCKED IN THE LAST 90 DAYS</p>
                            <ul className="mt-3 flex flex-wrap gap-2">
                              {location.recent_strains.map((strain) => (
                                <li key={strain.slug}>
                                  <Link
                                    href={`/strains/${strain.slug}`}
                                    className="inline-block border border-white/12 px-3 py-1.5 text-sm text-white/75 transition-colors hover:border-white/45 hover:text-white"
                                  >
                                    {strain.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

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

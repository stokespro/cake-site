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
  const { data, error } = await supabase
    .from('public_dispensary_locations')
    .select('*');

  if (error || !data) {
    console.error('Error fetching locations:', error);
    return [];
  }

  return data;
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-6 py-20 lg:px-12 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl lg:text-8xl font-black leading-none mb-8">
            Find CAKE
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-600 leading-relaxed">
            Discover premium dispensaries carrying CAKE products across Oklahoma.
          </p>
        </div>
      </section>

      {/* Dispensary List */}
      <section className="px-6 py-12 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {locations.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <h2 className="text-3xl font-black mb-4">
                New Partnerships Coming Soon
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We're expanding our retail network. Interested in carrying CAKE?
              </p>
              <Link
                href="/request-samples"
                className="inline-block bg-black text-white px-8 py-4 rounded font-bold hover:bg-gray-800 transition-colors"
              >
                Request Samples
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {cities.map((city) => {
                const cityLocations = locationsByCity.get(city) || [];
                return (
                  <div key={city}>
                    <h2 className="text-3xl font-black mb-6">{city}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {cityLocations.map((location, index) => (
                        <div
                          key={`${location.omma_license}-${index}`}
                          className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors"
                        >
                          <h3 className="text-xl font-bold mb-3">
                            {location.dispensary_name}
                          </h3>
                          
                          {location.address && (
                            <p className="text-gray-700 mb-2">
                              📍 {location.address}
                              {location.city && `, ${location.city}`}
                            </p>
                          )}

                          {location.phone && (
                            <p className="text-gray-700 mb-2">
                              📞{' '}
                              <a
                                href={`tel:${location.phone}`}
                                className="hover:text-black font-medium"
                              >
                                {location.phone}
                              </a>
                            </p>
                          )}

                          {location.email && (
                            <p className="text-gray-700 mb-4">
                              ✉️{' '}
                              <a
                                href={`mailto:${location.email}`}
                                className="hover:text-black font-medium"
                              >
                                {location.email}
                              </a>
                            </p>
                          )}

                          {location.address && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${location.dispensary_name} ${location.address} ${location.city || ''}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-4 border border-black text-black px-4 py-2 rounded font-bold text-sm hover:bg-black hover:text-white transition-colors"
                            >
                              Get Directions →
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
        </div>
      </section>

      {/* Info Section */}
      <section className="px-6 py-20 lg:px-12 border-t bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-8">
            Dispensary Not Listed?
          </h2>
          <div className="space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              If your favorite dispensary doesn't carry CAKE yet, let them know 
              you'd like to see our products on their shelves. Word-of-mouth 
              recommendations from customers make a real difference.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              For dispensary owners and buyers: we make it easy to add CAKE to 
              your inventory. Request samples and connect with our sales team.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/request-samples"
              className="inline-block bg-black text-white px-8 py-4 rounded font-bold hover:bg-gray-800 transition-colors"
            >
              Request Samples
            </Link>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      {locations.length > 0 && (
        <section className="px-6 py-12 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Interactive map coming soon
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

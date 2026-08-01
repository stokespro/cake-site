import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'H&G Nutrients Partnership | CAKE Oklahoma',
  description: 'CAKE Oklahoma partners with House & Garden Nutrients for premium plant nutrition.',
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="px-6 py-20 lg:px-12 lg:py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-black leading-none mb-8">
            House & Garden
            <br />
            Nutrients
          </h1>
          <p className="text-2xl text-gray-300">
            Premium nutrition for premium genetics
          </p>
        </div>
      </section>

      {/* Partnership Story */}
      <section className="px-6 py-20 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-8">
            Why House & Garden
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed text-gray-700 mb-6">
              When you're cultivating premium genetics, every input matters. 
              That's why CAKE Oklahoma partners exclusively with House & Garden 
              Nutrients—a company that shares our commitment to quality and consistency.
            </p>
            <p className="text-xl leading-relaxed text-gray-700 mb-6">
              House & Garden's nutrient line is designed for precision cannabis 
              cultivation. Their formulations are clean, concentrated, and proven 
              to deliver exceptional results across all growth stages.
            </p>
            <p className="text-xl leading-relaxed text-gray-700">
              From vegetative growth through flowering and final flush, H&G provides 
              our plants with exactly what they need—nothing more, nothing less.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="px-6 py-20 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-12 text-center">
            The H&G Advantage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Clean Nutrition</h3>
              <p className="text-gray-700">
                Highly concentrated formulas mean less waste and cleaner feeding. 
                No fillers, just results.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Proven Results</h3>
              <p className="text-gray-700">
                Used by top cultivators worldwide, H&G delivers consistent, 
                repeatable excellence.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Full Spectrum</h3>
              <p className="text-gray-700">
                Complete nutrient line covering every stage of growth, from 
                rooting to ripening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Growing Methodology */}
      <section className="px-6 py-20 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-8">
            Our Growing Methodology
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-2xl font-bold mb-3">Base Nutrients</h3>
              <p className="text-lg text-gray-700">
                H&G Soil A+B or Hydro A+B forms the foundation of our feeding 
                program, providing essential macro and micro nutrients.
              </p>
            </div>
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-2xl font-bold mb-3">Growth Boosters</h3>
              <p className="text-lg text-gray-700">
                Amino Treatment and Roots Excelurator ensure vigorous vegetative 
                growth and robust root development.
              </p>
            </div>
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-2xl font-bold mb-3">Flowering Enhancement</h3>
              <p className="text-lg text-gray-700">
                Top Booster, Shooting Powder, and Bud-XL maximize flower development, 
                terpene production, and final weight.
              </p>
            </div>
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-2xl font-bold mb-3">Final Flush</h3>
              <p className="text-lg text-gray-700">
                Drip Clean throughout and a proper flush ensure clean, smooth-smoking 
                flowers with full terpene expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-12 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            See What We're Growing
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Browse our full genetics library and request samples.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-black px-8 py-4 rounded font-bold text-lg hover:bg-gray-200 transition-colors"
          >
            View Our Strains
          </Link>
        </div>
      </section>
    </div>
  );
}

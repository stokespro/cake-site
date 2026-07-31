import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About CAKE | Premium Oklahoma Cannabis',
  description: 'Learn about CAKE Oklahoma - artistry in agriculture, premium genetics, and transparent quality.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-6 py-20 lg:px-12 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl lg:text-8xl font-black leading-none mb-8">
            Artistry in Agriculture
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-600 leading-relaxed">
            CAKE Oklahoma is a premium cannabis cultivator committed to quality, 
            consistency, and transparency.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-20 lg:px-12 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed text-gray-700 mb-6">
              In a market with over 7,000 licensed cultivators in Oklahoma, 
              CAKE stands apart through uncompromising dedication to craft and quality.
            </p>
            <p className="text-xl leading-relaxed text-gray-700 mb-6">
              We believe cannabis cultivation is an art form. Every strain in our 
              genetics library is carefully curated, not just for market trends, 
              but for genuine excellence in flavor, effect, and consistency.
            </p>
            <p className="text-xl leading-relaxed text-gray-700">
              Our name isn't about desserts—it's about premium quality that speaks 
              for itself. Bold. Clean. Uncompromising.
            </p>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="px-6 py-20 lg:px-12 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Indoor Cultivation</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Complete environmental control ensures every plant receives optimal 
                conditions throughout its entire life cycle.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Premium Nutrients</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                We partner with House & Garden to provide plants with the highest 
                quality nutrition from seed to harvest.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Hand-Trimmed</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Every flower is carefully hand-trimmed to preserve trichomes and 
                maintain the integrity of each bud.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Proper Curing</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Extended curing periods allow terpenes to fully develop, delivering 
                maximum flavor and smooth smoke.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="px-6 py-20 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-8">
            Our Commitment
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-3">Quality First</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                We grow fewer strains than most cultivators—because we'd rather 
                master seven genetics than rush fifty.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Full Transparency</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Every batch includes complete lab testing with downloadable COAs. 
                You should know exactly what you're getting.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Consistency</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Our processes are dialed in to deliver the same premium quality 
                harvest after harvest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OMMA License */}
      <section className="px-6 py-12 lg:px-12 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-2">Oklahoma Medical Marijuana Authority</p>
          <p className="text-2xl font-bold">Licensed Cultivator</p>
        </div>
      </section>
    </div>
  );
}

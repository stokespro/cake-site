import { SiteNav } from '@/components/site-nav';
import { Hero } from '@/components/hero';
import { StrainScroller } from '@/components/strain-scroller';
import { FeatureRotator } from '@/components/feature-rotator';
import { PricingBlock } from '@/components/pricing-block';
import { OrderCta } from '@/components/order-cta';
import { SiteFooter } from '@/components/site-footer';

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <StrainScroller />
        <FeatureRotator />
        <PricingBlock />
        <OrderCta />
      </main>
      <SiteFooter />
    </>
  );
}

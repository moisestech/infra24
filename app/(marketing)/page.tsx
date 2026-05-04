import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { marketingHomeMeta } from '@/lib/marketing/content';
import { dccHomeMissionHeadline, dccHomeOrgLine } from '@/lib/marketing/dcc-pilot-home-content';

const CdcHeroVisual = dynamic(
  () =>
    import('@/components/marketing/cdc/CdcHeroVisual').then((m) => m.CdcHeroVisual),
  {
    loading: () => (
      <div
        className="min-h-[320px] w-full animate-pulse rounded-2xl bg-neutral-100/90 shadow-inner ring-1 ring-[var(--cdc-border)] dark:bg-neutral-800/90 sm:min-h-[380px] lg:min-h-[440px]"
        aria-hidden
      />
    ),
    ssr: true,
  }
);

const HomeHeroDigital = dynamic(
  () => import('@/components/marketing/HomeHeroDigital').then((m) => m.HomeHeroDigital),
  { ssr: true }
);

const HomeHeroActionBand = dynamic(
  () => import('@/components/marketing/HomeHeroActionBand').then((m) => m.HomeHeroActionBand),
  { ssr: true }
);

const HomeBelowFoldHero = dynamic(
  () => import('@/components/marketing/HomeBelowFoldHero').then((m) => m.HomeBelowFoldHero),
  { ssr: true }
);

const HomeLivingNetworkTeaser = dynamic(
  () => import('@/components/marketing/HomeLivingNetworkTeaser').then((m) => m.HomeLivingNetworkTeaser),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[280px] border-b border-[var(--cdc-border)] bg-neutral-950"
        aria-hidden
      />
    ),
  }
);

const EraChannelBand = dynamic(
  () => import('@/components/era/EraChannelBand').then((m) => m.EraChannelBand),
  {
    ssr: true,
    loading: () => (
      <div
        className="min-h-[400px] border-y border-[var(--cdc-border)] bg-[#fafafa] dark:bg-neutral-950"
        aria-hidden
      />
    ),
  }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: marketingHomeMeta.title,
    description: marketingHomeMeta.description,
    alternates: { canonical: '/' },
    openGraph: {
      title: marketingHomeMeta.title,
      description: marketingHomeMeta.description,
      url: '/',
    },
    twitter: {
      title: marketingHomeMeta.title,
      description: marketingHomeMeta.description,
    },
  };
}

export default function MarketingHomePage() {
  return (
    <>
      <section
        id="hero"
        className="cdc-mesh-hero-bg cdc-webcore-hero-shell scroll-mt-14 border-b border-[var(--cdc-border)]"
      >
        <div className="mx-auto flex min-h-[min(92dvh,920px)] max-w-5xl flex-col justify-start px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <HomeHeroDigital layout="institutional" headline={dccHomeMissionHeadline} orgLine={dccHomeOrgLine}>
            <HomeHeroActionBand />
          </HomeHeroDigital>
        </div>
      </section>

      <MarketingSection
        id="hero-expanded"
        className="scroll-mt-14 border-b border-[var(--cdc-border)] bg-white py-14 dark:border-neutral-800 dark:bg-neutral-900 sm:py-16 lg:py-24"
      >
        <HomeBelowFoldHero />
      </MarketingSection>

      <section
        id="hero-collage"
        className="scroll-mt-14 border-b border-[var(--cdc-border)] bg-[#fafafa] py-12 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <CdcHeroVisual />
        </div>
      </section>

      <HomeLivingNetworkTeaser />

      <EraChannelBand id="era-band" />

    </>
  );
}

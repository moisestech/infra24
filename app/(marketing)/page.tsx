import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';
import { ProofStrip } from '@/components/marketing/ProofStrip';
import { HomeFaqWebcoreList } from '@/components/marketing/HomeFaqWebcoreList';
import {
  marketingHero,
  marketingHeroPlainSubhead,
  marketingHomeMeta,
  getMarketingFaqHomeItems,
  caseStudyPreviews,
  dccAudiencePathways,
  dccWhyMiami,
  dccSiteMeta,
  dccSystemsIntro,
  dccWhatWeAreIntro,
} from '@/lib/marketing/content';
import { homeVisualProofEcho, homeVisualWhyMiami } from '@/lib/marketing/home-visual-assets';

const CdcHeroVisual = dynamic(
  () =>
    import('@/components/marketing/cdc/CdcHeroVisual').then((m) => m.CdcHeroVisual),
  {
    loading: () => (
      <div
        className="min-h-[320px] w-full animate-pulse rounded-2xl bg-neutral-100/90 shadow-inner ring-1 ring-[var(--cdc-border)] sm:min-h-[380px] lg:min-h-[440px]"
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

const HomePathwayWebcoreGrid = dynamic(
  () =>
    import('@/components/marketing/HomePathwayWebcoreGrid').then((m) => m.HomePathwayWebcoreGrid),
  { ssr: true }
);

const HomeWebcoreVisualGrid = dynamic(
  () =>
    import('@/components/marketing/HomeWebcoreVisualGrid').then((m) => m.HomeWebcoreVisualGrid),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[200px] animate-pulse rounded-xl bg-neutral-100/90" aria-hidden />
    ),
  }
);

const HeroAboveFoldEngagement = dynamic(
  () =>
    import('@/components/marketing/HeroAboveFoldEngagement').then((m) => m.HeroAboveFoldEngagement),
  { ssr: true }
);

/** Tighter scale for long glitch H1 (“Digital Culture Center Miami”). */
const homeHeroHeadlineClassName =
  'cdc-hero-headline max-w-4xl text-[1.65rem] font-bold leading-[1.11] tracking-tight text-neutral-900 sm:text-3xl sm:leading-[1.12] lg:text-4xl xl:text-[2.35rem] xl:leading-[1.1]';

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
  const faqPreview = getMarketingFaqHomeItems();

  return (
    <>
      <section
        id="hero"
        className="cdc-mesh-hero-bg cdc-webcore-hero-shell scroll-mt-14 border-b border-[var(--cdc-border)]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-14">
            <HomeHeroDigital
              headline={marketingHero.headline}
              headlineClassName={homeHeroHeadlineClassName}
              subhead={marketingHeroPlainSubhead}
              poweredByLine={dccSiteMeta.poweredByLine}
            >
              <HeroAboveFoldEngagement />
              <p className="mt-5 max-w-2xl text-sm text-neutral-500">{marketingHero.microTrust}</p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-5">
                <form
                  action="/programs"
                  method="get"
                  className="inline-flex w-full justify-center sm:w-auto sm:justify-start"
                >
                  <ShimmerButton
                    type="submit"
                    borderRadius="0.5rem"
                    background="rgb(15 23 42)"
                    shimmerColor="rgb(45 212 191)"
                    shimmerDuration="2.8s"
                    className="cdc-arcade-primary-btn w-full border-2 border-teal-500/35 px-8 py-4 text-base font-bold tracking-wide sm:min-h-[3.25rem] sm:w-auto sm:px-10 sm:text-lg"
                  >
                    Explore Programs
                  </ShimmerButton>
                </form>
                <Link
                  href="/for-funders"
                  className="cdc-arcade-secondary-btn inline-flex min-h-[3.25rem] items-center justify-center px-6 text-base font-bold tracking-wide text-neutral-900 no-underline sm:px-8 sm:text-lg"
                >
                  For Funders
                </Link>
              </div>
              <p className="mt-8 text-sm text-neutral-500">
                <Link
                  href="/infra24"
                  className="font-medium text-neutral-700 underline-offset-4 hover:underline"
                >
                  What is Infra24?
                </Link>
                {' · '}
                <Link
                  href="/grants"
                  className="font-medium text-neutral-700 underline-offset-4 hover:underline"
                >
                  Grants &amp; Miami pilot
                </Link>
              </p>
            </HomeHeroDigital>
            <CdcHeroVisual className="lg:justify-self-end" />
          </div>
        </div>
      </section>

      <MarketingSection id="what-dcc-is" className="scroll-mt-14 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          What DCC is
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">{dccWhatWeAreIntro}</p>
        <p className="mt-6">
          <Link
            href="/about"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            About Digital Culture Center Miami →
          </Link>
        </p>
      </MarketingSection>

      <MarketingSection id="pathways" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          Three ways to engage
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          We are prioritizing <strong className="font-medium text-neutral-800">grantmakers</strong> and{' '}
          <strong className="font-medium text-neutral-800">small cultural organizations</strong> first;
          artists stay central through programs and workshops. For audits, signage systems, and
          implementation detail, see{' '}
          <Link href="/infra24" className="font-medium text-neutral-800 underline-offset-4 hover:underline">
            Infra24
          </Link>
          .
        </p>
        <div className="mt-10">
          <HomePathwayWebcoreGrid
            items={[...dccAudiencePathways]}
            columnsClassName="lg:grid-cols-3"
          />
        </div>
      </MarketingSection>

      <MarketingSection id="why-miami" className="scroll-mt-14 bg-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              {dccWhyMiami.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">{dccWhyMiami.body}</p>
            <p className="mt-6">
              <Link
                href="/why-miami"
                className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                Why Miami (full page) →
              </Link>
            </p>
          </div>
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualWhyMiami]} />
        </div>
      </MarketingSection>

      <MarketingSection id="proof" className="scroll-mt-14 bg-[#fafafa]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Selected project patterns
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Case-style examples—challenge, intervention, and what scales next.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            View all projects
          </Link>
        </div>
        <div className="mt-8 max-w-md">
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualProofEcho]} />
        </div>
        <div className="mt-10">
          <ProofStrip items={caseStudyPreviews} />
        </div>
      </MarketingSection>

      <MarketingSection id="infra24" className="scroll-mt-14 border-y border-[var(--cdc-border)] bg-white py-14 sm:py-16">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          Powered by Infra24
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">{dccSystemsIntro}</p>
        <p className="mt-6">
          <Link
            href="/infra24"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            What Infra24 does →
          </Link>
        </p>
      </MarketingSection>

      <MarketingSection id="faq" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          Common questions
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Straight answers for artists, organizations, and funders.{' '}
          <Link href="/about" className="font-medium text-neutral-800 underline-offset-4 hover:underline">
            More on About
          </Link>
          .
        </p>
        <div className="cdc-webcore-faq-shell mt-10">
          <HomeFaqWebcoreList items={faqPreview} />
        </div>
      </MarketingSection>

      <MarketingSection id="cta" className="scroll-mt-14 bg-white pb-20">
        <CtaBand
          headline="Build public digital culture with us"
          body="Funding supports DCC Miami programs and the Infra24 implementation that keeps interfaces and workshops maintainable. Partners host pilots; funders help prove the model for Miami."
          primaryLabel="Grants"
          primaryHref="/grants"
          secondaryLabel="Explore projects"
          secondaryHref="/projects"
          tertiaryLabel="Partnership contact"
          tertiaryHref="/contact/partnerships"
        />
      </MarketingSection>
    </>
  );
}

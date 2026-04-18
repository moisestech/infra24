import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';
import { ProofStrip } from '@/components/marketing/ProofStrip';
import { HomeFaqWebcoreList } from '@/components/marketing/HomeFaqWebcoreList';
import {
  marketingHero,
  marketingHomeMeta,
  publicDigitalMiamiLine,
  getMarketingFaqHomeItems,
  caseStudyPreviews,
  dccAudiencePathways,
  dccWhyMiami,
  dccSiteMeta,
  dccSystemsIntro,
  dccWhatWeAreIntro,
} from '@/lib/marketing/content';
import {
  dccHeroRotatingHeadlines,
  dccHeroRotatingSubheads,
  dccHomePathwaysSection,
  dccParticipantValue,
  dccPilotCtaBand,
  dccPilotHomeHero,
  dccPilotIntro,
  dccProofSectionIntro,
  dccYear1ServicePillars,
} from '@/lib/marketing/dcc-pilot-home-content';
import {
  homeVisualInfra24Band,
  homeVisualProofEcho,
  homeVisualWhatDccIs,
  homeVisualWhyMiami,
} from '@/lib/marketing/home-visual-assets';

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
      <div className="min-h-[200px] animate-pulse rounded-xl bg-neutral-100/90 dark:bg-neutral-800/90" aria-hidden />
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
  'cdc-hero-headline max-w-4xl text-[1.65rem] font-bold leading-[1.11] tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl sm:leading-[1.12] lg:text-4xl xl:text-[2.35rem] xl:leading-[1.1]';

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
              eyebrow={dccPilotHomeHero.eyebrow}
              publicDigitalMiamiLine={publicDigitalMiamiLine}
              headline={marketingHero.headline}
              headlineClassName={homeHeroHeadlineClassName}
              rotatingHeadlines={dccHeroRotatingHeadlines}
              rotatingSubheads={dccHeroRotatingSubheads}
              poweredByLine={dccSiteMeta.poweredByLine}
            >
              <HeroAboveFoldEngagement />
              <p className="mt-5 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
                {dccPilotHomeHero.trustLine}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-5">
                <Link
                  href={dccPilotHomeHero.primaryCta.href}
                  className="group relative z-0 inline-flex w-full min-h-[3.25rem] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-teal-500/35 bg-slate-900 px-8 py-4 text-base font-bold tracking-wide text-white shadow-sm transition-transform duration-300 ease-in-out hover:opacity-95 active:translate-y-px sm:w-auto sm:px-10 sm:text-lg"
                >
                  {dccPilotHomeHero.primaryCta.label}
                </Link>
                <Link
                  href={dccPilotHomeHero.secondaryCta.href}
                  className="cdc-arcade-secondary-btn inline-flex min-h-[3.25rem] items-center justify-center px-6 text-base font-bold tracking-wide text-neutral-900 no-underline sm:px-8 sm:text-lg dark:text-neutral-100"
                >
                  {dccPilotHomeHero.secondaryCta.label}
                </Link>
              </div>
              <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
                <Link
                  href="/infra24"
                  className="font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
                >
                  What is Infra24?
                </Link>
                {' · '}
                <Link
                  href="/grants"
                  className="font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
                >
                  Grants &amp; Miami pilot
                </Link>
                {' · '}
                <Link
                  href="/for-funders"
                  className="font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
                >
                  For funders
                </Link>
              </p>
            </HomeHeroDigital>
            <CdcHeroVisual className="lg:justify-self-end" />
          </div>
        </div>
      </section>

      <MarketingSection id="pilot-intro" className="scroll-mt-14 bg-white dark:bg-neutral-900">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {dccPilotIntro.title}
        </h2>
        {dccPilotIntro.paragraphs.map((p, i) => (
          <p
            key={i}
            className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            {p}
          </p>
        ))}
      </MarketingSection>

      <MarketingSection
        id="year-1-services"
        className="scroll-mt-24 border-y border-[var(--cdc-border)] bg-[#fafafa] py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16"
      >
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Year 1 service menu
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          A defined set of pilot services—concrete deliverables, public learning, and partner-ready outputs.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dccYear1ServicePillars.map((pillar) => (
            <li
              key={pillar.id}
              className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <h3 className="text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {pillar.summary}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                Who it serves
              </p>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{pillar.whoItServes}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                Deliverable
              </p>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{pillar.deliverable}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id="participant-value" className="scroll-mt-14 bg-white dark:bg-neutral-900">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {dccParticipantValue.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {dccParticipantValue.intro}
        </p>
        <ul className="mt-6 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {dccParticipantValue.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id="what-dcc-is" className="scroll-mt-14 bg-[#fafafa] dark:bg-neutral-950">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          What DCC is
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {dccWhatWeAreIntro}
        </p>
        <div className="mt-10 max-w-6xl">
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualWhatDccIs]} />
        </div>
        <p className="mt-8">
          <Link
            href="/about"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            About Digital Culture Center Miami →
          </Link>
        </p>
      </MarketingSection>

      <MarketingSection id="pathways" className="scroll-mt-14 bg-white dark:bg-neutral-900">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {dccHomePathwaysSection.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          We are prioritizing{' '}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">grantmakers</strong> and{' '}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">
            small cultural organizations
          </strong>{' '}
          first; artists stay central through programs and workshops. For audits, signage systems, and
          implementation detail, see{' '}
          <Link
            href="/infra24"
            className="font-medium text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200"
          >
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

      <MarketingSection id="why-miami" className="scroll-mt-14 bg-[#fafafa] dark:bg-neutral-950">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {dccWhyMiami.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {dccWhyMiami.body}
            </p>
            <p className="mt-6">
              <Link
                href="/why-miami"
                className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
              >
                Why Miami (full page) →
              </Link>
            </p>
          </div>
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualWhyMiami]} />
        </div>
      </MarketingSection>

      <MarketingSection id="proof" className="scroll-mt-14 bg-white dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {dccProofSectionIntro.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
              {dccProofSectionIntro.subcopy}
            </p>
          </div>
          <Link
            href="/projects"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            View all projects
          </Link>
        </div>
        <div className="mt-8 w-full max-w-6xl">
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualProofEcho]} />
        </div>
        <div className="mt-10">
          <ProofStrip items={caseStudyPreviews} />
        </div>
      </MarketingSection>

      <MarketingSection
        id="infra24"
        className="scroll-mt-14 border-y border-[var(--cdc-border)] bg-[#fafafa] py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16"
      >
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Powered by Infra24
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {dccSystemsIntro}
        </p>
        <div className="mt-8 max-w-3xl">
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualInfra24Band]} />
        </div>
        <p className="mt-6">
          <Link
            href="/infra24"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            What Infra24 does →
          </Link>
        </p>
      </MarketingSection>

      <MarketingSection id="faq" className="scroll-mt-14 bg-white dark:bg-neutral-900">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Common questions
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Straight answers for artists, organizations, and funders.{' '}
          <Link
            href="/about"
            className="font-medium text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200"
          >
            More on About
          </Link>
          .
        </p>
        <div className="cdc-webcore-faq-shell mt-10">
          <HomeFaqWebcoreList items={faqPreview} />
        </div>
      </MarketingSection>

      <MarketingSection id="cta" className="scroll-mt-14 bg-[#fafafa] pb-20 dark:bg-neutral-950">
        <CtaBand
          headline={dccPilotCtaBand.headline}
          body={dccPilotCtaBand.body}
          primaryLabel={dccPilotCtaBand.primaryLabel}
          primaryHref={dccPilotCtaBand.primaryHref}
          secondaryLabel={dccPilotCtaBand.secondaryLabel}
          secondaryHref={dccPilotCtaBand.secondaryHref}
          tertiaryLabel={dccPilotCtaBand.tertiaryLabel}
          tertiaryHref={dccPilotCtaBand.tertiaryHref}
        />
      </MarketingSection>
    </>
  );
}

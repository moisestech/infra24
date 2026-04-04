import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';
import { OfferLadder } from '@/components/marketing/OfferLadder';
import { ProblemSplitVisual } from '@/components/marketing/ProblemSplitVisual';
import { BentoSystemsGrid } from '@/components/marketing/BentoSystemsGrid';
import { ProofStrip } from '@/components/marketing/ProofStrip';
import { HomeFaqWebcoreList } from '@/components/marketing/HomeFaqWebcoreList';
import { HomeSysLogPanel } from '@/components/marketing/HomeSysLogPanel';
import { HomeWebcoreStatusStrip } from '@/components/marketing/HomeWebcoreStatusStrip';
import { WebcoreIcon, type WebcoreIconName } from '@/components/marketing/webcore-lucide';
import {
  marketingHero,
  marketingHomeMeta,
  marketingFaq,
  problemSection,
  problemBullets,
  differentiationSection,
  differentiationCards,
  capabilities,
  caseStudyPreviews,
  idealFitSection,
  idealFitBullets,
  measurementSection,
  cdcNarrativeStack,
  cdcAudiencePathways,
  cdcWhyMiami,
  cdcSystemsIntro,
  cdcSiteMeta,
  homeDigitalMarquee,
  homeWebcoreStatus,
  homeSysLogLines,
} from '@/lib/marketing/content';
import {
  homeVisualMidGallery,
  homeVisualNarrativeBridge,
  homeVisualPostMarquee,
  homeVisualProblemFeatured,
  homeVisualProcessStrip,
  homeVisualProofEcho,
  homeVisualWhyMiami,
} from '@/lib/marketing/home-visual-assets';

const NARRATIVE_WEBCORE_ICONS = {
  problem: 'AlertCircle',
  opportunity: 'Lightbulb',
  response: 'Sparkles',
  method: 'Wrench',
  outcome: 'ShieldCheck',
} as const satisfies Record<(typeof cdcNarrativeStack)[number]['id'], WebcoreIconName>;

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

const HomeDigitalMarqueeBand = dynamic(
  () =>
    import('@/components/marketing/HomeDigitalMarqueeBand').then((m) => m.HomeDigitalMarqueeBand),
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
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <HomeWebcoreStatusStrip
            items={homeWebcoreStatus}
            className="mb-10 rounded-lg border border-[var(--cdc-border)]/70 bg-white/25 px-3 py-2.5 sm:px-5"
          />
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-14">
            <HomeHeroDigital
              eyebrow={marketingHero.eyebrow}
              headline={marketingHero.headline}
              subhead={marketingHero.subhead}
              poweredByLine={cdcSiteMeta.poweredByLine}
            >
              <p className="mt-4 max-w-2xl text-sm text-neutral-500">{marketingHero.microTrust}</p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-5">
                <form
                  action="/grants"
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
                    Grants & Miami pilot
                  </ShimmerButton>
                </form>
                <Link
                  href="/programs"
                  className="cdc-arcade-secondary-btn inline-flex min-h-[3.25rem] items-center justify-center px-6 text-base font-bold tracking-wide text-neutral-900 no-underline sm:px-8 sm:text-lg"
                >
                  Browse programs
                </Link>
                <Link
                  href="/grants/funders"
                  className="cdc-arcade-secondary-btn cdc-arcade-secondary-btn--muted inline-flex min-h-[3.25rem] items-center justify-center px-6 text-base font-bold tracking-wide text-neutral-800 no-underline sm:px-8 sm:text-lg"
                >
                  Funder overview
                </Link>
              </div>
              <p className="mt-8 text-sm text-neutral-500">
                Implementation layer:{' '}
                <Link
                  href="/infra24"
                  className="font-medium text-neutral-700 underline-offset-4 hover:underline"
                >
                  What is Infra24?
                </Link>
                {' · '}
                <Link
                  href="/platform"
                  className="font-medium text-neutral-700 underline-offset-4 hover:underline"
                >
                  Platform area
                </Link>
              </p>
            </HomeHeroDigital>
            <CdcHeroVisual className="lg:justify-self-end" />
          </div>
        </div>
      </section>

      <HomeDigitalMarqueeBand items={homeDigitalMarquee} />

      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-y border-[var(--cdc-border)] bg-neutral-950/[0.02] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Field texture
          </p>
          <p className="mt-1 max-w-2xl text-xs text-neutral-500">
            Visual references from studio and field practice—texture, not stock photography.
          </p>
          <div className="mt-6">
            <HomeWebcoreVisualGrid lightbox mode="mosaic" items={[...homeVisualPostMarquee]} />
          </div>
        </div>
      </div>

      <MarketingSection id="pathways" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          Three ways to engage
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          We are prioritizing <strong className="font-medium text-neutral-800">grantmakers</strong> and{' '}
          <strong className="font-medium text-neutral-800">small cultural organizations</strong> first;
          artists remain central through programs and workshops. One site—CDC mission, Infra24
          delivery—without competing brands.
        </p>
        <div className="mt-10">
          <HomePathwayWebcoreGrid
            items={[...cdcAudiencePathways]}
            columnsClassName="lg:grid-cols-3"
          />
        </div>
      </MarketingSection>

      <MarketingSection id="narrative" className="scroll-mt-14 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          Narrative stack
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Problem → opportunity → response → method → outcome. This sequence matches how we talk with
          partners and in grant applications.
        </p>
        <dl className="mt-10 space-y-8">
          {cdcNarrativeStack.map((step) => (
            <div key={step.id}>
              <dt className="flex items-start gap-2.5 text-sm font-semibold text-neutral-900">
                <WebcoreIcon
                  name={NARRATIVE_WEBCORE_ICONS[step.id]}
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cdc-teal)]"
                />
                <span>{step.title}</span>
              </dt>
              <dd className="mt-2 max-w-2xl pl-[1.625rem] text-sm leading-relaxed text-neutral-600 sm:pl-7">
                {step.body}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 border-t border-[var(--cdc-border)] pt-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Reference layer
          </p>
          <p className="mt-2 max-w-2xl text-xs text-neutral-500 sm:text-sm">
            Networked aesthetics and surveillance-adjacent themes—context for how we talk about public
            digital culture.
          </p>
          <div className="mt-6">
            <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualNarrativeBridge]} />
          </div>
        </div>
      </MarketingSection>

      <MarketingSection id="why-miami" className="scroll-mt-14 bg-[#fafafa]">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              {cdcWhyMiami.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">{cdcWhyMiami.body}</p>
          </div>
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualWhyMiami]} />
        </div>
      </MarketingSection>

      <MarketingSection id="problem" className="scroll-mt-14 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {problemSection.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {problemSection.lead}
        </p>
        <ul className="mt-6 space-y-2.5">
          {problemBullets.map((s) => (
            <li key={s} className="flex gap-2.5 text-sm text-neutral-700">
              <span className="select-none font-mono text-sm font-semibold text-[var(--cdc-teal)]" aria-hidden>
                {'>'}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <HomeWebcoreVisualGrid lightbox mode="featured" item={homeVisualProblemFeatured} />
        </div>
        <ProblemSplitVisual />
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {problemSection.closing}
        </p>
      </MarketingSection>

      <MarketingSection id="difference" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {differentiationSection.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {differentiationSection.intro}
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {differentiationCards.map((card) => (
            <div
              key={card.leftLabel}
              className="cdc-webcore-brackets flex flex-col rounded-lg border border-[var(--cdc-border)] bg-white p-5 shadow-sm shadow-teal-950/[0.03]"
            >
              <div className="border-b border-neutral-100 pb-3">
                <p className="text-xs font-medium uppercase text-neutral-500">{card.leftLabel}</p>
                <p className="mt-2 text-sm text-neutral-600">{card.left}</p>
              </div>
              <div className="pt-4">
                <p className="text-xs font-medium uppercase text-neutral-800">{card.rightLabel}</p>
                <p className="mt-2 text-sm text-neutral-700">{card.right}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-neutral-600">{differentiationSection.supportingLine}</p>
      </MarketingSection>

      <MarketingSection
        id="field-refs"
        className="scroll-mt-14 border-y border-[var(--cdc-border)] bg-white py-16 sm:py-20"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Exhibition & practice
        </p>
        <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          Field references
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Works and exhibitions that sit adjacent to this infrastructure work—material culture,
          e-waste, surveillance cute, and open studios energy.
        </p>
        <div className="mt-10">
          <HomeWebcoreVisualGrid lightbox mode="mosaic" items={[...homeVisualMidGallery]} />
        </div>
      </MarketingSection>

      <MarketingSection id="systems" className="scroll-mt-14 bg-white">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          What we build
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">{cdcSystemsIntro}</p>
        <div className="mt-10">
          <BentoSystemsGrid capabilities={capabilities} />
        </div>
      </MarketingSection>

      <MarketingSection id="process" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Start with clarity. Pilot what matters. Expand what works.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          CDC and Infra24 are designed for sequenced work—audits and scoped pilots before large
          commitments.
        </p>
        <div className="mt-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Process buffer
          </p>
          <div className="mt-3">
            <HomeWebcoreVisualGrid lightbox mode="strip" items={[...homeVisualProcessStrip]} />
          </div>
        </div>
        <div className="mt-10">
          <OfferLadder />
        </div>
      </MarketingSection>

      <MarketingSection id="fit" className="scroll-mt-14 bg-white">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {idealFitSection.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {idealFitSection.body}
        </p>
        <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {idealFitBullets.map((b) => (
            <li key={b} className="flex gap-2.5 text-sm text-neutral-700">
              <span
                className="select-none font-mono text-xs font-semibold text-[var(--cdc-magenta)] opacity-80"
                aria-hidden
              >
                {'~'}
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-neutral-600">{idealFitSection.supporting}</p>
      </MarketingSection>

      <MarketingSection id="outcomes" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {measurementSection.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {measurementSection.lead}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {measurementSection.supporting}
        </p>
      </MarketingSection>

      <MarketingSection
        id="interface-notes"
        className="scroll-mt-14 border-y border-[var(--cdc-border)] bg-neutral-950/[0.015] py-14 sm:py-16"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Interface notes
        </p>
        <h2 className="mt-2 max-w-2xl text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
          Stylized system readout
        </h2>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-neutral-500 sm:text-sm">
          Console-style lines below are decorative flavor—not live operations, analytics, or
          proprietary telemetry.
        </p>
        <div className="mt-6 max-w-2xl">
          <HomeSysLogPanel lines={homeSysLogLines} />
        </div>
      </MarketingSection>

      <MarketingSection id="faq" className="scroll-mt-14 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          Common questions
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Straight answers for artists, organizations, and funders evaluating this work.
        </p>
        <div className="cdc-webcore-faq-shell mt-10">
          <HomeFaqWebcoreList items={[...marketingFaq]} />
        </div>
      </MarketingSection>

      <MarketingSection id="proof" className="scroll-mt-14 bg-[#fafafa]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Project patterns
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Case-style examples—challenge, intervention, and what scales next.
            </p>
            <p
              className="mt-3 max-w-xl font-mono text-[10px] font-normal uppercase tracking-[0.32em] text-neutral-400"
              aria-hidden
            >
              0x1a4e · trace.chunk · hash_echo · compile_idle
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

      <MarketingSection id="cta" className="scroll-mt-14 bg-white pb-20">
        <CtaBand
          headline="Build public digital culture with us"
          body="Funding supports CDC programs and the Infra24 implementation that keeps interfaces and workshops maintainable. Partners host pilots; funders help prove the model for Miami."
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

import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';
import { OfferLadder } from '@/components/marketing/OfferLadder';
import { HeroCollage } from '@/components/marketing/HeroCollage';
import { ProblemSplitVisual } from '@/components/marketing/ProblemSplitVisual';
import { BentoSystemsGrid } from '@/components/marketing/BentoSystemsGrid';
import { ProofStrip } from '@/components/marketing/ProofStrip';
import {
  marketingHero,
  problemSection,
  problemBullets,
  differentiationSection,
  differentiationCards,
  systemsIntro,
  capabilities,
  caseStudyPreviews,
  idealFitSection,
  idealFitBullets,
  measurementSection,
} from '@/lib/marketing/content';

export default function MarketingHomePage() {
  return (
    <>
      <section
        id="hero"
        className="scroll-mt-14 border-b border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {marketingHero.eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                <Balancer>{marketingHero.headline}</Balancer>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
                {marketingHero.subhead}
              </p>
              <p className="mt-4 max-w-2xl text-sm text-neutral-500">{marketingHero.microTrust}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <form
                  action="/audit"
                  method="get"
                  className="inline-flex w-full justify-center sm:w-auto sm:justify-start"
                >
                  <ShimmerButton
                    type="submit"
                    borderRadius="0.375rem"
                    background="rgb(23 23 23)"
                    shimmerColor="rgb(212 212 212)"
                    shimmerDuration="3.5s"
                    className="w-full px-5 py-2.5 text-sm font-medium sm:w-auto"
                  >
                    Book a Communication Infrastructure Audit
                  </ShimmerButton>
                </form>
                <Link
                  href="/pilots"
                  className="inline-flex justify-center text-sm font-medium text-neutral-800 underline-offset-4 hover:underline"
                >
                  Explore pilot systems
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex justify-center text-sm font-medium text-neutral-600 underline-offset-4 hover:underline"
                >
                  Ask about grant-aligned deployment
                </Link>
              </div>
              <p className="mt-8 text-sm text-neutral-500">
                Platform and product demos:{' '}
                <Link
                  href="/platform"
                  className="font-medium text-neutral-700 underline-offset-4 hover:underline"
                >
                  Platform overview
                </Link>
              </p>
            </div>
            <HeroCollage className="lg:justify-self-end" />
          </div>
        </div>
      </section>

      <MarketingSection id="problem" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {problemSection.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {problemSection.lead}
        </p>
        <ul className="mt-6 space-y-2">
          {problemBullets.map((s) => (
            <li key={s} className="text-sm text-neutral-700">
              — {s}
            </li>
          ))}
        </ul>
        <ProblemSplitVisual />
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {problemSection.closing}
        </p>
      </MarketingSection>

      <MarketingSection id="difference" className="scroll-mt-14 bg-white">
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
              className="flex flex-col rounded-lg border border-neutral-200 p-5"
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

      <MarketingSection id="systems" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          What Infra24 builds
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">{systemsIntro}</p>
        <div className="mt-10">
          <BentoSystemsGrid capabilities={capabilities} />
        </div>
      </MarketingSection>

      <MarketingSection id="process" className="scroll-mt-14 bg-white">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Start with an audit. Build a pilot. Expand what works.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Infra24 is designed to begin with a clear first step—not a giant transformation project.
        </p>
        <div className="mt-10">
          <OfferLadder />
        </div>
      </MarketingSection>

      <MarketingSection id="fit" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {idealFitSection.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {idealFitSection.body}
        </p>
        <ul className="mt-6 grid list-disc gap-2 pl-5 sm:grid-cols-2">
          {idealFitBullets.map((b) => (
            <li key={b} className="text-sm text-neutral-700">
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-neutral-600">{idealFitSection.supporting}</p>
      </MarketingSection>

      <MarketingSection id="outcomes" className="scroll-mt-14 bg-white">
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

      <MarketingSection id="proof" className="scroll-mt-14 bg-[#fafafa]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Early system examples
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Pilotable patterns—structured so leadership can see challenge, intervention, and what
              scales next.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            View all case studies
          </Link>
        </div>
        <div className="mt-10">
          <ProofStrip items={caseStudyPreviews} />
        </div>
      </MarketingSection>

      <MarketingSection id="audit" className="scroll-mt-14 bg-white pb-20">
        <CtaBand
          headline="Start with a Communication Infrastructure Audit"
          body="If your organization is dealing with fragmented signs, scattered updates, inconsistent event information, or underused public-facing tools, the best first step is a focused review. We help identify what needs to be visible, where it should live, who should own it, and which pilot creates the clearest value."
          primaryLabel="Book the audit"
          primaryHref="/audit"
          secondaryLabel="Discuss a pilot"
          secondaryHref="/pilots"
          tertiaryLabel="Ask about grant-aligned deployment"
          tertiaryHref="/contact"
        />
      </MarketingSection>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';
import { OfferLadder } from '@/components/marketing/OfferLadder';
import { BentoSystemsGrid } from '@/components/marketing/BentoSystemsGrid';
import { ProofStrip } from '@/components/marketing/ProofStrip';
import { ProblemSplitVisual } from '@/components/marketing/ProblemSplitVisual';
import { Breadcrumbs } from '@/components/marketing/cdc';
import {
  infra24MarketingMeta,
  infra24MarketingHero,
  infra24WhatWeDoCategories,
  infra24Faq,
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: infra24MarketingMeta.title,
    description: infra24MarketingMeta.description,
    alternates: { canonical: '/infra24' },
    openGraph: {
      title: infra24MarketingMeta.title,
      description: infra24MarketingMeta.description,
      url: '/infra24',
    },
    twitter: {
      title: infra24MarketingMeta.title,
      description: infra24MarketingMeta.description,
    },
  };
}

export default function Infra24ProductPage() {
  return (
    <>
      <section className="scroll-mt-14 border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 sm:pt-12 lg:px-8">
          <Breadcrumbs items={[{ href: '/infra24', label: 'Infra24' }]} />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {infra24MarketingHero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            <Balancer>{infra24MarketingHero.headline}</Balancer>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            {infra24MarketingHero.subhead}
          </p>
          <p className="mt-4 max-w-2xl text-sm text-neutral-500">{infra24MarketingHero.microTrust}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <form
              action="/programs/artist-support/digital-audits"
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
              href="/projects"
              className="inline-flex justify-center text-sm font-medium text-neutral-800 underline-offset-4 hover:underline"
            >
              Explore project patterns
            </Link>
            <Link
              href="/contact/general"
              className="inline-flex justify-center text-sm font-medium text-neutral-600 underline-offset-4 hover:underline"
            >
              Contact (institutional)
            </Link>
          </div>
          <p className="mt-8 text-sm text-neutral-500">
            <Link href="/" className="font-medium text-neutral-700 underline-offset-4 hover:underline">
              Center of Digital Culture
            </Link>
            {' — '}
            {infra24MarketingHero.cdcLinkLine}{' '}
            <Link href="/platform" className="font-medium text-neutral-700 underline-offset-4 hover:underline">
              Platform area
            </Link>
          </p>
        </div>
      </section>

      <MarketingSection id="problem" className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {problemSection.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">{problemSection.lead}</p>
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
              className="flex flex-col rounded-lg border border-neutral-200 bg-[#fafafa] p-5"
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
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">What Infra24 builds</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">{systemsIntro}</p>
        <div className="mt-10">
          <BentoSystemsGrid capabilities={capabilities} />
        </div>
      </MarketingSection>

      <MarketingSection id="what-we-do" className="scroll-mt-14 bg-white">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">What we do</h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Repeatable digital systems so visibility and clarity do not depend on heroic manual effort.
        </p>
        <div className="mt-10 grid gap-6">
          {infra24WhatWeDoCategories.map((cat) => (
            <div
              key={cat.title}
              className="rounded-lg border border-neutral-200 bg-[#fafafa] p-6 sm:p-8"
            >
              <h3 className="text-lg font-semibold text-neutral-900">{cat.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{cat.body}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="process" className="scroll-mt-14 bg-[#fafafa]">
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

      <MarketingSection id="fit" className="scroll-mt-14 bg-white">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">{idealFitSection.headline}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">{idealFitSection.body}</p>
        <ul className="mt-6 grid list-disc gap-2 pl-5 sm:grid-cols-2">
          {idealFitBullets.map((b) => (
            <li key={b} className="text-sm text-neutral-700">
              {b}
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

      <MarketingSection id="faq" className="scroll-mt-14 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          Common questions
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Straight answers for organizations evaluating public communication infrastructure.
        </p>
        <dl className="mt-10 space-y-8">
          {infra24Faq.map((item) => (
            <div key={item.question}>
              <dt className="text-sm font-semibold text-neutral-900">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-neutral-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </MarketingSection>

      <MarketingSection id="proof" className="scroll-mt-14 bg-[#fafafa]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Early system examples</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Pilotable patterns—challenge, intervention, and what scales next.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            View all projects
          </Link>
        </div>
        <div className="mt-10">
          <ProofStrip items={caseStudyPreviews} />
        </div>
      </MarketingSection>

      <MarketingSection id="deeper" className="scroll-mt-14 bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Go deeper</h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <Link href="/infra24/method" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
              Method
            </Link>
          </li>
          <li>
            <Link href="/infra24/systems" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
              Systems
            </Link>
          </li>
          <li>
            <Link
              href="/infra24/case-studies"
              className="font-medium text-neutral-900 underline-offset-4 hover:underline"
            >
              Case studies (overview)
            </Link>
          </li>
          <li>
            <Link href="/infra24/toolkit" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
              Toolkit
            </Link>
          </li>
        </ul>
      </MarketingSection>

      <MarketingSection id="cta" className="scroll-mt-14 bg-[#fafafa] pb-20">
        <CtaBand
          headline="Start with a Communication Infrastructure Audit"
          body="If your organization is dealing with fragmented signs, scattered updates, inconsistent event information, or underused public-facing tools, the best first step is a focused review."
          primaryLabel="Book the audit"
          primaryHref="/programs/artist-support/digital-audits"
          secondaryLabel="Explore projects"
          secondaryHref="/projects"
          tertiaryLabel="Grant-aligned deployment"
          tertiaryHref="/grants/funders"
        />
      </MarketingSection>
    </>
  );
}

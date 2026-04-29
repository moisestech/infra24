import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { knightFoundationGrantPage as p } from '@/lib/marketing/knight-foundation';

export const metadata: Metadata = {
  title: 'Miami pilot — public cultural communication infrastructure',
  description:
    'A proposed Miami pilot for updateable public-facing communication systems across cultural organizations—smart signs, maps, multilingual interfaces, and repeatable deployment.',
  openGraph: {
    title: 'Miami pilot | Infra24',
    description:
      'Public-facing pilot for clearer cultural access through smart signs, maps, and multilingual public interfaces.',
  },
};

export default function KnightFoundationGrantPage() {
  return (
    <>
      <section
        id="hero"
        className="scroll-mt-14 border-b border-neutral-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            <p>Knight Foundation–aligned pilot overview</p>
            <p className="mt-2 font-normal normal-case tracking-normal text-neutral-600">
              <Link
                href="/knight"
                className="font-medium text-neutral-800 underline-offset-4 hover:underline"
              >
                Reviewer packet (downloads + context) → dcc.miami/knight
              </Link>
            </p>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            {p.hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            {p.hero.subhead}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={p.hero.primaryCta.href}
              className="inline-flex justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              {p.hero.primaryCta.label}
            </a>
            <a
              href={p.hero.secondaryCta.href}
              className="inline-flex justify-center text-sm font-medium text-neutral-800 underline-offset-4 hover:underline"
            >
              {p.hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>

      <MarketingSection id={p.problem.id} className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.problem.headline}
        </h2>
        {p.problem.paragraphs.map((para, i) => (
          <p key={i} className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
            {para}
          </p>
        ))}
      </MarketingSection>

      <MarketingSection id={p.proposal.id} className="scroll-mt-14 border-b border-neutral-200 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.proposal.headline}
        </h2>
        {p.proposal.paragraphs.map((para, i) => (
          <p key={i} className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
            {para}
          </p>
        ))}
      </MarketingSection>

      <MarketingSection id={p.visibleEntryPoints.id} className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.visibleEntryPoints.headline}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {p.visibleEntryPoints.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-neutral-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{card.body}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id={p.differentiation.id} className="scroll-mt-14 border-b border-neutral-200 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.differentiation.headline}
        </h2>
        {p.differentiation.paragraphs.map((para, i) => (
          <p key={i} className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
            {para}
          </p>
        ))}
      </MarketingSection>

      <MarketingSection id={p.whoBenefits.id} className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.whoBenefits.headline}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {p.whoBenefits.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-neutral-900">{col.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{col.body}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id={p.outcomes.id} className="scroll-mt-14 border-b border-neutral-200 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.outcomes.headline}
        </h2>
        <ul className="mt-6 space-y-2">
          {p.outcomes.bullets.map((item) => (
            <li key={item} className="text-sm text-neutral-700">
              — {item}
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id={p.whyMiami.id} className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.whyMiami.headline}
        </h2>
        {p.whyMiami.paragraphs.map((para, i) => (
          <p key={i} className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
            {para}
          </p>
        ))}
      </MarketingSection>

      <MarketingSection id={p.repeatability.id} className="scroll-mt-14 border-b border-neutral-200 bg-white">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.repeatability.headline}
        </h2>
        {p.repeatability.paragraphs.map((para, i) => (
          <p key={i} className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
            {para}
          </p>
        ))}
      </MarketingSection>

      <MarketingSection id={p.about.id} className="scroll-mt-14 bg-[#fafafa]">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.about.headline}
        </h2>
        {p.about.paragraphs.map((para, i) => (
          <p key={i} className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
            {para}
          </p>
        ))}
      </MarketingSection>

      <MarketingSection id={p.closing.id} className="scroll-mt-14 border-t border-neutral-200 bg-white pb-20">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900">
          {p.closing.headline}
        </h2>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={p.closing.primaryCta.href}
            className="inline-flex justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            {p.closing.primaryCta.label}
          </Link>
          <Link
            href={p.closing.secondaryCta.href}
            className="inline-flex justify-center rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
          >
            {p.closing.secondaryCta.label}
          </Link>
          <Link
            href={p.closing.tertiaryCta.href}
            className="inline-flex justify-center text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
          >
            {p.closing.tertiaryCta.label}
          </Link>
        </div>
        <p className="mt-10 text-sm text-neutral-500">
          <Link href="/pilots" className="font-medium text-neutral-700 underline-offset-4 hover:underline">
            Explore pilot systems
          </Link>
          {' · '}
          <Link href="/audit" className="font-medium text-neutral-700 underline-offset-4 hover:underline">
            Communication infrastructure audit
          </Link>
        </p>
      </MarketingSection>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';
import { caseStudyPreviews } from '@/lib/marketing/content';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return caseStudyPreviews.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const c = caseStudyPreviews.find((x) => x.slug === params.slug);
  if (!c) return { title: 'Case study' };
  return {
    title: c.title,
    description: c.challenge,
  };
}

export default function CaseStudyDetailPage({ params }: Props) {
  const c = caseStudyPreviews.find((x) => x.slug === params.slug);
  if (!c) notFound();

  return (
    <>
      <MarketingSection className="border-b border-neutral-200 bg-white pb-12 pt-16">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Case study
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          {c.title}
        </h1>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">Institutional challenge</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{c.challenge}</p>
      </MarketingSection>

      <MarketingSection className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">What was fragmented</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Multiple sources of truth and manual reconciliation between teams and surfaces.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">What we proposed</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{c.whatWeDid}</p>
      </MarketingSection>

      <MarketingSection className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">What became easier</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{c.outcome}</p>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">What is repeatable</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          The workflow and data path—not a one-off design—so the organization can extend or
          adjacent teams can adopt the same pattern.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-white pb-20">
        <p className="text-sm text-neutral-600">
          <Link href="/case-studies" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            ← All case studies
          </Link>
        </p>
        <div className="mt-10">
          <CtaBand headline="Similar context?" primaryHref="/audit" secondaryHref="/contact" />
        </div>
      </MarketingSection>
    </>
  );
}

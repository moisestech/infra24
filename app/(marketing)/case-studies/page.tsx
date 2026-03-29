import type { Metadata } from 'next';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard';
import { CtaBand } from '@/components/marketing/CtaBand';
import { caseStudyPreviews } from '@/lib/marketing/content';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Institutional challenges, what was fragmented, what Infra24 proposed, and what became easier—representative patterns.',
};

export default function CaseStudiesIndexPage() {
  return (
    <>
      <MarketingSection className="border-b border-neutral-200 bg-white pb-12 pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Case studies / proof
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">
          Formal write-ups grow over time. Below are structured summaries in the pattern we use with
          leadership: challenge, approach, outcome, and what is repeatable.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <div className="grid gap-6 md:grid-cols-3">
          {caseStudyPreviews.map((c) => (
            <CaseStudyCard key={c.slug} {...c} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection className="bg-white pb-20">
        <CtaBand
          headline="Discuss a comparable challenge"
          body="We can walk through how this pattern might apply to your surfaces and teams."
          primaryHref="/audit"
          secondaryHref="/contact"
        />
      </MarketingSection>
    </>
  );
}

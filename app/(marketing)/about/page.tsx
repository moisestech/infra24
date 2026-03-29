import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Infra24’s point of view: digital infrastructure for cultural and public-facing organizations—artist-centered, systems-minded, operationally credible.',
};

export default function AboutPage() {
  return (
    <>
      <MarketingSection className="border-b border-neutral-200 bg-white pb-12 pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          About Infra24
        </h1>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-700">
          Infra24 is a digital culture infrastructure studio. We work with museums, nonprofits, civic
          organizations, and artist-centered institutions to build systems that stay current—because
          public trust depends on information people can find, understand, and believe.
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-600">
          This is not brand theater or generic IT consulting. It is design and technology in service
          of operational reality: how programs are communicated, how staff update what the public
          sees, and how physical and digital spaces tell one story.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-white">
        <h2 className="text-xl font-semibold text-neutral-900">Why infrastructure matters</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Cultural and civic organizations run on public information. When that information is
          fragmented, the cost shows up as staff time, visitor confusion, and missed connections—not
          as a single broken line item. Our work is to make the system legible: what to update, where,
          and who owns it.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-xl font-semibold text-neutral-900">Who leads the work</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Infra24 is led by practitioners who sit between design, technology, and operations—not
          distant strategists. That matters when your lobby, your website, and your program calendar
          have to agree.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-white pb-20">
        <CtaBand
          headline="Talk through your context"
          body="We are happy to explain how we work and whether there is a fit."
          primaryLabel="Request a consultation"
          primaryHref="/contact"
          secondaryLabel="Start with the audit"
          secondaryHref="/audit"
        />
        <p className="mt-8 text-sm text-neutral-600">
          Platform and product:{' '}
          <Link href="/platform" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Explore the Infra24 platform area
          </Link>
        </p>
      </MarketingSection>
    </>
  );
}

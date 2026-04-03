import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcSiteMeta } from '@/lib/marketing/content';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/about';

export const metadata: Metadata = cdcPageMetadata(path);

const values = [
  'Public benefit first',
  'Artist-centered design',
  'Legibility over hype',
  'Experimentation with documentation',
  'Civic usefulness',
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={cdcSiteMeta.organizationName}
        description="A Miami-based initiative for digital culture: public programs, artist support, and civic-facing infrastructure—with Infra24 as the systems layer that makes the work repeatable."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">What we do</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Workshops and clinics, public interfaces (signs, maps, kiosks), institutional training, and
          lightweight civic-cultural prototypes—always with an eye toward what neighbors and artists
          actually experience, not only what appears in a strategy deck.
        </p>
      </Section>

      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Why now</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Cultural organizations and artists are expected to show up across web and physical space,
          but the systems behind that visibility are fragmented. CDC exists to make digital culture
          public-serving, understandable, and maintainable—starting in Miami.
        </p>
      </Section>

      <Section className="bg-[#fafafa]" id="powered-by-infra24">
        <h2 className="text-lg font-semibold text-neutral-900">How we work</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {cdcSiteMeta.infra24Descriptor}{' '}
          <Link href="/infra24" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Read about Infra24 →
          </Link>
        </p>
      </Section>

      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Founders</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          CDC is led by practitioners working across design, technology, and cultural operations—close
          enough to the work to ship pilots, not only advise them. Founder bios will expand on{' '}
          <Link href="/grants/materials" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Materials
          </Link>
          .
        </p>
      </Section>

      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">Values</h2>
        <ul className="mt-4 max-w-xl list-disc space-y-2 pl-5 text-sm text-neutral-700">
          {values.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </Section>

      <Section className="bg-white pb-20">
        <CtaBlock
          headline="Talk with us"
          body="Partners, funders, and artists each have a clear contact path."
          primaryLabel="Contact"
          primaryHref="/contact"
          secondaryLabel="Mission"
          secondaryHref="/mission"
        />
        <p className="mt-8 text-sm text-neutral-600">
          Platform area:{' '}
          <Link href="/platform" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Platform overview
          </Link>
        </p>
      </Section>
    </>
  );
}

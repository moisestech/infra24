import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, CtaBlock } from '@/components/marketing/cdc';
import { WebcoreIcon, type WebcoreIconName } from '@/components/marketing/webcore-lucide';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { dccNarrativeStack, dccSiteMeta } from '@/lib/marketing/content';
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { cn } from '@/lib/utils';

const path = '/about';

const baseAboutMeta = cdcPageMetadata(path);
export const metadata: Metadata = {
  ...baseAboutMeta,
  title: 'About | Digital Culture Center Miami',
  openGraph: {
    ...baseAboutMeta.openGraph,
    title: 'About | Digital Culture Center Miami',
  },
  twitter: {
    ...baseAboutMeta.twitter,
    title: 'About | Digital Culture Center Miami',
  },
};

const NARRATIVE_WEBCORE_ICONS = {
  problem: 'AlertCircle',
  opportunity: 'Lightbulb',
  response: 'Sparkles',
  method: 'Wrench',
  outcome: 'ShieldCheck',
} as const satisfies Record<(typeof dccNarrativeStack)[number]['id'], WebcoreIconName>;

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
        title={dccSiteMeta.organizationName}
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
          but the systems behind that visibility are fragmented. DCC Miami exists to make digital culture
          public-serving, understandable, and maintainable—starting in Miami.
        </p>
      </Section>

      <Section className="bg-[#fafafa]" id="powered-by-infra24">
        <h2 className="text-lg font-semibold text-neutral-900">How we work</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          {dccSiteMeta.infra24Descriptor}{' '}
          <Link href="/infra24" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Read about Infra24 →
          </Link>
        </p>
      </Section>

      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Founders</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          DCC Miami is led by practitioners working across design, technology, and cultural operations—close
          enough to the work to ship pilots, not only advise them. Founder bios will expand on{' '}
          <Link href="/grants/materials" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Materials
          </Link>
          .
        </p>
      </Section>

      <Section className="bg-[#fafafa]" id="narrative-stack">
        <h2 className="text-lg font-semibold text-neutral-900">Narrative stack</h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Problem → opportunity → response → method → outcome. This sequence matches how we talk with
          partners and in grant applications.
        </p>
        <dl className="mt-10 space-y-10">
          {dccNarrativeStack.map((step) => (
            <div
              key={step.id}
              className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8"
            >
              <div
                className={cn(
                  'relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-[var(--cdc-border)] shadow-sm sm:aspect-square sm:w-40 md:w-48',
                  marketingGradientSurfaceClass(step.visual.gradientId)
                )}
                role="img"
                aria-label={step.visual.alt}
              />
              <div className="min-w-0 flex-1">
                <dt className="flex items-start gap-2.5 text-sm font-semibold text-neutral-900">
                  <WebcoreIcon
                    name={NARRATIVE_WEBCORE_ICONS[step.id]}
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cdc-teal)]"
                  />
                  <span>{step.title}</span>
                </dt>
                <dd className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                  {step.body}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </Section>

      <Section className="bg-white">
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

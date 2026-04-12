import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/mission';

export const metadata: Metadata = cdcPageMetadata(path);

const pillars = [
  {
    id: 'public-benefit',
    title: 'Public benefit',
    body: 'Digital culture infrastructure should increase access, clarity, and participation—not gatekeep culture behind opaque systems.',
  },
  {
    id: 'artist-centered-infrastructure',
    title: 'Artist-centered infrastructure',
    body: 'Tools and programs are designed around how artists work, learn, and need to be visible—not only institutional convenience.',
  },
  {
    id: 'digital-culture',
    title: 'Digital culture',
    body: 'We treat the web, screens, and public interfaces as part of cultural life, not as a separate “tech” silo.',
  },
  {
    id: 'civic-interfaces',
    title: 'Civic interfaces',
    body: 'Wayfinding, kiosks, signage, and maps are civic surfaces where cultural organizations meet the public.',
  },
  {
    id: 'repeatable-systems',
    title: 'Repeatable systems',
    body: 'Pilots are documented so the model can spread across partners and neighborhoods—not as one-off hero projects.',
  },
] as const;

export default function MissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Mission"
        title="Public digital culture, built for Miami"
        description="Digital Culture Center Miami exists so artists, organizations, and communities can participate in digital public life with support, legibility, and infrastructure that lasts."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      {pillars.map((p, i) => (
        <Section
          key={p.id}
          id={p.id}
          className={i % 2 === 0 ? 'bg-[#fafafa]' : 'bg-white'}
        >
          <h2 className="text-lg font-semibold text-neutral-900">{p.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">{p.body}</p>
        </Section>
      ))}
      <Section className="border-t border-neutral-200 bg-white pb-16">
        <p className="max-w-2xl text-sm text-neutral-600">
          Delivery and systems work runs through{' '}
          <a href="/infra24" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Infra24
          </a>
          , the implementation methodology behind DCC Miami programs and interfaces.
        </p>
      </Section>
    </>
  );
}

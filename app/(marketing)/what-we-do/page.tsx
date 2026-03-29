import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';

export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'Visibility systems, public interfaces, smart signs, maps, artist portals, update workflows, and coherent web plus physical information for cultural organizations.',
};

const categories = [
  {
    title: 'Visibility systems',
    body: 'A coherent picture of what your organization offers the public: what to see, when, and where—without competing versions in email, PDFs, and side channels.',
  },
  {
    title: 'Public interfaces',
    body: 'Websites and on-site surfaces that are easy to update and easy to navigate. Structure matches how visitors actually look for information.',
  },
  {
    title: 'Smart signs',
    body: 'Lobby and gallery screens that reflect authoritative data—not a separate copy-paste job every Monday.',
  },
  {
    title: 'Smart maps',
    body: 'Wayfinding and program-aware maps that stay tied to places and schedules as they change.',
  },
  {
    title: 'Artist and resident portals',
    body: 'Clear entry points for people your organization serves: expectations, resources, and deadlines in one accountable place.',
  },
  {
    title: 'Update workflows',
    body: 'Who publishes what, which system is source of truth, and how handoffs work between programming, communications, and operations.',
  },
  {
    title: 'Institutional memory',
    body: 'Lightweight patterns so decisions and content do not live only in inboxes or departing staff laptops.',
  },
  {
    title: 'Web and physical coherence',
    body: 'The lobby, the website, and the program calendar tell one story—because they draw from aligned systems.',
  },
  {
    title: 'Pilot design and implementation',
    body: 'Bounded experiments with clear success signals before you commit to organization-wide change.',
  },
];

export default function WhatWeDoPage() {
  return (
    <>
      <MarketingSection className="border-b border-neutral-200 bg-white pb-12 pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          What we do
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">
          Infra24 helps public-facing organizations build repeatable digital systems—so visibility,
          engagement, and day-to-day clarity do not depend on heroic manual effort.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <div className="grid gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-neutral-900">{cat.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{cat.body}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection className="bg-white">
        <CtaBand
          headline="Turn this into a scoped next step"
          body="An audit clarifies what to pilot first. A pilot proves value before a larger build."
          primaryHref="/audit"
          secondaryHref="/contact"
        />
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa] pb-20">
        <p className="text-sm text-neutral-600">
          <Link href="/pilots" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Explore pilots
          </Link>{' '}
          ·{' '}
          <Link href="/case-studies" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Case studies
          </Link>
        </p>
      </MarketingSection>
    </>
  );
}

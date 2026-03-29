import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { OfferLadder } from '@/components/marketing/OfferLadder';
import { CtaBand } from '@/components/marketing/CtaBand';
import { auditDeliverables, symptoms } from '@/lib/marketing/content';

export const metadata: Metadata = {
  title: 'Communication Infrastructure Audit',
  description:
    'Structured review of signs, screens, maps, workflows, and public-facing gaps—with pilot recommendations and a practical path forward.',
};

const reviewedItems = [
  'Public website and primary entry paths (what a first-time visitor is asked to understand)',
  'On-site digital surfaces—lobby screens, maps, directories—where applicable',
  'How events and programs are published and updated end to end',
  'Handoffs between programming, communications, and operations',
  'Where “truth” is stored today: CMS, spreadsheets, ticketing, memory',
];

export default function AuditPage() {
  return (
    <>
      <MarketingSection className="border-b border-neutral-200 bg-white pb-12 pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Communication Infrastructure Audit
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">
          A structured look at how your organization publishes, updates, and presents
          information—across web, on-site digital surfaces, and the routines that connect teams.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Many institutions do not need another one-off website project. They need a clear picture
          of where information breaks down, what to pilot first, and what “good” looks like for
          staff and the public. The audit is designed to produce that picture—and a practical path
          forward.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/contact?interest=audit"
            className="inline-flex justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Book an audit conversation
          </Link>
          <span className="text-sm text-neutral-500">
            We confirm fit and scope before anything is formalized.
          </span>
        </div>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-xl font-semibold text-neutral-900">Who it is for</h2>
        <ul className="mt-4 grid gap-2 text-sm text-neutral-700 sm:grid-cols-2">
          <li>Executive directors and CEOs</li>
          <li>COOs and operations leads</li>
          <li>Communications and marketing directors</li>
          <li>Program directors</li>
          <li>Digital and innovation leads</li>
          <li>Artist services and residency leads</li>
        </ul>
        <p className="mt-4 text-sm text-neutral-600">
          Especially when public information spans teams and surfaces—and no one role owns the
          whole picture.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-white">
        <h2 className="text-xl font-semibold text-neutral-900">Symptoms that suggest you need this</h2>
        <ul className="mt-4 space-y-2">
          {symptoms.map((s) => (
            <li key={s} className="text-sm text-neutral-700">
              — {s}
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-xl font-semibold text-neutral-900">What we review</h2>
        <ul className="mt-4 space-y-2">
          {reviewedItems.map((item) => (
            <li key={item} className="text-sm text-neutral-700">
              — {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-neutral-500">
          Scope is adjusted to your organization; we agree on boundaries before work begins.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-white">
        <h2 className="text-xl font-semibold text-neutral-900">What you receive</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {auditDeliverables.map((d) => (
            <div key={d.title} className="rounded-lg border border-neutral-200 p-5">
              <h3 className="text-sm font-semibold text-neutral-900">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{d.description}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-xl font-semibold text-neutral-900">Why this lowers risk</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          You get diagnosis before build. Leadership sees the same facts. The next step is a pilot
          sized to what you can operationalize—not a vague “digital transformation.”
        </p>
      </MarketingSection>

      <MarketingSection className="bg-white">
        <h2 className="text-xl font-semibold text-neutral-900">What happens after</h2>
        <div className="mt-8">
          <OfferLadder />
        </div>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-xl font-semibold text-neutral-900">Common questions</h2>
        <dl className="mt-6 space-y-6 text-sm">
          <div>
            <dt className="font-medium text-neutral-900">How long does it take?</dt>
            <dd className="mt-1 text-neutral-600">
              Timelines depend on scale and access. We quote a range after an intro call.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-900">Who should be in the room?</dt>
            <dd className="mt-1 text-neutral-600">
              At minimum: someone who owns public-facing information and someone who can speak to
              operations. IT or vendor partners join when relevant.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-900">Remote or on-site?</dt>
            <dd className="mt-1 text-neutral-600">
              Both are possible; on-site walkthroughs help when physical space is part of the
              problem.
            </dd>
          </div>
        </dl>
      </MarketingSection>

      <MarketingSection className="bg-white pb-20">
        <CtaBand
          headline="Ready to talk?"
          body="Book an audit conversation, or reach out with general questions first."
          primaryLabel="Book an audit conversation"
          primaryHref="/contact?interest=audit"
          secondaryLabel="Contact"
          secondaryHref="/contact"
        />
      </MarketingSection>
    </>
  );
}

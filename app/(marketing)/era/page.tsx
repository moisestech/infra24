import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section } from '@/components/marketing/cdc';
import { EraChannelBand } from '@/components/era/EraChannelBand';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { bornDigitalEra } from '@/lib/marketing/content';

const path = '/era';

export const metadata: Metadata = cdcPageMetadata(path);

export default function EraIndexPage() {
  return (
    <>
      <PageHero
        eyebrow={bornDigitalEra.eyebrow}
        title="Seven pathways, one shared cultural network"
        description={bornDigitalEra.tagline}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <EraChannelBand hideHeading />

      <Section className="bg-white pb-20 pt-12 dark:bg-neutral-900">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              How the channels meet
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Each pathway moves on its own, and every one of them lands back into the
              same Living Network. Quarterly we host an Era Mixer (May is the first one) to
              put all of them in the same room — a workshop demo, a clinic mini-session,
              a newsletter live read, and a walk through the network graph.
            </p>
            <ul className="mt-6 space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
              <li>↳ Public Events → people who showed up land in the shared map</li>
              <li>↳ Workshops → folks who finish stay close to what comes next</li>
              <li>↳ Clinics → artists, mentors, and organizations meet 1:1</li>
              <li>↳ Open Lab → the network is visible in the room every Monday and Friday</li>
              <li>↳ Public Interfaces → programs and artists show up in shared space</li>
              <li>↳ Newsletter → the weekly digest that pulls from every pathway</li>
              <li>↳ Living Network → where every pathway meets</li>
            </ul>
            <p className="mt-6 text-sm text-neutral-700 dark:text-neutral-300">
              <Link
                href="/network"
                className="font-medium underline-offset-4 hover:underline"
              >
                Open the live network →
              </Link>
            </p>
          </div>

          <aside className="rounded-2xl border border-[var(--cdc-border)] bg-[#fafafa] p-6 text-sm leading-relaxed text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
            <p className="cdc-font-mono-accent font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
              First convergence event
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Born-Digital Era: Open Studio #1
            </h3>
            <p className="mt-3">
              May, at our Bakehouse studio. A 2-hour open studio + 30-minute talk + 60
              minutes of show-and-tell. One workshop demo, one clinic mini-session, a
              newsletter live read, and a walkthrough of the network graph.
            </p>
            <p className="mt-4">
              <Link
                href="/events/born-digital-era-open-studio-may"
                className="font-medium underline-offset-4 hover:underline"
              >
                Event details →
              </Link>
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}

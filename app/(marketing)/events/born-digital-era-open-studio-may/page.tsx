import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { bornDigitalEra } from '@/lib/marketing/content';

const path = '/events/born-digital-era-open-studio-may';

export const metadata: Metadata = cdcPageMetadata(path);

const RUN_OF_SHOW = [
  {
    span: '0:00 – 2:00',
    title: 'Open studio',
    body:
      'Drop-in time at the studio. The wall screen runs the LiveLoop sketch, zines on the stool, intake clipboard at the door, coffee on the table.',
  },
  {
    span: '2:00 – 2:30',
    title: 'Talk: Why the network is the value',
    body:
      'Twenty-minute talk on the Born-Digital Era thesis — money goes down, information goes down, humans go up, networks go up — followed by ten minutes of questions from the room.',
  },
  {
    span: '2:30 – 3:30',
    title: 'Show & tell — four anchor segments',
    body:
      'Twelve minutes each: a workshop demo, a clinic mini-session (live audit of one volunteer artist), a newsletter live read, and a walkthrough of the network graph asking the room "who is missing?"',
  },
];

const TARGETS = [
  { metric: 'Attendees in the room', target: '40' },
  { metric: 'Newsletter subscribers added', target: '25' },
  { metric: 'New network nodes from intake', target: '15' },
  { metric: 'Follow-up workshop holds', target: '8' },
  { metric: 'Newsletter or journal post published', target: '1' },
];

export default function BornDigitalEraOpenStudioMayPage() {
  return (
    <>
      <PageHero
        eyebrow={`${bornDigitalEra.eyebrow} · IRL`}
        title="Born-Digital Era: Open Studio #1"
        description="The first convergence event of the Born-Digital Era. A 3.5-hour open studio at our Bakehouse studio — open hours, a 30-minute talk, and four show-and-tell segments tied to each priority channel."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-[#fafafa] dark:bg-neutral-950">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Format
            </h2>
            <ol className="mt-6 space-y-5">
              {RUN_OF_SHOW.map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-[var(--cdc-border)] bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
                    {item.span}
                  </p>
                  <p className="mt-1 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <aside className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
              Targets · Tier 1
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              How we will know it worked
            </h2>
            <ul className="mt-5 space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
              {TARGETS.map((t) => (
                <li key={t.metric} className="flex items-baseline justify-between gap-3">
                  <span>{t.metric}</span>
                  <span className="tabular-nums opacity-90">{t.target}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
              Source: <code className="font-mono text-xs">data/era-metrics.json</code> + post-event log.
            </p>

            <hr className="my-6 border-[var(--cdc-border)] dark:border-neutral-800" />

            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
              Date
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              May (date TBD — confirming with Bakehouse calendar). Subscribe to{' '}
              <Link href="/newsletter" className="font-medium underline-offset-4 hover:underline">
                the newsletter
              </Link>{' '}
              to be notified.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              Venue: Bakehouse Art Complex (studio TBD).
            </p>
          </aside>
        </div>
      </Section>

      <Section className="bg-white dark:bg-neutral-900">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Channels in the room
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Each show-and-tell segment maps to one Born-Digital Era channel. The point of the
          mixer is convergence — every channel writes new nodes back into the graph by the
          end of the night.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/era/network', label: 'Network · live walkthrough' },
            { href: '/era/workshops', label: 'Workshops · 12-min demo' },
            { href: '/era/clinics', label: 'Clinics · live mini-audit' },
            { href: '/era/newsletter', label: 'Newsletter · live read' },
            { href: '/era/open-lab', label: 'Open Lab · the studio is the venue' },
            { href: '/era/public-corridor', label: 'Public Corridor · hallway monitor' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-[var(--cdc-border)] bg-[#fafafa] p-4 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600"
            >
              {item.label} →
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-[#fafafa] pb-20 dark:bg-neutral-950">
        <div className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
            For collaborators
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Activate the studio with us
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            We have a paste-ready brief covering inside / outside studio activation, the
            run-of-show, and copy blocks for posters, vinyl, and the printed zine. Use it for
            a partner conversation, a vendor handoff, or a second AI thread without
            re-explaining DCC.
          </p>
          <p className="mt-4">
            <Link
              href="/contact/partnerships"
              className="inline-flex items-center gap-1 rounded-full border border-current px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Partner on the May event →
            </Link>
          </p>
          <p className="mt-3 text-xs font-mono uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            Source: <code>docs/BAKEHOUSE_DCC_BRIEF.md</code>
          </p>
        </div>
      </Section>
    </>
  );
}

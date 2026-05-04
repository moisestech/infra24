import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarClock, MapPin } from 'lucide-react';
import { PageHero, Section } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/events';

export const metadata: Metadata = cdcPageMetadata(path);

type UpcomingEvent = {
  href: string | null;
  title: string;
  when: string;
  where: string;
  blurb: string;
  status: 'confirmed' | 'tentative' | 'tbd';
};

const upcomingEvents: UpcomingEvent[] = [
  {
    href: '/events/born-digital-era-open-studio-may',
    title: 'Born-Digital Era: Open Studio #1',
    when: 'May 2026 · 3.5 hours',
    where: 'Bakehouse studio',
    blurb:
      'Open hours at the studio, a short talk on why the network is the value, and four show-and-tell segments — a workshop demo, a clinic mini-session, a newsletter live read, and a walkthrough of the network graph.',
    status: 'confirmed',
  },
  {
    href: null,
    title: 'Workshop salon — date TBD',
    when: 'Summer 2026',
    where: 'Bakehouse studio',
    blurb:
      'A short evening pairing a workshop demo with conversation. Topic and date will be announced through the newsletter and on this page.',
    status: 'tbd',
  },
];

const sectionMuted =
  'border-b border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950';
const sectionSolid =
  'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-900';

const linkClass =
  'font-medium text-neutral-900 underline-offset-4 hover:text-teal-700 hover:underline dark:text-neutral-100 dark:hover:text-teal-300';

const statusBadge: Record<UpcomingEvent['status'], { label: string; className: string }> = {
  confirmed: {
    label: 'Confirmed',
    className:
      'border-teal-500/35 bg-teal-500/[0.12] text-teal-700 dark:border-teal-400/35 dark:bg-teal-400/10 dark:text-teal-300',
  },
  tentative: {
    label: 'Tentative',
    className:
      'border-amber-500/40 bg-amber-500/[0.12] text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300',
  },
  tbd: {
    label: 'Date TBD',
    className:
      'border-neutral-300 bg-neutral-100 text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
  },
};

export default function EventsPage() {
  return (
    <>
      <section className="cdc-mesh-hero-bg cdc-webcore-hero-shell scroll-mt-14 border-b border-[var(--cdc-border)]">
        <div className="bg-transparent pt-6">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <EraPill />
          </div>
        </div>
        <PageHero
          surface="mesh"
          eyebrow="Public events"
          title="Upcoming events"
          description="Public gatherings, talks, screenings, and studio activations open to artists, cultural workers, and neighbors. Showing up is how the network gets real."
          breadcrumbs={getCdcBreadcrumbs(path)}
        />
      </section>

      <Section className={sectionMuted}>
        <ol className="space-y-5">
          {upcomingEvents.map((event) => {
            const badge = statusBadge[event.status];
            const Wrapper = ({ children }: { children: React.ReactNode }) =>
              event.href ? (
                <Link
                  href={event.href}
                  className="group block rounded-2xl border border-[var(--cdc-border)] bg-white p-6 shadow-sm transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 sm:p-7"
                >
                  {children}
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--cdc-border)] bg-white/70 p-6 dark:border-neutral-700 dark:bg-neutral-900/60 sm:p-7">
                  {children}
                </div>
              );

            return (
              <li key={event.title}>
                <Wrapper>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                      {event.when}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {event.where}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-2xl">
                    {event.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {event.blurb}
                  </p>
                  {event.href ? (
                    <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition-colors group-hover:text-teal-800 dark:text-teal-300 dark:group-hover:text-teal-200">
                      Event details
                      <span aria-hidden>→</span>
                    </p>
                  ) : null}
                </Wrapper>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section className={sectionSolid}>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
              Get notified about new events
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              We send a short weekly newsletter with upcoming workshops, drop-in
              hours, and one-off events. Subscribing is the easiest way to know when
              something opens up — no spam, unsubscribe anytime.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/newsletter?source=era-irl-events"
                className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
              >
                Subscribe to the newsletter
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/contact/artist-index?source=era-irl-events"
                className="inline-flex items-center gap-1 rounded-full border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
              >
                Add yourself to the artist index
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--cdc-border)] bg-[#fafafa] p-5 text-sm leading-relaxed text-neutral-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 sm:p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
              Hosting an event?
            </p>
            <p className="mt-2">
              If you run a Miami venue, school, or organization and want to host a
              DCC workshop, salon, or screening, reach out through{' '}
              <Link href="/partners" className={linkClass}>
                Partners
              </Link>{' '}
              or{' '}
              <Link href="/contact/partnerships" className={linkClass}>
                Partnership contact
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <Section className={`${sectionMuted} pb-16`}>
        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Looking for something more structured? Browse{' '}
          <Link href="/programs" className={linkClass}>
            Programs
          </Link>
          ,{' '}
          <Link href="/workshops" className={linkClass}>
            Workshops
          </Link>
          , or drop into{' '}
          <Link href="/programs/public-programs/open-lab" className={linkClass}>
            Open Lab
          </Link>{' '}
          on Mondays and Fridays.
        </p>
      </Section>
    </>
  );
}

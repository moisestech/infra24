import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarClock, Coffee, Compass, MapPin, Sparkles } from 'lucide-react';
import { PageHero, Section } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/programs/public-programs/open-lab';

export const metadata: Metadata = cdcPageMetadata(path);

const sectionMuted =
  'border-b border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950';
const sectionSolid =
  'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-900';

const linkClass =
  'font-medium text-neutral-900 underline-offset-4 hover:text-teal-700 hover:underline dark:text-neutral-100 dark:hover:text-teal-300';

const SCHEDULE = [
  {
    day: 'Mondays',
    hours: '3 – 7 pm',
    note: 'Quieter; good for focused 1:1 questions.',
  },
  {
    day: 'Fridays',
    hours: '3 – 7 pm',
    note: 'More social; bring something to show or troubleshoot.',
  },
];

const WHAT_TO_BRING = [
  'A laptop or tablet (we have a few extras if you need one).',
  'A real question, half-finished project, or stuck thing — vague is fine.',
  'Links to your work, even if rough — websites, social, drives, photos.',
];

const WHAT_TO_EXPECT = [
  {
    icon: Compass,
    title: 'A real human will say hi',
    body: 'No clipboard, no script. We start with whatever you walked in with.',
  },
  {
    icon: Sparkles,
    title: 'Try a tool together',
    body: 'AI, websites, archives, automation — we will sit down and work through one piece of it.',
  },
  {
    icon: Coffee,
    title: 'Stay as long as you want',
    body: 'Studio is open the whole window. Come for fifteen minutes or the full four hours.',
  },
];

export default function OpenLabPage() {
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
          eyebrow="Open Lab · drop-in"
          title="Open Lab at Bakehouse"
          description="Drop in on Mondays and Fridays, 3 – 7 pm. Bring a question, a project, or just yourself — no appointment needed. The easiest door into everything else DCC does."
          breadcrumbs={getCdcBreadcrumbs(path)}
        />
      </section>

      <Section className={sectionMuted}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-7">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
              When
            </p>
            <ul className="mt-4 space-y-4">
              {SCHEDULE.map((slot) => (
                <li key={slot.day} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <div className="flex items-center gap-2 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                    <CalendarClock className="h-4 w-4 text-teal-600 dark:text-teal-300" aria-hidden />
                    {slot.day}
                    <span className="font-mono text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {slot.hours}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">{slot.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-neutral-500 dark:text-neutral-400">
              If a holiday falls on a Monday or Friday, we usually skip that day. Schedule changes go
              out through the{' '}
              <Link href="/newsletter?source=era-open-lab" className={linkClass}>
                newsletter
              </Link>
              .
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-7">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
              Where
            </p>
            <p className="mt-4 flex items-center gap-2 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-300" aria-hidden />
              Bakehouse Art Complex
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              The DCC studio inside Bakehouse — Wynwood, Miami. Look for the open door and the
              wall screen running a sketch. If the gate is locked, message us and we will come let
              you in.
            </p>
            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
              Specific room number and arrival notes will be confirmed for each visit through the
              newsletter or by replying to a clinic booking.
            </p>
          </div>
        </div>
      </Section>

      <Section className={sectionSolid}>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
          What to expect
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHAT_TO_EXPECT.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-[var(--cdc-border)] bg-[#fafafa] p-5 dark:border-neutral-700 dark:bg-neutral-950 sm:p-6"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal-500/25 bg-teal-500/[0.12] text-teal-700 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300"
                aria-hidden
              >
                <item.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className={sectionMuted}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
              What to bring
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 marker:text-neutral-400 dark:text-neutral-300 dark:marker:text-neutral-500">
              {WHAT_TO_BRING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              Need something deeper than a drop-in?{' '}
              <Link
                href="https://calendly.com/dccmiami?utm_source=dcc-clinics"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Book a free 1:1 clinic
              </Link>{' '}
              and we will hold a focused window for you.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-7">
            <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Coming this week?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Letting us know is optional, but it helps us prep and reserve a spot at the table.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact/artist-index?source=era-open-lab"
                className="inline-flex items-center justify-center gap-1 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
              >
                Tell us you&rsquo;re coming
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/newsletter?source=era-open-lab"
                className="inline-flex items-center justify-center gap-1 rounded-full border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
              >
                Subscribe to schedule changes
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section className={`${sectionSolid} pb-16`}>
        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Open Lab is one of seven Born-Digital Era pathways. See the others on{' '}
          <Link href="/era" className={linkClass}>
            /era
          </Link>{' '}
          or jump straight to{' '}
          <Link href="/workshops" className={linkClass}>
            Workshops
          </Link>
          ,{' '}
          <Link href="/events" className={linkClass}>
            upcoming events
          </Link>
          , or the{' '}
          <Link href="/network" className={linkClass}>
            Living Network
          </Link>
          .
        </p>
      </Section>
    </>
  );
}

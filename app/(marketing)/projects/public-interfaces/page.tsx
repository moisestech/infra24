import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, MonitorSmartphone, QrCode, ScanLine, Signpost, Map, Palette } from 'lucide-react';
import { PageHero, Section } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/projects/public-interfaces';

export const metadata: Metadata = cdcPageMetadata(path);

const sectionMuted =
  'border-b border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950';
const sectionSolid =
  'border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-900';

const linkClass =
  'font-medium text-neutral-900 underline-offset-4 hover:text-teal-700 hover:underline dark:text-neutral-100 dark:hover:text-teal-300';

const SURFACE_TYPES = [
  {
    icon: MonitorSmartphone,
    title: 'Smart screens',
    body: 'Lobby and gallery screens that pull from real schedules and real artist data — not a separate copy-paste job every Monday.',
  },
  {
    icon: Signpost,
    title: 'Wayfinding & signs',
    body: 'Updateable signs that match what is actually happening in the space, indoor or outdoor.',
  },
  {
    icon: Map,
    title: 'Cultural maps',
    body: 'Neighborhood and program-aware maps that stay tied to places and schedules as they change.',
  },
  {
    icon: QrCode,
    title: 'QR experiences',
    body: 'Smart codes on walls, posters, and prints that lead to current artist info, programs, or media.',
  },
  {
    icon: ScanLine,
    title: 'Lobby kiosks',
    body: 'Touch surfaces that let visitors find artists, programs, or directions without asking the front desk.',
  },
];

const GOOD_INTERFACE_NOTES = [
  'It says something true today, not last month.',
  'It connects to a person, a program, or a place — not a marketing landing page.',
  'It works for someone who has thirty seconds and never visits your website.',
  'Whoever runs the building can update it themselves.',
];

export default function PublicInterfacesPage() {
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
          eyebrow="Public Interfaces"
          title="Where digital culture shows up in shared space"
          description="Screens, signs, kiosks, QR experiences, and maps that put artists and cultural programs into the spaces people actually walk through."
          breadcrumbs={getCdcBreadcrumbs(path)}
        />
      </section>

      <Section className={sectionMuted}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-7">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal-500/25 bg-teal-500/[0.12] text-teal-700 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300"
              aria-hidden
            >
              <Palette className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-2xl">
              Submit your work for public screens
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              If you make work that could live on a public surface — video, animation, generative
              code, photography, time-based pieces — tell us about it. We program work onto active
              and upcoming public interfaces around Miami.
            </p>
            <Link
              href="/contact/artist-index?source=era-public-interfaces"
              className="mt-5 inline-flex items-center gap-1 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
            >
              Submit your work
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-7">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/[0.12] text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300"
              aria-hidden
            >
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-2xl">
              Host a public interface
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Run a venue, school, library, lobby, storefront, or studio? We work with hosts to put
              up screens, smart signs, kiosks, and QR systems that surface artists and programs to
              the public — and stay current without manual updates.
            </p>
            <Link
              href="/contact/host-a-screen?source=era-public-interfaces"
              className="mt-5 inline-flex items-center gap-1 rounded-full bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-violet-300 dark:text-violet-950"
            >
              Host a screen
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Section>

      <Section className={sectionSolid}>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
          What lives on a public interface
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          A few of the surfaces we work with. Most public interfaces combine two or three.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SURFACE_TYPES.map((item) => (
            <li
              key={item.title}
              className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--cdc-border)] bg-[#fafafa] p-5 dark:border-neutral-700 dark:bg-neutral-950 sm:p-6"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal-500/25 bg-teal-500/[0.12] text-teal-700 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300"
                aria-hidden
              >
                <item.icon className="h-5 w-5" />
              </span>
              <p className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                {item.title}
              </p>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className={sectionMuted}>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
              What makes a good public interface
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 marker:text-neutral-400 dark:text-neutral-300 dark:marker:text-neutral-500">
              {GOOD_INTERFACE_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--cdc-border)] bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-7">
            <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Want to talk it through first?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Book a free 1:1 with DCC and we will sketch what a public interface could look like
              for your space, audience, and budget.
            </p>
            <Link
              href="https://calendly.com/dccmiami?utm_source=dcc-public-interfaces"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 rounded-full border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100"
            >
              Book a clinic
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Section>

      <Section className={`${sectionSolid} pb-16`}>
        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Public interfaces is one of seven Born-Digital Era pathways. See how it connects to{' '}
          <Link href="/network" className={linkClass}>
            the network
          </Link>
          ,{' '}
          <Link href="/workshops" className={linkClass}>
            workshops
          </Link>
          , and{' '}
          <Link href="/era/public-corridor" className={linkClass}>
            the deep page
          </Link>
          .
        </p>
      </Section>
    </>
  );
}

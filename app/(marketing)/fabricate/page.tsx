import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BadgeCheck,
  Building2,
  FileStack,
  HeartHandshake,
  HelpCircle,
  Route,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'
import {
  FabricateChrome,
  FabricateCtaRow,
} from '@/components/dcc/fabrication/FabricateChrome'
import {
  FabricateSectionHeading,
  FabricateSectionMedia,
} from '@/components/dcc/fabrication/FabricateSectionMedia'
import {
  FABRICATION_CRAFTCLOUD_NOTE,
  FABRICATION_FINISH_LEVELS,
  FABRICATION_PROMISE,
  FABRICATION_RATE_CARDS,
  FABRICATION_SERVICE_LANES,
  FABRICATION_WORKSHOP_BOUNDARY,
  RESIN_QUOTE_FORMULA_NOTE,
  formatUsd,
  getFabricationColor,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Fabricate',
  description: FABRICATION_PROMISE,
  openGraph: {
    title: `Fabricate | ${dccSiteMeta.organizationName}`,
    url: '/fabricate',
  },
}

const LANE_ICONS = {
  file: FileStack,
  wrench: Wrench,
  sparkles: Sparkles,
} as const

const RATE_ICONS = {
  handshake: HeartHandshake,
  'badge-check': BadgeCheck,
  building: Building2,
} as const

export default function FabricateLandingPage() {
  return (
    <FabricateChrome current="home">
      <header className="mb-8 grid min-w-0 items-center gap-6 md:mb-10 md:gap-8 lg:grid-cols-[1.05fr_0.95fr] xl:gap-10">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
            DCC Fabrication
          </p>
          <h1 className="mt-2 text-[clamp(1.875rem,4.5vw,3.25rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Transparent fabrication for artists
          </h1>
          <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
            {FABRICATION_PROMISE}
          </p>
          <FabricateCtaRow className="mt-6" />
        </div>
        <FabricateSectionMedia mediaId="hero" colorTokenId="cyan" priority />
      </header>

      <nav
        className="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap"
        aria-label="On this page"
      >
        {(
          [
            { href: '#lanes', label: 'Lanes', color: 'indigo' as const },
            { href: '#pricing', label: 'Pricing', color: 'teal' as const },
            { href: '#finishes', label: 'Finishes', color: 'violet' as const },
            { href: '#access', label: 'Access', color: 'emerald' as const },
            { href: '#faq', label: 'FAQ', color: 'sky' as const },
          ] as const
        ).map((item) => {
          const color = getFabricationColor(item.color)
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex min-h-10 shrink-0 items-center rounded-full border px-3 text-xs font-medium sm:text-sm',
                color.chip
              )}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <section id="lanes" className="mb-10 scroll-mt-24 md:mb-12 xl:mb-14">
        <FabricateSectionHeading
          title="Service lanes"
          description="Pick the lane that matches how finished your file already is."
          Icon={Route}
          colorTokenId="indigo"
        />
        <FabricateSectionMedia
          mediaId="lanes"
          colorTokenId="indigo"
          className="mb-5 md:mb-6"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
          {FABRICATION_SERVICE_LANES.map((lane) => {
            const Icon = LANE_ICONS[lane.iconKey]
            const color = getFabricationColor(lane.colorTokenId)
            return (
              <article
                key={lane.id}
                className={cn(
                  'flex min-h-[11rem] flex-col rounded-2xl border p-4 sm:p-5',
                  color.border,
                  color.surface
                )}
              >
                <h3
                  className={cn(
                    'inline-flex items-center gap-2 font-semibold',
                    color.heading
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-full',
                      color.icon
                    )}
                  >
                    <Icon aria-hidden className="h-4 w-4" />
                  </span>
                  {lane.label}
                </h3>
                <p className="mt-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {lane.summary}
                </p>
                <p className="mt-3 font-mono text-xs text-neutral-500">
                  {lane.typicalTicket}
                </p>
                <Link
                  href={`/fabricate/quote?lane=${lane.id}`}
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-[var(--cdc-teal)] underline"
                >
                  Start this lane
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section id="pricing" className="mb-10 scroll-mt-24 md:mb-12 xl:mb-14">
        <FabricateSectionHeading
          title="Pricing at a glance"
          description="Artists see setup, machine time, material, and labor before we print."
          Icon={BadgeCheck}
          colorTokenId="teal"
        />
        <FabricateSectionMedia
          mediaId="pricing"
          colorTokenId="teal"
          className="mb-5 md:mb-6"
        />
        <div className="overflow-x-auto rounded-2xl border border-[var(--cdc-border)]">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--cdc-border)] bg-neutral-50 font-mono text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900/50">
                <th className="px-3 py-2.5 pr-3 font-medium sm:px-4">Tier</th>
                <th className="px-3 py-2.5 pr-3 font-medium sm:px-4">Setup</th>
                <th className="px-3 py-2.5 pr-3 font-medium sm:px-4">Machine</th>
                <th className="px-3 py-2.5 pr-3 font-medium sm:px-4">Material</th>
                <th className="px-3 py-2.5 font-medium sm:px-4">Min</th>
              </tr>
            </thead>
            <tbody>
              {FABRICATION_RATE_CARDS.map((card) => {
                const Icon = RATE_ICONS[card.iconKey]
                const color = getFabricationColor(card.colorTokenId)
                return (
                  <tr key={card.id} className="border-b border-[var(--cdc-border)]">
                    <td className="px-3 py-3 pr-3 font-medium text-neutral-900 dark:text-neutral-100 sm:px-4">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={cn(
                            'inline-flex h-6 w-6 items-center justify-center rounded-full',
                            color.icon
                          )}
                        >
                          <Icon aria-hidden className="h-3 w-3" />
                        </span>
                        {card.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 pr-3 font-mono sm:px-4">
                      {formatUsd(card.setup)}
                    </td>
                    <td className="px-3 py-3 pr-3 font-mono sm:px-4">
                      {formatUsd(card.machineHour)}/hr
                    </td>
                    <td className="px-3 py-3 pr-3 font-mono sm:px-4">
                      {formatUsd(card.materialGram)}/g
                    </td>
                    <td className="px-3 py-3 font-mono sm:px-4">
                      {formatUsd(card.minimum)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          {RESIN_QUOTE_FORMULA_NOTE}
        </p>
        <Link
          href="/fabricate/pricing"
          className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[var(--cdc-teal)] underline"
        >
          Full rates, examples, and failure policy
        </Link>
      </section>

      <section id="finishes" className="mb-10 scroll-mt-24 md:mb-12 xl:mb-14">
        <FabricateSectionHeading
          title="Finish levels"
          description="Levels 0–2 start in-house. Levels 3–4 are custom quote until finishing capacity grows."
          Icon={Sparkles}
          colorTokenId="violet"
        />
        <ul className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {FABRICATION_FINISH_LEVELS.map((f) => {
            const color = getFabricationColor(f.colorTokenId)
            return (
              <li
                key={f.id}
                className={cn('rounded-xl border px-4 py-3 text-sm', color.border, color.surface)}
              >
                <span className={cn('font-medium', color.heading)}>
                  L{f.level} — {f.label}
                </span>
                <span className="mt-1 block text-neutral-600 dark:text-neutral-400">
                  {f.summary}
                </span>
              </li>
            )
          })}
        </ul>
        <Link
          href="/fabricate/finishes"
          className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-[var(--cdc-teal)] underline"
        >
          Finish details and labor notes
        </Link>
      </section>

      <section
        id="access"
        className="mb-10 grid min-w-0 scroll-mt-24 gap-5 md:mb-12 md:grid-cols-2 md:items-center xl:mb-14"
      >
        <div>
          <FabricateSectionHeading
            title="Artist Access"
            description="$25 / month, or included for 60 days after a paid workshop. Access pricing applies when you know how to prepare and run a job within DCC-approved procedures."
            Icon={ShieldCheck}
            colorTokenId="emerald"
          />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {FABRICATION_WORKSHOP_BOUNDARY}
          </p>
          <Link
            href="/workshop/resin-printing"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[var(--cdc-teal)] underline"
          >
            Resin printing workshop
          </Link>
        </div>
        <FabricateSectionMedia mediaId="access" colorTokenId="emerald" />
      </section>

      <section className="mb-10 md:mb-12">
        <FabricateSectionHeading
          title="Compared with online print farms"
          description={FABRICATION_CRAFTCLOUD_NOTE}
          Icon={Building2}
          colorTokenId="slate"
        />
      </section>

      <section id="faq" className="mb-4 scroll-mt-24">
        <FabricateSectionHeading
          title="FAQ"
          Icon={HelpCircle}
          colorTokenId="sky"
        />
        <dl className="mt-2 space-y-4 text-sm md:columns-2 md:gap-8 md:space-y-0 md:[&>div]:mb-4 xl:columns-3">
          <div>
            <dt className="font-medium text-neutral-900 dark:text-neutral-100">
              Can I set my own price?
            </dt>
            <dd className="mt-1 text-neutral-600 dark:text-neutral-400">
              No. Staff send a transparent estimate after review. You approve before we print.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-900 dark:text-neutral-100">
              Does the workshop certify me to run machines alone?
            </dt>
            <dd className="mt-1 text-neutral-600 dark:text-neutral-400">
              No. Workshops prepare you for supervised appointments and Artist Access pathways.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-900 dark:text-neutral-100">
              Who pays for machine failures?
            </dt>
            <dd className="mt-1 text-neutral-600 dark:text-neutral-400">
              DCC machine failures are on us. Risky artist files are flagged before printing.
            </dd>
          </div>
        </dl>
      </section>
    </FabricateChrome>
  )
}

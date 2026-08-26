import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, Section } from '@/components/marketing/cdc'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import {
  DCC_NOW_FORTHCOMING,
  DCC_NOW_LEAD,
  DCC_NOW_LIVE_INTRO,
  DCC_NOW_PARTICIPATE,
  DCC_NOW_PATH,
  DCC_NOW_PHOTOGRAPHY,
  DCC_NOW_POSITION,
  DCC_NOW_TITLE,
  type DccNowItem,
} from '@/lib/dcc/culture/now'
import { getProgramPublicPath, listArtists, listCurrentOrUpcomingPrograms } from '@/lib/dcc/culture'
import { listWorkshopOfferings } from '@/lib/dcc/education'
import { dccSiteMeta } from '@/lib/marketing/content'

const path = DCC_NOW_PATH

const baseMeta = cdcPageMetadata(path)
export const metadata: Metadata = {
  ...baseMeta,
  title: DCC_NOW_TITLE,
  description: DCC_NOW_LEAD,
  openGraph: {
    ...baseMeta.openGraph,
    title: `${DCC_NOW_TITLE} | ${dccSiteMeta.organizationName}`,
    description: DCC_NOW_LEAD,
    url: path,
  },
}

function NowItem({ item }: { item: DccNowItem }) {
  return (
    <article className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cdc-teal)]">
        {item.kicker}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        {item.title}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {item.body}
      </p>
      {item.links?.length ? (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
          {item.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
            >
              {link.label}
            </Link>
          ))}
        </p>
      ) : null}
    </article>
  )
}

export default function DccNowPage() {
  const artists = listArtists()
  const program = listCurrentOrUpcomingPrograms()[0]
  const workshops = listWorkshopOfferings()

  return (
    <>
      <PageHero
        eyebrow="Public snapshot"
        title={DCC_NOW_TITLE}
        description={DCC_NOW_LEAD}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <p className="max-w-3xl text-lg font-medium leading-snug text-neutral-900 dark:text-neutral-50">
          {DCC_NOW_POSITION}
        </p>
      </Section>

      <Section className="border-b border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Live
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          What you can open today
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {DCC_NOW_LIVE_INTRO}
        </p>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2">
          <li>
            <NowItem
              item={{
                kicker: 'Artists',
                title: `${artists.length} published founders`,
                body: `${artists.map((artist) => artist.name).join(', ')}. This is not the Clandestine roster.`,
                links: [{ href: '/artists', label: 'Artists' }],
              }}
            />
          </li>
          {program ? (
            <li>
              <NowItem
                item={{
                  kicker: 'Programs',
                  title: program.title,
                  body: program.shortDescription ?? 'Current DCC MIA program.',
                  links: [{ href: getProgramPublicPath(program), label: 'Program record' }],
                }}
              />
            </li>
          ) : null}
          <li>
            <NowItem
              item={{
                kicker: 'Workshops',
                title: 'Public syllabi',
                body: `${workshops.map((offering) => offering.title).join('; ')}. Resin SLA remains a taught syllabus at /workshop/resin-printing — not a third 3D catalog card.`,
                links: [
                  { href: '/workshops', label: 'Workshop catalog' },
                  { href: '/workshop/resin-printing', label: 'Resin SLA syllabus' },
                ],
              }}
            />
          </li>
          <li>
            <NowItem
              item={{
                kicker: 'Fabricate',
                title: 'Estimate, quote, Field Lab',
                body: 'Transparent rate cards, a planning estimate (not an invoice), Field Lab notes, and DCC test projects. Shop photography is conceptual until a documentary hero exists.',
                links: [
                  { href: '/fabricate', label: 'Fabricate' },
                  { href: '/fabricate/estimate', label: 'Planning estimate' },
                ],
              }}
            />
          </li>
        </ul>
      </Section>

      <Section className="border-b border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Forthcoming
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Empty on purpose
        </h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2">
          {DCC_NOW_FORTHCOMING.map((item) => (
            <li key={item.title}>
              <NowItem item={item} />
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-b border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950">
        <NowItem item={DCC_NOW_PHOTOGRAPHY} />
      </Section>

      <Section className="bg-white dark:bg-neutral-950">
        <NowItem item={DCC_NOW_PARTICIPATE} />
      </Section>
    </>
  )
}

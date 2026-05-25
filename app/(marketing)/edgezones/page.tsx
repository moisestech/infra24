import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, Section } from '@/components/marketing/cdc'
import { EdgeZonesAnchorNav, EdgeZonesArtistGrid } from '@/components/marketing/edgezones/EdgeZonesSections'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { fetchEdgeZonesArtists } from '@/lib/marketing/edgezones-artists'
import { edgeZonesNavAnchors, edgeZonesPortal } from '@/lib/marketing/edgezones-content'

const path = edgeZonesPortal.path

export const metadata: Metadata = cdcPageMetadata(path)

export default async function EdgeZonesPortalPage() {
  const { artists, source, filterNote } = await fetchEdgeZonesArtists()
  const { sections } = edgeZonesPortal

  const artistsEmptyMessage =
    source === 'none'
      ? 'Artist profiles will appear here once Airtable Seed Candidates are connected and tagged for Edge Zones.'
      : 'No Edge Zones artists matched yet. Tag Seed Candidates with Related Campaign or “Edge Zones” in Relevant Exhibition / Program.'

  return (
    <>
      <PageHero
        eyebrow={edgeZonesPortal.eyebrow}
        title={edgeZonesPortal.title}
        description={`${edgeZonesPortal.subtitle}. ${edgeZonesPortal.mission}`}
        breadcrumbs={getCdcBreadcrumbs(path)}
        anchorId="top"
      />

      <div className="border-b border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-end sm:justify-between">
            <ul className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {edgeZonesPortal.roles.map((role) => (
                <li key={role.name} className="rounded-xl border border-[var(--cdc-border)] bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{role.name}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--cdc-teal)]">
                    {role.role}
                  </p>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{role.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pb-8">
            {edgeZonesPortal.primaryCtas.map((cta) => (
              <a
                key={cta.href}
                href={cta.href}
                className="inline-flex items-center rounded-full bg-[var(--cdc-teal)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {cta.label}
              </a>
            ))}
            <Link
              href={sections.join.signupHref}
              className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-[var(--cdc-teal)] hover:text-[var(--cdc-teal)] dark:border-neutral-600 dark:text-neutral-100"
            >
              {sections.join.signupLabel}
            </Link>
          </div>
        </div>

        <EdgeZonesAnchorNav items={edgeZonesNavAnchors} />
      </div>

      <Section id="artists" className="scroll-mt-36 bg-white dark:bg-neutral-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Artists & network index
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Profiles pulled from the DCC Seed Candidates layer{filterNote ? ` (${filterNote})` : ''}. Full
              network exploration lives on the research map.
            </p>
          </div>
          <Link
            href="/network/research"
            className="shrink-0 text-sm font-medium text-[var(--cdc-teal)] hover:underline"
          >
            Open research map →
          </Link>
        </div>
        <div className="mt-8">
          <EdgeZonesArtistGrid artists={artists} emptyMessage={artistsEmptyMessage} />
        </div>
      </Section>

      <Section id="support" className="scroll-mt-36 bg-[#fafafa] dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.support.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.support.intro}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {sections.support.items.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-[var(--cdc-border)] bg-white px-4 py-3 text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="vision" className="scroll-mt-36 bg-white dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.vision.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.vision.intro}
        </p>
        <ul className="mt-8 space-y-3">
          {sections.vision.bullets.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cdc-teal)]" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="programs" className="scroll-mt-36 bg-[#fafafa] dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.programs.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.programs.intro}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.programs.buckets.map((bucket) => (
            <li
              key={bucket}
              className="rounded-xl border border-dashed border-[var(--cdc-border)] bg-white/80 px-4 py-4 text-sm font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300"
            >
              {bucket}
              <p className="mt-2 text-xs font-normal text-neutral-500">Details TBD</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">{sections.programs.status}</p>
      </Section>

      <Section id="archive" className="scroll-mt-36 bg-white dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.archive.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.archive.intro}
        </p>
        <p className="mt-6 inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
          {sections.archive.status}
        </p>
      </Section>

      <Section id="join" className="scroll-mt-36 border-t border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {sections.join.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {sections.join.intro}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={sections.join.signupHref}
              className="inline-flex rounded-full bg-[var(--cdc-teal)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {sections.join.signupLabel}
            </Link>
            <Link
              href={sections.join.suggestHref}
              className="inline-flex rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:border-[var(--cdc-teal)] dark:border-neutral-600 dark:text-neutral-100"
            >
              {sections.join.suggestLabel}
            </Link>
          </div>
          <p className="mt-6 font-mono text-xs text-neutral-500">dcc.miami/network/signup?source=edgezones</p>
        </div>
      </Section>
    </>
  )
}

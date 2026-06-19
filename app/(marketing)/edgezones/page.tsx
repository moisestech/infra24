import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { PageHero, Section } from '@/components/marketing/cdc'
import { EdgeZonesAttributionSeed } from '@/components/marketing/edgezones/EdgeZonesAttributionSeed'
import { EdgeZonesJoinSection } from '@/components/marketing/edgezones/EdgeZonesJoinSection'
import { EdgeZonesAnchorNav, EdgeZonesArtistGrid, EdgeZonesPortrait, EdgeZonesRoleCard } from '@/components/marketing/edgezones/EdgeZonesSections'
import { DccSignupAttributionCapture } from '@/components/dcc/signup/DccSignupAttributionCapture'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { fetchEdgeZonesArtists } from '@/lib/marketing/edgezones-artists'
import { edgeZonesNavAnchors, edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { EDGE_ZONES_PARTNERSHIP_PDF_PATH } from '@/lib/marketing/edgezones-network-index'
import { cn } from '@/lib/utils'

const path = edgeZonesPortal.path

export const metadata: Metadata = {
  ...cdcPageMetadata(path),
  robots: { index: false, follow: false },
}

export default async function EdgeZonesPortalPage() {
  const { artists, filterNote } = await fetchEdgeZonesArtists()
  const exhibitionArtists = artists.filter((artist) => artist.roleType !== 'Curator')
  const { sections } = edgeZonesPortal

  return (
    <>
      <Suspense fallback={null}>
        <DccSignupAttributionCapture />
        <EdgeZonesAttributionSeed />
      </Suspense>
      <PageHero
        eyebrow={`${edgeZonesPortal.eyebrow} · ${edgeZonesPortal.exhibition.workingTitle} (${edgeZonesPortal.exhibition.titleStatus})`}
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
                <EdgeZonesRoleCard key={role.name} {...role} />
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
            <a
              href={EDGE_ZONES_PARTNERSHIP_PDF_PATH}
              download
              className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-[var(--cdc-teal)] hover:text-[var(--cdc-teal)] dark:border-neutral-600 dark:text-neutral-100"
            >
              Download Partnership PDF
            </a>
          </div>
        </div>

        <EdgeZonesAnchorNav items={edgeZonesNavAnchors} />
      </div>

      <Section id="exhibition" className="scroll-mt-36 bg-white dark:bg-neutral-950">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {edgeZonesPortal.exhibition.workingTitle}
            </h2>
            <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
              {edgeZonesPortal.exhibition.titleStatus}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Curated by {edgeZonesPortal.exhibition.curator} · {edgeZonesPortal.exhibition.location}
          </p>
          <p className="mt-2 inline-flex rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
            {edgeZonesPortal.exhibition.dates}
          </p>
        </div>

        <figure className="mt-8 max-w-3xl">
          <div className="flex gap-4">
            <EdgeZonesPortrait
              name={edgeZonesPortal.exhibition.curator}
              imageUrl={edgeZonesPortal.exhibition.curatorImageUrl}
              imageAlt={`${edgeZonesPortal.exhibition.curator}, curator`}
              imageFit="cover"
              size="lg"
            />
            <figcaption className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cdc-teal)]">
                Curator&apos;s statement
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {edgeZonesPortal.exhibition.curator}
              </p>
            </figcaption>
          </div>
          <blockquote className="mt-6 border-l-4 border-[var(--cdc-teal)] pl-5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p>&ldquo;{edgeZonesPortal.exhibition.curatorStatementQuote}&rdquo;</p>
          </blockquote>
        </figure>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {edgeZonesPortal.roles.map((role) => (
            <EdgeZonesRoleCard key={`exhibition-${role.name}`} {...role} className="bg-[#fafafa] dark:bg-neutral-900" />
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Featuring {edgeZonesPortal.exhibition.artistNames.join(', ')}.
        </p>

        <a
          href="#artists"
          className="mt-8 inline-flex items-center rounded-full bg-[var(--cdc-teal)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Meet the artists
        </a>
      </Section>

      <Section id="artists" className="scroll-mt-36 bg-[#fafafa] dark:bg-neutral-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Network index
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Artists in {edgeZonesPortal.exhibition.workingTitle}
              {filterNote ? ` (${filterNote})` : ''}. Profiles are configured in the network index data
              file and enriched from Airtable when available.
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
          <EdgeZonesArtistGrid artists={exhibitionArtists} emptyMessage="Network index profiles are being configured." />
        </div>
      </Section>

      <Section id="support" className="scroll-mt-36 bg-white dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.support.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.support.intro}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.support.modules.map((module) => (
            <li key={module.id}>
              <a
                href={module.href}
                className="group flex h-full flex-col rounded-xl border border-[var(--cdc-border)] bg-white p-4 transition hover:border-[var(--cdc-teal)] dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-[var(--cdc-teal)] dark:text-neutral-100">
                    {module.title}
                  </h3>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      module.status === 'live'
                        ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    )}
                  >
                    {module.status === 'live' ? 'Live' : 'Coming soon'}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {module.description}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="vision" className="scroll-mt-36 bg-[#fafafa] dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.vision.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.vision.intro}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.vision.pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="rounded-xl border border-[var(--cdc-border)] bg-[#fafafa] p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="studio-visits" className="scroll-mt-36 bg-[#fafafa] dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.studioVisits.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.studioVisits.intro}
        </p>
        <p className="mt-6 inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
          {sections.studioVisits.status}
        </p>
      </Section>

      <Section id="programs" className="scroll-mt-36 bg-white dark:bg-neutral-950">
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

      <Section id="archive" className="scroll-mt-36 bg-[#fafafa] dark:bg-neutral-950">
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

      <Section id="publishing" className="scroll-mt-36 bg-white dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.publishing.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.publishing.intro}
        </p>
        <p className="mt-6 inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
          {sections.publishing.status}
        </p>
      </Section>

      <Section id="join" className="scroll-mt-36 border-t border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {sections.join.title}
          </h2>
          <p className="mt-3 text-center text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {sections.join.intro}
          </p>
          <div className="mt-8">
            <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />}>
              <EdgeZonesJoinSection />
            </Suspense>
          </div>
          <p className="mt-6 text-center">
            <Link
              href={sections.join.suggestHref}
              className="text-sm font-medium text-[var(--cdc-teal)] hover:underline"
            >
              {sections.join.suggestLabel}
            </Link>
          </p>
        </div>
      </Section>
    </>
  )
}

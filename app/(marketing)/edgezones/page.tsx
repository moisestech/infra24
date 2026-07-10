import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Mail } from 'lucide-react'
import { PageHero, Section } from '@/components/marketing/cdc'
import { SectionWithRightImageFade } from '@/components/marketing/SectionWithRightImageFade'
import { EdgeZonesAttributionSeed } from '@/components/marketing/edgezones/EdgeZonesAttributionSeed'
import { EdgeZonesContactStrip } from '@/components/marketing/edgezones/EdgeZonesContactStrip'
import { EdgeZonesGalleryMosaic } from '@/components/marketing/edgezones/EdgeZonesGalleryMosaic'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { EdgeZonesJoinSection } from '@/components/marketing/edgezones/EdgeZonesJoinSection'
import { EdgeZonesNetworkIndexSection } from '@/components/marketing/edgezones/EdgeZonesNetworkIndexSection'
import { EdgeZonesPacketNav } from '@/components/marketing/edgezones/EdgeZonesPacketNav'
import { EdgeZonesPartnershipLockup } from '@/components/marketing/edgezones/EdgeZonesPartnershipLockup'
import { EdgeZonesPromoStrip } from '@/components/marketing/edgezones/EdgeZonesPromoStrip'
import { EdgeZonesSectionBanner } from '@/components/marketing/edgezones/EdgeZonesSectionBanner'
import { EdgeZonesPortrait, EdgeZonesRoleCard } from '@/components/marketing/edgezones/EdgeZonesSections'
import { DccSignupAttributionCapture } from '@/components/dcc/signup/DccSignupAttributionCapture'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { fetchEdgeZonesArtists } from '@/lib/marketing/edgezones-artists'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import {
  EDGE_ZONES_PROGRAM_ICONS,
  EDGE_ZONES_SUPPORT_ICONS,
  EDGE_ZONES_VISION_ICONS,
} from '@/lib/marketing/edgezones-icons'
import { EDGE_ZONES_BANNERS, edgeZonesPartnershipMailto } from '@/lib/marketing/edgezones-media'
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients'
import { EDGE_ZONES_PARTNERSHIP_PDF_PATH } from '@/lib/marketing/edgezones-network-index'
import { cn } from '@/lib/utils'

const path = edgeZonesPortal.path

export const metadata: Metadata = {
  ...cdcPageMetadata(path),
  robots: { index: false, follow: false },
}

export default async function EdgeZonesPortalPage() {
  const { artists, filterNote } = await fetchEdgeZonesArtists()
  const exhibitionArtists = artists.filter(
    (artist) => artist.roleType !== 'Curator' && artist.roleType !== 'Physical host space'
  )
  const { sections } = edgeZonesPortal
  const partnershipMailto = edgeZonesPartnershipMailto()

  return (
    <>
      <Suspense fallback={null}>
        <DccSignupAttributionCapture />
        <EdgeZonesAttributionSeed />
      </Suspense>

      <section className="cdc-mesh-hero-bg cdc-webcore-hero-shell scroll-mt-14 border-b border-[var(--cdc-border)]">
        <PageHero
          surface="mesh"
          eyebrow={`${edgeZonesPortal.eyebrow} · ${edgeZonesPortal.exhibition.workingTitle} (${edgeZonesPortal.exhibition.titleStatus})`}
          title={edgeZonesPortal.title}
          description={`${edgeZonesPortal.subtitle}. ${edgeZonesPortal.mission}`}
          breadcrumbs={getCdcBreadcrumbs(path)}
          anchorId="top"
          trailing={<EdgeZonesPartnershipLockup />}
        />
      </section>

      <div className="border-b border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="pt-8">
            <EdgeZonesSectionBanner
              banner="hero"
              priority
              caption={`${edgeZonesPortal.exhibition.workingTitle} · ${edgeZonesPortal.exhibition.location}`}
            />
          </div>

          <div className="py-8">
            <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
              {edgeZonesPortal.roles.map((role) => (
                <EdgeZonesRoleCard key={role.name} {...role} />
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 pb-8 sm:flex-row sm:flex-wrap sm:gap-3">
            {edgeZonesPortal.primaryCtas.map((cta) => (
              <a
                key={cta.href}
                href={cta.href}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--cdc-teal)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:justify-start"
              >
                {cta.label}
              </a>
            ))}
            <Link
              href={sections.join.signupHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-[var(--cdc-teal)] hover:text-[var(--cdc-teal)] dark:border-neutral-600 dark:text-neutral-100 sm:justify-start"
            >
              {sections.join.signupLabel}
            </Link>
            <a
              href={partnershipMailto}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-teal-300/60 bg-teal-50/80 px-5 py-2.5 text-sm font-semibold text-teal-900 transition hover:border-teal-400 hover:bg-teal-100 dark:border-teal-700/50 dark:bg-teal-950/40 dark:text-teal-200 dark:hover:bg-teal-900/50 sm:justify-start"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email DCC
            </a>
            <a
              href={EDGE_ZONES_PARTNERSHIP_PDF_PATH}
              download
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-[var(--cdc-teal)] hover:text-[var(--cdc-teal)] dark:border-neutral-600 dark:text-neutral-100 sm:justify-start"
            >
              Download Partnership PDF
            </a>
          </div>
        </div>

        <EdgeZonesPacketNav />
      </div>

      <SectionWithRightImageFade
        id="exhibition"
        className="scroll-mt-36 bg-white py-14 sm:py-20 lg:py-24 dark:bg-neutral-950"
        image={EDGE_ZONES_BANNERS.exhibition}
      >
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
          <p className="mt-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {edgeZonesPortal.exhibition.blurb}
          </p>
        </div>

        <figure className="mt-8 max-w-3xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
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
          <blockquote className="mt-6 border-l-4 border-[var(--cdc-teal)] pl-4 text-base leading-relaxed text-neutral-700 sm:pl-5 dark:text-neutral-300">
            <p>&ldquo;{edgeZonesPortal.exhibition.curatorStatementQuote}&rdquo;</p>
          </blockquote>
        </figure>

        <EdgeZonesGalleryMosaic className="mt-10 max-w-5xl" />

        <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {Object.entries(edgeZonesPortal.exhibition.partnershipImages).map(([key, image]) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-xl border border-[var(--cdc-border)] bg-[#fafafa] p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
            >
              <EdgeZonesPortrait
                name={image.alt}
                imageUrl={image.url}
                imageAlt={image.alt}
                imageFit={image.fit}
                size="logo"
                className="mx-auto"
              />
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-neutral-500">{image.alt}</p>
            </div>
          ))}
        </div>

        <ul className="mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
          {edgeZonesPortal.roles.map((role) => (
            <EdgeZonesRoleCard key={`exhibition-${role.name}`} {...role} className="bg-[#fafafa] dark:bg-neutral-900" />
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Featuring {edgeZonesPortal.exhibition.artistNames.join(', ')}.
        </p>

        <a
          href="#artists"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[var(--cdc-teal)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Meet the artists
        </a>
      </SectionWithRightImageFade>

      <EdgeZonesPromoStrip />

      <EdgeZonesNetworkIndexSection
        artists={exhibitionArtists}
        exhibitionTitle={edgeZonesPortal.exhibition.workingTitle}
        filterNote={filterNote}
      />

      <Section id="support" className="scroll-mt-36 bg-white dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.support.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.support.intro}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.support.modules.map((module) => {
            const Icon = EDGE_ZONES_SUPPORT_ICONS[module.icon]
            return (
              <li key={module.id}>
                <a
                  href={module.href}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-white transition hover:border-[var(--cdc-teal)] hover:shadow-[0_0_24px_rgba(13,148,136,0.12)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-teal-500/40"
                >
                  <div className="h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-500 opacity-80 transition group-hover:opacity-100" />
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <EdgeZonesIconBadge icon={Icon} accent={module.accent} size="compact" />
                        <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-[var(--cdc-teal)] dark:text-neutral-100">
                          {module.title}
                        </h3>
                      </div>
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
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {module.description}
                    </p>
                  </div>
                </a>
              </li>
            )
          })}
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
          {sections.vision.pillars.map((pillar) => {
            const Icon = EDGE_ZONES_VISION_ICONS[pillar.icon]
            return (
              <li
                key={pillar.title}
                className="rounded-xl border border-[var(--cdc-border)] bg-white p-4 transition hover:border-teal-300/50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-teal-500/30"
              >
                <EdgeZonesIconBadge icon={Icon} accent={pillar.accent} size="compact" />
                <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {pillar.description}
                </p>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section id="studio-visits" className="scroll-mt-36 bg-[#fafafa] dark:bg-neutral-950">
        <EdgeZonesSectionBanner banner="studioVisits" className="mb-8" caption="Virtual studio visits — coming soon" />
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
        <EdgeZonesSectionBanner banner="programs" className="mb-8" caption="Public programs at Edge Zones Gallery" />
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sections.programs.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {sections.programs.intro}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.programs.buckets.map((bucket) => {
            const Icon = EDGE_ZONES_PROGRAM_ICONS[bucket.icon]
            return (
              <li
                key={bucket.label}
                className="overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-white dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className={cn('h-16', marketingGradientSurfaceClass(bucket.gradientId))} aria-hidden />
                <div className="flex items-start gap-3 px-4 py-4">
                  <EdgeZonesIconBadge icon={Icon} accent="teal" size="compact" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{bucket.label}</p>
                    <p className="mt-2 text-xs text-neutral-500">Details TBD</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">{sections.programs.status}</p>
      </Section>

      <Section id="archive" className="scroll-mt-36 bg-[#fafafa] dark:bg-neutral-950">
        <EdgeZonesSectionBanner banner="archive" className="mb-8" caption="Documentation archive — coming soon" />
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
        <EdgeZonesSectionBanner banner="publishing" className="mb-8" caption="Digital publishing — coming soon" />
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

      <Section
        id="join"
        className="scroll-mt-36 border-t border-[var(--cdc-border)] bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {sections.join.title}
          </h2>
          <p className="mt-3 text-center text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {sections.join.intro}
          </p>

          <EdgeZonesContactStrip className="mt-8" />

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

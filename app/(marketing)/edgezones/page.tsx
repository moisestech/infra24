import type { Metadata } from 'next'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { Suspense } from 'react'
import './edgezones-proposal-theme.css'
import { EdgeZonesAttributionSeed } from '@/components/marketing/edgezones/EdgeZonesAttributionSeed'
import { EdgeZonesContactStrip } from '@/components/marketing/edgezones/EdgeZonesContactStrip'
import { EdgeZonesHashAlias } from '@/components/marketing/edgezones/EdgeZonesHashAlias'
import { EdgeZonesJoinSection } from '@/components/marketing/edgezones/EdgeZonesJoinSection'
import { EdgeZonesNetworkIndex } from '@/components/marketing/edgezones/EdgeZonesNetworkIndex'
import { EdgeZonesProposalHero } from '@/components/marketing/edgezones/EdgeZonesProposalHero'
import { EdgeZonesProposalShell } from '@/components/marketing/edgezones/EdgeZonesProposalShell'
import { EdgeZonesRolesMatrix } from '@/components/marketing/edgezones/EdgeZonesRolesMatrix'
import { EdgeZonesSectionNav } from '@/components/marketing/edgezones/EdgeZonesSectionNav'
import { EdgeZonesArchiveSection } from '@/components/marketing/edgezones/EdgeZonesSectionBanner'
import { DccPublicProgram } from '@/components/marketing/edgezones/DccPublicProgram'
import { DccSupportModules } from '@/components/marketing/edgezones/DccSupportModules'
import { PartnershipPdfCard } from '@/components/marketing/edgezones/PartnershipPdfCard'
import { TouchingGrassConcept } from '@/components/marketing/edgezones/TouchingGrassConcept'
import { DccSignupAttributionCapture } from '@/components/dcc/signup/DccSignupAttributionCapture'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { fetchEdgeZonesArtists } from '@/lib/marketing/edgezones-artists'
import { edgeZonesPortal } from '@/lib/marketing/edgezones-content'
import { EDGE_ZONES_SECTION_ICONS } from '@/lib/marketing/edgezones-icons'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'

const path = edgeZonesPortal.path

export const metadata: Metadata = {
  ...cdcPageMetadata(path),
  robots: { index: false, follow: false },
}

export default async function EdgeZonesPortalPage() {
  const { artists, filterNote } = await fetchEdgeZonesArtists()
  const host = artists.find((a) => a.roleType === 'Physical host space') ?? null
  const curator = artists.find((a) => a.roleType === 'Curator') ?? null
  const exhibitionArtists = artists.filter(
    (a) => a.roleType !== 'Curator' && a.roleType !== 'Physical host space'
  )
  const { sections, footer } = edgeZonesPortal

  return (
    <EdgeZonesProposalShell>
      <Suspense fallback={null}>
        <DccSignupAttributionCapture />
        <EdgeZonesAttributionSeed />
        <EdgeZonesHashAlias />
      </Suspense>

      <EdgeZonesProposalHero />
      <EdgeZonesSectionNav />

      <EdgeZonesRolesMatrix />
      <TouchingGrassConcept />

      <EdgeZonesNetworkIndex
        host={host}
        curator={curator}
        artists={exhibitionArtists}
        filterNote={filterNote}
      />

      <DccSupportModules />
      <DccPublicProgram />
      <EdgeZonesArchiveSection />

      <PartnershipPdfCard />

      <section id="join" className="ez-section border-t border-[var(--ez-border)]">
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <EdgeZonesIconBadge icon={EDGE_ZONES_SECTION_ICONS.join} accent="teal" />
            <h2 className="ez-heading ez-section-title mt-4">{sections.join.title}</h2>
            <p className="ez-lead mt-4 text-[var(--ez-muted)]">{sections.join.intro}</p>
            <p className="ez-body mt-3 text-[var(--ez-muted)]">{sections.join.formIntro}</p>
          </div>

          <EdgeZonesContactStrip className="mt-8" />

          <div className="mt-8">
            <Suspense fallback={<div className="h-48 animate-pulse border border-[var(--ez-border)] bg-white" />}>
              <EdgeZonesJoinSection />
            </Suspense>
          </div>

          <p className="mt-6 text-center">
            <Link
              href={sections.join.suggestHref}
              className="ez-caption inline-flex items-center gap-1.5 font-mono uppercase tracking-wide text-[var(--ez-blue)] hover:underline"
            >
              <UserPlus className="h-4 w-4 shrink-0" aria-hidden />
              {sections.join.suggestLabel}
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-t border-[var(--ez-border)] bg-[var(--ez-paper-alt)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="ez-body max-w-2xl text-[var(--ez-muted)]">{footer.blurb}</p>
          <p className="ez-caption mt-4 font-medium">{footer.credit}</p>
        </div>
      </footer>
    </EdgeZonesProposalShell>
  )
}

'use client'

import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'
import { EdgeZonesContactStrip } from '@/components/marketing/edgezones/EdgeZonesContactStrip'
import { EdgeZonesJoinSection } from '@/components/marketing/edgezones/EdgeZonesJoinSection'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import { EdgeZonesNetworkIndex } from '@/components/marketing/edgezones/EdgeZonesNetworkIndex'
import { EdgeZonesProposalHero } from '@/components/marketing/edgezones/EdgeZonesProposalHero'
import { EdgeZonesRolesMatrix } from '@/components/marketing/edgezones/EdgeZonesRolesMatrix'
import { EdgeZonesSectionNav } from '@/components/marketing/edgezones/EdgeZonesSectionNav'
import { EdgeZonesArchiveSection } from '@/components/marketing/edgezones/EdgeZonesSectionBanner'
import { DccPublicProgram } from '@/components/marketing/edgezones/DccPublicProgram'
import { DccSupportModules } from '@/components/marketing/edgezones/DccSupportModules'
import { PartnershipPdfCard } from '@/components/marketing/edgezones/PartnershipPdfCard'
import { TouchingGrassConcept } from '@/components/marketing/edgezones/TouchingGrassConcept'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { EDGE_ZONES_SECTION_ICONS } from '@/lib/marketing/edgezones-icons'

type Props = {
  host: EdgeZonesArtistProfile | null
  curator: EdgeZonesArtistProfile | null
  artists: EdgeZonesArtistProfile[]
}

/** Single client tree so every section reads the same locale from context. */
export function EdgeZonesProposalContent({ host, curator, artists }: Props) {
  const { portal } = useEdgeZonesLocale()
  const { sections, footer } = portal

  return (
    <>
      <EdgeZonesProposalHero />
      <EdgeZonesSectionNav />

      <EdgeZonesRolesMatrix />
      <TouchingGrassConcept />

      <EdgeZonesNetworkIndex host={host} curator={curator} artists={artists} />

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

          <div className="ez-signup-form mt-8">
            <EdgeZonesJoinSection />
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
    </>
  )
}

'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { EdgeZonesIcon } from '@/components/marketing/edgezones/EdgeZonesIcon'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { EdgeZonesSectionHeader } from '@/components/marketing/edgezones/EdgeZonesSectionHeader'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import {
  EDGE_ZONES_CONCEPT_DIAGRAM_ICONS,
  EDGE_ZONES_SECTION_ICONS,
  edgeZonesConceptThemeIcon,
} from '@/lib/marketing/edgezones-icons'
import { EDGE_ZONES_BANNERS } from '@/lib/marketing/edgezones-media'

export function TouchingGrassConcept() {
  const { portal } = useEdgeZonesLocale()
  const { concept, ui } = portal
  const banner = EDGE_ZONES_BANNERS.concept

  return (
    <section id="concept" className="ez-section border-b border-[var(--ez-border)]">
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative mb-8 overflow-hidden border border-[var(--ez-border)]">
          <div className="relative aspect-[21/9] w-full min-h-[12rem] sm:min-h-[16rem]">
            <Image src={banner.src} alt={banner.alt} fill className="object-cover" sizes="1152px" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ez-paper)] via-[var(--ez-paper)]/70 to-transparent" />
          </div>
        </div>

        <EdgeZonesSectionHeader
          icon={EDGE_ZONES_SECTION_ICONS.concept}
          title={concept.title}
          accent="teal"
        />
        <p className="ez-heading ez-lead mt-3 text-[var(--ez-blue)]">{concept.subtitle}</p>

        <div className="ez-body mt-6 max-w-3xl space-y-4 text-[var(--ez-muted)]">
          {concept.paragraphs.map((p) => (
            <p key={p.slice(0, 30)}>{p}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {concept.diagram.map((step, i) => {
            const stepIcon = EDGE_ZONES_CONCEPT_DIAGRAM_ICONS[i]
            return (
              <span key={step} className="flex items-center gap-2">
                <span className="ez-chip inline-flex items-center gap-2 rounded px-3 py-1.5">
                  {stepIcon ? <EdgeZonesIcon name={stepIcon} className="h-3.5 w-3.5 shrink-0" strokeWidth={2} /> : null}
                  {step}
                </span>
                {i < concept.diagram.length - 1 ? (
                  <ArrowRight className="h-4 w-4 text-[var(--ez-muted)]" aria-hidden />
                ) : null}
              </span>
            )
          })}
        </div>

        <h3 className="ez-heading ez-subsection-title mt-10">{ui.keyThemes}</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {concept.themes.map((theme) => {
            const themeIcon = edgeZonesConceptThemeIcon(theme.label)
            return (
              <li key={theme.label} className="ez-card p-5">
                <div className="flex items-start gap-3">
                  <EdgeZonesIconBadge icon={themeIcon} accent="indigo" size="compact" />
                  <div>
                    <p className="ez-heading ez-caption text-[var(--ez-blue)]">{theme.label}</p>
                    <p className="ez-body mt-2 text-[var(--ez-muted)]">{theme.description}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

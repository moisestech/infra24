'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { EdgeZonesConceptHoverProvider } from '@/components/marketing/edgezones/EdgeZonesConceptHoverContext'
import { EdgeZonesConceptIconStage } from '@/components/marketing/edgezones/EdgeZonesConceptIconStage'
import { EdgeZonesDiagramChip } from '@/components/marketing/edgezones/EdgeZonesDiagramChip'
import { EdgeZonesHighlightParagraph } from '@/components/marketing/edgezones/EdgeZonesHighlightParagraph'
import { EdgeZonesThemeCard } from '@/components/marketing/edgezones/EdgeZonesThemeCard'
import { EdgeZonesSectionHeader } from '@/components/marketing/edgezones/EdgeZonesSectionHeader'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import {
  EDGE_ZONES_CONCEPT_DIAGRAM_ACCENTS,
  EDGE_ZONES_CONCEPT_DIAGRAM_ICONS,
  EDGE_ZONES_SECTION_ICONS,
} from '@/lib/marketing/edgezones-icons'
import { EDGE_ZONES_BANNERS } from '@/lib/marketing/edgezones-media'

export function TouchingGrassConcept() {
  const { portal } = useEdgeZonesLocale()
  const { concept, ui } = portal
  const banner = EDGE_ZONES_BANNERS.concept

  return (
    <EdgeZonesConceptHoverProvider>
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

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(200px,280px)] lg:items-start">
            <div className="space-y-4">
              {concept.paragraphs.map((p) => (
                <EdgeZonesHighlightParagraph key={p.slice(0, 30)}>{p}</EdgeZonesHighlightParagraph>
              ))}

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {concept.diagram.map((step, i) => {
                  const stepIcon = EDGE_ZONES_CONCEPT_DIAGRAM_ICONS[i]
                  const accent = EDGE_ZONES_CONCEPT_DIAGRAM_ACCENTS[i] ?? 'indigo'
                  return (
                    <span key={step} className="flex items-center gap-2">
                      {stepIcon ? (
                        <EdgeZonesDiagramChip label={step} icon={stepIcon} accent={accent} />
                      ) : (
                        <span className="ez-chip inline-flex items-center gap-2 rounded px-3 py-1.5">{step}</span>
                      )}
                      {i < concept.diagram.length - 1 ? (
                        <ArrowRight className="h-4 w-4 text-[var(--ez-muted)]" aria-hidden />
                      ) : null}
                    </span>
                  )
                })}
              </div>
            </div>

            <EdgeZonesConceptIconStage />
          </div>

          <h3 className="ez-heading ez-subsection-title mt-10">{ui.keyThemes}</h3>
          <ul className="mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {concept.themes.map((theme) => (
              <EdgeZonesThemeCard
                key={theme.label}
                label={theme.label}
                description={theme.description}
                keywords={theme.keywords}
              />
            ))}
          </ul>
        </div>
      </section>
    </EdgeZonesConceptHoverProvider>
  )
}

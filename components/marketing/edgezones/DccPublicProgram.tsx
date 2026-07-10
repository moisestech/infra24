'use client'

import { CalendarClock, Mail } from 'lucide-react'
import { EdgeZonesSectionBanner } from '@/components/marketing/edgezones/EdgeZonesSectionBanner'
import { EdgeZonesSectionHeader } from '@/components/marketing/edgezones/EdgeZonesSectionHeader'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import { EDGE_ZONES_SECTION_ICONS, edgeZonesProgramFormatIcon } from '@/lib/marketing/edgezones-icons'

export function DccPublicProgram() {
  const { portal } = useEdgeZonesLocale()
  const { sections, ui } = portal
  const program = sections.publicProgram

  return (
    <section id="programs" className="ez-section border-b border-[var(--ez-border)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <EdgeZonesSectionBanner banner="programs" className="mb-8" caption={ui.programsBannerCaption} />
        <EdgeZonesSectionHeader
          icon={EDGE_ZONES_SECTION_ICONS.programs}
          title={program.title}
          intro={program.intro}
          accent="magenta"
          introClassName="max-w-2xl"
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="ez-chip ez-chip-blue inline-flex items-center gap-2 rounded px-3 py-1.5">
            <CalendarClock className="h-4 w-4 shrink-0" aria-hidden />
            {program.dateLabel}
          </span>
          <span className="ez-chip ez-chip-orange inline-flex items-center gap-2 rounded px-3 py-1.5">
            {program.formatLabel}
          </span>
        </div>

        <h3 className="ez-heading ez-subsection-title mt-8">{ui.possibleFormats}</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {program.formats.map((format) => {
            const formatIcon = edgeZonesProgramFormatIcon(format)
            return (
              <li key={format} className="ez-card flex items-start gap-3 p-4">
                <EdgeZonesIconBadge icon={formatIcon} accent="indigo" size="compact" />
                <span className="ez-body">{format}</span>
              </li>
            )
          })}
        </ul>

        <a
          href={program.ctaHref}
          className="ez-btn-primary mt-8 inline-flex min-h-12 items-center gap-2 px-5 py-2.5"
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden />
          {program.ctaLabel}
        </a>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import { EdgeZonesHighlightParagraph } from '@/components/marketing/edgezones/EdgeZonesHighlightParagraph'
import { EdgeZonesPortrait } from '@/components/marketing/edgezones/EdgeZonesSections'
import { EdgeZonesSectionHeader } from '@/components/marketing/edgezones/EdgeZonesSectionHeader'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import {
  EDGE_ZONES_ROLE_ACCENT_ICONS,
  EDGE_ZONES_SECTION_ICONS,
  type EdgeZonesIconAccent,
  type EdgeZonesRoleAccent,
} from '@/lib/marketing/edgezones-icons'
import { partnershipPortraitFor } from '@/lib/marketing/edgezones-network-index'
import { cn } from '@/lib/utils'

const ACCENT_BORDER = {
  coral: 'border-t-[var(--ez-orange)]',
  indigo: 'border-t-[var(--ez-blue)]',
  teal: 'border-t-[var(--ez-green)]',
} as const

export function EdgeZonesRolesMatrix() {
  const { portal } = useEdgeZonesLocale()
  const { rolesMatrix, ui } = portal
  const columns = [rolesMatrix.edgeZones, rolesMatrix.jordanHorton, rolesMatrix.dccMiami]

  return (
    <section id="roles" className="ez-section border-b border-[var(--ez-border)] bg-[var(--ez-paper-alt)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <EdgeZonesSectionHeader
          icon={EDGE_ZONES_SECTION_ICONS.roles}
          title={rolesMatrix.title}
          accent="indigo"
        />
        <EdgeZonesHighlightParagraph className="mt-4 max-w-3xl">{rolesMatrix.intro}</EdgeZonesHighlightParagraph>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {columns.map((col) => {
            const portrait = partnershipPortraitFor(col.title)
            const imageFit = portrait?.imageFit ?? 'cover'
            const accent = col.accent as EdgeZonesRoleAccent
            const roleIcon = EDGE_ZONES_ROLE_ACCENT_ICONS[accent]

            return (
              <li
                key={col.title}
                className={cn(
                  'ez-card ez-logo-watermark border-t-4 p-5',
                  ACCENT_BORDER[col.accent as keyof typeof ACCENT_BORDER]
                )}
              >
                <span className="ez-card-watermark pointer-events-none absolute inset-0 z-0" aria-hidden />
                {portrait ? (
                  <div className="mb-5 flex justify-center">
                    {col.href ? (
                      <Link href={col.href} target="_blank" rel="noopener noreferrer" className="transition hover:opacity-90">
                        <EdgeZonesPortrait
                          name={portrait.name}
                          imageUrl={portrait.imageUrl}
                          imageAlt={portrait.imageAlt}
                          imageFit={imageFit}
                          size={imageFit === 'contain' ? 'logo' : 'lg'}
                        />
                      </Link>
                    ) : (
                      <EdgeZonesPortrait
                        name={portrait.name}
                        imageUrl={portrait.imageUrl}
                        imageAlt={portrait.imageAlt}
                        imageFit={imageFit}
                        size={imageFit === 'contain' ? 'logo' : 'lg'}
                      />
                    )}
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <EdgeZonesIconBadge
                    icon={roleIcon}
                    accent={col.accent as EdgeZonesIconAccent}
                    size="compact"
                  />
                  <p className="ez-module-number">{ui.roleLabel}</p>
                </div>
                <h3 className="ez-heading ez-subsection-title mt-2">
                  {col.href ? (
                    <Link
                      href={col.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 transition hover:text-[var(--ez-blue)]"
                    >
                      {col.title}
                      <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    </Link>
                  ) : (
                    col.title
                  )}
                </h3>
                <p className="ez-caption mt-1 font-semibold uppercase tracking-wide text-[var(--ez-muted)]">
                  {col.subtitle}
                </p>
                <EdgeZonesHighlightParagraph className="mt-3">{col.intro}</EdgeZonesHighlightParagraph>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-2.5 ez-body leading-snug text-[var(--ez-body-fg)]">
                      <CheckCircle2 className="ez-inline-icon mt-0.5 h-4 w-4 shrink-0 text-[var(--ez-green)]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {col.href ? (
                  <Link
                    href={col.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ez-caption mt-4 inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide text-[var(--ez-blue)] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    {col.hrefLabel}
                  </Link>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

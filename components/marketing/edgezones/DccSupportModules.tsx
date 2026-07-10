import { getEdgeZonesPortal } from '@/lib/marketing/edgezones/content'
import { edgeZonesModuleStatusClass, edgeZonesModuleStatusLabel } from '@/lib/marketing/edgezones-content'
import type { EdgeZonesLocale } from '@/lib/marketing/edgezones/edgezones-locale'
import { EDGE_ZONES_SECTION_ICONS, EDGE_ZONES_SUPPORT_ICONS } from '@/lib/marketing/edgezones-icons'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { EdgeZonesSectionHeader } from '@/components/marketing/edgezones/EdgeZonesSectionHeader'
import { cn } from '@/lib/utils'

export function DccSupportModules({ locale }: { locale: EdgeZonesLocale }) {
  const { sections, ui } = getEdgeZonesPortal(locale)
  const { support } = sections

  return (
    <section id="support" className="ez-section border-b border-[var(--ez-border)] bg-[var(--ez-paper-alt)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <EdgeZonesSectionHeader
          icon={EDGE_ZONES_SECTION_ICONS.support}
          title={support.title}
          intro={support.intro}
          accent="teal"
          introClassName="max-w-2xl"
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {support.modules.map((module) => {
            const iconName = EDGE_ZONES_SUPPORT_ICONS[module.icon]
            const statusClass = edgeZonesModuleStatusClass(module.status)
            const statusLabel = edgeZonesModuleStatusLabel(module.status, locale)
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="ez-module-number mt-1.5">{module.number}</span>
                    <EdgeZonesIconBadge icon={iconName} accent={module.accent} />
                  </div>
                  <span className={cn('rounded px-2.5 py-1', statusClass)}>{statusLabel}</span>
                </div>
                <h3 className="ez-heading ez-subsection-title mt-4">{module.title}</h3>
                <p className="ez-body mt-2 text-[var(--ez-muted)]">{module.description}</p>
                {module.materialsNote ? (
                  <p className="ez-caption mt-2 text-[var(--ez-orange)]">
                    {ui.materialsNeededPrefix} {module.materialsNote}
                  </p>
                ) : null}
              </>
            )

            return (
              <li key={module.id}>
                {module.href ? (
                  <a href={module.href} className="ez-card block p-5">
                    {inner}
                  </a>
                ) : (
                  <div className="ez-card p-5 opacity-90">{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

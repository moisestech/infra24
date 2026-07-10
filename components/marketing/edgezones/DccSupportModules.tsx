import {
  edgeZonesModuleStatusClass,
  edgeZonesModuleStatusLabel,
  edgeZonesPortal,
} from '@/lib/marketing/edgezones-content'
import { EDGE_ZONES_SUPPORT_ICONS } from '@/lib/marketing/edgezones-icons'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import { cn } from '@/lib/utils'

export function DccSupportModules() {
  const { support } = edgeZonesPortal.sections

  return (
    <section id="support" className="ez-section border-b border-[var(--ez-border)] bg-[var(--ez-paper-alt)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="ez-heading text-xl sm:text-2xl">{support.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ez-muted)]">{support.intro}</p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {support.modules.map((module) => {
            const Icon = EDGE_ZONES_SUPPORT_ICONS[module.icon]
            const statusClass = edgeZonesModuleStatusClass(module.status)
            const statusLabel = edgeZonesModuleStatusLabel(module.status)
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="ez-module-number mt-1">{module.number}</span>
                    <EdgeZonesIconBadge icon={Icon} accent={module.accent} size="compact" />
                  </div>
                  <span className={cn('rounded px-2 py-0.5', statusClass)}>{statusLabel}</span>
                </div>
                <h3 className="ez-heading mt-4 text-sm">{module.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ez-muted)]">{module.description}</p>
                {module.materialsNote ? (
                  <p className="mt-2 text-xs text-[var(--ez-orange)]">
                    Materials needed: {module.materialsNote}
                  </p>
                ) : null}
              </>
            )

            return (
              <li key={module.id}>
                {module.href ? (
                  <a href={module.href} className="ez-card block p-5 transition hover:border-[var(--ez-blue)]">
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

import type { LucideIcon } from 'lucide-react'
import { EdgeZonesIconBadge } from '@/components/marketing/edgezones/EdgeZonesIconBadge'
import type { EdgeZonesIconAccent } from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

type Props = {
  icon: LucideIcon
  title: string
  intro?: string
  accent?: EdgeZonesIconAccent
  className?: string
  introClassName?: string
}

export function EdgeZonesSectionHeader({
  icon,
  title,
  intro,
  accent = 'teal',
  className,
  introClassName,
}: Props) {
  return (
    <header className={className}>
      <div className="flex items-start gap-4">
        <EdgeZonesIconBadge icon={icon} accent={accent} />
        <div className="min-w-0">
          <h2 className="ez-heading ez-section-title">{title}</h2>
          {intro ? (
            <p className={cn('ez-lead mt-3 max-w-3xl text-[var(--ez-muted)]', introClassName)}>{intro}</p>
          ) : null}
        </div>
      </div>
    </header>
  )
}

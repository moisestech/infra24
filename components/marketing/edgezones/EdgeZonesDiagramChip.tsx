'use client'

import { EdgeZonesIcon } from '@/components/marketing/edgezones/EdgeZonesIcon'
import { useEdgeZonesConceptHover } from '@/components/marketing/edgezones/EdgeZonesConceptHoverContext'
import type { EdgeZonesIconName, EdgeZonesThemeAccent } from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  icon: EdgeZonesIconName
  accent: EdgeZonesThemeAccent
}

export function EdgeZonesDiagramChip({ label, icon, accent }: Props) {
  const { setHover } = useEdgeZonesConceptHover()

  return (
    <button
      type="button"
      className={cn(
        'ez-diagram-chip ez-chip inline-flex items-center gap-2 rounded px-3 py-1.5 transition',
        `ez-theme-accent-${accent}`
      )}
      onMouseEnter={() => setHover({ icon, accent, label })}
      onFocus={() => setHover({ icon, accent })}
    >
      <EdgeZonesIcon name={icon} className="ez-diagram-chip-icon h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      <span>{label}</span>
    </button>
  )
}

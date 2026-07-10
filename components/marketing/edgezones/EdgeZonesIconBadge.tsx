'use client'

import { EdgeZonesIcon } from '@/components/marketing/edgezones/EdgeZonesIcon'
import type { EdgeZonesIconAccent, EdgeZonesIconName } from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

const RING_CLASS: Record<EdgeZonesIconAccent, string> = {
  teal: 'ez-icon-ring-teal',
  coral: 'ez-icon-ring-coral',
  magenta: 'ez-icon-ring-magenta',
  indigo: 'ez-icon-ring-indigo',
}

type Props = {
  icon: EdgeZonesIconName
  accent?: EdgeZonesIconAccent
  size?: 'default' | 'compact'
  className?: string
}

export function EdgeZonesIconBadge({
  icon,
  accent = 'teal',
  size = 'default',
  className,
}: Props) {
  const box = size === 'compact' ? 'h-9 w-9 rounded-xl' : 'h-11 w-11 rounded-2xl'
  const glyph = size === 'compact' ? 'h-[1.125rem] w-[1.125rem]' : 'h-5 w-5'

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center ring-1 ring-inset',
        box,
        RING_CLASS[accent],
        className
      )}
    >
      <EdgeZonesIcon name={icon} className={glyph} />
    </span>
  )
}

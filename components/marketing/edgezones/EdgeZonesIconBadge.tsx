import type { LucideIcon } from 'lucide-react'
import {
  EDGE_ZONES_ICON_RING,
  type EdgeZonesIconAccent,
} from '@/lib/marketing/edgezones-icons'
import { cn } from '@/lib/utils'

type Props = {
  icon: LucideIcon
  accent?: EdgeZonesIconAccent
  size?: 'default' | 'compact'
  className?: string
}

export function EdgeZonesIconBadge({
  icon: Icon,
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
        EDGE_ZONES_ICON_RING[accent],
        className
      )}
    >
      <Icon className={glyph} strokeWidth={2.25} aria-hidden />
    </span>
  )
}

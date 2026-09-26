import { cn } from '@/lib/utils'
import type { FabricationColorClasses } from '@/lib/dcc/fabrication/theme'

export function curriculumCardInteractive(color: FabricationColorClasses) {
  return cn(
    'relative overflow-hidden bg-gradient-to-br transition-all duration-300 ease-out',
    'motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_20px_44px_-22px_rgba(15,23,42,0.5)]',
    'hover:brightness-[1.04] dark:hover:brightness-125 dark:hover:saturate-150',
    color.gradient,
    color.border
  )
}

export function curriculumIconBadge(color: FabricationColorClasses) {
  return cn(
    'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm',
    'transition-transform duration-300 motion-safe:group-hover:scale-110',
    color.icon
  )
}

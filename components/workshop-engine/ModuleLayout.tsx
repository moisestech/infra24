import { cn } from '@/lib/utils'
import { weLayout, weMeasure } from '@/components/workshop-engine/responsive'

/**
 * Generic module page layout: single column on mobile/tablet,
 * main curriculum + secondary rail from lg (desktop) up.
 */
export function ModuleLayout({
  main,
  rail,
  className,
}: {
  main: React.ReactNode
  rail?: React.ReactNode
  className?: string
}) {
  if (!rail) {
    return (
      <div className={cn(weMeasure.proseWide, 'w-full', className)}>{main}</div>
    )
  }

  return (
    <div className={cn(weLayout.moduleGrid, className)}>
      <div className={cn(weLayout.main, weMeasure.proseWide)}>{main}</div>
      <aside className={weLayout.rail} aria-label="Supporting references">
        {rail}
      </aside>
    </div>
  )
}

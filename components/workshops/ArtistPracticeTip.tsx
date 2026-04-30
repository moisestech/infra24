import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ArtistPracticeTipProps = {
  children: ReactNode
  className?: string
}

export function ArtistPracticeTip({ children, className }: ArtistPracticeTipProps) {
  return (
    <aside
      className={cn(
        'rounded-lg border border-primary-200 bg-primary-50/80 p-4 text-sm leading-relaxed text-foreground/90',
        className
      )}
    >
      <p className="font-semibold text-primary-900">Artist practice tip</p>
      <div className="mt-2">{children}</div>
    </aside>
  )
}

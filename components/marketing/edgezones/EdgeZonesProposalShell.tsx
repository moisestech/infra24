import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
}

/** Light/dark proposal microsite shell — paper aesthetic via ez-proposal tokens. */
export function EdgeZonesProposalShell({ children, className }: Props) {
  return (
    <div
      className={cn(
        'ez-proposal ez-paper-grain relative min-h-screen text-[var(--ez-ink)]',
        className
      )}
      data-edgezones-proposal
    >
      <div className="pointer-events-none absolute inset-0 ez-grid-bg opacity-40" aria-hidden />
      <div className="relative">{children}</div>
    </div>
  )
}

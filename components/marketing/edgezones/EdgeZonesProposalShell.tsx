import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
}

/** Light proposal microsite shell — forces paper aesthetic regardless of site dark mode. */
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

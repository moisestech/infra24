import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AskThePlaceShellProps = {
  children: ReactNode
  className?: string
}

/**
 * Dark-first premium shell for Ask the Place demos (isolated from org /tenant chrome).
 */
export function AskThePlaceShell({ children, className }: AskThePlaceShellProps) {
  return (
    <div
      className={cn(
        'dark min-h-screen bg-[#05070A] text-zinc-100 antialiased',
        'selection:bg-teal-500/30 selection:text-teal-50',
        className
      )}
    >
      {children}
    </div>
  )
}

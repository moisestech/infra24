'use client'

import type { ReactNode } from 'react'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { cn } from '@/lib/utils'

/** Subtle Magic UI grid behind lesson hero — keeps motion low so reading stays primary. */
export function LessonAmbientBackdrop({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative min-h-[120px] overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80',
        className
      )}
    >
      <AnimatedGridPattern
        numSquares={24}
        maxOpacity={0.12}
        duration={5}
        repeatDelay={0.8}
        width={36}
        height={36}
        className="pointer-events-none absolute inset-0 h-full w-full stroke-neutral-400/25 text-primary/20 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)] dark:stroke-neutral-600/30"
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

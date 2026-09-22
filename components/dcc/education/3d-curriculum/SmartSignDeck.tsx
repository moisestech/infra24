'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  THREE_D_SMARTSIGN_SCREENS,
  THREE_D_SCHOOL_PATH,
} from '@/lib/dcc/education/3d-curriculum'

export function SmartSignDeck({ className }: { className?: string }) {
  const [index, setIndex] = useState(0)
  const screen = THREE_D_SMARTSIGN_SCREENS[index]
  const total = THREE_D_SMARTSIGN_SCREENS.length

  function go(delta: number) {
    setIndex((current) => (current + delta + total) % total)
  }

  return (
    <div className={cn('mx-auto w-full max-w-md', className)}>
      <div
        className="relative flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-[2rem] border-8 border-neutral-900 bg-neutral-950 px-8 py-10 text-white shadow-2xl"
      >
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-teal-300">
            {screen.kicker}
          </p>
          <h2 className="mt-8 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {screen.title}
          </h2>
        </div>
        {screen.body ? (
          <p className="text-xl leading-snug text-neutral-100">{screen.body}</p>
        ) : null}
        <div className="flex items-end justify-between gap-4">
          {screen.href ? (
            <Link
              href={screen.href}
              className="inline-flex min-h-14 min-w-[10rem] items-center justify-center rounded-2xl bg-white px-5 text-lg font-semibold text-neutral-950"
            >
              Open
            </Link>
          ) : (
            <span />
          )}
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-neutral-300">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--cdc-border)] bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
          aria-label="Previous screen"
        >
          <ChevronLeft aria-hidden className="h-5 w-5" />
        </button>
        <Link
          href={THREE_D_SCHOOL_PATH}
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          Back to 3D School
        </Link>
        <button
          type="button"
          onClick={() => go(1)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--cdc-border)] bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
          aria-label="Next screen"
        >
          <ChevronRight aria-hidden className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

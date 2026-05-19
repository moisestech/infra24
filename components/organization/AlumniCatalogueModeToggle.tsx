'use client'

import Link from 'next/link'
import { Mic, LayoutGrid } from 'lucide-react'

import { cn } from '@/lib/utils'

type AlumniCatalogueModeToggleProps = {
  slug: string
  mode: 'browse' | 'voice'
}

export function AlumniCatalogueModeToggle({ slug, mode }: AlumniCatalogueModeToggleProps) {
  const item = (active: boolean) =>
    cn(
      'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors',
      active
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
    )

  const browseActive = mode === 'browse'
  const voiceActive = mode === 'voice'

  return (
    <div
      className="inline-flex rounded-xl border border-border bg-muted/40 p-1"
      role="group"
      aria-label="How to explore alumni"
    >
      {browseActive ? (
        <span className={item(true)} aria-current="page">
          <LayoutGrid className="h-4 w-4" aria-hidden />
          Browse
        </span>
      ) : (
        <Link href={`/o/${slug}/alumni`} className={item(false)}>
          <LayoutGrid className="h-4 w-4" aria-hidden />
          Browse
        </Link>
      )}
      {voiceActive ? (
        <span className={item(true)} aria-current="page">
          <Mic className="h-4 w-4" aria-hidden />
          Ask by voice
        </span>
      ) : (
        <Link href={`/o/${slug}/memory-agent`} className={item(false)}>
          <Mic className="h-4 w-4" aria-hidden />
          Ask by voice
        </Link>
      )}
    </div>
  )
}

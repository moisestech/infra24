import Link from 'next/link'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { href: '#wna-hero', label: 'Intro' },
  { href: '#wna-outcomes', label: 'Outcomes' },
  { href: '#wna-definition', label: 'Definition' },
  { href: '#wna-compare', label: 'Compare' },
  { href: '#wna-why', label: 'Why' },
  { href: '#wna-ideas', label: 'Ideas' },
  { href: '#wna-principles', label: 'Principles' },
  { href: '#wna-canon', label: 'Canon' },
  { href: '#wna-artifact', label: 'Artifact' },
] as const

export function WhatIsNetArtSectionNav({ className }: { className?: string }) {
  return (
    <nav
      aria-label="What Is Net Art sections"
      className={cn(
        'sticky top-16 z-40 -mx-1 flex flex-wrap gap-1 rounded-2xl border border-border bg-background/95 px-2 py-2 text-xs shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 md:text-sm',
        className
      )}
    >
      {SECTIONS.map((s, i) => (
        <Link
          key={s.href}
          href={s.href}
          className="rounded-lg px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span className="font-mono text-[10px] text-muted-foreground/80 md:text-xs">{i + 1}/9</span> {s.label}
        </Link>
      ))}
    </nav>
  )
}

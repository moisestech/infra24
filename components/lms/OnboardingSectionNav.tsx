import Link from 'next/link'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { href: '#onboarding-hero', label: 'Intro' },
  { href: '#onboarding-outcomes', label: 'Outcomes' },
  { href: '#onboarding-paths', label: 'Lanes' },
  { href: '#onboarding-glossary', label: 'Words' },
  { href: '#onboarding-github', label: 'GitHub' },
  { href: '#onboarding-tools', label: 'Tools' },
  { href: '#onboarding-prompts', label: 'Prompts' },
  { href: '#onboarding-modes', label: 'Modes' },
  { href: '#onboarding-artifact', label: 'Artifact' },
] as const

type OnboardingSectionNavProps = {
  className?: string
}

export function OnboardingSectionNav({ className }: OnboardingSectionNavProps) {
  return (
    <nav
      aria-label="Onboarding sections"
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
          <span className="font-mono text-[10px] text-muted-foreground/80 md:text-xs">{i + 1}/9</span>{' '}
          {s.label}
        </Link>
      ))}
    </nav>
  )
}

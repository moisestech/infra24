'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { learnAiWorkshopPaths } from '@/lib/workshops/learn-ai-without-losing-yourself/constants'

const navItems = (paths: ReturnType<typeof learnAiWorkshopPaths>) =>
  [
    { href: paths.base, label: 'Overview' },
    { href: paths.curriculum, label: 'Curriculum' },
    { href: paths.lab, label: 'Lab' },
    { href: paths.rehearse, label: 'Rehearse' },
  ] as const

export function LearnAiWorkshopNav({
  orgSlug,
  className,
}: {
  orgSlug: string
  className?: string
}) {
  const pathname = usePathname()
  const paths = learnAiWorkshopPaths(orgSlug)
  const items = navItems(paths)

  return (
    <nav
      className={cn(
        'flex flex-wrap gap-2 border-b border-border pb-4 print:hidden',
        className
      )}
      aria-label="Learn AI workshop sections"
    >
      {items.map(({ href, label }) => {
        const active =
          href === paths.base
            ? pathname === paths.base || pathname === `${paths.base}/`
            : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            )}
          >
            {label}
          </Link>
        )
      })}
      <Link
        href={`/o/${orgSlug}/workshops`}
        className="ml-auto rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        All workshops
      </Link>
    </nav>
  )
}

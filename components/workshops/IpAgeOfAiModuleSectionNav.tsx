'use client'

import { cn } from '@/lib/utils'
import type { IpAgeOfAiModuleTocItem } from '@/lib/workshops/ip-age-of-ai-module-toc'

export function IpAgeOfAiModuleSectionNav({
  items,
  className,
}: {
  items: IpAgeOfAiModuleTocItem[]
  className?: string
}) {
  return (
    <nav
      aria-label="On this page"
      className={cn(
        'rounded-xl border border-border bg-card/95 p-3 text-sm shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/80 dark:bg-card/80',
        'lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto',
        className
      )}
    >
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
      <ul className="space-y-0.5">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="block rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

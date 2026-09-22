'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ProposalNavItem } from '@/lib/dcc/fabrication/schema'
import { cn } from '@/lib/utils'

/** Below marketing SiteHeader (`sticky top-0`). */
const STICKY_TOP_PX = 88
const HORIZONTAL_NAV_HEIGHT_PX = 48
const SCROLL_SPY_TOP_PX = STICKY_TOP_PX + HORIZONTAL_NAV_HEIGHT_PX

const IO_THRESHOLDS = [
  0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75,
  0.8, 0.85, 0.9, 0.95, 1,
] as const

type ProposalNavProps = {
  sections: ProposalNavItem[]
  layout: 'horizontal' | 'sidebar'
  className?: string
}

function useProposalScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  const ratiosRef = useRef<Record<string, number>>({})

  useEffect(() => {
    setActiveId(sectionIds[0] ?? '')
  }, [sectionIds])

  const pickActiveFromRatios = useCallback(() => {
    let bestId = sectionIds[0] ?? ''
    let bestR = -1
    for (const id of sectionIds) {
      const r = ratiosRef.current[id] ?? 0
      if (r > bestR) {
        bestR = r
        bestId = id
      }
    }
    if (bestR > 0.001) setActiveId(bestId)
  }, [sectionIds])

  useEffect(() => {
    sectionIds.forEach((id) => {
      ratiosRef.current[id] = 0
    })

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    if (elements.length === 0) return

    const rootMargin =
      typeof window !== 'undefined' && window.innerWidth >= 1024
        ? '-20% 0px -55% 0px'
        : `-${SCROLL_SPY_TOP_PX}px 0px -38% 0px`

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratiosRef.current[entry.target.id] = entry.intersectionRatio
        }
        pickActiveFromRatios()
      },
      { root: null, rootMargin, threshold: [...IO_THRESHOLDS] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds, pickActiveFromRatios])

  useEffect(() => {
    const lastId = sectionIds[sectionIds.length - 1]
    if (!lastId) return

    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40
      if (nearBottom) setActiveId(lastId)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionIds])

  return activeId
}

function navLabel(item: ProposalNavItem, layout: ProposalNavProps['layout']): string {
  if (layout === 'horizontal' && item.shortLabel) return item.shortLabel
  return item.label
}

export function ProposalNav({ sections, layout, className }: ProposalNavProps) {
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections])
  const activeId = useProposalScrollSpy(sectionIds)

  if (sections.length === 0) return null

  if (layout === 'sidebar') {
    return (
      <nav
        aria-label="Proposal sections"
        className={cn('sticky top-24 self-start', className)}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
          On this page
        </p>
        <ul className="mt-3 space-y-0.5 border-l border-[var(--cdc-border)]">
          {sections.map((item) => {
            const isActive = activeId === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    'block border-l-2 py-1.5 pl-3 text-sm leading-snug transition-colors',
                    isActive
                      ? '-ml-px border-[var(--cdc-teal)] font-medium text-neutral-900 dark:text-neutral-100'
                      : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  )}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  return (
    <nav
      aria-label="Proposal sections"
      style={{ top: STICKY_TOP_PX }}
      className={cn(
        'sticky z-40 -mx-4 border-b border-neutral-200/90 bg-[#fafafa]/92 px-4 py-2 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.2)] backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/92 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8',
        className
      )}
    >
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 pt-0.5">
        <span className="mr-1 hidden shrink-0 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 sm:inline">
          Jump to
        </span>
        {sections.map((item) => {
          const isActive = activeId === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'border-teal-400/50 bg-teal-50 text-teal-900 shadow-sm dark:border-teal-500/35 dark:bg-teal-950/50 dark:text-teal-100'
                  : 'border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              {navLabel(item, layout)}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

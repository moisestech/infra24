'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  THREE_D_SCHOOL_SECTIONS,
  schoolSectionHref,
  type ThreeDSchoolSectionId,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import {
  curriculumCardInteractive,
  curriculumIconBadge,
} from '@/components/dcc/education/3d-curriculum/interactive'

const STICKY_TOP = '5.5rem'

function useActiveSchoolSection(
  fallback?: ThreeDSchoolSectionId
): ThreeDSchoolSectionId | undefined {
  const [activeId, setActiveId] = useState<ThreeDSchoolSectionId | undefined>(
    fallback
  )

  useEffect(() => {
    const elements = THREE_D_SCHOOL_SECTIONS.map((section) =>
      document.getElementById(section.id)
    ).filter((node): node is HTMLElement => Boolean(node))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const next = visible[0]?.target.id as ThreeDSchoolSectionId | undefined
        if (next) setActiveId(next)
      },
      {
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return activeId
}

export function ThreeDSchoolNav({
  current,
}: {
  current?: ThreeDSchoolSectionId
}) {
  const activeId = useActiveSchoolSection(current)
  const [indexOpen, setIndexOpen] = useState(true)

  return (
    <div className="mb-8">
      <details
        open={indexOpen}
        onToggle={(event) => setIndexOpen(event.currentTarget.open)}
        className="group/index overflow-hidden rounded-3xl border border-[var(--cdc-border)] bg-gradient-to-br from-teal-50 via-cyan-50 to-violet-50 dark:from-teal-950/30 dark:via-neutral-950 dark:to-violet-950/30"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              On this page
            </p>
            <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-neutral-50">
              How 3D School is organized
            </p>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
              Eight sections. Expand this menu, jump to a part, or collapse a
              section once you have what you need.
            </p>
          </div>
          <ChevronDown
            aria-hidden
            className="h-6 w-6 shrink-0 text-neutral-500 transition-transform duration-300 group-open/index:rotate-180"
          />
        </summary>
        <ul className="grid gap-3 border-t border-[var(--cdc-border)]/70 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {THREE_D_SCHOOL_SECTIONS.map((section) => {
            const color = getFabricationColor(section.colorTokenId)
            const Icon = CURRICULUM_ICONS[section.icon]
            const active = activeId === section.id
            return (
              <li key={section.id}>
                <Link
                  href={schoolSectionHref(section.id)}
                  className={cn(
                    'group flex h-full flex-col rounded-2xl border p-4',
                    curriculumCardInteractive(color),
                    active &&
                      'ring-2 ring-teal-400/70 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950'
                  )}
                >
                  <span className={curriculumIconBadge(color)}>
                    <Icon aria-hidden className="h-6 w-6" />
                  </span>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                    {section.kicker} · {section.short}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    {section.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {section.summary}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </details>

      <nav
        aria-label="DCC 3D School sections"
        style={{ top: STICKY_TOP }}
        className="sticky z-40 mt-3 overflow-x-auto rounded-2xl border border-[var(--cdc-border)] bg-white/90 p-1.5 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.45)] backdrop-blur-md dark:bg-neutral-950/90"
      >
        <div className="flex min-w-max gap-1">
          {THREE_D_SCHOOL_SECTIONS.map((section) => {
            const color = getFabricationColor(section.colorTokenId)
            const Icon = CURRICULUM_ICONS[section.icon]
            const active = activeId === section.id
            return (
              <Link
                key={section.id}
                href={schoolSectionHref(section.id)}
                className={cn(
                  'group inline-flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300',
                  active
                    ? cn(
                        'bg-gradient-to-r shadow-sm',
                        color.gradient,
                        color.border,
                        color.heading
                      )
                    : 'border-transparent text-neutral-700 hover:bg-gradient-to-r hover:from-teal-50 hover:via-cyan-50 hover:to-violet-50 dark:text-neutral-300 dark:hover:from-teal-950/40 dark:hover:via-neutral-900 dark:hover:to-violet-950/40'
                )}
                aria-current={active ? 'location' : undefined}
              >
                <Icon
                  aria-hidden
                  className="h-5 w-5 shrink-0 transition-transform duration-300 motion-safe:group-hover:scale-110"
                />
                <span className="sm:hidden">{section.short}</span>
                <span className="hidden sm:inline">{section.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

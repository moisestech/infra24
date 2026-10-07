'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown, School } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  THREE_D_SCHOOL_SECTIONS,
  getCurriculumAsset,
  schoolSectionHref,
  type ThreeDSchoolSectionId,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import {
  curriculumCardInteractive,
  curriculumIconBadge,
} from '@/components/dcc/education/3d-curriculum/interactive'

const STICKY_TOP = '5.5rem'
const CUBE = 56
const CUBE_DEPTH = CUBE / 2

function SchoolCube() {
  const stageRef = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState(CUBE)

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const copy = node.parentElement?.querySelector('[data-school-copy]')
    if (!copy) return
    const contentHeight = () => {
      const kids = [...copy.children] as HTMLElement[]
      if (kids.length === 0) return 0
      const last = kids[kids.length - 1]
      return last.offsetTop + last.offsetHeight - kids[0].offsetTop
    }
    const fit = () => {
      const summary = node.closest('summary')
      if (!summary) return
      const max = Math.min(200, Math.max(96, summary.clientWidth * 0.42))
      let chosen = 96
      let best = Number.POSITIVE_INFINITY
      for (let stage = 96; stage <= max; stage += 4) {
        const next = Math.round(stage * 0.72)
        node.style.width = `${stage}px`
        const height = contentHeight()
        const textWidth = copy.getBoundingClientRect().width
        if (textWidth < 140) break
        const score = Math.abs(height - stage)
        if (score < best) {
          best = score
          chosen = next
        }
      }
      node.style.width = ''
      setSize((current) => (current === chosen ? current : chosen))
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(node.parentElement ?? node)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  const depth = size / 2
  const face = (transform: string, className: string, children?: ReactNode) => (
    <span
      className={cn(
        'absolute inset-0 flex items-center justify-center rounded-lg [backface-visibility:hidden]',
        className
      )}
      style={{ transform }}
    >
      {children}
    </span>
  )

  return (
    <span ref={stageRef} className="flex shrink-0 items-center self-stretch" aria-hidden>
      <span
        className="relative grid place-items-center [perspective:680px]"
        style={{ width: size / 0.72, height: size / 0.72 }}
      >
        <span
          className="relative transition-transform duration-200 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
          style={{
            width: size,
            height: size,
            transform: 'rotateX(var(--school-rx, -16deg)) rotateY(var(--school-ry, 28deg))',
          }}
        >
          {face(
            `translateZ(${depth}px)`,
            'bg-gradient-to-br from-teal-200 via-teal-400 to-teal-700 text-white shadow-[0_12px_28px_-14px_rgba(13,148,136,0.95)]',
            <School style={{ width: size * 0.42, height: size * 0.42 }} />
          )}
          {face(`rotateY(180deg) translateZ(${depth}px)`, 'bg-neutral-900')}
          {face(
            `rotateY(90deg) translateZ(${depth}px)`,
            'bg-gradient-to-b from-violet-300 to-violet-800'
          )}
          {face(
            `rotateY(-90deg) translateZ(${depth}px)`,
            'bg-gradient-to-b from-cyan-300 to-cyan-800'
          )}
          {face(
            `rotateX(90deg) translateZ(${depth}px)`,
            'bg-gradient-to-br from-amber-200 to-orange-500'
          )}
          {face(
            `rotateX(-90deg) translateZ(${depth}px)`,
            'bg-gradient-to-br from-slate-700 to-slate-950'
          )}
        </span>
      </span>
    </span>
  )
}

function SectionThumb({ assetId, alt }: { assetId: Parameters<typeof getCurriculumAsset>[0]; alt: string }) {
  const media = getCurriculumAsset(assetId)
  if (!media.src) return null
  return (
    <span className="relative w-20 shrink-0 self-stretch overflow-hidden bg-neutral-100 sm:w-24 dark:bg-neutral-900">
      <img src={media.src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    </span>
  )
}

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
  organizedOpen = true,
}: {
  current?: ThreeDSchoolSectionId
  organizedOpen?: boolean
}) {
  const activeId = useActiveSchoolSection(current)
  const [indexOpen, setIndexOpen] = useState(organizedOpen)
  const indexRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const node = indexRef.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = (rx: number, ry: number, px: number, py: number) => {
      node.style.setProperty('--school-rx', `${rx}deg`)
      node.style.setProperty('--school-ry', `${ry}deg`)
      node.style.setProperty('--school-px', `${px}px`)
      node.style.setProperty('--school-py', `${py}px`)
    }
    apply(-16, 28, 0, 0)
    if (reduce.matches) return
    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      apply(-16 + py * -18, 28 + px * 28, px * 28, py * 16)
    }
    const onLeave = () => apply(-16, 28, 0, 0)
    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
    <div className="mb-3">
      <details
        ref={indexRef}
        open={indexOpen}
        onToggle={(event) => setIndexOpen(event.currentTarget.open)}
        className="group/index relative overflow-hidden rounded-3xl border border-[var(--cdc-border)] bg-gradient-to-br from-teal-50 via-cyan-50 to-violet-50 dark:from-teal-950/30 dark:via-neutral-950 dark:to-violet-950/30"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -left-8 -top-10 h-36 w-36 rounded-full bg-teal-300/50 blur-3xl transition-transform duration-200 ease-out dark:bg-teal-400/25 motion-reduce:transition-none"
          style={{ transform: 'translate3d(var(--school-px, 0px), var(--school-py, 0px), 0)' }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-16 right-4 h-44 w-44 rounded-full bg-violet-300/45 blur-3xl transition-transform duration-200 ease-out dark:bg-violet-500/20 motion-reduce:transition-none"
          style={{
            transform:
              'translate3d(calc(var(--school-px, 0px) * -1.3), calc(var(--school-py, 0px) * -1.1), 0)',
          }}
        />
        <summary className="relative z-10 flex cursor-pointer list-none items-stretch gap-4 px-5 py-4 marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden">
          <SchoolCube />
          <div data-school-copy className="min-w-0 flex-1">
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
            className="mt-1 h-6 w-6 shrink-0 self-start text-neutral-500 transition-transform duration-300 group-open/index:rotate-180"
          />
        </summary>
        <ul className="relative z-10 grid gap-3 border-t border-[var(--cdc-border)]/70 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {THREE_D_SCHOOL_SECTIONS.map((section) => {
            const color = getFabricationColor(section.colorTokenId)
            const Icon = CURRICULUM_ICONS[section.icon]
            const active = activeId === section.id
            return (
              <li key={section.id}>
                <Link
                  href={schoolSectionHref(section.id)}
                  onClick={() => setIndexOpen(false)}
                  className={cn(
                    'group flex h-full items-stretch overflow-hidden rounded-2xl border',
                    curriculumCardInteractive(color),
                    active &&
                      'ring-2 ring-teal-400/70 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950'
                  )}
                >
                  <span className="flex min-w-0 flex-1 flex-col p-4">
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
                  </span>
                  <SectionThumb assetId={section.imageAssetId} alt="" />
                </Link>
              </li>
            )
          })}
        </ul>
      </details>
    </div>

      <nav
        aria-label="DCC 3D School sections"
        style={{ top: STICKY_TOP }}
        className="sticky z-40 mb-3 overflow-x-auto rounded-2xl border border-[var(--cdc-border)] bg-white/90 p-1.5 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.45)] backdrop-blur-md dark:bg-neutral-950/90"
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
                onClick={() => setIndexOpen(false)}
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
    </>
  )
}

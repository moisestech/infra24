'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  getSchoolSection,
  type ThreeDSchoolSectionId,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'

export function ThreeDSchoolBreakpoint({
  kicker,
  label,
}: {
  kicker: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 py-8" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-300 to-violet-400 dark:via-teal-700 dark:to-violet-600" />
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
        {kicker} · {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-300 to-amber-400 dark:via-cyan-700 dark:to-amber-600" />
    </div>
  )
}

export function ThreeDSchoolSection({
  id,
  children,
  defaultOpen = false,
}: {
  id: ThreeDSchoolSectionId
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const section = getSchoolSection(id)
  const color = getFabricationColor(section.colorTokenId)
  const Icon = CURRICULUM_ICONS[section.icon]
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(defaultOpen)
  const [mark, setMark] = useState(112)

  useEffect(() => {
    const copy = copyRef.current
    const tile = markRef.current
    const section = detailsRef.current?.parentElement
    if (!copy || !tile || !section) return

    const contentHeight = () => {
      const kids = [...copy.children] as HTMLElement[]
      if (kids.length === 0) return 0
      const last = kids[kids.length - 1]
      return last.offsetTop + last.offsetHeight - kids[0].offsetTop
    }

    const fit = () => {
      const summary = copy.closest('summary')
      if (!summary) return
      const max = Math.min(220, Math.max(96, summary.clientWidth * 0.46))
      let chosen = 96
      let best = Number.POSITIVE_INFINITY
      for (let size = 96; size <= max; size += 4) {
        tile.style.width = `${size}px`
        tile.style.height = `${size}px`
        const height = contentHeight()
        const textWidth = copy.getBoundingClientRect().width
        if (textWidth < 128) break
        const score = Math.abs(height - size)
        if (score < best) {
          best = score
          chosen = Math.round(Math.min(size, height))
        }
      }
      tile.style.width = `${chosen}px`
      tile.style.height = `${chosen}px`
      setMark((current) => (current === chosen ? current : chosen))
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(section)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  useEffect(() => {
    if (defaultOpen && detailsRef.current && !detailsRef.current.open) {
      detailsRef.current.open = true
    }
    const reveal = () => {
      const node = detailsRef.current
      if (!node || window.location.hash !== `#${id}`) return
      if (!node.open) node.open = true
    }
    const onClick = (event: MouseEvent) => {
      const href = (event.target as Element | null)?.closest?.('a')?.getAttribute('href')
      if (!href?.endsWith(`#${id}`)) return
      const node = detailsRef.current
      if (node && !node.open) node.open = true
    }
    reveal()
    window.addEventListener('hashchange', reveal)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('hashchange', reveal)
      document.removeEventListener('click', onClick, true)
    }
  }, [defaultOpen, id])

  return (
    <section id={id} className="scroll-mt-36">
      <ThreeDSchoolBreakpoint kicker={section.kicker} label={section.label} />
      <details
        ref={detailsRef}
        onToggle={(event) => setOpen(event.currentTarget.open)}
        className={cn(
          'group/section mt-4 overflow-hidden rounded-3xl border bg-gradient-to-br transition duration-300',
          !open &&
            'motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_20px_44px_-22px_rgba(15,23,42,0.45)]',
          color.border,
          color.gradient
        )}
      >
        <summary className="flex cursor-pointer list-none items-stretch gap-4 px-5 py-5 marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className="flex shrink-0 items-center self-stretch">
            <span
              ref={markRef}
              className={cn(
                'relative flex items-center justify-center overflow-hidden rounded-2xl shadow-sm transition duration-300',
                color.icon,
                'motion-safe:group-hover/section:shadow-[0_0_36px_-8px_rgba(255,255,255,0.9)] motion-safe:group-hover/section:brightness-125'
              )}
              style={{ width: mark, height: mark }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.78),transparent_62%)] opacity-0 transition duration-500 motion-safe:group-hover/section:opacity-100"
              />
              <Icon
                aria-hidden
                className="relative h-[90%] w-[90%] transition duration-500 ease-out motion-safe:group-hover/section:-translate-y-0.5 motion-safe:group-hover/section:scale-105 motion-safe:group-hover/section:drop-shadow-[0_0_18px_rgba(255,255,255,0.95)]"
              />
            </span>
          </span>
          <div ref={copyRef} className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {section.kicker} · {section.label}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
              {section.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
              {section.summary}
            </p>
          </div>
          <ChevronDown
            aria-hidden
            className={cn(
              'mt-1 h-6 w-6 shrink-0 self-start text-neutral-500 transition-transform duration-300 group-open/section:rotate-180',
              !open && 'motion-safe:group-hover/section:translate-x-1'
            )}
          />
        </summary>
        <div className="border-t border-[var(--cdc-border)]/70 px-5 pb-6 pt-5 sm:px-6">
          {children}
        </div>
      </details>
    </section>
  )
}

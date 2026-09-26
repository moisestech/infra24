'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  getSchoolSection,
  type ThreeDSchoolSectionId,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { curriculumIconBadge } from '@/components/dcc/education/3d-curriculum/interactive'

export function ThreeDSchoolBreakpoint({
  kicker,
  label,
}: {
  kicker: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 py-2" aria-hidden>
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
  defaultOpen = true,
}: {
  id: ThreeDSchoolSectionId
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const section = getSchoolSection(id)
  const color = getFabricationColor(section.colorTokenId)
  const Icon = CURRICULUM_ICONS[section.icon]
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section id={id} className="scroll-mt-36">
      <ThreeDSchoolBreakpoint kicker={section.kicker} label={section.label} />
      <details
        open={open}
        onToggle={(event) => setOpen(event.currentTarget.open)}
        className={cn(
          'group/section mt-4 overflow-hidden rounded-3xl border bg-gradient-to-br',
          color.border,
          color.gradient
        )}
      >
        <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-5 marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className={curriculumIconBadge(color)}>
            <Icon aria-hidden className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
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
            className="mt-1 h-6 w-6 shrink-0 text-neutral-500 transition-transform duration-300 group-open/section:rotate-180"
          />
        </summary>
        <div className="border-t border-[var(--cdc-border)]/70 px-5 pb-6 pt-5 sm:px-6">
          {children}
        </div>
      </details>
    </section>
  )
}

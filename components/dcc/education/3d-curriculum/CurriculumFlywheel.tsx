'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  THREE_D_FLYWHEEL_LEAD,
  THREE_D_FLYWHEEL_STEPS,
  getCurriculumAsset,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { curriculumCardInteractive } from '@/components/dcc/education/3d-curriculum/interactive'

const FLYWHEEL_COLORS = [
  'teal',
  'cyan',
  'indigo',
  'violet',
  'emerald',
  'amber',
  'orange',
  'rose',
] as const

export function CurriculumFlywheel({
  className,
  embedded = false,
}: {
  className?: string
  embedded?: boolean
}) {
  const [activeId, setActiveId] = useState(THREE_D_FLYWHEEL_STEPS[0]?.id)
  const active =
    THREE_D_FLYWHEEL_STEPS.find((step) => step.id === activeId) ??
    THREE_D_FLYWHEEL_STEPS[0]
  const still = active ? getCurriculumAsset(active.imageAssetId) : undefined

  const body = (
    <div className={cn(!embedded && 'mt-8', 'grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]')}>
      {still?.src && active ? (
        <figure className="overflow-hidden rounded-2xl border border-[var(--cdc-border)] bg-neutral-100 lg:sticky lg:top-40 lg:col-start-2 lg:row-start-1 dark:bg-neutral-900">
          <div className="relative aspect-[4/3]">
            <img
              key={active.id}
              src={still.src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <figcaption className="px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              {String(
                THREE_D_FLYWHEEL_STEPS.findIndex((step) => step.id === active.id) + 1
              ).padStart(2, '0')}
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              {active.label}
            </p>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{active.detail}</p>
          </figcaption>
        </figure>
      ) : null}
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-start-1 lg:row-start-1">
        {THREE_D_FLYWHEEL_STEPS.map((step, i) => {
          const color = getFabricationColor(FLYWHEEL_COLORS[i] ?? 'slate')
          const selected = step.id === active?.id
          return (
            <li key={step.id} className="min-w-0">
              <button
                type="button"
                aria-pressed={selected}
                onMouseEnter={() => setActiveId(step.id)}
                onFocus={() => setActiveId(step.id)}
                onClick={() => setActiveId(step.id)}
                className={cn(
                  'flex h-full min-h-28 w-full flex-col justify-center rounded-xl border px-4 py-4 text-left',
                  curriculumCardInteractive(color),
                  selected &&
                    'ring-2 ring-teal-400/80 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950'
                )}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {step.label}
                </span>
                <span className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  {step.detail}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )

  if (embedded) return body

  return (
    <section
      id="flywheel"
      className={cn('scroll-mt-24', className)}
      aria-labelledby="flywheel-heading"
    >
      <h2
        id="flywheel-heading"
        className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl"
      >
        Why DCC teaches fabrication
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
        {THREE_D_FLYWHEEL_LEAD}
      </p>
      {body}
    </section>
  )
}

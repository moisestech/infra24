'use client'

import { useEffect, useId, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  CircleDashed,
  Layers3,
  ListChecks,
  Maximize2,
  Network,
  Rotate3d,
  Ruler,
  SearchCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  ModuleInstructionalConcepts,
  WorkshopMedia,
} from '@/lib/workshop-engine/types'
import { weSpace, weType } from '@/components/workshop-engine/responsive'

const ICON_MAP: Record<NonNullable<WorkshopMedia['iconKey']>, LucideIcon> = {
  'rotate-3d': Rotate3d,
  network: Network,
  'circle-dashed': CircleDashed,
  'layers-3': Layers3,
  ruler: Ruler,
  'list-checks': ListChecks,
  sparkles: Sparkles,
  'search-check': SearchCheck,
}

function ConceptualLabel() {
  return (
    <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-indigo-900 md:text-xs">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-white">
        <Sparkles aria-hidden className="h-3 w-3" />
      </span>
      Conceptual illustration
    </p>
  )
}

function ZoomDialog({
  media,
  open,
  onClose,
}: {
  media: WorkshopMedia
  open: boolean
  onClose: () => void
}) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-6xl overflow-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0 space-y-1">
            <ConceptualLabel />
            <p id={titleId} className={cn(weType.body, 'font-medium text-slate-900')}>
              {media.caption ?? media.alt}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            aria-label="Close zoomed illustration"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-slate-100 p-2 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            className="mx-auto h-auto max-h-[75vh] w-full object-contain"
          />
        </div>
        {media.prompt ? (
          <p className={cn(weType.body, 'border-t border-slate-200 px-4 py-3 text-slate-700')}>
            {media.prompt}
          </p>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Generic conceptual teaching image — curriculum supplies metadata.
 * Always labeled as conceptual; never documentary evidence.
 */
export function ConceptualIllustration({
  media,
  className,
  priority = false,
}: {
  media: WorkshopMedia
  className?: string
  priority?: boolean
}) {
  const [zoomed, setZoomed] = useState(false)
  const Icon = media.iconKey ? ICON_MAP[media.iconKey] : Sparkles

  return (
    <>
      <figure
        className={cn(
          'overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-white',
          className
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-white">
              <Icon aria-hidden className="h-3.5 w-3.5" />
            </span>
            <ConceptualLabel />
          </div>
          {media.zoomable ? (
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 text-xs font-medium text-indigo-950 hover:bg-indigo-50 md:text-sm"
            >
              <Maximize2 aria-hidden className="h-3.5 w-3.5" />
              Zoom
            </button>
          ) : null}
        </div>
        <div
          className="relative min-h-[210px] w-full min-w-0 bg-slate-100"
          style={{ aspectRatio: `${media.width} / ${media.height}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full max-w-full object-cover"
            style={{ objectPosition: media.objectPosition ?? 'center' }}
          />
        </div>
        <figcaption className="space-y-2 border-t border-indigo-100 px-3 py-3 sm:px-4">
          {media.caption ? (
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
              {media.caption}
            </p>
          ) : null}
          {media.prompt ? (
            <p className={cn(weType.body, 'text-slate-800')}>{media.prompt}</p>
          ) : null}
          <p className="sr-only">
            Conceptual illustration — not a validated slicer screenshot, equipment
            photograph, or failure diagnosis.
          </p>
        </figcaption>
      </figure>
      {media.zoomable ? (
        <ZoomDialog
          media={media}
          open={zoomed}
          onClose={() => setZoomed(false)}
        />
      ) : null}
    </>
  )
}

export function InstructionalConceptsBlock({
  concepts,
  priority = false,
}: {
  concepts: ModuleInstructionalConcepts
  priority?: boolean
}) {
  const [open, setOpen] = useState(concepts.layout !== 'expandable')

  if (!concepts.items.length) return null

  const header = (
    <div className="space-y-1.5">
      {concepts.title ? (
        <h2 className={cn(weType.section, 'text-slate-950')}>{concepts.title}</h2>
      ) : null}
      {concepts.intro ? (
        <p className={cn(weType.body, 'text-slate-700')}>{concepts.intro}</p>
      ) : null}
    </div>
  )

  const points =
    concepts.htmlPoints && concepts.htmlPoints.length > 0 ? (
      <ul
        className={cn(
          weType.body,
          'list-disc space-y-1.5 pl-5 text-slate-800 md:space-y-2'
        )}
      >
        {concepts.htmlPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    ) : null

  if (concepts.layout === 'expandable') {
    return (
      <section
        className={cn(
          'rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-white',
          weSpace.cardPad
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full min-h-11 items-start justify-between gap-3 text-left"
          aria-expanded={open}
        >
          <div className="min-w-0 space-y-1">
            <ConceptualLabel />
            {concepts.title ? (
              <p className={cn(weType.section, 'text-slate-950')}>{concepts.title}</p>
            ) : null}
            {concepts.intro ? (
              <p className={cn(weType.body, 'text-slate-700')}>{concepts.intro}</p>
            ) : null}
          </div>
          <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-indigo-800">
            {open ? 'Hide' : 'Show'}
          </span>
        </button>
        {open ? (
          <div className={cn(weSpace.stackTight, 'mt-4')}>
            {concepts.items.map((media, index) => (
              <ConceptualIllustration
                key={media.id}
                media={media}
                priority={priority && index === 0}
              />
            ))}
            {points}
          </div>
        ) : null}
      </section>
    )
  }

  if (concepts.layout === 'slicer-sequence') {
    return (
      <section className={weSpace.stack}>
        {header}
        {/* Mobile / tablet / TV: one at a time. Large desktop: 2×2 grid. */}
        <div className="grid gap-4 md:gap-5 xl:grid-cols-2 xl:gap-6">
          {concepts.items.map((media, index) => (
            <ConceptualIllustration
              key={media.id}
              media={media}
              priority={priority && index === 0}
            />
          ))}
        </div>
        <p className={cn(weType.label, 'text-slate-600')}>
          Next: open the validated venue slicer and match each concept with the
          real Photon Workshop step. These illustrations are not screenshots.
        </p>
      </section>
    )
  }

  return (
    <section className={weSpace.stackTight}>
      {header}
      {concepts.items.map((media, index) => (
        <ConceptualIllustration
          key={media.id}
          media={media}
          priority={priority && index === 0}
        />
      ))}
      {points}
    </section>
  )
}

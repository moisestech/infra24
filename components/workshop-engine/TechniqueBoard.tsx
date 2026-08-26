'use client'

import { useEffect, useId, useState } from 'react'
import {
  CheckCircle2,
  Maximize2,
  Camera,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  ModuleTechniqueBoards,
  WorkshopMedia,
} from '@/lib/workshop-engine/types'
import { weSpace, weType } from '@/components/workshop-engine/responsive'

function EvidenceLabel({
  status,
}: {
  status?: WorkshopMedia['productionStatus']
}) {
  const draft = !status || status === 'draft-teaching-board'
  return (
    <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-indigo-900 md:text-xs">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-white">
        <Sparkles aria-hidden className="h-3 w-3" />
      </span>
      {draft ? 'Conceptual illustration · draft teaching board' : 'Verified teaching asset'}
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
            <EvidenceLabel status={media.productionStatus} />
            <p id={titleId} className={cn(weType.body, 'font-medium text-slate-900')}>
              {media.caption ?? media.alt}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            aria-label="Close zoomed technique board"
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
        {media.longDescription || media.prompt ? (
          <p className={cn(weType.body, 'border-t border-slate-200 px-4 py-3 text-slate-700')}>
            {media.longDescription ?? media.prompt}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function RegionPins({ media }: { media: WorkshopMedia }) {
  if (!media.regions?.length) return null
  return (
    <ul className="absolute inset-0 pointer-events-none">
      {media.regions.map((r) => (
        <li
          key={r.id}
          className="absolute"
          style={{
            left: `${r.x}%`,
            top: `${r.y}%`,
            width: `${r.w}%`,
            height: `${r.h}%`,
          }}
        >
          <span className="pointer-events-auto absolute left-0 top-0 inline-flex max-w-[12rem] rounded-md bg-slate-950/80 px-2 py-1 text-[10px] font-medium text-white shadow md:text-xs">
            {r.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

function DoAvoidPanel({
  doAvoid,
}: {
  doAvoid: NonNullable<WorkshopMedia['doAvoid']>
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  return (
    <div className="space-y-4">
      <div>
        <p className={cn(weType.meta, 'text-emerald-800')}>Do</p>
        <ul className="mt-2 space-y-2">
          {doAvoid.do.map((item) => (
            <li key={item}>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-2 text-emerald-950',
                  weType.body
                )}
              >
                <input
                  type="checkbox"
                  className="mt-1 accent-emerald-700"
                  checked={Boolean(checked[`do-${item}`])}
                  onChange={(e) =>
                    setChecked((prev) => ({
                      ...prev,
                      [`do-${item}`]: e.target.checked,
                    }))
                  }
                />
                <CheckCircle2
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className={cn(weType.meta, 'text-rose-800')}>Avoid</p>
        <ul className="mt-2 space-y-2">
          {doAvoid.avoid.map((item) => (
            <li key={item}>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-2 text-rose-950',
                  weType.body
                )}
              >
                <input
                  type="checkbox"
                  className="mt-1 accent-rose-700"
                  checked={Boolean(checked[`avoid-${item}`])}
                  onChange={(e) =>
                    setChecked((prev) => ({
                      ...prev,
                      [`avoid-${item}`]: e.target.checked,
                    }))
                  }
                />
                <XCircle
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-rose-700"
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function BoardImage({
  media,
  priority,
  objectPosition,
}: {
  media: WorkshopMedia
  priority?: boolean
  objectPosition?: string
}) {
  const [zoomed, setZoomed] = useState(false)
  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-indigo-200 bg-slate-100">
        <div
          className="relative w-full"
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
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition:
                objectPosition ?? media.objectPosition ?? 'center',
            }}
          />
          <RegionPins media={media} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-indigo-100 bg-white/95 px-3 py-2.5">
          <EvidenceLabel status={media.productionStatus} />
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 text-xs font-medium text-indigo-950 hover:bg-indigo-50 md:text-sm"
          >
            <Maximize2 aria-hidden className="h-3.5 w-3.5" />
            Zoom
          </button>
        </div>
      </div>
      <ZoomDialog media={media} open={zoomed} onClose={() => setZoomed(false)} />
    </>
  )
}

function CalloutRail({ media }: { media: WorkshopMedia }) {
  return (
    <aside className="space-y-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-white p-4 md:p-5 lg:sticky lg:top-6">
      {media.prompt ? (
        <div>
          <p className={cn(weType.meta, 'text-indigo-900')}>Technique question</p>
          <p className={cn(weType.body, 'mt-2 text-slate-800')}>{media.prompt}</p>
        </div>
      ) : null}
      {media.longDescription ? (
        <p className={cn(weType.label, 'text-slate-600')}>{media.longDescription}</p>
      ) : null}
      {media.regions?.length ? (
        <div>
          <p className={cn(weType.meta, 'text-indigo-900')}>Callouts</p>
          <ul className="mt-2 space-y-2">
            {media.regions.map((r) => (
              <li key={r.id} className={cn(weType.body, 'text-slate-800')}>
                <span className="font-medium text-indigo-950">{r.label}.</span>{' '}
                {r.note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {media.doAvoid ? <DoAvoidPanel doAvoid={media.doAvoid} /> : null}
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
        <p className={cn(weType.meta, 'text-slate-600')}>Verified photo / screenshot</p>
        {media.verifiedSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.verifiedSrc}
            alt=""
            className="mt-2 h-auto w-full rounded-md object-cover"
          />
        ) : (
          <p className={cn(weType.label, 'mt-2 flex items-center gap-2 text-slate-500')}>
            <Camera aria-hidden className="h-4 w-4" />
            Slot reserved for venue-verified asset
          </p>
        )}
      </div>
    </aside>
  )
}

function MobilePanelSequence({ media }: { media: WorkshopMedia }) {
  const panels = media.panelCrops
  const [index, setIndex] = useState(0)
  if (!panels?.length) {
    return <BoardImage media={media} />
  }
  const panel = panels[index] ?? panels[0]
  return (
    <div className="space-y-3 lg:hidden">
      <BoardImage
        media={media}
        objectPosition={panel.objectPosition}
      />
      <p className={cn(weType.body, 'text-slate-800')}>
        <span className="font-medium text-indigo-950">{panel.label}.</span>{' '}
        {panel.prompt}
      </p>
      <div className="flex flex-wrap gap-2">
        {panels.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              'min-h-11 rounded-lg border px-3 text-sm',
              i === index
                ? 'border-indigo-900 bg-indigo-900 text-white'
                : 'border-slate-300 bg-white'
            )}
          >
            {i + 1}. {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SingleBoardView({
  media,
  priority,
}: {
  media: WorkshopMedia
  priority?: boolean
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-6 xl:gap-8">
      <div className="min-w-0 lg:col-span-8 xl:col-span-8 2xl:col-span-8">
        <div className="hidden lg:block">
          <BoardImage media={media} priority={priority} />
        </div>
        <MobilePanelSequence media={media} />
      </div>
      <div className="min-w-0 lg:col-span-4">
        <CalloutRail media={media} />
      </div>
    </div>
  )
}

/**
 * Generic interactive technique board — curriculum supplies metadata.
 * Layouts: primary | tabs | guided-sequence | pair | prep-next.
 */
export function TechniqueBoard({
  block,
  className,
}: {
  block: ModuleTechniqueBoards
  className?: string
}) {
  const [active, setActive] = useState(0)
  const boards = block.boards
  const current = boards[Math.min(active, boards.length - 1)]
  const showStepper =
    block.layout === 'tabs' ||
    block.layout === 'guided-sequence' ||
    block.layout === 'pair' ||
    block.layout === 'prep-next'

  const stepLabel = (i: number) => {
    if (block.pairLabels && boards.length === 2) return block.pairLabels[i] ?? `Board ${i + 1}`
    return boards[i]?.caption ?? `Step ${i + 1}`
  }

  return (
    <section
      className={cn(
        'mx-auto w-full max-w-3xl space-y-4 md:max-w-4xl lg:max-w-6xl xl:max-w-[1500px] 2xl:max-w-[1700px]',
        weSpace.cardPad,
        'rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-white',
        className
      )}
    >
      <header className="space-y-2">
        <p className={cn(weType.meta, 'text-indigo-900')}>Technique board</p>
        <h2 className={cn(weType.section)}>{block.title}</h2>
        {block.intro ? (
          <p className={cn(weType.body, 'max-w-[70ch] text-slate-700')}>{block.intro}</p>
        ) : null}
      </header>

      {showStepper && boards.length > 1 ? (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={block.title}>
          {boards.map((b, i) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                'min-h-11 rounded-lg border px-3 text-sm font-medium md:px-4 md:text-base',
                i === active
                  ? 'border-indigo-900 bg-indigo-900 text-white'
                  : 'border-indigo-200 bg-white text-indigo-950 hover:bg-indigo-50'
              )}
            >
              {block.layout === 'guided-sequence' ? `${i + 1}. ` : null}
              {stepLabel(i)}
            </button>
          ))}
        </div>
      ) : null}

      {current ? <SingleBoardView media={current} priority={active === 0} /> : null}

      {block.safetyNote ? (
        <p className={cn(weType.label, 'rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950')}>
          {block.safetyNote}
        </p>
      ) : null}
    </section>
  )
}

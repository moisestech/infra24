import type {
  BookletReferenceStatus,
  ModuleBanner as ModuleBannerMeta,
  SafetyLevel,
} from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'
import {
  getModuleIdentity,
  ModuleIcon,
  ModulePhaseChip,
} from '@/components/workshop-engine/WorkshopVisuals'
import { ModuleBanner } from '@/components/workshop-engine/ModuleBanner'
import {
  weIconBox,
  weSpace,
  weTouch,
  weType,
} from '@/components/workshop-engine/responsive'
import {
  bookletDownloadHref,
  bookletReferenceAriaLabel,
  formatLogicalPageLabel,
} from '@/lib/workshop-engine/resin-printing/booklet'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Link2Off,
  ShieldAlert,
  Target,
} from 'lucide-react'

export function ModuleHeader({
  order,
  moduleId,
  title,
  estimatedMinutes,
  liveLabel,
  safetyLevel,
  banner,
  bannerPriority = false,
}: {
  order: number
  moduleId: string
  title: string
  estimatedMinutes: number
  liveLabel?: string
  safetyLevel?: SafetyLevel
  banner?: ModuleBannerMeta
  bannerPriority?: boolean
}) {
  const identity = getModuleIdentity(moduleId)

  const meta = (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        weType.meta,
        'normal-case tracking-wide',
        banner ? 'text-slate-700' : 'text-slate-600'
      )}
    >
      <ModulePhaseChip moduleId={moduleId} />
      <span className="uppercase tracking-[0.12em]">
        Module {String(order).padStart(2, '0')}
      </span>
      <span aria-hidden>·</span>
      <span>{estimatedMinutes} min</span>
      {safetyLevel === 'required' ? (
        <>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.12em] text-amber-900">
            <ShieldAlert aria-hidden className="h-3.5 w-3.5" />
            Safety required
          </span>
        </>
      ) : null}
      {liveLabel ? (
        <>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
            <CheckCircle2 aria-hidden className="h-3.5 w-3.5" />
            {liveLabel}
          </span>
        </>
      ) : null}
    </div>
  )

  if (banner) {
    return (
      <ModuleBanner
        banner={banner}
        priority={bannerPriority}
        decorative
        washClassName={identity.bannerWash}
      >
        <div className="flex items-start gap-3 md:gap-4">
          <ModuleIcon moduleId={moduleId} className={weIconBox.lg} />
          <div className="min-w-0 flex-1 space-y-2 md:space-y-3">
            {meta}
            <h1 className={cn(weType.title, 'text-slate-950')}>{title}</h1>
          </div>
        </div>
      </ModuleBanner>
    )
  }

  return (
    <header
      className={cn(
        'overflow-hidden rounded-2xl border bg-gradient-to-br',
        weSpace.headerPad,
        identity.border,
        identity.gradient
      )}
    >
      <div className="flex items-start gap-3 md:gap-4 2xl:gap-5">
        <ModuleIcon moduleId={moduleId} className={weIconBox.lg} />
        <div className="min-w-0 flex-1 space-y-2 md:space-y-3">
          {meta}
          <h1 className={weType.title}>{title}</h1>
        </div>
      </div>
    </header>
  )
}

export function LearningPromise({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={cn(
        'flex gap-3 rounded-xl border border-cyan-200 bg-cyan-50/60 text-cyan-950',
        weSpace.cardPad,
        weType.body
      )}
    >
      <Target
        aria-hidden
        className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700 md:h-6 md:w-6 2xl:h-7 2xl:w-7"
      />
      <span>
        <span className="font-semibold text-slate-950">Promise: </span>
        {children}
      </span>
    </p>
  )
}

export function BookletReference({
  sectionTitle,
  startPage,
  endPage,
  mappingPending,
  status,
  note,
  pagePreviewHref,
  href,
}: {
  sectionTitle: string
  startPage?: number
  endPage?: number
  mappingPending?: boolean
  status?: BookletReferenceStatus
  note?: string
  pagePreviewHref?: string
  href?: string
}) {
  const resolvedStatus: BookletReferenceStatus =
    status ?? (mappingPending || typeof startPage !== 'number' ? 'missing' : 'verified')
  const pages = formatLogicalPageLabel(startPage, endPage)
  const downloadHref = href ?? bookletDownloadHref()
  const aria = bookletReferenceAriaLabel({
    bookletId: 'ref',
    sectionTitle,
    startPage,
    endPage,
    status: resolvedStatus,
  })
  const statusLabel =
    resolvedStatus === 'verified'
      ? 'Verified'
      : resolvedStatus === 'related'
        ? 'Related'
        : 'Unavailable'
  const statusClass =
    resolvedStatus === 'verified'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : resolvedStatus === 'related'
        ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
        : 'border-amber-200 bg-amber-50 text-amber-950'

  const body = (
    <>
      <span
        className={cn(
          'relative flex aspect-[4/3] w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-28',
        )}
      >
        {pagePreviewHref && resolvedStatus !== 'missing' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pagePreviewHref}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <Link2Off aria-hidden className="h-5 w-5 text-slate-400" />
        )}
        {pages ? (
          <span className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {pages}
          </span>
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-950">{sectionTitle}</span>
          <span
            className={cn(
              'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
              statusClass,
            )}
          >
            {statusLabel}
          </span>
        </span>
        {pages ? (
          <span className="mt-1 block text-slate-600">Booklet {pages}</span>
        ) : null}
        {note ? (
          <span className="mt-1 block text-xs text-slate-600 md:text-sm">{note}</span>
        ) : null}
        {resolvedStatus === 'missing' ? (
          <span className="mt-1 block text-xs text-amber-800 md:text-sm">
            Page unavailable in this export
          </span>
        ) : null}
      </span>
    </>
  )

  if (resolvedStatus === 'missing') {
    return (
      <div
        className={cn(
          'flex gap-3 rounded-xl border border-dashed border-slate-300 bg-white text-slate-700',
          weSpace.cardPad,
          weType.body,
        )}
      >
        {body}
      </div>
    )
  }

  return (
    <a
      href={downloadHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      className={cn(
        weTouch.button,
        'h-auto w-full justify-start gap-3 rounded-xl border border-dashed border-slate-300 bg-white text-left text-slate-700 transition hover:border-slate-500',
        weSpace.cardPad,
        weType.body,
      )}
    >
      <BookOpen
        aria-hidden
        className="mt-0.5 hidden h-5 w-5 shrink-0 text-slate-600 sm:block md:h-6 md:w-6"
      />
      {body}
    </a>
  )
}

export function FacilitatorCue({ notes }: { notes: string[] }) {
  if (!notes.length) return null
  return (
    <aside
      className={cn(
        'rounded-xl border border-sky-200 bg-sky-50 text-sky-950',
        weSpace.cardPad,
        weType.body
      )}
    >
      <p className="inline-flex items-center gap-2 font-semibold">
        <ClipboardList aria-hidden className="h-4 w-4 md:h-5 md:w-5" />
        Facilitator cues
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </aside>
  )
}

export function SafetyBanner({
  note,
  required,
}: {
  note: string
  required?: boolean
}) {
  return (
    <div
      role="note"
      className={cn(
        'flex gap-3 rounded-xl border',
        weSpace.cardPad,
        weType.body,
        required
          ? 'border-amber-400 bg-amber-50 text-amber-950'
          : 'border-slate-300 bg-slate-100 text-slate-800'
      )}
    >
      {required ? (
        <ShieldAlert
          aria-hidden
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-800 md:h-6 md:w-6"
        />
      ) : (
        <AlertTriangle
          aria-hidden
          className="mt-0.5 h-5 w-5 shrink-0 text-slate-600 md:h-6 md:w-6"
        />
      )}
      <div>
        <p className="font-semibold">
          {required ? 'Safety (required)' : 'Safety note'}
        </p>
        <p className="mt-1">{note}</p>
      </div>
    </div>
  )
}

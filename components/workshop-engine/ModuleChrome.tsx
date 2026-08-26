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
  CheckCircle2,
  ClipboardList,
  GitBranch,
  Link2Off,
  ShieldAlert,
  Target,
  type LucideIcon,
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

const BOOKLET_STATUS_UI: Record<
  BookletReferenceStatus,
  {
    label: string
    Icon: LucideIcon
    card: string
    pill: string
    iconWrap: string
    borderStyle: string
  }
> = {
  verified: {
    label: 'Verified',
    Icon: CheckCircle2,
    card: 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-white text-emerald-950',
    pill: 'border-emerald-300 bg-emerald-100 text-emerald-950',
    iconWrap: 'bg-emerald-700 text-white',
    borderStyle: 'border-solid',
  },
  related: {
    label: 'Related',
    Icon: GitBranch,
    card: 'border-indigo-300 bg-gradient-to-br from-indigo-50 via-violet-50/40 to-white text-indigo-950',
    pill: 'border-indigo-300 bg-indigo-100 text-indigo-950',
    iconWrap: 'bg-indigo-700 text-white',
    borderStyle: 'border-solid',
  },
  missing: {
    label: 'Unavailable',
    Icon: AlertTriangle,
    card: 'border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50/30 to-white text-amber-950',
    pill: 'border-amber-300 bg-amber-100 text-amber-950',
    iconWrap: 'bg-amber-500 text-amber-950',
    borderStyle: 'border-dashed',
  },
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
  moduleId,
}: {
  sectionTitle: string
  startPage?: number
  endPage?: number
  mappingPending?: boolean
  status?: BookletReferenceStatus
  note?: string
  pagePreviewHref?: string
  href?: string
  /** When set, left accent / module chip uses that module’s color token. */
  moduleId?: string
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
  const ui = BOOKLET_STATUS_UI[resolvedStatus]
  const StatusIcon = ui.Icon
  const identity = moduleId ? getModuleIdentity(moduleId) : null

  const body = (
    <>
      <span
        className={cn(
          'relative flex aspect-[4/3] w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white/80 sm:w-28 md:w-32 portrait-tv:w-36',
          identity?.border ?? 'border-slate-200'
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
          <Link2Off aria-hidden className="h-5 w-5 text-slate-400 md:h-6 md:w-6" />
        )}
        {pages ? (
          <span className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-medium text-white md:text-xs portrait-tv:text-sm">
            {pages}
          </span>
        ) : null}
      </span>
      <span className="min-w-0 flex-1 space-y-1.5">
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full md:h-8 md:w-8 portrait-tv:h-10 portrait-tv:w-10',
              ui.iconWrap
            )}
          >
            <StatusIcon aria-hidden className="h-3.5 w-3.5 md:h-4 md:w-4 portrait-tv:h-5 portrait-tv:w-5" />
          </span>
          <span
            className={cn(
              'font-semibold text-slate-950',
              'text-base md:text-lg portrait-tv:text-2xl'
            )}
          >
            {sectionTitle}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide md:text-[11px] portrait-tv:px-3 portrait-tv:py-1 portrait-tv:text-sm',
              ui.pill
            )}
          >
            {ui.label}
          </span>
        </span>
        {pages ? (
          <span className="block text-sm text-slate-600 md:text-base portrait-tv:text-xl">
            Booklet {pages}
          </span>
        ) : null}
        {note ? (
          <span className="block text-xs text-slate-600 md:text-sm portrait-tv:text-lg">
            {note}
          </span>
        ) : null}
        {resolvedStatus === 'missing' ? (
          <span className="block text-xs text-amber-800 md:text-sm portrait-tv:text-lg">
            Page unavailable in this export
          </span>
        ) : null}
      </span>
    </>
  )

  const shellClass = cn(
    'relative flex h-auto w-full justify-start gap-3 overflow-hidden rounded-xl text-left transition',
    weSpace.cardPad,
    weType.body,
    ui.borderStyle,
    ui.card,
    'border',
    identity ? 'pl-4 md:pl-5' : null
  )

  const accent =
    identity != null ? (
      <span aria-hidden className={cn('absolute inset-y-0 left-0 w-1.5', identity.icon)} />
    ) : null

  if (resolvedStatus === 'missing') {
    return (
      <div className={shellClass} role="group" aria-label={aria}>
        {accent}
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
        shellClass,
        'hover:brightness-[0.98] hover:shadow-sm'
      )}
    >
      {accent}
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

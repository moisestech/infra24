import type { SafetyLevel } from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'
import {
  getModuleIdentity,
  ModuleIcon,
  ModulePhaseChip,
} from '@/components/workshop-engine/WorkshopVisuals'
import {
  weIconBox,
  weSpace,
  weType,
} from '@/components/workshop-engine/responsive'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
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
}: {
  order: number
  moduleId: string
  title: string
  estimatedMinutes: number
  liveLabel?: string
  safetyLevel?: SafetyLevel
}) {
  const identity = getModuleIdentity(moduleId)
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
          <div
            className={cn(
              'flex flex-wrap items-center gap-2',
              weType.meta,
              'normal-case tracking-wide text-slate-600'
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
  href = '/workshop/resin-printing/booklet',
}: {
  sectionTitle: string
  startPage?: number
  endPage?: number
  mappingPending?: boolean
  href?: string
}) {
  const pages =
    typeof startPage === 'number'
      ? endPage && endPage !== startPage
        ? `pp. ${startPage}–${endPage}`
        : `p. ${startPage}`
      : null

  return (
    <a
      href={href}
      className={cn(
        'flex gap-3 rounded-xl border border-dashed border-slate-300 bg-white text-slate-700 transition hover:border-slate-500',
        weSpace.cardPad,
        weType.body
      )}
    >
      <BookOpen
        aria-hidden
        className="mt-0.5 h-5 w-5 shrink-0 text-slate-600 md:h-6 md:w-6"
      />
      <span>
        <span className="font-semibold text-slate-950">
          Booklet · {sectionTitle}
        </span>
        {pages ? <span className="text-slate-500"> — {pages}</span> : null}
        {mappingPending || !pages ? (
          <span className="mt-1 block text-xs text-amber-800 md:text-sm">
            Page mapping pending
          </span>
        ) : null}
      </span>
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

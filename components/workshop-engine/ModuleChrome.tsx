import type { SafetyLevel } from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'

export function ModuleHeader({
  order,
  title,
  estimatedMinutes,
  liveLabel,
  safetyLevel,
}: {
  order: number
  title: string
  estimatedMinutes: number
  liveLabel?: string
  safetyLevel?: SafetyLevel
}) {
  return (
    <header className="space-y-2 border-b border-neutral-200 pb-4">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
        <span>Module {String(order).padStart(2, '0')}</span>
        <span aria-hidden>·</span>
        <span>{estimatedMinutes} min</span>
        {safetyLevel === 'required' ? (
          <>
            <span aria-hidden>·</span>
            <span className="text-amber-800">Safety required</span>
          </>
        ) : null}
        {liveLabel ? (
          <>
            <span aria-hidden>·</span>
            <span className="text-emerald-800">{liveLabel}</span>
          </>
        ) : null}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">{title}</h1>
    </header>
  )
}

export function LearningPromise({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-800">
      <span className="font-medium text-neutral-950">Promise: </span>
      {children}
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
      className="block rounded-md border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-700 hover:border-neutral-500"
    >
      <span className="font-medium text-neutral-950">Booklet · {sectionTitle}</span>
      {pages ? <span className="text-neutral-500"> — {pages}</span> : null}
      {mappingPending || !pages ? (
        <span className="mt-1 block text-xs text-amber-800">Page mapping pending</span>
      ) : null}
    </a>
  )
}

export function FacilitatorCue({ notes }: { notes: string[] }) {
  if (!notes.length) return null
  return (
    <aside className="rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
      <p className="font-medium">Facilitator cues</p>
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
        'rounded-md border px-4 py-3 text-sm',
        required
          ? 'border-amber-400 bg-amber-50 text-amber-950'
          : 'border-neutral-300 bg-neutral-100 text-neutral-800'
      )}
    >
      <p className="font-medium">{required ? 'Safety (required)' : 'Safety note'}</p>
      <p className="mt-1">{note}</p>
    </div>
  )
}

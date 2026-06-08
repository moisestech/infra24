import type { ProgrammingRecordStatus } from '@/lib/memory-agent/knowledge-record'

const STATUS_LABELS: Record<ProgrammingRecordStatus, string> = {
  draft: 'Draft',
  coming_soon: 'Coming soon',
  on_view: 'On view',
  published: 'Published',
  canceled: 'Canceled',
  archived: 'Archived',
}

function parseDateOnly(iso?: string | null): Date | null {
  if (!iso?.trim()) return null
  const d = new Date(iso.trim())
  return Number.isNaN(d.getTime()) ? null : d
}

function formatDateOnly(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Exhibition-friendly range: Jul 8 – Oct 4, 2026 (no misleading midnight times). */
export function formatProgrammingDateRange(
  startsAt?: string | null,
  endsAt?: string | null
): string | null {
  const start = parseDateOnly(startsAt)
  const end = parseDateOnly(endsAt)
  if (!start && !end) return null

  if (start && end) {
    const sameYear = start.getFullYear() === end.getFullYear()
    const startStr = start.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      ...(sameYear ? {} : { year: 'numeric' }),
    })
    const endStr = formatDateOnly(end)
    if (startStr === endStr) return endStr
    return `${startStr} – ${endStr}`
  }

  return start ? formatDateOnly(start) : end ? formatDateOnly(end) : null
}

export function programmingStatusLabel(
  status?: ProgrammingRecordStatus | string | null
): string | undefined {
  if (!status) return undefined
  const key = String(status).trim().toLowerCase().replace(/\s+/g, '_') as ProgrammingRecordStatus
  return STATUS_LABELS[key]
}

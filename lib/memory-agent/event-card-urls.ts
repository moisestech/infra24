import type { KnowledgeRecord } from '@/lib/memory-agent/knowledge-record'
import {
  formatProgrammingDateRange,
  programmingStatusLabel,
} from '@/lib/memory-agent/programming-display'
import {
  announcementEditHref,
  workshopAdminHref,
} from '@/lib/memory-agent/data-gap-actions'
import type { MemoryAgentEventCard, MemoryAgentMode } from '@/types/memory-agent'

function isBookableKind(record: KnowledgeRecord): boolean {
  return record.recordKind === 'workshop' || record.recordKind === 'bookable_event'
}

function recordAllowsPublicActions(record: KnowledgeRecord, mode: MemoryAgentMode): boolean {
  if (record.eventState === 'canceled') return false
  if (mode === 'staff_operator') return true
  if (record.doNotUseInAi === true) return false
  if (record.approvedForPublicAi === false) return false
  if (record.visibility === 'internal') return false
  const expires = record.expiresAt ? Date.parse(record.expiresAt) : NaN
  if (Number.isFinite(expires) && expires < Date.now()) return false
  return true
}

function resolveEditUrl(orgSlug: string, record: KnowledgeRecord): string | undefined {
  if (record.source === 'soho_record' || record.source === 'airtable_programming') return undefined
  if (record.source === 'announcement') {
    return announcementEditHref(orgSlug, record.sourceRecordId)
  }
  if (record.source === 'workshop') {
    const workshopId = record.id.split(':')[1]
    if (workshopId) return workshopAdminHref(orgSlug, workshopId)
  }
  return undefined
}

function resolvePublicUrl(record: KnowledgeRecord): string | undefined {
  if (record.primaryLink?.trim() && record.primaryLink.startsWith('http')) {
    return record.primaryLink.trim()
  }
  return record.publicPath?.trim() || undefined
}

/** CTA rules differ by mode; URLs always come from source rows. */
function resolveEventCtaForMode(
  record: KnowledgeRecord,
  mode: MemoryAgentMode
): { ctaLabel?: string; ctaUrl?: string } {
  const bookable = isBookableKind(record)
  const grounded = record.bookingCta?.grounded && record.bookingCta.url?.trim()

  if (mode === 'staff_operator') {
    if (grounded) {
      return {
        ctaLabel: record.bookingCta!.label,
        ctaUrl: record.bookingCta!.url,
      }
    }
    if (bookable && record.rsvpUrl?.trim()) {
      return { ctaLabel: 'RSVP', ctaUrl: record.rsvpUrl.trim() }
    }
    if (record.primaryLink?.trim()) {
      return { ctaLabel: 'More info', ctaUrl: record.primaryLink.trim() }
    }
    return {}
  }

  if (!recordAllowsPublicActions(record, mode)) return {}

  if (bookable) {
    if (grounded) {
      return {
        ctaLabel: record.bookingCta!.label || 'Register',
        ctaUrl: record.bookingCta!.url,
      }
    }
    if (record.rsvpUrl?.trim()) {
      return { ctaLabel: 'RSVP', ctaUrl: record.rsvpUrl.trim() }
    }
  }

  return {}
}

export function formatEventCardSummaryText(event: MemoryAgentEventCard): string {
  const lines = [event.title]
  if (event.statusLabel) lines.push(event.statusLabel)
  if (event.dateLabel) {
    lines.push(event.dateLabel)
  } else if (event.startsAt) {
    const d = new Date(event.startsAt)
    if (!Number.isNaN(d.getTime())) {
      lines.push(
        d.toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      )
    }
  }
  if (event.location) lines.push(event.location)
  if (event.curator) lines.push(`Curated by ${event.curator}`)
  if (event.summary) lines.push(event.summary)
  if (event.publicUrl) lines.push(event.publicUrl)
  return lines.join('\n')
}

export function buildEventCardFields(
  record: KnowledgeRecord,
  mode: MemoryAgentMode,
  orgSlug: string,
  summary?: string
): Omit<MemoryAgentEventCard, 'id' | 'title' | 'recordKind' | 'source'> {
  const cta = resolveEventCtaForMode(record, mode)
  const bookable = isBookableKind(record)
  const allowPublicActions = recordAllowsPublicActions(record, mode)
  const publicSafe =
    mode === 'staff_operator' ? true : allowPublicActions

  return {
    summary,
    startsAt: record.startsAt,
    endsAt: record.endsAt,
    location: record.location,
    ctaLabel: cta.ctaLabel,
    ctaUrl: cta.ctaUrl,
    imageUrl: record.imageUrl,
    tags: record.tags?.slice(0, 8),
    sourceRecordId: record.sourceRecordId,
    editUrl: mode === 'staff_operator' ? resolveEditUrl(orgSlug, record) : undefined,
    publicUrl: resolvePublicUrl(record),
    bookable,
    allowPublicActions,
    publicSafe,
    curator: record.curator,
    featuredArtists: record.featuredArtists,
    status: record.status,
    statusLabel: programmingStatusLabel(record.status),
    dateLabel: formatProgrammingDateRange(record.startsAt, record.endsAt) ?? undefined,
    instructor: record.instructor,
    timeText: record.timeText,
    durationText: record.durationText,
    costText: record.costText,
    capacity: record.capacity,
    ageRequirement: record.ageRequirement,
  }
}

export function toClientEventCards(
  cards: MemoryAgentEventCard[],
  mode: MemoryAgentMode
): MemoryAgentEventCard[] {
  if (mode === 'staff_operator') return cards
  return cards.map(({ editUrl: _edit, ...rest }) => {
    void _edit
    return rest
  })
}

/**
 * Decision A: a PUBLIC artifact derived solely from a delayed, trusted aggregate.
 * Call only from a controlled periodic publisher after reviewing its inputs.
 * Never feed person records, raw emails, member IDs or signup webhooks to this function.
 */
export type PublicPresenceSnapshot = {
  snapshotWeek: string
  verifiedWebsiteMemberPresence: {
    status: 'suppressed' | 'coarsened'
    markCount: number | null
  }
  reportedWhatsAppLowerBound: number | null
  pollSelections: number | null
  countsNotAdditive: true
}
export type SnapshotDecision =
  | { action: 'defer'; reason: 'too_recent' | 'invalid_count' }
  | { action: 'unchanged'; snapshot: PublicPresenceSnapshot }
  | { action: 'publish'; snapshot: PublicPresenceSnapshot }

const MIN_COHORT = 5
const BUCKET = 5
const PUBLICATION_LAG_MS = 7 * 24 * 60 * 60 * 1000

function validCount(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0
}

function isoWeek(utcMs: number): string {
  const d = new Date(utcMs)
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const year = d.getUTCFullYear()
  const yearStart = Date.UTC(year, 0, 1)
  return year + '-W' + String(Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7)).padStart(2, '0')
}

/**
 * Five-member buckets and one-week delay are preliminary engineering guardrails,
 * not a guarantee of anonymization. No real-time endpoint should invoke this.
 */
export function prepareWeeklyPresenceSnapshot(input: {
  verifiedActiveMemberCount: number
  aggregateCutoff: string
  publishAt: string
  reportedWhatsAppLowerBound?: number | null
  pollSelections?: number | null
  lastPublished?: PublicPresenceSnapshot | null
}): SnapshotDecision {
  const { verifiedActiveMemberCount, aggregateCutoff, publishAt, lastPublished } = input
  const cutoffMs = Date.parse(aggregateCutoff)
  const publishMs = Date.parse(publishAt)
  if (!validCount(verifiedActiveMemberCount) ||
      (input.reportedWhatsAppLowerBound != null && !validCount(input.reportedWhatsAppLowerBound)) ||
      (input.pollSelections != null && !validCount(input.pollSelections))) {
    return { action: 'defer', reason: 'invalid_count' }
  }
  if (!Number.isFinite(cutoffMs) || !Number.isFinite(publishMs) ||
      publishMs - cutoffMs < PUBLICATION_LAG_MS) return { action: 'defer', reason: 'too_recent' }

  const week = isoWeek(cutoffMs)
  if (lastPublished && lastPublished.snapshotWeek === week) {
    return { action: 'unchanged', snapshot: lastPublished }
  }
  const marks = verifiedActiveMemberCount >= MIN_COHORT
    ? Math.floor(verifiedActiveMemberCount / BUCKET) * BUCKET : null
  const published: PublicPresenceSnapshot = {
    snapshotWeek: week,
    verifiedWebsiteMemberPresence: {
      status: marks === null ? 'suppressed' : 'coarsened',
      markCount: marks,
    },
    reportedWhatsAppLowerBound: input.reportedWhatsAppLowerBound ?? null,
    pollSelections: input.pollSelections ?? null,
    countsNotAdditive: true,
  }
  return { action: 'publish', snapshot: published }
}

/** Decorative per-batch marks; these IDs are not linked to any member/person. */
export function publicPresenceMarks(snapshot: PublicPresenceSnapshot) {
  const count = snapshot.verifiedWebsiteMemberPresence.markCount ?? 0
  const safeCount = Math.min(1024, count)
  return Array.from({ length: safeCount }, (_, index) => ({
    id: 'aggregate-' + snapshot.snapshotWeek + '-' + index,
    kind: 'anonymous-website-presence' as const,
  }))
}

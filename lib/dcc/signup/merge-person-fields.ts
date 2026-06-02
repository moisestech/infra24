import type { AirtableRecord } from '@/lib/airtable/client'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP } from '@/lib/network-builder/field-map'

const F = DEFAULT_DCC_PEOPLE_FIELD_MAP

const LATEST_TOUCH_KEYS = [
  F.utmSource,
  F.utmMedium,
  F.utmCampaign,
  F.utmContent,
  F.qrCodeId,
  F.landingPage,
  F.referrer,
  F.signupSource,
] as const

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  if (typeof v === 'string' && v.trim()) return [v.trim()]
  return []
}

function asString(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim()
  return undefined
}

export function mergeStringArrays(existing: unknown, incoming: unknown): string[] {
  const merged = new Set([...asStringArray(existing), ...asStringArray(incoming)])
  return Array.from(merged)
}

export function appendAgentNote(existing: unknown, line: string): string {
  const prev = asString(existing)
  const stamp = new Date().toISOString().slice(0, 10)
  const entry = `[${stamp}] ${line}`
  if (!prev) return entry
  if (prev.includes(line)) return prev
  return `${prev}\n${entry}`
}

function keepExistingIfSet(
  out: Record<string, unknown>,
  prev: Record<string, unknown>,
  field: string
): void {
  if (asString(prev[field])) delete out[field]
}

/** Merge new signup fields into an existing People record (dedupe-safe). */
export function mergeSignupIntoExistingPerson(
  existing: AirtableRecord,
  incoming: Record<string, unknown>,
  meta: { signupSource?: string; signupSourceLabel?: string; utmCampaign?: string }
): Record<string, unknown> {
  const prev = existing.fields
  const out: Record<string, unknown> = { ...incoming }

  keepExistingIfSet(out, prev, F.name)
  keepExistingIfSet(out, prev, F.contactCategory)
  keepExistingIfSet(out, prev, F.city)
  keepExistingIfSet(out, prev, F.institution)
  keepExistingIfSet(out, prev, F.digitalOrientationStatement)

  out[F.practiceTags] = mergeStringArrays(prev[F.practiceTags], incoming[F.practiceTags])
  out[F.interestTags] = mergeStringArrays(prev[F.interestTags], incoming[F.interestTags])

  for (const key of LATEST_TOUCH_KEYS) {
    if (incoming[key] !== undefined && incoming[key] !== null && incoming[key] !== '') {
      out[key] = incoming[key]
    }
  }

  const sourceLine = [
    meta.signupSourceLabel
      ? `Signup Source=${meta.signupSourceLabel}`
      : meta.signupSource
        ? `source=${meta.signupSource}`
        : null,
    meta.utmCampaign ? `utm_campaign=${meta.utmCampaign}` : null,
  ]
    .filter(Boolean)
    .join(', ')

  if (sourceLine) {
    out[F.agentNotes] = appendAgentNote(
      prev[F.agentNotes] ?? incoming[F.agentNotes],
      `Signup resubmit (${sourceLine})`
    )
  }

  out[F.signupSubmittedAt] = incoming[F.signupSubmittedAt]

  return out
}

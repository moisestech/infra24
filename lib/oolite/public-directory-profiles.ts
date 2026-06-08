import 'server-only'

import { parseAdditionalImageUrls } from '@/lib/airtable/alumni-images'
import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'
import { isStaffOperatorMode } from '@/lib/memory-agent/mode'
import type { MemoryAgentMode } from '@/types/memory-agent'
import {
  OOLITE_AIRTABLE_BASE_ID,
  OOLITE_PUBLIC_DIRECTORY_TABLE,
} from '@/lib/oolite/airtable-recognitions-config'

export type OolitePublicDirectoryProfile = {
  recordId: string
  displayName: string
  nameKey: string
  publicBio?: string
  shortAiSummary?: string
  featuredImageUrl?: string
  portraitVerticalUrl?: string
  portraitLandscapeUrl?: string
  additionalImageUrls: string[]
  topics: string[]
  themes: string[]
  primaryMedium?: string
  additionalMediums: string[]
  studioNumber?: string
  residencyCategory?: string
  residencyProgram?: string
  websiteUrl?: string
  instagramUrl?: string
  imageAltText?: string
  publiclyApproved: boolean
  doNotUseInAi: boolean
}

const f = OOLITE_PUBLIC_DIRECTORY_TABLE.fields

function cellStr(fields: Record<string, unknown>, fieldId: string): string | undefined {
  const raw = fields[fieldId]
  if (raw == null) return undefined
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length ? t : undefined
  }
  if (typeof raw === 'number' && !Number.isNaN(raw)) return String(raw)
  return undefined
}

function cellBool(fields: Record<string, unknown>, fieldId: string): boolean {
  const raw = fields[fieldId]
  if (raw === true) return true
  if (typeof raw === 'string') {
    const t = raw.trim().toLowerCase()
    return ['yes', 'true', '1', 'y', 'checked'].includes(t)
  }
  return false
}

function cellMultiSelect(fields: Record<string, unknown>, fieldId: string): string[] {
  const raw = fields[fieldId]
  if (!Array.isArray(raw)) return []
  return raw
    .map((v) => (typeof v === 'string' ? v.trim() : String(v)))
    .filter(Boolean)
}

function mapPublicDirectoryRecord(record: AirtableRecord): OolitePublicDirectoryProfile | null {
  const fields = record.fields
  const displayName = cellStr(fields, f.displayName)
  if (!displayName) return null

  const nameKey = cellStr(fields, f.nameKey) || displayName.toLowerCase()
  const additionalRaw = cellStr(fields, f.additionalImageUrls)

  return {
    recordId: record.id,
    displayName,
    nameKey: nameKey.toLowerCase(),
    publicBio: cellStr(fields, f.publicBio),
    shortAiSummary: cellStr(fields, f.shortAiSummary),
    featuredImageUrl: cellStr(fields, f.featuredImageUrl),
    portraitVerticalUrl: cellStr(fields, f.portraitVerticalUrl),
    portraitLandscapeUrl: cellStr(fields, f.portraitLandscapeUrl),
    additionalImageUrls: parseAdditionalImageUrls(additionalRaw),
    topics: cellMultiSelect(fields, f.topics),
    themes: cellMultiSelect(fields, f.themes),
    primaryMedium: cellStr(fields, f.primaryMedium),
    additionalMediums: cellMultiSelect(fields, f.additionalMediums),
    studioNumber: cellStr(fields, f.studioNumber),
    residencyCategory: cellStr(fields, f.residencyCategory),
    residencyProgram: cellStr(fields, f.residencyProgram),
    websiteUrl: cellStr(fields, f.websiteUrl),
    instagramUrl: cellStr(fields, f.instagramUrl),
    imageAltText: cellStr(fields, f.imageAltText),
    publiclyApproved: cellBool(fields, f.publicProfileApproved),
    doNotUseInAi: cellBool(fields, f.doNotUseInAi),
  }
}

export function publicDirectoryProfilePassesGovernance(
  profile: Pick<OolitePublicDirectoryProfile, 'publiclyApproved' | 'doNotUseInAi'>,
  mode: MemoryAgentMode
): boolean {
  if (profile.doNotUseInAi) return false
  if (isStaffOperatorMode(mode)) return true
  return profile.publiclyApproved
}

let cachedProfiles: OolitePublicDirectoryProfile[] | null = null
let cacheAt = 0
const CACHE_MS = 60_000

export async function fetchOolitePublicDirectoryProfiles(): Promise<
  | { ok: true; profiles: OolitePublicDirectoryProfile[] }
  | { ok: false; message: string }
> {
  const conn = getAlumniConnectionForOrg('oolite')
  if (!conn?.apiKey) {
    return { ok: false, message: 'Oolite Airtable is not configured.' }
  }

  const now = Date.now()
  if (cachedProfiles && now - cacheAt < CACHE_MS) {
    return { ok: true, profiles: cachedProfiles }
  }

  try {
    const records = await fetchAllRecords(
      OOLITE_AIRTABLE_BASE_ID,
      OOLITE_PUBLIC_DIRECTORY_TABLE.id,
      conn.apiKey,
      { returnFieldsByFieldId: true }
    )
    const profiles = records
      .map(mapPublicDirectoryRecord)
      .filter(Boolean) as OolitePublicDirectoryProfile[]
    cachedProfiles = profiles
    cacheAt = now
    return { ok: true, profiles }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, message }
  }
}

export async function fetchOolitePublicDirectoryProfileById(
  recordId: string
): Promise<OolitePublicDirectoryProfile | null> {
  const fetched = await fetchOolitePublicDirectoryProfiles()
  if (!fetched.ok) return null
  return fetched.profiles.find((p) => p.recordId === recordId) ?? null
}

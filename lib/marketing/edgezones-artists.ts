import { fetchAllRecords, isAirtableConnectionConfigured, type AirtableRecord } from '@/lib/airtable/client'
import { DEFAULT_SEED_CANDIDATES_FIELD_MAP } from '@/lib/network-builder/seed-candidates-field-map'
import {
  isDemoReadinessExcluded,
  isHiddenGraphLayer,
  nodePriorityScale,
} from '@/lib/network-builder/demo-select-options'

const F = DEFAULT_SEED_CANDIDATES_FIELD_MAP

export type EdgeZonesArtistProfile = {
  id: string
  name: string
  instagram?: string
  website?: string
  bio?: string
  imageUrl?: string
  roleType?: string
  practiceTags: string[]
  program?: string
  sourceUrl?: string
}

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

function asString(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim()
  return undefined
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string') as string[]
  if (typeof v === 'string' && v.trim()) {
    return v
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

function linkedIds(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string') as string[]
  if (typeof v === 'string' && v.startsWith('rec')) return [v]
  return []
}

function normalizeInstagram(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('http')) return trimmed
  const handle = trimmed.replace(/^@/, '')
  return `https://instagram.com/${handle}`
}

function normalizeWebsite(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('http')) return trimmed
  return `https://${trimmed}`
}

function mapSeedToProfile(record: AirtableRecord): EdgeZonesArtistProfile | null {
  const fields = record.fields
  const name = asString(fields[F.candidateName])
  if (!name) return null

  const practiceTags = [
    ...asStringArray(fields[F.suggestedPracticeTags]),
    ...asStringArray(fields[F.suggestedInterestTags]),
  ]

  return {
    id: record.id,
    name,
    instagram: normalizeInstagram(asString(fields[F.instagram])),
    website: normalizeWebsite(asString(fields[F.website])),
    bio:
      asString(fields[F.publicNodeSummary]) ??
      asString(fields[F.whyDccFit]) ??
      asString(fields[F.digitalOrientationSignal]),
    imageUrl: asString(fields[F.imagePortraitUrl]),
    roleType: asString(fields[F.roleType]),
    practiceTags: [...new Set(practiceTags)].slice(0, 6),
    program: asString(fields[F.relevantExhibitionProgram]),
    sourceUrl: asString(fields[F.sourceUrl]),
  }
}

export function edgeZonesSeedMatches(record: AirtableRecord, campaignId?: string): boolean {
  const fields = record.fields

  if (campaignId) {
    const related = linkedIds(fields[F.relatedCampaign])
    if (related.includes(campaignId)) return true
  }

  const program = asString(fields[F.relevantExhibitionProgram])?.toLowerCase() ?? ''
  if (program.includes('edge zones') || program.includes('edgezones')) return true

  const institution = asString(fields[F.institutionSource])?.toLowerCase() ?? ''
  if (institution.includes('edge zones') || institution.includes('edgezones')) return true

  const tags = [
    ...asStringArray(fields[F.suggestedPracticeTags]),
    ...asStringArray(fields[F.suggestedInterestTags]),
  ]
    .join(' ')
    .toLowerCase()
  if (tags.includes('edge zones') || tags.includes('edgezones')) return true

  return false
}

function isPublicPortalEligible(record: AirtableRecord): boolean {
  const fields = record.fields
  if (isDemoReadinessExcluded(asString(fields[F.demoReadiness]))) return false
  if (isHiddenGraphLayer(asString(fields[F.graphLayer]))) return false
  return true
}

function sortProfiles(a: EdgeZonesArtistProfile, b: EdgeZonesArtistProfile, records: Map<string, AirtableRecord>): number {
  const ra = records.get(a.id)
  const rb = records.get(b.id)
  const pa = nodePriorityScale(asString(ra?.fields[F.nodePriority]))
  const pb = nodePriorityScale(asString(rb?.fields[F.nodePriority]))
  if (pa !== pb) return pb - pa
  return a.name.localeCompare(b.name)
}

export type EdgeZonesArtistsResult = {
  artists: EdgeZonesArtistProfile[]
  source: 'airtable' | 'none'
  filterNote?: string
}

/**
 * Seed Candidates scoped to Edge Zones (campaign id, dedicated view, or program text match).
 */
export async function fetchEdgeZonesArtists(): Promise<EdgeZonesArtistsResult> {
  const apiKey = env('AIRTABLE_DCC_CRM_API_KEY')
  const baseId = env('AIRTABLE_DCC_CRM_BASE_ID')
  const tableId = env('AIRTABLE_DCC_CRM_TABLE_SEED_CANDIDATES')
  const campaignId = env('AIRTABLE_DCC_CRM_CAMPAIGN_EDGE_ZONES_ID')
  const viewId = env('AIRTABLE_DCC_CRM_VIEW_SEED_EDGE_ZONES')

  if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId })) {
    return { artists: [], source: 'none', filterNote: 'Airtable not configured' }
  }

  const records = await fetchAllRecords(baseId!, tableId!, apiKey!, viewId ? { viewId } : undefined)

  const filtered = records.filter((r) => {
    if (!isPublicPortalEligible(r)) return false
    if (viewId) return true
    return edgeZonesSeedMatches(r, campaignId)
  })

  const recordMap = new Map(filtered.map((r) => [r.id, r]))
  const artists = filtered
    .map(mapSeedToProfile)
    .filter((p): p is EdgeZonesArtistProfile => p !== null)
    .sort((a, b) => sortProfiles(a, b, recordMap))

  return {
    artists,
    source: 'airtable',
    filterNote: viewId
      ? `Airtable view ${viewId}`
      : campaignId
        ? `Related Campaign ${campaignId}`
        : 'Program / institution match: Edge Zones',
  }
}

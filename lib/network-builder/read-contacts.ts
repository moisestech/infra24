import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { CRM_GRAPH_FIELD_MAP } from '@/lib/airtable/crm-graph-field-map'
import type { NetworkBuilderConnection } from '@/lib/network-builder/org-config'
import type { FollowUpCadence, NetworkContact, RelationshipStage } from '@/lib/network-builder/types'

const INTERACTION_FIELDS = CRM_GRAPH_FIELD_MAP.interactions

function asString(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim()
  return undefined
}

function asBoolean(v: unknown): boolean | undefined {
  if (typeof v === 'boolean') return v
  if (v === 'Yes' || v === 'yes') return true
  if (v === 'No' || v === 'no') return false
  return undefined
}

function asTags(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === 'string' ? x.trim() : ''))
      .filter(Boolean)
  }
  const s = asString(v)
  if (!s) return []
  return s.split(/[,;|]/).map((t) => t.trim()).filter(Boolean)
}

function linkedIds(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string') as string[]
  if (typeof v === 'string' && v.startsWith('rec')) return [v]
  return []
}

function warmthToStage(warmth: string | undefined): RelationshipStage {
  const w = (warmth ?? '').toLowerCase()
  if (w.includes('partner') || w.includes('active partner')) return 'partner'
  if (w.includes('active') || w.includes('very warm')) return 'active'
  if (w.includes('warm') || w.includes('aware')) return 'warm'
  if (w.includes('dormant') || w.includes('cold')) return 'dormant'
  return 'new'
}

export function parseFollowUpCadence(raw: string | undefined): FollowUpCadence {
  const s = (raw ?? '').toLowerCase()
  if (s.includes('30')) return '30_days'
  if (s.includes('60')) return '60_days'
  if (s.includes('90')) return '90_days'
  if (s.includes('custom')) return 'custom'
  if (s.includes('pause')) return 'pause'
  if (s.includes('do not contact') || s.includes('dnc')) return 'do_not_contact'
  return 'unknown'
}

function maxDate(...dates: (string | undefined)[]): string | undefined {
  let best: string | undefined
  let bestTs = 0
  for (const d of dates) {
    if (!d) continue
    const ts = Date.parse(d)
    if (!Number.isNaN(ts) && ts > bestTs) {
      bestTs = ts
      best = d
    }
  }
  return best
}

type InteractionIndex = Map<
  string,
  { count: number; lastAt: string | undefined; lastTs: number }
>

function buildInteractionIndex(interactions: AirtableRecord[]): InteractionIndex {
  const index: InteractionIndex = new Map()

  for (const row of interactions) {
    const dateRaw = row.fields[INTERACTION_FIELDS.date]
    const dateStr = asString(dateRaw)
    const ts = dateStr ? Date.parse(dateStr) : 0
    const people = linkedIds(row.fields[INTERACTION_FIELDS.people])

    for (const personId of people) {
      const cur = index.get(personId)
      if (!cur) {
        index.set(personId, { count: 1, lastAt: dateStr, lastTs: ts })
      } else {
        cur.count += 1
        if (ts > cur.lastTs) {
          cur.lastTs = ts
          cur.lastAt = dateStr
        }
      }
    }
  }

  return index
}

function normalizeContact(
  record: AirtableRecord,
  conn: NetworkBuilderConnection,
  interactionIndex: InteractionIndex
): NetworkContact {
  const F = conn.peopleFieldMap
  const fields = record.fields

  const fullName = asString(fields[F.name]) ?? 'Unknown'
  const warmth = asString(fields[F.warmth])
  const titleRole = asString(fields[F.titleRole])
  const contactCategory = asString(fields[F.contactCategory])
  const roleType = titleRole ?? contactCategory
  const interactionMeta = interactionIndex.get(record.id)

  const lastContactDate = asString(fields[F.lastContactDate])
  const lastMeaningfulTouch = asString(fields[F.lastMeaningfulTouch])
  const interactionLastAt = interactionMeta?.lastAt
  const lastRecencyAt = maxDate(lastMeaningfulTouch, lastContactDate, interactionLastAt)
  const interactionCount = interactionMeta?.count ?? linkedIds(fields[F.interactions]).length

  const city = asString(fields[F.city])
  const miami = asBoolean(fields[F.miami])

  return {
    recordId: record.id,
    fullName,
    email: asString(fields[F.email]),
    titleRole,
    roleType,
    contactCategory,
    practiceTags: asTags(fields[F.practiceTags]),
    interestTags: asTags(fields[F.interestTags]),
    location: city ?? (miami ? 'Miami area' : undefined),
    miamiArea: miami,
    organizationAffiliations: linkedIds(fields[F.institution]),
    website: asString(fields[F.website]),
    instagram: asString(fields[F.instagram]),
    linkedin: asString(fields[F.linkedin]),
    warmth,
    relationshipStrength: asString(fields[F.relationshipStrength]),
    relationshipType: asString(fields[F.relationshipType]),
    relationshipStage: warmthToStage(warmth),
    consentStatus: asString(fields[F.consentStatus]),
    dccSignupStatus: asString(fields[F.dccSignupStatus]),
    digitalOrientationStatement: asString(fields[F.digitalOrientationStatement]),
    source: asString(fields[F.source]),
    recordType: asString(fields[F.recordType]),
    canHelpWith: asTags(fields[F.canHelpWith]),
    nextBestAsk: asString(fields[F.nextBestAsk]),
    strategicValue: asString(fields[F.strategicValue]),
    lastContactDate,
    lastMeaningfulTouch,
    lastRecencyAt,
    lastContactedAt: lastRecencyAt,
    nextFollowUpDate: asString(fields[F.nextFollowUpDate]),
    followUpStatus: asString(fields[F.followUpStatus]),
    followUpCadence: parseFollowUpCadence(asString(fields[F.followUpCadence])),
    interactionCount,
    rawFields: fields,
  }
}

export type ReadNetworkContactsResult = {
  contacts: NetworkContact[]
  source: 'airtable'
  observedFieldNames: string[]
}

/** Read normalized contacts from org Airtable CRM. */
export async function readNetworkContacts(
  conn: NetworkBuilderConnection
): Promise<ReadNetworkContactsResult> {
  const peopleOpts = conn.views?.people ? { viewId: conn.views.people } : undefined

  const [people, interactions] = await Promise.all([
    fetchAllRecords(conn.baseId, conn.tables.people, conn.apiKey, peopleOpts),
    conn.tables.interactions
      ? fetchAllRecords(conn.baseId, conn.tables.interactions, conn.apiKey)
      : Promise.resolve([] as AirtableRecord[]),
  ])

  const interactionIndex = buildInteractionIndex(interactions)
  const contacts = people.map((r) => normalizeContact(r, conn, interactionIndex))

  const observed = new Set<string>()
  for (const r of people) {
    Object.keys(r.fields).forEach((k) => observed.add(k))
  }

  return { contacts, source: 'airtable', observedFieldNames: [...observed].sort() }
}

/** Fixture contacts aligned with INFRA24 People semantics. */
export function getFixtureNetworkContacts(): NetworkContact[] {
  return [
    {
      recordId: 'rec_fixture_001',
      fullName: 'Jane Artist',
      email: undefined,
      titleRole: 'Artist',
      roleType: 'Artist',
      contactCategory: 'Artist',
      practiceTags: [],
      interestTags: ['Workshops'],
      location: 'Miami',
      miamiArea: true,
      organizationAffiliations: ['rec_inst_001'],
      warmth: 'Warm',
      relationshipStage: 'warm',
      followUpCadence: '60_days',
      interactionCount: 1,
      lastContactDate: '2026-01-15',
      lastRecencyAt: '2026-01-15',
      lastContactedAt: '2026-01-15',
      canHelpWith: [],
      rawFields: {},
    },
    {
      recordId: 'rec_fixture_002',
      fullName: 'Alex Curator',
      email: 'alex@example.com',
      titleRole: 'Curator',
      roleType: 'Curator',
      contactCategory: 'Curator',
      practiceTags: ['Video', 'Installation'],
      interestTags: ['Public Programs', 'Grants'],
      location: 'Miami',
      miamiArea: true,
      organizationAffiliations: ['rec_inst_002'],
      website: 'https://example.com',
      linkedin: 'https://linkedin.com/in/alex',
      warmth: 'Active',
      relationshipStage: 'active',
      consentStatus: 'Permission to Contact',
      digitalOrientationStatement: 'Works with interactive installations and web-based art.',
      followUpCadence: '30_days',
      interactionCount: 4,
      lastContactDate: '2026-05-01',
      lastMeaningfulTouch: '2026-05-10',
      lastRecencyAt: '2026-05-10',
      lastContactedAt: '2026-05-10',
      canHelpWith: ['Workshops'],
      rawFields: {},
    },
    {
      recordId: 'rec_fixture_003',
      fullName: 'Partner Contact',
      email: 'partner@oolite.org',
      titleRole: 'Institutional partner',
      roleType: 'Institutional partner',
      contactCategory: 'Partner',
      practiceTags: ['Nonprofit'],
      interestTags: ['Labs', 'Infrastructure'],
      organizationAffiliations: ['rec_inst_003'],
      linkedin: 'https://linkedin.com/in/partner',
      warmth: 'Very warm',
      relationshipStage: 'active',
      consentStatus: 'Invited',
      followUpCadence: 'pause',
      interactionCount: 0,
      canHelpWith: [],
      rawFields: {},
    },
    {
      recordId: 'rec_fixture_004',
      fullName: 'Sam Creative Technologist',
      email: 'sam@example.com',
      titleRole: 'Creative Technologist',
      contactCategory: 'Creative Technologist',
      roleType: 'Creative Technologist',
      practiceTags: ['Creative Coding', 'AI Art'],
      interestTags: ['DCC Index', 'Workshops'],
      instagram: '@samcreates',
      digitalOrientationStatement: 'Builds AI tools for live performance.',
      consentStatus: 'Subscribed',
      dccSignupStatus: 'Signed Up',
      warmth: 'Warm',
      relationshipStage: 'warm',
      followUpCadence: '90_days',
      lastMeaningfulTouch: '2026-04-01',
      lastRecencyAt: '2026-04-01',
      lastContactedAt: '2026-04-01',
      miamiArea: true,
      interactionCount: 2,
      canHelpWith: ['Workshops'],
      rawFields: {},
    },
  ]
}

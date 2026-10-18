import { fetchAllRecords } from '@/lib/airtable/client'
import { DCC_CRM_LIVE_BASE_ID, DCC_CRM_LIVE_TABLES, getDccOsConnection } from '@/lib/dcc/os-config'
import { type QuoteSprintEntry } from '@/lib/dcc/fabrication/sprint/quote-sprint'

/** Canonical Jobs & Quotes rows. Heather's closed job and later glass row are context only. */
export const QUOTE_SPRINT_AIRTABLE_JOBS = [
  'recSejBYq324jEpoq',
  'recNEiD7GmiUXgaiV',
  'recgNYcTAfSkE8Cwb',
  'recMxJ2kWFsvreTnq',
  'rec7kiWSEqEINpcNG',
  'rec3P0h2VA234UGRq',
] as const

export const HEATHER_CLOSED_JOB_ID = 'rec7kiWSEqEINpcNG'
export const HEATHER_GLASS_JOB_ID = 'rec3P0h2VA234UGRq'
export const PRODUCTION_JOB_CAP = 3
export const PAYMENT_NOT_CONFIRMED = 'Not confirmed in accounting'

export type SprintLiveJob = {
  recordId: string
  airtableStatus: string
  operatingStage: string
  paymentStatus: typeof PAYMENT_NOT_CONFIRMED
  productionStatus: string
  documentationStatus: string
  blocker: string | null
  budgetRange: string | null
  /** Jobs field Proposal Route. Separate from the commercial Status. */
  proposalRoute: string | null
  /** Jobs field Proposal Release Stage. Draft PR is not payment or acceptance. */
  proposalReleaseStage: string | null
}

export type QuoteSprintLiveRead = {
  available: boolean
  detail: string
  jobs: Record<string, SprintLiveJob>
}

const IN_PRODUCTION = new Set(['Open', 'Claimed', 'Production'])

/** Map a live Jobs & Quotes Status onto the operating sequence. Accepted is not paid. */
export function operatingStageForAirtableStatus(status: string): string {
  switch (status) {
    case 'New Request':
    case 'Needs Info':
      return 'Inquiry'
    case 'Scoping':
      return 'Scoped'
    case 'Quoted':
      return 'Quoted'
    case 'Accepted / Paid':
      return 'Accepted'
    case 'Open for Fabrication':
      return 'Open'
    case 'Claimed / Assigned':
      return 'Claimed'
    case 'Production':
      return 'Production'
    case 'Review / Delivery':
      return 'Review/Delivery'
    case 'Documented':
      return 'Documented'
    case 'Closed / Lost':
      return 'Closed'
    default:
      return status || 'Unknown'
  }
}

function productionStatusFor(stage: string): string {
  if (IN_PRODUCTION.has(stage)) return stage
  if (stage === 'Closed') return 'Closed'
  return 'Not in production'
}

function documentationStatusFor(stage: string, documented: boolean): string {
  if (documented || stage === 'Documented') return 'Documented'
  return 'Not documented'
}

function asText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export function isSprintEntryBlocked(
  entry: QuoteSprintEntry,
  live?: SprintLiveJob
): boolean {
  if (entry.role !== 'active') return false
  if (entry.missingInputs.length > 0) return true
  if (live?.airtableStatus === 'Needs Info') return true
  return /not quote-ready|discovery only/i.test(entry.quoteReadiness)
}

export function filterSprintEntries(
  entries: readonly QuoteSprintEntry[],
  live: QuoteSprintLiveRead,
  filters: { stage?: string; readiness?: string }
): QuoteSprintEntry[] {
  return entries.filter((entry) => {
    const job = entry.airtableRecordId ? live.jobs[entry.airtableRecordId] : undefined
    const stage = job?.operatingStage ?? entry.stage
    if (filters.stage && filters.stage !== 'all' && stage !== filters.stage) return false
    const blocked = isSprintEntryBlocked(entry, job)
    if (filters.readiness === 'blocked' && !blocked) return false
    if (filters.readiness === 'ready' && (entry.role !== 'active' || blocked)) return false
    return true
  })
}

export function sprintOperatingCounts(
  entries: readonly QuoteSprintEntry[],
  live: QuoteSprintLiveRead
) {
  const active = entries.filter((entry) => entry.role === 'active')
  const stages = active.map((entry) => {
    const id = entry.airtableRecordId
    return id ? live.jobs[id]?.operatingStage : undefined
  })
  const count = (name: string) => stages.filter((stage) => stage === name).length
  return {
    scopesPrepared: active.length,
    quotesIssued: count('Quoted'),
    accepted: count('Accepted'),
    paid: 0,
    inProduction: stages.filter((stage) => stage != null && IN_PRODUCTION.has(stage)).length,
    delivered: count('Review/Delivery'),
    documented: count('Documented'),
    productionCap: PRODUCTION_JOB_CAP,
  }
}

async function fetchQuoteSprintJobs(apiKey: string): Promise<QuoteSprintLiveRead> {
  const formula = `OR(${QUOTE_SPRINT_AIRTABLE_JOBS.map((id) => `RECORD_ID()='${id}'`).join(',')})`
  let records: Awaited<ReturnType<typeof fetchAllRecords>>
  try {
    records = await fetchAllRecords(
      DCC_CRM_LIVE_BASE_ID,
      DCC_CRM_LIVE_TABLES.jobs,
      apiKey,
      { filterFormula: formula }
    )
  } catch {
    throw new Error('Airtable quote-sprint read failed')
  }
  const jobs: Record<string, SprintLiveJob> = {}
  for (const record of records) {
    const status = asText(record.fields.Status) ?? 'Unknown'
    const stage = operatingStageForAirtableStatus(status)
    jobs[record.id] = {
      recordId: record.id,
      airtableStatus: status,
      operatingStage: stage,
      paymentStatus: PAYMENT_NOT_CONFIRMED,
      productionStatus: productionStatusFor(stage),
      documentationStatus: documentationStatusFor(
        stage,
        record.fields['Documentation Complete?'] === true
      ),
      blocker: asText(record.fields['Current Blocker']),
      budgetRange: asText(record.fields['Budget Range']),
      proposalRoute: asText(record.fields['Proposal Route']),
      proposalReleaseStage: asText(record.fields['Proposal Release Stage']),
    }
  }
  return {
    available: true,
    detail: 'Airtable status is live. Payment is not inferred from Accepted / Paid.',
    jobs,
  }
}

const CACHE_MS = 60_000
let cachedRead: { at: number; value: QuoteSprintLiveRead } | null = null

export async function readQuoteSprintJobs(): Promise<QuoteSprintLiveRead> {
  const connection = getDccOsConnection()
  if (!connection?.apiKey) {
    return {
      available: false,
      detail: 'Airtable is not configured. Stages below are the registry fallback.',
      jobs: {},
    }
  }
  if (cachedRead && Date.now() - cachedRead.at < CACHE_MS) return cachedRead.value
  try {
    const value = await fetchQuoteSprintJobs(connection.apiKey)
    cachedRead = { at: Date.now(), value }
    return value
  } catch {
    return {
      available: false,
      detail: 'Airtable is unavailable. Stages below are the registry fallback.',
      jobs: {},
    }
  }
}

export function airtableJobHref(recordId: string): string {
  return `https://airtable.com/${DCC_CRM_LIVE_BASE_ID}/${DCC_CRM_LIVE_TABLES.jobs}/${recordId}`
}

export function registryStage(entry: QuoteSprintEntry, live: QuoteSprintLiveRead): string {
  const job = entry.airtableRecordId ? live.jobs[entry.airtableRecordId] : undefined
  return job?.operatingStage ?? entry.stage
}

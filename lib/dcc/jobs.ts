import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
  type AirtableRecord,
} from '@/lib/airtable/client'
import { requireDccOsConnection, type DccOsConnection } from '@/lib/dcc/os-config'
import { DCC_JOB_FIELDS as F, DCC_JOB_STAGES } from '@/lib/dcc/os-field-map'
import { appendChangeLog } from '@/lib/dcc/change-log'

export const MAKE_NOTES_PREFIX = '[web:/make]'

export type DccJob = {
  id: string
  jobName: string
  stage: string
  customerIds: string[]
  tier?: string
  serviceIds: string[]
  machineIds: string[]
  dueDate?: string
  notes?: string
  quoteAmount: number | null
}

function str(fields: Record<string, unknown>, key: string): string | undefined {
  const v = fields[key]
  if (typeof v === 'string' && v.trim()) return v.trim()
  return undefined
}

function links(fields: Record<string, unknown>, key: string): string[] {
  const v = fields[key]
  if (!Array.isArray(v)) return []
  return v.filter((x): x is string => typeof x === 'string')
}

function money(fields: Record<string, unknown>, key: string): number | null {
  const v = fields[key]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  return null
}

function mapJob(rec: AirtableRecord): DccJob {
  return {
    id: rec.id,
    jobName: str(rec.fields, F.jobName) ?? '(unnamed job)',
    stage: str(rec.fields, F.stage) ?? DCC_JOB_STAGES.inquiry,
    customerIds: links(rec.fields, F.customer),
    tier: str(rec.fields, F.tier),
    serviceIds: links(rec.fields, F.service),
    machineIds: links(rec.fields, F.machine),
    dueDate: str(rec.fields, F.dueDate),
    notes: str(rec.fields, F.notes),
    quoteAmount: money(rec.fields, F.quoteAmount),
  }
}

export async function listJobs(conn?: DccOsConnection): Promise<DccJob[]> {
  const c = conn ?? requireDccOsConnection()
  const rows = await fetchAllRecords(c.baseId, c.tables.jobs, c.apiKey)
  return rows.map(mapJob)
}

export type CreateInquiryJobInput = {
  jobName: string
  customerRecordId: string
  tier: 'Associate' | 'Public' | 'Commercial'
  serviceRecordId?: string
  dueDate?: string
  notesBody: string
  estimateShown?: string
}

/** Public /make write path — Inquiry only. Never sets quote/costs/machine. */
export async function createInquiryJob(
  input: CreateInquiryJobInput,
  conn?: DccOsConnection
): Promise<DccJob> {
  const c = conn ?? requireDccOsConnection()
  const notes = `${MAKE_NOTES_PREFIX}\n${input.notesBody}${
    input.estimateShown ? `\nEstimate shown: ${input.estimateShown}` : ''
  }`

  const fields: Record<string, unknown> = {
    [F.jobName]: input.jobName,
    [F.stage]: DCC_JOB_STAGES.inquiry,
    [F.customer]: [input.customerRecordId],
    [F.tier]: input.tier,
    [F.notes]: notes,
  }
  if (input.serviceRecordId) fields[F.service] = [input.serviceRecordId]
  if (input.dueDate) fields[F.dueDate] = input.dueDate

  const [created] = await createAirtableRecords(c.baseId, c.tables.jobs, c.apiKey, [
    { fields },
  ])
  if (!created) throw new Error('Airtable create job returned no record')

  await appendChangeLog(
    {
      entity: 'Job',
      entityId: created.id,
      action: 'createInquiry',
      actor: 'web:/make',
      details: input.jobName,
      source: 'web:/make',
    },
    c
  )

  return mapJob(created)
}

export async function setJobQuoteAmount(
  id: string,
  quoteAmount: number,
  actor: string,
  conn?: DccOsConnection
): Promise<DccJob> {
  const c = conn ?? requireDccOsConnection()
  const reserve = Math.round(quoteAmount * 0.1 * 100) / 100
  const updated = await patchAirtableRecord(
    c.baseId,
    c.tables.jobs,
    c.apiKey,
    id,
    {
      [F.quoteAmount]: quoteAmount,
      [F.machineReserve]: reserve,
      [F.stage]: DCC_JOB_STAGES.quoted,
    }
  )
  await appendChangeLog(
    {
      entity: 'Job',
      entityId: id,
      action: 'setQuote',
      actor,
      details: `Quote $${quoteAmount}; machine reserve $${reserve}`,
      source: 'staff',
    },
    c
  )
  return mapJob(updated)
}

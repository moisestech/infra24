/**
 * Airtable Budget Service
 *
 * Fetches budget data from Airtable for Oolite. Used when AIRTABLE_* env vars are configured.
 * Falls back to budget-data.ts when unconfigured or on error.
 */

import type { OrganizationBudgetConfig } from '@/lib/budget/budget-data'

import type { AirtableRecord } from '@/lib/airtable/client'
import { fetchAllRecords, patchAirtableRecord } from '@/lib/airtable/client'

export type OoliteBudgetType = 'digital-lab' | 'summit'

// Field mapping - matches "Budget Line Items-All Items.csv" / Airtable import
const FIELD_MAP = {
  name: process.env.AIRTABLE_FIELD_NAME || 'Name',
  category: process.env.AIRTABLE_FIELD_CATEGORY || 'Category',
  amount: process.env.AIRTABLE_FIELD_AMOUNT || 'Amount',
  subtotal: process.env.AIRTABLE_FIELD_SUBTOTAL || 'Subtotal',
  vendor: process.env.AIRTABLE_FIELD_VENDOR || 'Vendor',
  notes: process.env.AIRTABLE_FIELD_NOTES || 'Notes',
  date: process.env.AIRTABLE_FIELD_DATE || 'Date',
  budgetBucket: process.env.AIRTABLE_FIELD_BUDGET_BUCKET || 'Budget Bucket',
  purpose: process.env.AIRTABLE_FIELD_PURPOSE || 'Purpose',
  phase: process.env.AIRTABLE_FIELD_PHASE || 'Phase',
  programPillar: process.env.AIRTABLE_FIELD_PROGRAM_PILLAR || 'Program Pillar',
  spendType: process.env.AIRTABLE_FIELD_SPEND_TYPE || 'Spend Type',
  targetMonth: process.env.AIRTABLE_FIELD_TARGET_MONTH || 'Target Month',
  vendorGroup: process.env.AIRTABLE_FIELD_VENDOR_GROUP || 'Vendor Group',
  printSystem: process.env.AIRTABLE_FIELD_PRINT_SYSTEM || 'Print System',
  expenseType: process.env.AIRTABLE_FIELD_EXPENSE_TYPE || 'Expense Type',
  emailTitle: process.env.AIRTABLE_FIELD_EMAIL_TITLE || 'Email Title',
  emailDate: process.env.AIRTABLE_FIELD_EMAIL_DATE || 'Email Date',
  emailPeople: process.env.AIRTABLE_FIELD_EMAIL_PEOPLE || 'Email People',
  evidenceMetadata: process.env.AIRTABLE_FIELD_EVIDENCE_METADATA || 'Evidence Metadata'
}

// Filter values - must match "Budget Bucket" single-select in Airtable
const AIRTABLE_DIGITAL_LAB = process.env.AIRTABLE_VALUE_DIGITAL_LAB || 'Digital Lab'
const AIRTABLE_DIGITAL_CONFERENCE = process.env.AIRTABLE_VALUE_DIGITAL_CONFERENCE || 'Digital Conference'

function parseAirtableDate(value: unknown): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') {
    // Airtable: "YYYY-MM-DD" or ISO string
    const isoMatch = value.match(/^\d{4}-\d{2}-\d{2}/)
    if (isoMatch) return isoMatch[0]
    // CSV import format: "M/D/YYYY" or "MM/DD/YYYY"
    const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
    if (slashMatch) {
      const [, m, d, y] = slashMatch
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    }
  }
  return undefined
}

function parseAmount(value: unknown): number {
  if (value == null) return 0
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''))
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

/**
 * Map Airtable records to OrganizationBudgetConfig items
 */
function mapRecordsToItems(records: AirtableRecord[]): OrganizationBudgetConfig['items'] {
  return records
    .filter((record) => {
      const name = String(record.fields[FIELD_MAP.name] ?? '').trim()
      return name.length > 0
    })
    .map((record) => {
      const fields = record.fields
      // Prefer Subtotal (line total) over Amount for Airtable/CSV consistency
      const amount = parseAmount(fields[FIELD_MAP.subtotal]) || parseAmount(fields[FIELD_MAP.amount])
      const category = String(fields[FIELD_MAP.category] ?? 'hardware-materials').trim()
      const purposeRaw = fields[FIELD_MAP.purpose] ? String(fields[FIELD_MAP.purpose]).trim() : undefined
      const budgetBucketRaw = fields[FIELD_MAP.budgetBucket] ? String(fields[FIELD_MAP.budgetBucket]).trim() : undefined
      const emailPeopleRaw = fields[FIELD_MAP.emailPeople]
      const emailPeopleStr = Array.isArray(emailPeopleRaw)
        ? (emailPeopleRaw as string[]).join(', ')
        : emailPeopleRaw ? String(emailPeopleRaw).trim() : undefined

      return {
        name: String(fields[FIELD_MAP.name] ?? '').trim(),
        category,
        amount,
        vendor: fields[FIELD_MAP.vendor] ? String(fields[FIELD_MAP.vendor]).trim() : undefined,
        notes: fields[FIELD_MAP.notes] ? String(fields[FIELD_MAP.notes]).trim() : undefined,
        date: parseAirtableDate(fields[FIELD_MAP.date]),
        purpose: purposeRaw || getPurposeFromCategory(category),
        phase: fields[FIELD_MAP.phase] ? String(fields[FIELD_MAP.phase]).trim() : undefined,
        programPillar: fields[FIELD_MAP.programPillar] ? String(fields[FIELD_MAP.programPillar]).trim() : undefined,
        spendType: fields[FIELD_MAP.spendType] ? String(fields[FIELD_MAP.spendType]).trim() : undefined,
        budgetBucket: budgetBucketRaw || 'Digital Lab',
        targetMonth: fields[FIELD_MAP.targetMonth] ? String(fields[FIELD_MAP.targetMonth]).trim() : undefined,
        vendorGroup: fields[FIELD_MAP.vendorGroup] ? String(fields[FIELD_MAP.vendorGroup]).trim() : undefined,
        printSystem: fields[FIELD_MAP.printSystem] ? String(fields[FIELD_MAP.printSystem]).trim() : undefined,
        expenseType: fields[FIELD_MAP.expenseType] ? String(fields[FIELD_MAP.expenseType]).trim() : undefined,
        emailTitle: fields[FIELD_MAP.emailTitle] ? String(fields[FIELD_MAP.emailTitle]).trim() : undefined,
        emailDate: parseAirtableDate(fields[FIELD_MAP.emailDate]),
        emailPeople: emailPeopleStr,
        evidenceMetadata: fields[FIELD_MAP.evidenceMetadata] ? String(fields[FIELD_MAP.evidenceMetadata]).trim() : undefined
      }
    })
}

// Category → Purpose mapping for syncing to Airtable
const CATEGORY_TO_PURPOSE: Record<string, string> = {
  'Displays & Projection': 'Display and presentation equipment for exhibitions and workshops',
  'Peripherals & Creation': 'Creation tools and peripherals for programming',
  'Furniture & Fixtures': 'Furniture and workspace fixtures',
  'Room Build-Out': 'Space renovation and build-out',
  'Large Format Printer': 'Large format printing and fabrication',
  'Streaming': 'Streaming and video infrastructure',
  'Compute': 'Computing and hardware',
  'Audio': 'Audio equipment',
  'Community Event': 'Digital Conference programming and public engagement',
  'Networking & Storage': 'Networking and storage infrastructure',
  'Signage': 'Signage and wayfinding',
  'Contingency': 'Contingency and buffer'
}

function getPurposeFromCategory(category: string): string {
  return CATEGORY_TO_PURPOSE[category] || 'General programming support'
}

/**
 * Fetch ALL budget items from Airtable for Oolite (Digital Lab + Digital Conference).
 * No Budget Bucket filter - returns everything for view-based filtering in the app.
 * Returns null on error or when Airtable is not configured.
 */
export async function fetchAllBudgetItemsFromAirtable(
  orgSlug: string
): Promise<OrganizationBudgetConfig | null> {
  if (orgSlug !== 'oolite') return null

  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const budgetTableId = process.env.AIRTABLE_BUDGET_TABLE_ID

  if (!apiKey || !baseId || !budgetTableId) return null

  try {
    const records = await fetchAllRecords(baseId, budgetTableId, apiKey)
    const items = mapRecordsToItems(records)

    return {
      totalBudget: 80000,
      description: 'Digital Lab + Digital Conference (combined $80k)',
      items
    }
  } catch (err) {
    console.error('Airtable budget fetch error:', err)
    return null
  }
}

/**
 * Fetch budget config from Airtable for Oolite (filtered by budgetType).
 * @deprecated Prefer fetchAllBudgetItemsFromAirtable for combined view.
 */
export async function fetchBudgetFromAirtable(
  orgSlug: string,
  budgetType?: OoliteBudgetType
): Promise<OrganizationBudgetConfig | null> {
  if (orgSlug !== 'oolite') return null

  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const budgetTableId = process.env.AIRTABLE_BUDGET_TABLE_ID
  const summitTableId = process.env.AIRTABLE_SUMMIT_TABLE_ID

  if (!apiKey || !baseId) return null

  // Default to digital-lab when budgetType not specified
  const effectiveType = budgetType ?? 'digital-lab'

  // Use separate tables if configured, otherwise single table with filter
  const useSeparateTables = Boolean(summitTableId)
  const tableId = useSeparateTables && effectiveType === 'summit' ? summitTableId : budgetTableId

  if (!tableId) return null

  try {
    let records: AirtableRecord[]

    if (useSeparateTables) {
      records = await fetchAllRecords(baseId, tableId, apiKey)
    } else {
      // Single table: filter by Budget Bucket ("Digital Lab" vs "Digital Conference")
      const filterFormula =
        effectiveType === 'summit'
          ? `{${FIELD_MAP.budgetBucket}} = '${AIRTABLE_DIGITAL_CONFERENCE}'`
          : `OR({${FIELD_MAP.budgetBucket}} = '${AIRTABLE_DIGITAL_LAB}', {${FIELD_MAP.budgetBucket}} = BLANK())`
      records = await fetchAllRecords(baseId, tableId, apiKey, filterFormula)
    }

    const items = mapRecordsToItems(records)
    const totalBudget = items.reduce((sum, item) => sum + item.amount, 0)

    return {
      totalBudget: totalBudget || (effectiveType === 'summit' ? 25000 : 80000),
      description:
        effectiveType === 'summit'
          ? '$25,000 Budget (strategic split) - Event/Summit'
          : 'Digital Lab Equipment and Infrastructure',
      items
    }
  } catch (err) {
    console.error('Airtable budget fetch error:', err)
    return null
  }
}

/**
 * Sync Purpose field to Airtable based on Category for all records.
 * Fetches all records (both Digital Lab and Digital Conference), computes Purpose from Category, and updates.
 * Returns { updated: number, errors: string[] }
 */
export async function syncPurposeToAirtable(): Promise<{ updated: number; errors: string[] }> {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const budgetTableId = process.env.AIRTABLE_BUDGET_TABLE_ID

  if (!apiKey || !baseId || !budgetTableId) {
    return { updated: 0, errors: ['Airtable not configured (missing API_KEY, BASE_ID, or BUDGET_TABLE_ID)'] }
  }

  const errors: string[] = []
  let updated = 0

  try {
    // Fetch ALL records (no filter) so we can update Purpose for both Digital Lab and Digital Conference
    const records = await fetchAllRecords(baseId, budgetTableId, apiKey)

    for (const record of records) {
      const category = String(record.fields[FIELD_MAP.category] ?? '').trim()
      if (!category) continue

      const purpose = getPurposeFromCategory(category)
      const currentPurpose = String(record.fields[FIELD_MAP.purpose] ?? '').trim()

      // Skip if Purpose already matches (avoid unnecessary API calls)
      if (currentPurpose === purpose) continue

      try {
        await patchAirtableRecord(baseId, budgetTableId, apiKey, record.id, {
          [FIELD_MAP.purpose]: purpose
        })
        updated++
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        errors.push(`Record ${record.id} (${record.fields[FIELD_MAP.name]}): ${msg}`)
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`Fetch failed: ${msg}`)
  }

  return { updated, errors }
}

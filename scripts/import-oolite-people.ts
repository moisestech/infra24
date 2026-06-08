/**
 * Upsert Oolite CRM People rows from JSON into Airtable (no duplicates by name).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import dotenv from 'dotenv'

import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
} from '../lib/airtable/client'
import { getOoliteCrmPeopleConnection } from '../lib/airtable/oolite-crm-people-config'
import { DEFAULT_CRM_PEOPLE_FIELD_MAP } from '../lib/oolite/people-field-map'
import { indexPeopleRowsByName } from '../lib/oolite/people-field-map'
import {
  seedPersonToAirtableFields,
  type OolitePeopleSeedRecord,
} from '../lib/oolite/people-seed'

dotenv.config({ path: '.env.local' })

type SeedFile = {
  organizationRecordId?: string
  records: OolitePeopleSeedRecord[]
}

function parseArgs(): { filePath: string } {
  const args = process.argv.slice(2)
  const fileIdx = args.indexOf('--file')
  const filePath =
    fileIdx >= 0 && args[fileIdx + 1]
      ? args[fileIdx + 1]
      : 'data/oolite-people-seed.json'
  return { filePath }
}

async function main() {
  const { filePath } = parseArgs()
  const absPath = resolve(process.cwd(), filePath)
  const seed = JSON.parse(readFileSync(absPath, 'utf8')) as SeedFile

  const conn = getOoliteCrmPeopleConnection('oolite')
  if (!conn) {
    console.error(
      '❌ Oolite CRM People not configured. Set AIRTABLE_OOLITE_PEOPLE_TABLE_ID in .env.local'
    )
    process.exit(1)
  }

  const orgRecordId =
    seed.organizationRecordId || conn.orgRecordId || 'recRiKB2W96uzTfY0'

  console.log(`📥 Upserting ${seed.records.length} People row(s) from ${filePath}`)
  console.log(`   Base: ${conn.baseId} · Table: ${conn.tableId} · Org: ${orgRecordId}`)

  const filterFormula = conn.orgName
    ? `{${conn.fieldMap.institution}}='${conn.orgName.replace(/'/g, "\\'")}'`
    : undefined
  const existingRows = await fetchAllRecords(conn.baseId, conn.tableId, conn.apiKey, {
    filterFormula,
    viewId: conn.viewId,
  })
  const byName = indexPeopleRowsByName(existingRows, conn.fieldMap.name)

  const toCreate: Array<{ fields: Record<string, unknown> }> = []
  let updated = 0

  for (const row of seed.records) {
    const fields = seedPersonToAirtableFields(row, orgRecordId, conn.fieldMap)
    const key = row.fullName.trim().toLowerCase()
    const existingId = byName.get(key)
    if (existingId) {
      await patchAirtableRecord(conn.baseId, conn.tableId, conn.apiKey, existingId, fields)
      console.log(`   ↻ Updated  ${row.fullName} (${existingId})`)
      updated += 1
    } else {
      toCreate.push({ fields })
    }
  }

  let created = 0
  if (toCreate.length) {
    const createdRows = await createAirtableRecords(
      conn.baseId,
      conn.tableId,
      conn.apiKey,
      toCreate
    )
    created = createdRows.length
    for (const rec of createdRows) {
      const title = rec.fields[DEFAULT_CRM_PEOPLE_FIELD_MAP.name]
      console.log(`   + Created  ${typeof title === 'string' ? title : '(untitled)'} (${rec.id})`)
    }
  }

  console.log(`\n🎉 Done. ${created} created, ${updated} updated (${created + updated} total).`)
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})

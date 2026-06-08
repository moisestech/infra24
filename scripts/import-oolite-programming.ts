/**
 * Upsert Oolite Programming rows from JSON into Airtable (no duplicates by title).
 *
 * Usage:
 *   npm run import:oolite-programming
 *   npx tsx scripts/import-oolite-programming.ts --file data/oolite-programming-seed.json
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import dotenv from 'dotenv'

import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
} from '../lib/airtable/client'
import { getProgrammingConnectionForOrg } from '../lib/airtable/programming-config'
import {
  buildProgrammingOrgFilterFormula,
  indexProgrammingRowsByTitle,
  normalizeProgrammingTitle,
  scopeProgrammingRowsByOrg,
} from '../lib/oolite/programming-import'
import {
  seedRecordToAirtableFields,
  type OoliteProgrammingSeedRecord,
} from '../lib/oolite/programming-seed'
import { DEFAULT_PROGRAMMING_FIELD_MAP } from '../lib/memory-agent/airtable-programming'

dotenv.config({ path: '.env.local' })

type SeedFile = {
  organizationRecordId?: string
  records: OoliteProgrammingSeedRecord[]
}

function parseArgs(): { filePath: string } {
  const args = process.argv.slice(2)
  const fileIdx = args.indexOf('--file')
  const filePath =
    fileIdx >= 0 && args[fileIdx + 1]
      ? args[fileIdx + 1]
      : 'data/oolite-programming-seed.json'
  return { filePath }
}

async function main() {
  const { filePath } = parseArgs()
  const absPath = resolve(process.cwd(), filePath)
  const seed = JSON.parse(readFileSync(absPath, 'utf8')) as SeedFile

  if (!Array.isArray(seed.records) || seed.records.length === 0) {
    console.error('❌ Seed file has no records:', absPath)
    process.exit(1)
  }

  const conn = getProgrammingConnectionForOrg('oolite')
  if (!conn) {
    console.error(
      '❌ Airtable Programming not configured. Set AIRTABLE_OOLITE_PROGRAMMING_TABLE_ID and API key in .env.local'
    )
    process.exit(1)
  }

  const orgRecordId =
    seed.organizationRecordId ||
    conn.orgRecordId ||
    process.env.AIRTABLE_OOLITE_PROGRAMMING_ORG_RECORD_ID ||
    'recRiKB2W96uzTfY0'

  console.log(`📥 Upserting ${seed.records.length} Programming row(s) from ${filePath}`)
  console.log(`   Base: ${conn.baseId} · Table: ${conn.tableId} · Org: ${orgRecordId}`)

  const filterFormula = buildProgrammingOrgFilterFormula(conn)
  const existingRows = await fetchAllRecords(conn.baseId, conn.tableId, conn.apiKey, {
    filterFormula,
    viewId: conn.viewId,
  })
  const scopedRows = scopeProgrammingRowsByOrg(existingRows, conn)
  const byTitle = indexProgrammingRowsByTitle(scopedRows, conn.fieldMap.title)

  const toCreate: Array<{ fields: Record<string, unknown> }> = []
  let updated = 0

  for (const row of seed.records) {
    const fields = seedRecordToAirtableFields(row, orgRecordId)
    const key = normalizeProgrammingTitle(row.title)
    const existingId = byTitle.get(key)
    if (existingId) {
      await patchAirtableRecord(conn.baseId, conn.tableId, conn.apiKey, existingId, fields)
      console.log(`   ↻ Updated  ${row.title} (${existingId})`)
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
      const title = rec.fields[DEFAULT_PROGRAMMING_FIELD_MAP.title]
      console.log(`   + Created  ${typeof title === 'string' ? title : '(untitled)'} (${rec.id})`)
    }
  }

  console.log(`\n🎉 Done. ${created} created, ${updated} updated (${created + updated} total).`)
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})

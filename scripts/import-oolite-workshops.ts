/**
 * Batch import upcoming Oolite workshops into Airtable Programming.
 *
 * Upserts by normalized title + start date. Links instructor People via
 * Programming.Artists (merged with any existing links on that row).
 *
 * Usage:
 *   npm run import:oolite-workshops
 *   npx tsx scripts/import-oolite-workshops.ts --file data/oolite-workshops-seed.json
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import dotenv from 'dotenv'

import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
  type AirtableRecord,
} from '../lib/airtable/client'
import { getOoliteCrmPeopleConnection } from '../lib/airtable/oolite-crm-people-config'
import { getProgrammingConnectionForOrg } from '../lib/airtable/programming-config'
import { indexPeopleRowsByName } from '../lib/oolite/people-field-map'
import { seedPersonToAirtableFields } from '../lib/oolite/people-seed'
import {
  buildProgrammingOrgFilterFormula,
  indexProgrammingRowsByUpsertKey,
  mergeLinkedRecordIds,
  programmingUpsertKey,
  scopeProgrammingRowsByOrg,
} from '../lib/oolite/programming-import'
import {
  resolveWorkshopInstructorName,
  workshopSeedToAirtableFields,
  type OoliteWorkshopsSeedFile,
} from '../lib/oolite/workshops-seed'

dotenv.config({ path: '.env.local' })

function parseArgs(): { filePath: string } {
  const args = process.argv.slice(2)
  const fileIdx = args.indexOf('--file')
  const filePath =
    fileIdx >= 0 && args[fileIdx + 1]
      ? args[fileIdx + 1]
      : 'data/oolite-workshops-seed.json'
  return { filePath }
}

function rowById(rows: AirtableRecord[], id: string): AirtableRecord | undefined {
  return rows.find((row) => row.id === id)
}

async function upsertInstructors(
  seed: OoliteWorkshopsSeedFile,
  orgRecordId: string
): Promise<{ created: number; updated: number; byName: Map<string, string> }> {
  const peopleConn = getOoliteCrmPeopleConnection('oolite')
  if (!peopleConn) {
    throw new Error('Oolite CRM People not configured')
  }

  const filterFormula = peopleConn.orgName
    ? `{${peopleConn.fieldMap.institution}}='${peopleConn.orgName.replace(/'/g, "\\'")}'`
    : undefined
  const existingRows = await fetchAllRecords(
    peopleConn.baseId,
    peopleConn.tableId,
    peopleConn.apiKey,
    { filterFormula, viewId: peopleConn.viewId }
  )
  const byName = indexPeopleRowsByName(existingRows, peopleConn.fieldMap.name)

  let created = 0
  let updated = 0

  for (const row of seed.instructors ?? []) {
    const fields = seedPersonToAirtableFields(row, orgRecordId, peopleConn.fieldMap)
    const key = row.fullName.trim().toLowerCase()
    const existingId = row.recordId || byName.get(key)
    if (existingId) {
      await patchAirtableRecord(
        peopleConn.baseId,
        peopleConn.tableId,
        peopleConn.apiKey,
        existingId,
        fields
      )
      console.log(`   ↻ Instructor ${row.fullName} (${existingId})`)
      updated += 1
      byName.set(key, existingId)
    } else {
      const createdRows = await createAirtableRecords(
        peopleConn.baseId,
        peopleConn.tableId,
        peopleConn.apiKey,
        [{ fields }]
      )
      const id = createdRows[0]?.id
      if (id) {
        console.log(`   + Instructor ${row.fullName} (${id})`)
        created += 1
        byName.set(key, id)
      }
    }
  }

  return { created, updated, byName }
}

async function main() {
  const { filePath } = parseArgs()
  const absPath = resolve(process.cwd(), filePath)
  const seed = JSON.parse(readFileSync(absPath, 'utf8')) as OoliteWorkshopsSeedFile

  if (!Array.isArray(seed.workshops) || seed.workshops.length === 0) {
    console.error('❌ Seed file has no workshops:', absPath)
    process.exit(1)
  }

  const progConn = getProgrammingConnectionForOrg('oolite')
  if (!progConn) {
    console.error('❌ Airtable Programming not configured in .env.local')
    process.exit(1)
  }

  const orgRecordId =
    seed.organizationRecordId ||
    progConn.orgRecordId ||
    process.env.AIRTABLE_OOLITE_PROGRAMMING_ORG_RECORD_ID ||
    'recRiKB2W96uzTfY0'

  console.log(`📥 Workshop import (${seed.workshops.length} row(s)) from ${filePath}`)
  console.log(`   Base: ${progConn.baseId} · Table: ${progConn.tableId} · Org: ${orgRecordId}`)

  let instructorCreated = 0
  let instructorUpdated = 0
  let peopleByName = new Map<string, string>()

  if (seed.instructors?.length) {
    console.log(`\n👤 Upserting ${seed.instructors.length} instructor People row(s)…`)
    const instructorResult = await upsertInstructors(seed, orgRecordId)
    instructorCreated = instructorResult.created
    instructorUpdated = instructorResult.updated
    peopleByName = instructorResult.byName
  } else {
    const peopleConn = getOoliteCrmPeopleConnection('oolite')
    if (peopleConn) {
      const filterFormula = peopleConn.orgName
        ? `{${peopleConn.fieldMap.institution}}='${peopleConn.orgName.replace(/'/g, "\\'")}'`
        : undefined
      const existingRows = await fetchAllRecords(
        peopleConn.baseId,
        peopleConn.tableId,
        peopleConn.apiKey,
        { filterFormula, viewId: peopleConn.viewId }
      )
      peopleByName = indexPeopleRowsByName(existingRows, peopleConn.fieldMap.name)
    }
  }

  const filterFormula = buildProgrammingOrgFilterFormula(progConn)
  const existingRows = await fetchAllRecords(progConn.baseId, progConn.tableId, progConn.apiKey, {
    filterFormula,
    viewId: progConn.viewId,
  })
  const scopedRows = scopeProgrammingRowsByOrg(existingRows, progConn)
  const byUpsertKey = indexProgrammingRowsByUpsertKey(
    scopedRows,
    progConn.fieldMap.title,
    progConn.fieldMap.startDate
  )

  const toCreate: Array<{ fields: Record<string, unknown> }> = []
  let updated = 0
  let linked = 0

  for (const row of seed.workshops) {
    const instructorName = resolveWorkshopInstructorName(row)
    const instructorId =
      row.instructorPeopleId ||
      (instructorName ? peopleByName.get(instructorName.trim().toLowerCase()) : undefined)

    const key = programmingUpsertKey(row.title, row.startDate)
    const existingId = byUpsertKey.get(key)
    const existingRow = existingId ? rowById(scopedRows, existingId) : undefined
    const mergedArtistIds = mergeLinkedRecordIds(
      existingRow?.fields[progConn.fieldMap.artists],
      instructorId,
      ...(row.artistRecordIds ?? [])
    )

    const fields = workshopSeedToAirtableFields(row, orgRecordId, mergedArtistIds)
    if (instructorId) linked += 1

    if (existingId) {
      await patchAirtableRecord(
        progConn.baseId,
        progConn.tableId,
        progConn.apiKey,
        existingId,
        fields
      )
      const linkNote =
        mergedArtistIds.length > 0
          ? ` · Artists: ${mergedArtistIds.length}`
          : instructorName
            ? ' · instructor not linked (People row missing)'
            : ''
      console.log(`   ↻ Updated  ${row.title} (${existingId})${linkNote}`)
      updated += 1
    } else {
      toCreate.push({ fields })
    }
  }

  let created = 0
  if (toCreate.length) {
    const createdRows = await createAirtableRecords(
      progConn.baseId,
      progConn.tableId,
      progConn.apiKey,
      toCreate
    )
    created = createdRows.length
    for (const rec of createdRows) {
      const title = rec.fields[progConn.fieldMap.title]
      console.log(`   + Created  ${typeof title === 'string' ? title : '(untitled)'} (${rec.id})`)
    }
  }

  console.log('\n📊 Summary')
  console.log(`   Workshops created: ${created}`)
  console.log(`   Workshops updated: ${updated}`)
  console.log(`   Instructor People created: ${instructorCreated}`)
  console.log(`   Instructor People updated: ${instructorUpdated}`)
  console.log(`   Workshops with linked instructor: ${linked}`)
  console.log('\n🎉 Workshop import complete.')
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})

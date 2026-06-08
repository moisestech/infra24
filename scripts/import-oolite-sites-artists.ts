/**
 * Import Sites of the Self artist cluster + link People ↔ Programming.
 *
 * Usage:
 *   npm run import:oolite-sites-artists
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
import { getProgrammingConnectionForOrg } from '../lib/airtable/programming-config'
import { DEFAULT_CRM_PEOPLE_FIELD_MAP } from '../lib/oolite/people-field-map'
import { indexPeopleRowsByName } from '../lib/oolite/people-field-map'
import {
  seedPersonToAirtableFields,
  type OolitePeopleSeedRecord,
} from '../lib/oolite/people-seed'

dotenv.config({ path: '.env.local' })

type SeedFile = {
  organizationRecordId?: string
  links?: {
    sitesOfTheSelfProgrammingId?: string
    fabricOfRememberingProgrammingId?: string
    bexMcCharenPeopleId?: string
  }
  records: OolitePeopleSeedRecord[]
}

async function main() {
  const absPath = resolve(process.cwd(), 'data/oolite-sites-artists-seed.json')
  const seed = JSON.parse(readFileSync(absPath, 'utf8')) as SeedFile

  const peopleConn = getOoliteCrmPeopleConnection('oolite')
  const progConn = getProgrammingConnectionForOrg('oolite')
  if (!peopleConn || !progConn) {
    console.error('❌ Oolite People or Programming not configured in .env.local')
    process.exit(1)
  }

  const orgRecordId = seed.organizationRecordId || peopleConn.orgRecordId || 'recRiKB2W96uzTfY0'
  const sitesId = seed.links?.sitesOfTheSelfProgrammingId || 'recM68bSWBD40Ikcu'

  console.log(`📥 Sites of the Self artist cluster (${seed.records.length} people rows)`)

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

  const artistPeopleIds: string[] = []
  let created = 0
  let updated = 0

  for (const row of seed.records) {
    const fields = seedPersonToAirtableFields(row, orgRecordId, peopleConn.fieldMap)
    const existingId = row.recordId || byName.get(row.fullName.trim().toLowerCase())
    if (existingId) {
      await patchAirtableRecord(
        peopleConn.baseId,
        peopleConn.tableId,
        peopleConn.apiKey,
        existingId,
        fields
      )
      console.log(`   ↻ Updated  ${row.fullName} (${existingId})`)
      updated += 1
      artistPeopleIds.push(existingId)
    } else {
      const createdRows = await createAirtableRecords(
        peopleConn.baseId,
        peopleConn.tableId,
        peopleConn.apiKey,
        [{ fields }]
      )
      const id = createdRows[0]?.id
      if (id) {
        console.log(`   + Created  ${row.fullName} (${id})`)
        created += 1
        artistPeopleIds.push(id)
        byName.set(row.fullName.trim().toLowerCase(), id)
      }
    }
  }

  const uniqueArtistIds = [...new Set(artistPeopleIds)]
  if (sitesId && uniqueArtistIds.length) {
    await patchAirtableRecord(progConn.baseId, progConn.tableId, progConn.apiKey, sitesId, {
      [progConn.fieldMap.artists]: uniqueArtistIds,
    })
    console.log(`\n🔗 Linked ${uniqueArtistIds.length} artist(s) to Sites of the Self (${sitesId})`)
  }

  console.log(`\n🎉 Done. ${created} created, ${updated} updated.`)
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})

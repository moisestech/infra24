/**
 * DCC OS v1 Airtable checklist — additive fields + Assignments table.
 *
 * Default: print the spec. If DCC OS credentials exist, also report schema gaps
 * (read-only). Does not mutate Stage options or historic records.
 *
 *   npx tsx scripts/tools/scaffold-dcc-os-v1-fields.ts
 *   npx tsx scripts/tools/scaffold-dcc-os-v1-fields.ts --apply
 *
 * --apply requires schema.bases:write. It only creates missing fields / the
 * Assignments table / missing Interaction Type choices.
 */

import path from 'path'
import { config } from 'dotenv'

import {
  DCC_OS_BASE_ID_DEFAULT,
  DCC_OS_TABLE_DEFAULTS,
  getDccOsConnection,
} from '@/lib/dcc/os-config'
import {
  DCC_ASSIGNMENTS_TABLE_NAME,
  DCC_INTERACTION_NOTES_FIELD,
} from '@/lib/dcc/os-field-map'
import {
  assignmentsTableFields,
  interactionNotesField,
  INTERACTION_TYPE_ADDITIONS,
  jobsV1Fields,
  peopleV1Fields,
  servicesV1Fields,
  transactionsV1Fields,
  type AirtableFieldCreate,
} from '@/lib/dcc/os-v1-schema'

config({ path: path.resolve(process.cwd(), '.env.local') })

type MetaField = {
  id: string
  name: string
  type: string
  options?: { choices?: Array<{ id?: string; name: string }> }
}

type MetaTable = {
  id: string
  name: string
  fields: MetaField[]
}

function metaToken(): string | undefined {
  return (
    process.env.AIRTABLE_META_API_KEY?.trim() ||
    process.env.AIRTABLE_DCC_OS_API_KEY?.trim() ||
    process.env.AIRTABLE_DCC_CRM_API_KEY?.trim() ||
    process.env.AIRTABLE_API_KEY?.trim()
  )
}

function baseId(): string {
  return (
    process.env.AIRTABLE_DCC_OS_BASE_ID?.trim() ||
    process.env.AIRTABLE_DCC_CRM_BASE_ID?.trim() ||
    DCC_OS_BASE_ID_DEFAULT
  )
}

function interactionsTableId(): string {
  return (
    process.env.AIRTABLE_DCC_CRM_TABLE_INTERACTIONS?.trim() ||
    'tbl4PSVbNU2G6kLVl'
  )
}

async function listTables(token: string, id: string): Promise<MetaTable[]> {
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(id)}/tables`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    throw new Error(`Meta API list tables ${res.status}: ${await res.text()}`)
  }
  const data = (await res.json()) as { tables: MetaTable[] }
  return data.tables
}

function missingFields(table: MetaTable | undefined, wanted: AirtableFieldCreate[]): AirtableFieldCreate[] {
  const have = new Set((table?.fields ?? []).map((f) => f.name))
  return wanted.filter((f) => !have.has(f.name))
}

async function createField(
  token: string,
  id: string,
  tableId: string,
  field: AirtableFieldCreate
): Promise<void> {
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(id)}/tables/${encodeURIComponent(tableId)}/fields`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(field),
    }
  )
  if (!res.ok) {
    throw new Error(
      `Create field "${field.name}" on ${tableId} failed ${res.status}: ${await res.text()}`
    )
  }
}

async function createTable(
  token: string,
  id: string,
  name: string,
  fields: AirtableFieldCreate[]
): Promise<MetaTable> {
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(id)}/tables`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description:
          'DCC OS v1 operator assignments. No client price or margin on this table.',
        fields,
      }),
    }
  )
  if (!res.ok) {
    throw new Error(`Create table ${name} failed ${res.status}: ${await res.text()}`)
  }
  return (await res.json()) as MetaTable
}

async function mergeSelectChoices(
  token: string,
  id: string,
  tableId: string,
  field: MetaField,
  extraNames: readonly string[]
): Promise<string[]> {
  const existing = field.options?.choices ?? []
  const have = new Set(existing.map((c) => c.name))
  const missing = extraNames.filter((n) => !have.has(n))
  if (missing.length === 0) return []

  const choices = [
    ...existing.map((c) => (c.id ? { id: c.id, name: c.name } : { name: c.name })),
    ...missing.map((name) => ({ name })),
  ]

  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(id)}/tables/${encodeURIComponent(tableId)}/fields/${encodeURIComponent(field.id)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ options: { choices } }),
    }
  )
  if (!res.ok) {
    throw new Error(
      `Patch Type choices failed ${res.status}: ${await res.text()}`
    )
  }
  return [...missing]
}

function printGap(label: string, missing: AirtableFieldCreate[]) {
  if (missing.length === 0) {
    console.log(`  ${label}: complete`)
    return
  }
  console.log(`  ${label}: missing`)
  for (const f of missing) console.log(`    - ${f.name} (${f.type})`)
}

async function main() {
  const apply = process.argv.includes('--apply')
  const conn = getDccOsConnection()
  const tables = conn?.tables ?? DCC_OS_TABLE_DEFAULTS
  const peopleId = tables.people
  const jobsId = tables.jobs
  const servicesId = tables.services
  const transactionsId = tables.transactions
  const interactionsId = interactionsTableId()
  const id = conn?.baseId ?? baseId()

  console.log('# DCC OS v1 — Airtable additive schema\n')
  console.log(`Base: ${id}`)
  console.log('Do not change Stage options. Do not backfill historic Jobs.\n')
  console.log('Guide: docs/dcc/AIRTABLE-CHECKLIST.md\n')

  const spec = {
    order: [
      '1 People',
      '2 Services',
      '3 Jobs',
      '4 Assignments (new table)',
      '5 Transactions (after Assignments exists)',
      '6 Interactions Type options + Notes if absent',
    ],
    people: peopleV1Fields(),
    services: servicesV1Fields(),
    jobs: jobsV1Fields(),
    assignments: assignmentsTableFields(jobsId, peopleId),
    transactions: '(Assignment link requires Assignments table id)',
    interactionTypeAdditions: INTERACTION_TYPE_ADDITIONS,
    interactionNotes: interactionNotesField(),
    doNotCreate: [
      'Assignment Mode',
      'Base Price',
      'Quotes table',
      'Attendance table',
      'Activity table',
    ],
  }
  console.log(JSON.stringify(spec, null, 2))

  const token = metaToken()
  if (!token) {
    console.log(
      '\nNo Airtable token. Print-only. Set AIRTABLE_DCC_OS_API_KEY (or AIRTABLE_DCC_CRM_API_KEY) to gap-check or --apply.'
    )
    if (apply) process.exit(1)
    return
  }

  let live: MetaTable[]
  try {
    live = await listTables(token, id)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.log(`\nSchema gap skipped (Meta API): ${msg}`)
    console.log(
      'Print-only succeeded. Gap check / --apply needs a PAT with schema.bases:read (and schema.bases:write for --apply).'
    )
    if (apply) process.exit(1)
    return
  }
  const byId = new Map(live.map((t) => [t.id, t]))
  const people = byId.get(peopleId)
  const services = byId.get(servicesId)
  const jobs = byId.get(jobsId)
  const txs = byId.get(transactionsId)
  const interactions = byId.get(interactionsId)
  const assignments =
    live.find((t) => t.name === DCC_ASSIGNMENTS_TABLE_NAME) ??
    live.find((t) => t.id === process.env.AIRTABLE_DCC_OS_TABLE_ASSIGNMENTS?.trim())

  console.log('\n## Schema gap (read-only)\n')
  printGap('People', missingFields(people, peopleV1Fields()))
  printGap('Services', missingFields(services, servicesV1Fields()))
  printGap('Jobs', missingFields(jobs, jobsV1Fields()))
  if (!assignments) {
    console.log(`  Assignments: table "${DCC_ASSIGNMENTS_TABLE_NAME}" not found`)
  } else {
    printGap(
      'Assignments',
      missingFields(assignments, assignmentsTableFields(jobsId, peopleId))
    )
  }
  if (assignments) {
    printGap(
      'Transactions',
      missingFields(txs, transactionsV1Fields(peopleId, assignments.id))
    )
  } else {
    console.log('  Transactions: skipped until Assignments exists')
  }

  const typeField = interactions?.fields.find((f) => f.name === 'Type')
  if (!interactions) {
    console.log('  Interactions: table not found')
  } else {
    const haveTypes = new Set(typeField?.options?.choices?.map((c) => c.name) ?? [])
    const missingTypes = INTERACTION_TYPE_ADDITIONS.filter((n) => !haveTypes.has(n))
    if (missingTypes.length) {
      console.log(`  Interactions Type: add ${missingTypes.join(', ')}`)
    } else {
      console.log('  Interactions Type: complete')
    }
    const hasNotes = interactions.fields.some(
      (f) => f.name === DCC_INTERACTION_NOTES_FIELD
    )
    console.log(
      hasNotes
        ? '  Interactions Notes: present'
        : `  Interactions Notes: missing (${DCC_INTERACTION_NOTES_FIELD})`
    )
  }

  if (!apply) {
    console.log(
      '\nDry-run only. Pass --apply to create missing fields / Assignments (schema.bases:write). Never mutates Stage or records.'
    )
    return
  }

  console.log('\n## Applying additive schema\n')

  for (const field of missingFields(people, peopleV1Fields())) {
    await createField(token, id, peopleId, field)
    console.log(`  People + ${field.name}`)
  }
  for (const field of missingFields(services, servicesV1Fields())) {
    await createField(token, id, servicesId, field)
    console.log(`  Services + ${field.name}`)
  }
  for (const field of missingFields(jobs, jobsV1Fields())) {
    await createField(token, id, jobsId, field)
    console.log(`  Jobs + ${field.name}`)
  }

  let assignmentsTable = assignments
  if (!assignmentsTable) {
    assignmentsTable = await createTable(
      token,
      id,
      DCC_ASSIGNMENTS_TABLE_NAME,
      assignmentsTableFields(jobsId, peopleId)
    )
    console.log(
      `  Created table ${assignmentsTable.name} (${assignmentsTable.id})`
    )
    console.log(
      `  Add to .env.local: AIRTABLE_DCC_OS_TABLE_ASSIGNMENTS=${assignmentsTable.id}`
    )
  } else {
    for (const field of missingFields(
      assignmentsTable,
      assignmentsTableFields(jobsId, peopleId)
    )) {
      await createField(token, id, assignmentsTable.id, field)
      console.log(`  Assignments + ${field.name}`)
    }
  }

  for (const field of missingFields(
    txs,
    transactionsV1Fields(peopleId, assignmentsTable.id)
  )) {
    await createField(token, id, transactionsId, field)
    console.log(`  Transactions + ${field.name}`)
  }

  if (interactions && typeField && typeField.type === 'singleSelect') {
    const added = await mergeSelectChoices(
      token,
      id,
      interactions.id,
      typeField,
      INTERACTION_TYPE_ADDITIONS
    )
    if (added.length) console.log(`  Interactions Type + ${added.join(', ')}`)
  }

  if (
    interactions &&
    !interactions.fields.some((f) => f.name === DCC_INTERACTION_NOTES_FIELD)
  ) {
    await createField(token, id, interactions.id, interactionNotesField())
    console.log(`  Interactions + ${DCC_INTERACTION_NOTES_FIELD}`)
  }

  console.log('\nDone. Mark the first staff Person DCC App Roles = admin. Do not backfill Stage.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

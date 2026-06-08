/**
 * Merge tag / record-type / status options into Airtable Programming field schema.
 *
 * Requires a PAT with schema.bases:write (or full base access).
 *
 * Usage:
 *   npm run setup:oolite-programming-options
 *   npx tsx scripts/setup-oolite-programming-options.ts --dry-run
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import dotenv from 'dotenv'

import { getProgrammingConnectionForOrg } from '../lib/airtable/programming-config'
import { mergeProgrammingFieldChoices } from '../lib/oolite/programming-import'

dotenv.config({ path: '.env.local' })

type OptionsFile = {
  tableName?: string
  recordTypes?: string[]
  statuses?: string[]
  tags?: string[]
}

type MetaField = {
  id: string
  name: string
  type: string
  options?: {
    choices?: Array<{ id?: string; name: string; color?: string }>
  }
}

type MetaTable = {
  id: string
  name: string
  fields: MetaField[]
}

function parseArgs(): { dryRun: boolean; filePath: string } {
  const args = process.argv.slice(2)
  const fileIdx = args.indexOf('--file')
  const filePath =
    fileIdx >= 0 && args[fileIdx + 1]
      ? args[fileIdx + 1]
      : 'data/oolite-programming-airtable-options.json'
  return { dryRun: args.includes('--dry-run'), filePath }
}

async function fetchMetaTable(
  baseId: string,
  tableId: string,
  apiKey: string
): Promise<MetaTable | null> {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${encodeURIComponent(baseId)}/tables`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Meta API list tables failed ${res.status}: ${text}`)
  }
  const data = (await res.json()) as { tables: MetaTable[] }
  return data.tables.find((t) => t.id === tableId) ?? null
}

async function patchFieldChoices(
  baseId: string,
  tableId: string,
  fieldId: string,
  apiKey: string,
  choices: string[]
): Promise<void> {
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(baseId)}/tables/${encodeURIComponent(tableId)}/fields/${encodeURIComponent(fieldId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        options: {
          choices: choices.map((name) => ({ name })),
        },
      }),
    }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Meta API patch field failed ${res.status}: ${text}`)
  }
}

async function main() {
  const { dryRun, filePath } = parseArgs()
  const absPath = resolve(process.cwd(), filePath)
  const options = JSON.parse(readFileSync(absPath, 'utf8')) as OptionsFile

  const conn = getProgrammingConnectionForOrg('oolite')
  if (!conn) {
    console.error('❌ Programming connection not configured.')
    process.exit(1)
  }

  const table = await fetchMetaTable(conn.baseId, conn.tableId, conn.apiKey)
  if (!table) {
    console.error(`❌ Table ${conn.tableId} not found in base ${conn.baseId}`)
    process.exit(1)
  }

  const targets: Array<{ fieldName: string; desired: string[] }> = [
    { fieldName: conn.fieldMap.recordType, desired: options.recordTypes ?? [] },
    { fieldName: conn.fieldMap.status, desired: options.statuses ?? [] },
    { fieldName: conn.fieldMap.tags, desired: options.tags ?? [] },
  ]

  console.log(`📋 Programming options setup (${dryRun ? 'dry run' : 'live'})`)
  console.log(`   Table: ${table.name} (${table.id})`)

  for (const target of targets) {
    const field = table.fields.find((f) => f.name === target.fieldName)
    if (!field) {
      console.warn(`⚠️  Field not found: ${target.fieldName}`)
      continue
    }
    const existing = field.options?.choices?.map((c) => c.name)
    const merged = mergeProgrammingFieldChoices(existing, target.desired)
    console.log(`\n→ ${target.fieldName} (${field.type})`)
    console.log(`   Existing: ${existing?.length ?? 0} · After merge: ${merged.length}`)
    if (dryRun) {
      console.log(`   Would set: ${merged.join(', ')}`)
      continue
    }
    await patchFieldChoices(conn.baseId, conn.tableId, field.id, conn.apiKey, merged)
    console.log(`   ✅ Updated`)
  }

  if (dryRun) {
    console.log('\n(dry run — no changes written)')
  } else {
    console.log('\n🎉 Options merged. Run npm run import:oolite-programming next.')
  }
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  console.error(
    '\nIf Meta API access is denied, add options manually from data/oolite-programming-airtable-options.json'
  )
  process.exit(1)
})

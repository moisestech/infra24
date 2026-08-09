#!/usr/bin/env npx tsx
/**
 * LIFE OS task CLI — claim / progress / deploy write-back.
 *
 * Usage:
 *   npx tsx scripts/tools/life-os-tasks.ts list
 *   npx tsx scripts/tools/life-os-tasks.ts claim <recId> [--agent=cursor] [--branch=…]
 *   npx tsx scripts/tools/life-os-tasks.ts done <recId> [--pr=https://…]
 *   npx tsx scripts/tools/life-os-tasks.ts deployed <recId> [--pr=…] [--note=…]
 *   npx tsx scripts/tools/life-os-tasks.ts note <recId> "message"
 *   npx tsx scripts/tools/life-os-tasks.ts discover   # Meta API schema dump
 */

import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

loadEnv({ path: resolve(process.cwd(), '.env.local') })
loadEnv()

import {
  isLifeOsConfigured,
  LIFE_OS_BASE_ID_DEFAULT,
} from '@/lib/life-os/config'
import {
  addAgentNote,
  claimTask,
  listOpenTasks,
  markDeployed,
  markDone,
} from '@/lib/life-os/tasks'

function argValue(argv: string[], prefix: string): string | undefined {
  const hit = argv.find((a) => a.startsWith(prefix))
  if (!hit) return undefined
  const v = hit.slice(prefix.length)
  return v || undefined
}

async function discoverSchema() {
  const apiKey =
    process.env.AIRTABLE_LIFE_OS_API_KEY?.trim() ||
    process.env.AIRTABLE_API_KEY?.trim()
  const baseId =
    process.env.AIRTABLE_LIFE_OS_BASE_ID?.trim() || LIFE_OS_BASE_ID_DEFAULT
  if (!apiKey) {
    console.error('Missing AIRTABLE_LIFE_OS_API_KEY or AIRTABLE_API_KEY')
    process.exit(1)
  }

  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(baseId)}/tables`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  )
  if (!res.ok) {
    console.error(`Meta API ${res.status}: ${await res.text()}`)
    console.error(
      'Ensure the PAT has schema.bases:read and access to LIFE OS base apprswzWnLrHBwFcx.'
    )
    process.exit(1)
  }
  const data = (await res.json()) as {
    tables: Array<{
      id: string
      name: string
      fields: Array<{
        id: string
        name: string
        type: string
        options?: { choices?: Array<{ name: string }> }
      }>
    }>
  }

  for (const t of data.tables) {
    console.log(`\n## ${t.name}  \`${t.id}\``)
    for (const f of t.fields) {
      const choices =
        f.type === 'singleSelect'
          ? ` choices=[${(f.options?.choices ?? []).map((c) => c.name).join(', ')}]`
          : ''
      console.log(`- ${f.name} \`${f.id}\` (${f.type})${choices}`)
    }
  }

  const tasks =
    data.tables.find((t) => /task/i.test(t.name)) ?? data.tables[0]
  if (tasks) {
    console.log(`\n# Suggested env`)
    console.log(`AIRTABLE_LIFE_OS_BASE_ID=${baseId}`)
    console.log(`AIRTABLE_LIFE_OS_TABLE_TASKS=${tasks.id}`)
  }
}

async function main() {
  const [, , cmd, ...rest] = process.argv
  if (!cmd || cmd === 'help' || cmd === '-h') {
    console.log(`life-os-tasks: list | claim | done | deployed | note | discover`)
    process.exit(0)
  }

  if (cmd === 'discover') {
    await discoverSchema()
    return
  }

  if (!isLifeOsConfigured()) {
    console.error(
      'LIFE OS not configured. Set AIRTABLE_LIFE_OS_TABLE_TASKS (+ API key). Run: discover'
    )
    process.exit(1)
  }

  if (cmd === 'list') {
    const tasks = await listOpenTasks()
    if (tasks.length === 0) {
      console.log('No open tasks (Todo / Ready).')
      return
    }
    for (const t of tasks) {
      console.log(`${t.id}\t[${t.status}]\t${t.title}`)
    }
    return
  }

  const id = rest[0]
  if (!id?.startsWith('rec')) {
    console.error('Expected Airtable record id (rec…)')
    process.exit(1)
  }

  if (cmd === 'claim') {
    const task = await claimTask(id, {
      agent: argValue(rest, '--agent=') ?? 'cursor',
      branch: argValue(rest, '--branch='),
      repo: argValue(rest, '--repo=') ?? 'infra24',
      agentRunId: argValue(rest, '--run='),
    })
    console.log(`Claimed ${task.id}: ${task.title} → ${task.status}`)
    return
  }

  if (cmd === 'done') {
    const pr = argValue(rest, '--pr=')
    const task = await markDone(id, {
      prUrl: pr,
      note: argValue(rest, '--note='),
    })
    console.log(`Done ${task.id}: ${task.title} → ${task.status}`)
    return
  }

  if (cmd === 'deployed') {
    const task = await markDeployed(id, {
      prUrl: argValue(rest, '--pr='),
      note: argValue(rest, '--note='),
    })
    console.log(`Deployed ${task.id}: ${task.title} → ${task.status}`)
    return
  }

  if (cmd === 'note') {
    const note = rest.slice(1).join(' ').trim()
    if (!note) {
      console.error('Usage: note <recId> message…')
      process.exit(1)
    }
    const task = await addAgentNote(id, note)
    console.log(`Noted ${task.id}`)
    return
  }

  console.error(`Unknown command: ${cmd}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

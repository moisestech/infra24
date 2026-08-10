/**
 * Sync Memory Agent embeddings to Supabase pgvector.
 *
 *   npx tsx scripts/tools/sync-memory-agent-embeddings.ts --org=oolite
 *   npx tsx scripts/tools/sync-memory-agent-embeddings.ts --org=dcc --docs-only
 */

import path from 'path'
import { config } from 'dotenv'

import { fetchAlumniFromAirtableDetailed } from '@/lib/airtable/alumni-service'
import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'
import { filterRowsForMemoryAgent } from '@/lib/memory-agent/governance'
import {
  alumniToEmbeddingRows,
  embedAndUpsertRows,
  loadDccDocEmbeddingRows,
  programmingToEmbeddingRows,
} from '@/lib/memory-agent/embedding-sync'
import { fetchProgrammingForMemoryAgent } from '@/lib/memory-agent/programming'

config({ path: path.resolve(process.cwd(), '.env.local') })

function parseArgs() {
  let org = 'dcc'
  let docsOnly = false
  let mode: 'public' | 'staff_operator' = 'staff_operator'

  for (const a of process.argv.slice(2)) {
    if (a.startsWith('--org=')) org = a.slice(6).trim().toLowerCase()
    else if (a === '--docs-only') docsOnly = true
    else if (a.startsWith('--mode=')) {
      const m = a.slice(7).trim()
      if (m === 'public' || m === 'staff_operator') mode = m
    }
  }

  return { org, docsOnly, mode }
}

async function main() {
  const { org, docsOnly, mode } = parseArgs()
  const pending: Omit<
    import('@/lib/memory-agent/embedding-sync').MemoryAgentEmbeddingRow,
    'embedding'
  >[] = []

  if (!docsOnly) {
    const conn = getAlumniConnectionForOrg(org)
    if (conn) {
      const fetched = await fetchAlumniFromAirtableDetailed(org)
      if (fetched.ok) {
        const eligible = filterRowsForMemoryAgent(fetched.alumni, mode, conn.fieldMap)
        pending.push(...alumniToEmbeddingRows(org, eligible))
        console.log(`Alumni rows queued: ${eligible.length}`)
      } else {
        console.warn(`Alumni fetch skipped: ${fetched.reason === 'airtable_error' ? fetched.message : fetched.reason}`)
      }
    } else {
      console.warn(`No alumni Airtable config for org "${org}"`)
    }

    const programming = await fetchProgrammingForMemoryAgent(org, { mode })
    if (programming.ok) {
      pending.push(...programmingToEmbeddingRows(org, programming.records))
      console.log(`Programming rows queued: ${programming.records.length}`)
    } else {
      console.warn(`Programming fetch skipped: ${programming.message ?? programming.reason}`)
    }
  }

  const docRows = await loadDccDocEmbeddingRows(org)
  pending.push(...docRows)
  console.log(`DCC doc chunks queued: ${docRows.length}`)

  console.log(`Total pending embeddings: ${pending.length}`)
  const result = await embedAndUpsertRows(pending)
  console.log(JSON.stringify(result, null, 2))

  if (result.errors.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

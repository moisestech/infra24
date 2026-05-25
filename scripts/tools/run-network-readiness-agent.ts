/**
 * Network Readiness Agent — dry run (default) or write to Airtable Agent Approvals
 *
 *   npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc
 *   npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --json
 *   npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --write-approvals
 *   npx tsx scripts/tools/run-network-readiness-agent.ts --org=dcc --report-out=reports/dcc-network.md
 */

import path from 'path'
import { config } from 'dotenv'
import {
  formatNetworkReadinessReport,
  runNetworkReadinessAgent,
} from '@/lib/network-builder/run-network-readiness'
import { isNetworkBuilderConfigured } from '@/lib/network-builder/org-config'

config({ path: path.resolve(process.cwd(), '.env.local') })

function parseArgs() {
  let org = 'dcc'
  let limit = 25
  let staleDays = 60
  let readinessThreshold = 70
  let json = false
  let writeApprovals = false
  let noFixture = false
  let reportOut: string | undefined

  for (const a of process.argv.slice(2)) {
    if (a === '--json') json = true
    else if (a === '--write-approvals') writeApprovals = true
    else if (a === '--no-fixture') noFixture = true
    else if (a.startsWith('--org=')) org = a.slice(6).trim()
    else if (a.startsWith('--limit=')) limit = Number(a.slice(8)) || 25
    else if (a.startsWith('--stale-days=')) staleDays = Number(a.slice(13)) || 60
    else if (a.startsWith('--readiness-threshold=')) {
      readinessThreshold = Number(a.slice(22)) || 70
    } else if (a.startsWith('--report-out=')) {
      reportOut = a.slice(13).trim()
    }
  }

  return { org, limit, staleDays, readinessThreshold, json, writeApprovals, noFixture, reportOut }
}

async function main() {
  const {
    org,
    limit,
    staleDays,
    readinessThreshold,
    json,
    writeApprovals,
    noFixture,
    reportOut,
  } = parseArgs()

  const configured = isNetworkBuilderConfigured(org)
  if (!configured && !noFixture) {
    console.warn(
      `[network-builder] Airtable not configured for org="${org}". Using fixture data.\n` +
        `Set AIRTABLE_DCC_CRM_* in .env.local for INFRA24 live CRM.\n`
    )
  }

  if (writeApprovals && !configured) {
    console.error(
      'Cannot --write-approvals without live Airtable. Set AIRTABLE_DCC_CRM_* env vars.'
    )
    process.exit(1)
  }

  const summary = await runNetworkReadinessAgent({
    orgSlug: org,
    limit,
    staleDays,
    readinessThreshold,
    includeFixture: !noFixture,
    writeApprovals,
    persistToSupabase: writeApprovals,
    reportOutPath: reportOut,
  })

  if (json) {
    console.log(JSON.stringify(summary, null, 2))
    return
  }

  console.log(formatNetworkReadinessReport(summary))
  console.log('')
  console.log('---')
  console.log(`Mode: ${writeApprovals ? 'WRITE (approvals queued)' : 'DRY-RUN (no writes)'}`)
  console.log(`Configured: ${configured ? 'yes (live INFRA24 Airtable)' : 'no (fixture fallback)'}`)
  console.log(`Proposed actions: ${summary.proposedActions.length}`)
  if (reportOut) console.log(`Report written: ${reportOut}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

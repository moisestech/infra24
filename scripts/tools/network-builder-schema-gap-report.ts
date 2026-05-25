/**
 * Compare INFRA24 People table columns against Network Builder field map.
 *
 *   npx tsx scripts/tools/network-builder-schema-gap-report.ts --org=dcc
 *   npx tsx scripts/tools/network-builder-schema-gap-report.ts --org=dcc --json
 */

import path from 'path'
import { config } from 'dotenv'
import { getNetworkBuilderConnection } from '@/lib/network-builder/org-config'
import { readNetworkContacts } from '@/lib/network-builder/read-contacts'
import {
  buildSchemaGapReport,
  formatSchemaGapReportMarkdown,
} from '@/lib/network-builder/schema-gap'

config({ path: path.resolve(process.cwd(), '.env.local') })

function parseArgs() {
  let org = 'dcc'
  let json = false
  for (const a of process.argv.slice(2)) {
    if (a === '--json') json = true
    else if (a.startsWith('--org=')) org = a.slice(6).trim()
  }
  return { org, json }
}

async function main() {
  const { org, json } = parseArgs()
  const conn = getNetworkBuilderConnection(org)

  if (!conn) {
    console.error(`Network Builder not configured for org="${org}". Set AIRTABLE_DCC_CRM_* env vars.`)
    process.exit(1)
  }

  const { observedFieldNames } = await readNetworkContacts(conn)
  const report = buildSchemaGapReport(org, observedFieldNames)

  if (json) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(formatSchemaGapReportMarkdown(report))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

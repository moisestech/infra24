/**
 * Print Agent Approvals table schema for manual Airtable setup.
 * Optional --apply uses Airtable Metadata API (requires AIRTABLE_META_API_KEY + schema.bases:write).
 *
 * Default: print-only (no API calls).
 *
 *   npx tsx scripts/tools/scaffold-agent-approvals-table.ts
 *   npx tsx scripts/tools/scaffold-agent-approvals-table.ts --apply
 */

import path from 'path'
import { config } from 'dotenv'
import { AGENT_APPROVAL_SELECT_VALUES } from '@/lib/network-builder/approval-field-map'

config({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_ID = process.env.AIRTABLE_DCC_CRM_BASE_ID ?? 'appWoYBRdklcz2RJH'
const PEOPLE_TABLE = process.env.AIRTABLE_DCC_CRM_TABLE_PEOPLE ?? 'tbltHiqscY80ybsGE'
const INSTITUTIONS_TABLE = process.env.AIRTABLE_DCC_CRM_TABLE_INSTITUTIONS ?? 'tblu9cIAsNSg5Khhp'
const OPPORTUNITIES_TABLE = process.env.AIRTABLE_DCC_CRM_TABLE_OPPORTUNITIES ?? 'tblFdv4oI3FUXWtBl'
const CAMPAIGNS_TABLE = process.env.AIRTABLE_DCC_CRM_TABLE_CAMPAIGNS ?? 'tblNdjser5MtVbZ4U'

const TABLE_SCHEMA = {
  name: 'Agent Approvals',
  description: 'DCC Network Builder human approval queue',
  fields: [
    { name: 'Approval Name', type: 'singleLineText' },
    { name: 'Action ID', type: 'singleLineText' },
    {
      name: 'Organization',
      type: 'singleSelect',
      options: {
        choices: [{ name: 'DCC' }, { name: 'Oolite' }, { name: 'Bakehouse' }, { name: 'Soho House' }, { name: 'Other' }],
      },
    },
    {
      name: 'Goal',
      type: 'singleSelect',
      options: {
        choices: Object.values(AGENT_APPROVAL_SELECT_VALUES.goal).map((name) => ({ name })),
      },
    },
    {
      name: 'Person / Partner',
      type: 'multipleRecordLinks',
      options: { linkedTableId: PEOPLE_TABLE },
    },
    {
      name: 'Institution',
      type: 'multipleRecordLinks',
      options: { linkedTableId: INSTITUTIONS_TABLE },
    },
    {
      name: 'Opportunity',
      type: 'multipleRecordLinks',
      options: { linkedTableId: OPPORTUNITIES_TABLE },
    },
    {
      name: 'Campaign',
      type: 'multipleRecordLinks',
      options: { linkedTableId: CAMPAIGNS_TABLE },
    },
    {
      name: 'Action Type',
      type: 'singleSelect',
      options: {
        choices: Object.values(AGENT_APPROVAL_SELECT_VALUES.actionType).map((name) => ({ name })),
      },
    },
    {
      name: 'Relationship Stage',
      type: 'singleSelect',
      options: {
        choices: Object.values(AGENT_APPROVAL_SELECT_VALUES.relationshipStage).map((name) => ({ name })),
      },
    },
    { name: 'Agent Recommendation', type: 'multilineText' },
    { name: 'Reason', type: 'multilineText' },
    { name: 'Proposed Output', type: 'multilineText' },
    {
      name: 'Risk Level',
      type: 'singleSelect',
      options: {
        choices: Object.values(AGENT_APPROVAL_SELECT_VALUES.riskLevel).map((name) => ({ name })),
      },
    },
    {
      name: 'Approval Status',
      type: 'singleSelect',
      options: {
        choices: Object.values(AGENT_APPROVAL_SELECT_VALUES.approvalStatus).map((name) => ({
          name,
        })),
      },
    },
    { name: 'Human Notes', type: 'multilineText' },
    { name: 'Approved By', type: 'singleLineText' },
    { name: 'Approved At', type: 'dateTime' },
    {
      name: 'Execution Status',
      type: 'singleSelect',
      options: {
        choices: Object.values(AGENT_APPROVAL_SELECT_VALUES.executionStatus).map((name) => ({
          name,
        })),
      },
    },
    { name: 'Execution Result', type: 'multilineText' },
    {
      name: 'Outcome',
      type: 'singleSelect',
      options: {
        choices: Object.values(AGENT_APPROVAL_SELECT_VALUES.outcome).map((name) => ({ name })),
      },
    },
    { name: 'Run ID', type: 'singleLineText' },
    { name: 'Readiness Percent', type: 'number', options: { precision: 0 } },
  ],
}

async function applyViaMetaApi(): Promise<void> {
  const token = process.env.AIRTABLE_META_API_KEY ?? process.env.AIRTABLE_DCC_CRM_API_KEY
  if (!token?.trim()) {
    console.error('Set AIRTABLE_META_API_KEY or AIRTABLE_DCC_CRM_API_KEY with schema.bases:write scope.')
    process.exit(1)
  }

  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(TABLE_SCHEMA),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`Meta API error ${res.status}: ${text}`)
    process.exit(1)
  }

  const data = (await res.json()) as { id: string; name: string }
  console.log(`Created table: ${data.name} (${data.id})`)
  console.log(`Add to .env.local: AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS=${data.id}`)
}

async function main() {
  const apply = process.argv.includes('--apply')

  console.log('# Agent Approvals — scaffold schema\n')
  console.log(`Base ID: ${BASE_ID}`)
  console.log(`People table (link target): ${PEOPLE_TABLE}\n`)
  console.log(JSON.stringify(TABLE_SCHEMA, null, 2))
  console.log('\nManual setup guide: docs/network-builder/AGENT_APPROVALS_AIRTABLE_SCHEMA.md')

  if (!apply) {
    console.log('\nDry-run only. Pass --apply to create via Metadata API (requires schema.bases:write).')
    return
  }

  console.log('\nApplying via Airtable Metadata API...')
  await applyViaMetaApi()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

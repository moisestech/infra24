/**
 * Print MVP People field additions for manual Airtable setup.
 *
 *   npx tsx scripts/tools/scaffold-people-mvp-fields.ts
 */

import {
  CONSENT_STATUS_OPTIONS,
  DCC_SIGNUP_STATUS_OPTIONS,
  FOLLOW_UP_CADENCE_OPTIONS,
  GRAPH_LAYER_OPTIONS,
  INTEREST_TAG_OPTIONS,
  NETWORK_READINESS_STATUS_OPTIONS,
  PRACTICE_TAG_OPTIONS,
  PUBLIC_PROFILE_CONSENT_OPTIONS,
  SIGNUP_PATHWAY_OPTIONS,
} from '@/lib/network-builder/people-select-options'

const MVP_FIELDS = [
  { name: 'Practice Tags', type: 'multipleSelects', options: PRACTICE_TAG_OPTIONS },
  { name: 'Interest Tags', type: 'multipleSelects', options: INTEREST_TAG_OPTIONS },
  { name: 'Website', type: 'url' },
  { name: 'Instagram', type: 'singleLineText' },
  { name: 'Consent Status', type: 'singleSelect', options: CONSENT_STATUS_OPTIONS },
  { name: 'DCC Signup Status', type: 'singleSelect', options: DCC_SIGNUP_STATUS_OPTIONS },
  { name: 'Digital Orientation Statement', type: 'multilineText' },
  { name: 'Network Readiness Score', type: 'number', precision: 0 },
  { name: 'Network Readiness Status', type: 'singleSelect', options: NETWORK_READINESS_STATUS_OPTIONS },
  { name: 'Follow-Up Cadence', type: 'singleSelect', options: FOLLOW_UP_CADENCE_OPTIONS },
  { name: 'Agent Notes', type: 'multilineText' },
  { name: 'Agent Last Scored At', type: 'dateTime' },
  { name: 'Signup Pathway', type: 'singleSelect', options: SIGNUP_PATHWAY_OPTIONS },
  {
    name: 'Public Profile Consent',
    type: 'singleSelect',
    options: Object.values(PUBLIC_PROFILE_CONSENT_OPTIONS),
  },
  { name: 'Signup Submitted At', type: 'dateTime' },
  {
    name: 'Graph Layer',
    type: 'singleSelect',
    options: Object.values(GRAPH_LAYER_OPTIONS),
  },
]

console.log('# People table — MVP field additions\n')
console.log('Base: INFRA24 CRM (appWoYBRdklcz2RJH)')
console.log('Table: People (tbltHiqscY80ybsGE)\n')
console.log(JSON.stringify(MVP_FIELDS, null, 2))
console.log('\nFull guide: docs/network-builder/PEOPLE_AIRTABLE_SCHEMA.md')
console.log('Schema gap check: npx tsx scripts/tools/network-builder-schema-gap-report.ts')

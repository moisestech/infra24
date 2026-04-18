/**
 * Airtable field API names for the DCC CRM base.
 * Adjust to match your base; values are defaults from the CRM graph spec.
 */
export const CRM_GRAPH_FIELD_MAP = {
  people: {
    name: 'Full Name',
    institution: 'Institution',
    contactCategory: 'Contact Category',
    warmth: 'Warmth',
    miami: 'Miami Area?',
    campaigns: 'Campaigns',
    interactions: 'Interactions',
  },
  institutions: {
    name: 'Institution Name',
    type: 'Type',
    city: 'City',
    status: 'Status',
    relationshipStrength: 'Relationship Strength',
    miami: 'Miami Area?',
    people: 'People',
    opportunities: 'Opportunities',
    interactions: 'Interactions',
    campaigns: 'Campaigns',
  },
  opportunities: {
    name: 'Opportunity Name',
    institution: 'Institution / Organization',
    peopleInvolved: 'People Involved',
    status: 'Status',
    stage: 'Stage',
    bucket: 'Opportunity Bucket',
    deadline: 'Deadline',
    campaigns: 'Campaigns',
  },
  interactions: {
    date: 'Date',
    type: 'Type',
    institution: 'Institution',
    people: 'People',
    relatedOpportunity: 'Related Opportunity',
  },
  campaigns: {
    name: 'Campaign Name',
    type: 'Campaign Type',
    people: 'Related People',
    institutions: 'Related Institutions',
    opportunities: 'Related Opportunities',
    status: 'Status',
  },
} as const

export type CrmFieldMap = typeof CRM_GRAPH_FIELD_MAP

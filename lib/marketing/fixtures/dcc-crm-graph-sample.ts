import type { AirtableRecord } from '@/lib/airtable/client'
import { buildCrmGraphElements } from '@/lib/airtable/crm-graph-transform'
import { filterGraphForHome } from '@/lib/airtable/crm-graph-home-filter'
import { CRM_GRAPH_FIELD_MAP } from '@/lib/airtable/crm-graph-field-map'
import type { DccNetworkGraphPayload, DccNetworkGraphSurface } from '@/lib/marketing/dcc-crm-graph-types'

const F = CRM_GRAPH_FIELD_MAP

/** Tiny CRM-shaped fixture for local dev and tests when Airtable is unset. */
export function getSampleCrmTables(): {
  people: AirtableRecord[]
  institutions: AirtableRecord[]
  opportunities: AirtableRecord[]
  interactions: AirtableRecord[]
  campaigns: AirtableRecord[]
} {
  const institutions: AirtableRecord[] = [
    {
      id: 'recInst1',
      fields: {
        [F.institutions.name]: 'Oolite Arts',
        [F.institutions.city]: 'Miami Beach',
        [F.institutions.miami]: true,
        [F.institutions.relationshipStrength]: 'High',
      },
    },
    {
      id: 'recInst2',
      fields: {
        [F.institutions.name]: 'Knight Foundation',
        [F.institutions.city]: 'Miami',
        [F.institutions.miami]: true,
        [F.institutions.relationshipStrength]: 'Strong',
      },
    },
  ]

  const people: AirtableRecord[] = [
    {
      id: 'recP1',
      fields: {
        [F.people.name]: 'Alex Rivera',
        [F.people.institution]: ['recInst1'],
        [F.people.contactCategory]: 'Artist',
        [F.people.warmth]: 'Very Warm',
        [F.people.miami]: true,
      },
    },
    {
      id: 'recP2',
      fields: {
        [F.people.name]: 'Jordan Lee',
        [F.people.institution]: ['recInst1'],
        [F.people.contactCategory]: 'Connector',
        [F.people.warmth]: 'Warm',
        [F.people.miami]: true,
      },
    },
    {
      id: 'recP3',
      fields: {
        [F.people.name]: 'Sam Chen',
        [F.people.institution]: ['recInst2'],
        [F.people.contactCategory]: 'Funder',
        [F.people.warmth]: 'Active',
        [F.people.miami]: true,
      },
    },
  ]

  const opportunities: AirtableRecord[] = [
    {
      id: 'recO1',
      fields: {
        [F.opportunities.name]: 'Digital Lab cohort',
        [F.opportunities.institution]: ['recInst1'],
        [F.opportunities.peopleInvolved]: ['recP1', 'recP2'],
        [F.opportunities.status]: 'Open',
        [F.opportunities.deadline]: new Date(Date.now() + 864e5 * 14).toISOString().slice(0, 10),
      },
    },
  ]

  const interactions: AirtableRecord[] = [
    {
      id: 'recInt1',
      fields: {
        [F.interactions.date]: new Date().toISOString().slice(0, 10),
        [F.interactions.type]: 'Meeting',
        [F.interactions.people]: ['recP1', 'recP2'],
        [F.interactions.institution]: ['recInst1'],
        [F.interactions.relatedOpportunity]: ['recO1'],
      },
    },
    {
      id: 'recInt2',
      fields: {
        [F.interactions.date]: new Date(Date.now() - 864e5 * 10).toISOString().slice(0, 10),
        [F.interactions.type]: 'Call',
        [F.interactions.people]: ['recP3'],
        [F.interactions.institution]: ['recInst2'],
      },
    },
  ]

  const campaigns: AirtableRecord[] = [
    {
      id: 'recCamp1',
      fields: {
        [F.campaigns.name]: 'Year 1 pilot',
        [F.campaigns.people]: ['recP1'],
        [F.campaigns.institutions]: ['recInst1'],
        [F.campaigns.opportunities]: ['recO1'],
        [F.campaigns.status]: 'Active',
      },
    },
  ]

  return { people, institutions, opportunities, interactions, campaigns }
}

export function getSampleGraphPayload(surface: DccNetworkGraphSurface): DccNetworkGraphPayload {
  const tables = getSampleCrmTables()
  const elements = buildCrmGraphElements(tables, surface)
  const base: DccNetworkGraphPayload = {
    elements,
    meta: {
      source: 'fixture',
      surface,
      generatedAt: new Date().toISOString(),
      nodeCount: elements.filter((e) => 'kind' in e.data && !('source' in e.data)).length,
      edgeCount: elements.filter((e) => 'source' in e.data).length,
    },
  }
  if (surface === 'home') {
    return filterGraphForHome(base, 60)
  }
  return base
}

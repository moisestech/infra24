import type { AirtableRecord } from '@/lib/airtable/client'
import { buildCrmGraphElements } from '@/lib/airtable/crm-graph-transform'
import { filterGraphForHome, HOME_GRAPH_MAX_TOTAL_NODES } from '@/lib/airtable/crm-graph-home-filter'
import { CRM_GRAPH_FIELD_MAP } from '@/lib/airtable/crm-graph-field-map'
import type { DccGraphMode, DccGraphVisibility, DccNetworkGraphPayload, DccNetworkGraphSurface } from '@/lib/marketing/dcc-crm-graph-types'

export type SampleGraphPayloadOptions = {
  surface?: DccNetworkGraphSurface
  mode?: DccGraphMode
  visibility?: DccGraphVisibility
}

export function getSampleGraphPayload(
  surfaceOrOptions: DccNetworkGraphSurface | SampleGraphPayloadOptions = 'home'
): DccNetworkGraphPayload {
  const options: SampleGraphPayloadOptions =
    typeof surfaceOrOptions === 'string' ? { surface: surfaceOrOptions } : surfaceOrOptions
  const surface = options.surface ?? 'home'
  const mode = options.mode ?? 'active'
  const visibility = options.visibility ?? 'public'

  const tables = getSampleCrmTables()
  const elements = buildCrmGraphElements(tables, { surface, mode, visibility })
  const base: DccNetworkGraphPayload = {
    elements,
    meta: {
      source: 'fixture',
      surface,
      mode,
      visibility,
      generatedAt: new Date().toISOString(),
      nodeCount: elements.filter((e) => 'kind' in e.data && !('source' in e.data)).length,
      edgeCount: elements.filter((e) => 'source' in e.data).length,
    },
  }
  if (surface === 'home') {
    return filterGraphForHome(base, { maxPeople: 80, maxTotalNodes: HOME_GRAPH_MAX_TOTAL_NODES })
  }
  return base
}

const F = CRM_GRAPH_FIELD_MAP

/** Tiny CRM-shaped fixture for local dev and tests when Airtable is unset. */
export function getSampleCrmTables(): {
  people: AirtableRecord[]
  seedCandidates: AirtableRecord[]
  institutions: AirtableRecord[]
  opportunities: AirtableRecord[]
  interactions: AirtableRecord[]
  campaigns: AirtableRecord[]
} {
  const institutions: AirtableRecord[] = [
    {
      id: 'recInst1',
      fields: {
        [F.institutions.name]: 'Bakehouse Art Complex',
        [F.institutions.city]: 'Miami',
        [F.institutions.miami]: true,
        [F.institutions.relationshipStrength]: 'High',
      },
    },
    {
      id: 'recInst2',
      fields: {
        [F.institutions.name]: 'Transfer',
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

  /** Extra CRM-shaped rows so the homepage graph preview can fill up to 50 nodes after `filterGraphForHome`. */
  const demoInstitutionIds = ['recInst1', 'recInst2', 'recInstHub0', 'recInstHub1', 'recInstHub2', 'recInstHub3']
  const extraInstitutions: AirtableRecord[] = Array.from({ length: 4 }, (_, i) => ({
    id: `recInstHub${i}`,
    fields: {
      [F.institutions.name]: `Miami field anchor ${i + 1}`,
      [F.institutions.city]: 'Miami',
      [F.institutions.miami]: true,
      [F.institutions.relationshipStrength]: 'Strong',
    },
  }))
  const extraPeople: AirtableRecord[] = Array.from({ length: 41 }, (_, i) => ({
    id: `recPgen${i}`,
    fields: {
      [F.people.name]: `Network contact ${i + 1}`,
      [F.people.institution]: [demoInstitutionIds[i % demoInstitutionIds.length]!],
      [F.people.contactCategory]: ['Artist', 'Connector', 'Partner'][i % 3],
      [F.people.warmth]: 'Warm',
      [F.people.miami]: true,
    },
  }))
  const extraInteractions: AirtableRecord[] = Array.from({ length: 42 }, (_, i) => ({
    id: `recIntGen${i}`,
    fields: {
      [F.interactions.date]: new Date(Date.now() - 864e5 * (i % 38)).toISOString().slice(0, 10),
      [F.interactions.type]: 'Meet',
      [F.interactions.people]: [`recPgen${i}`, `recPgen${(i + 1) % 41}`],
      [F.interactions.institution]: ['recInst1'],
    },
  }))

  const seedCandidates: AirtableRecord[] = [
    {
      id: 'recS1',
      fields: {
        [F.seedCandidates.candidateName]: 'Lauren Shapiro',
        [F.seedCandidates.constituentLabel]: 'Media Artist',
        [F.seedCandidates.roleType]: 'Artist',
        [F.seedCandidates.institutionSource]: 'Locust Projects',
        [F.seedCandidates.graphLayer]: 'Both',
        [F.seedCandidates.demoReadiness]: 'Needs Image / Link',
        [F.seedCandidates.publicNodeSummary]:
          'Miami-based media artist working across video, installation, and digital identity.',
        [F.seedCandidates.miamiConnectionType]: 'Miami-based',
        [F.seedCandidates.nodePriority]: 'Large Node',
        [F.seedCandidates.suggestedPracticeTags]: ['Video', 'Installation'],
        [F.seedCandidates.reviewStatus]: 'Approved for First 30',
      },
    },
    {
      id: 'recS2',
      fields: {
        [F.seedCandidates.candidateName]: 'Research Node Example',
        [F.seedCandidates.constituentLabel]: 'Creative Technologist',
        [F.seedCandidates.institutionSource]: 'Bakehouse Art Complex',
        [F.seedCandidates.graphLayer]: 'Research Node',
        [F.seedCandidates.demoReadiness]: 'Needs Review',
        [F.seedCandidates.publicNodeSummary]: 'Creative technologist connected to Miami digital lab culture.',
        [F.seedCandidates.miamiConnectionType]: 'Miami institution connection',
        [F.seedCandidates.nodePriority]: 'Research Node',
        [F.seedCandidates.suggestedPracticeTags]: ['Creative Technology', 'Web'],
      },
    },
  ]

  return {
    people: [...people, ...extraPeople],
    seedCandidates,
    institutions: [...institutions, ...extraInstitutions],
    opportunities,
    interactions: [...interactions, ...extraInteractions],
    campaigns,
  }
}

export function getSampleGraphPayloadLegacy(surface: DccNetworkGraphSurface): DccNetworkGraphPayload {
  return getSampleGraphPayload({ surface })
}

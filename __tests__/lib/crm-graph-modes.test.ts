import { buildCrmGraphElements } from '@/lib/airtable/crm-graph-transform'
import { CRM_GRAPH_FIELD_MAP } from '@/lib/airtable/crm-graph-field-map'
import { getSampleCrmTables } from '@/lib/marketing/fixtures/dcc-crm-graph-sample'
import type { DccGraphNodeData } from '@/lib/marketing/dcc-crm-graph-types'

const PF = CRM_GRAPH_FIELD_MAP.people
const SF = CRM_GRAPH_FIELD_MAP.seedCandidates

describe('graph modes', () => {
  it('research mode anonymizes seed candidates on public visibility', () => {
    const tables = {
      people: [],
      seedCandidates: [
        {
          id: 'recS1',
          fields: {
            [SF.candidateName]: 'Lauren Shapiro',
            [SF.constituentLabel]: 'Media Artist',
            [SF.graphLayer]: 'Research Node',
            [SF.demoReadiness]: 'Needs Review',
          },
        },
      ],
      institutions: [],
      opportunities: [],
      interactions: [],
      campaigns: [],
    }
    const els = buildCrmGraphElements(tables, { surface: 'explorer', mode: 'research', visibility: 'public' })
    const node = els.find(
      (e) => 'kind' in e.data && (e.data as DccGraphNodeData).kind === 'seedCandidate'
    )?.data as DccGraphNodeData
    expect(node?.displayLabel).toBe('Media Artist')
    expect(node?.anonymized).toBe(true)
    expect(node?.label).toBe('Lauren Shapiro')
  })

  it('combined mode dedupes seed when person exists', () => {
    const tables = {
      people: [
        {
          id: 'recP1',
          fields: {
            [PF.name]: 'Lauren Shapiro',
            [PF.graphLayer]: 'Both',
            [PF.publicProfileConsent]: 'Public Listing OK',
          },
        },
      ],
      seedCandidates: [
        {
          id: 'recS1',
          fields: {
            [SF.candidateName]: 'Lauren Shapiro',
            [SF.constituentLabel]: 'Media Artist',
            [SF.graphLayer]: 'Both',
            [SF.publicNodeSummary]: 'Seed summary context',
          },
        },
      ],
      institutions: [],
      opportunities: [],
      interactions: [],
      campaigns: [],
    }
    const els = buildCrmGraphElements(tables, { surface: 'explorer', mode: 'combined', visibility: 'public' })
    const people = els.filter(
      (e) => 'kind' in e.data && (e.data as DccGraphNodeData).kind === 'person'
    )
    const seeds = els.filter(
      (e) => 'kind' in e.data && (e.data as DccGraphNodeData).kind === 'seedCandidate'
    )
    expect(people.length).toBe(1)
    expect(seeds.length).toBe(0)
    const person = people[0]!.data as DccGraphNodeData
    expect(person.publicNodeSummary).toBe('Seed summary context')
  })

  it('excludes Do Not Show demo readiness', () => {
    const tables = getSampleCrmTables()
    tables.seedCandidates.push({
      id: 'recHidden',
      fields: {
        [SF.candidateName]: 'Hidden Candidate',
        [SF.graphLayer]: 'Research Node',
        [SF.demoReadiness]: 'Do Not Show',
      },
    })
    const els = buildCrmGraphElements(tables, { surface: 'explorer', mode: 'research', visibility: 'public' })
    const labels = els
      .filter((e) => 'kind' in e.data && !('source' in e.data))
      .map((e) => (e.data as DccGraphNodeData).label)
    expect(labels).not.toContain('Hidden Candidate')
  })
})

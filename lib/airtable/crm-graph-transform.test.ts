import { buildCrmGraphElements } from './crm-graph-transform'
import { CRM_GRAPH_FIELD_MAP } from './crm-graph-field-map'
import { filterGraphForHome, HOME_GRAPH_MAX_TOTAL_NODES, scorePersonNode } from './crm-graph-home-filter'
import { getSampleCrmTables, getSampleGraphPayload } from '@/lib/marketing/fixtures/dcc-crm-graph-sample'
import type { DccGraphNodeData } from '@/lib/marketing/dcc-crm-graph-types'

const PF = CRM_GRAPH_FIELD_MAP.people

describe('buildCrmGraphElements', () => {
  it('creates person and institution nodes from internal sample tables', () => {
    const tables = getSampleCrmTables()
    const els = buildCrmGraphElements(tables, { surface: 'home', mode: 'admin', visibility: 'internal' })
    const nodes = els.filter((e) => 'kind' in e.data && !('source' in e.data)).map((e) => e.data as DccGraphNodeData)
    expect(nodes.some((n) => n.kind === 'person' && n.label === 'Alex Rivera')).toBe(true)
    expect(nodes.some((n) => n.kind === 'institution' && n.label === 'Bakehouse Art Complex')).toBe(true)
  })

  it('includes opportunities on explorer surface in combined mode', () => {
    const tables = getSampleCrmTables()
    const els = buildCrmGraphElements(tables, { surface: 'explorer', mode: 'combined', visibility: 'internal' })
    const nodes = els.filter((e) => 'kind' in e.data && !('source' in e.data)).map((e) => e.data as DccGraphNodeData)
    expect(nodes.some((n) => n.kind === 'opportunity')).toBe(true)
  })

  it('merges interaction weight into edges', () => {
    const tables = getSampleCrmTables()
    const els = buildCrmGraphElements(tables, { surface: 'explorer', mode: 'admin', visibility: 'internal' })
    const edges = els.filter((e) => 'source' in e.data)
    expect(edges.length).toBeGreaterThan(0)
  })

  it('creates stub institution nodes from people links when Institutions table is empty', () => {
    const tables = {
      people: [
        {
          id: 'recPerson1',
          fields: {
            [PF.name]: 'Synthetic Test Person',
            [PF.publicProfileConsent]: 'Public Listing OK',
            [PF.graphLayer]: 'Network Node',
            [PF.institution]: ['recInstOnlyOnPerson'],
          },
        },
      ],
      seedCandidates: [],
      institutions: [],
      opportunities: [],
      interactions: [],
      campaigns: [],
    }
    const els = buildCrmGraphElements(tables, 'home')
    const nodes = els.filter((e) => 'kind' in e.data && !('source' in e.data)).map((e) => e.data as DccGraphNodeData)
    const stub = nodes.find((n) => n.id === 'institution:recInstOnlyOnPerson')
    expect(stub?.kind).toBe('institution')
    expect(stub?.label).toBe('Organization')
    const edges = els.filter((e) => 'source' in e.data)
    expect(edges.some((e) => e.data.kind === 'affiliated_with')).toBe(true)
  })

  it('never exposes website-bound People or their private affiliations through legacy public consent', () => {
    const tables = {
      people: [{ id: 'recBound', fields: {
        [PF.name]: 'Private website member',
        [PF.publicProfileConsent]: 'Public Listing OK',
        [PF.graphLayer]: 'Network Node',
        [PF.institution]: ['recPrivateAffiliation'],
        'DCC Website Member Binding ID': 'synthetic-binding',
      }}],
      seedCandidates: [], institutions: [], opportunities: [], interactions: [], campaigns: [],
    }
    for (const surface of ['home','explorer'] as const) {
      const publicGraph = buildCrmGraphElements(tables, { surface, mode:'active', visibility:'public' })
      expect(JSON.stringify(publicGraph)).not.toContain('Private website member')
      expect(JSON.stringify(publicGraph)).not.toContain('recBound')
      expect(JSON.stringify(publicGraph)).not.toContain('recPrivateAffiliation')
    }
    const internal = buildCrmGraphElements(tables, { surface:'explorer', mode:'admin', visibility:'internal' })
    expect(JSON.stringify(internal)).toContain('Private website member')
  })

  it('excludes people without public listing consent on public surfaces', () => {
    const tables = {
      people: [
        {
          id: 'recHidden',
          fields: {
            [PF.name]: 'Hidden Person',
            [PF.publicProfileConsent]: 'Ask Before Publishing',
            [PF.graphLayer]: 'Network Node',
          },
        },
        {
          id: 'recPublic',
          fields: {
            [PF.name]: 'Public Person',
            [PF.publicProfileConsent]: 'Public Listing OK',
            [PF.graphLayer]: 'Network Node',
          },
        },
        {
          id: 'recLegacy',
          fields: {
            [PF.name]: 'Legacy Person',
          },
        },
      ],
      seedCandidates: [],
      institutions: [],
      opportunities: [],
      interactions: [],
      campaigns: [],
    }
    const els = buildCrmGraphElements(tables, 'home')
    const labels = els
      .filter((e) => 'kind' in e.data && !('source' in e.data))
      .map((e) => (e.data as DccGraphNodeData).label)
    expect(labels).toContain('Public Person')
    expect(labels).not.toContain('Legacy Person')
    expect(labels).not.toContain('Hidden Person')
  })
})

describe('filterGraphForHome', () => {
  it('returns subset from explorer payload', () => {
    const full = getSampleGraphPayload({ surface: 'explorer', mode: 'admin', visibility: 'internal' })
    const home = filterGraphForHome(full, 2)
    const people = home.elements.filter(
      (e) => 'kind' in e.data && !('source' in e.data) && (e.data as DccGraphNodeData).kind === 'person'
    )
    expect(people.length).toBeLessThanOrEqual(2)
  })

  it('public home fixture does not expose people without consent', () => {
    const home = getSampleGraphPayload('home')
    expect(home.meta.nodeCount).toBeLessThanOrEqual(HOME_GRAPH_MAX_TOTAL_NODES)
    expect(home.elements.filter((e) => 'kind' in e.data && !('source' in e.data) && e.data.kind === 'person')).toHaveLength(0)
  })
})

describe('scorePersonNode', () => {
  it('scores Miami warm artist higher', () => {
    const hi: DccGraphNodeData = {
      id: 'person:x',
      kind: 'person',
      provenance: 'people',
      label: 'X',
      displayLabel: 'X',
      miami: true,
      warmth: 'Very Warm',
      contactCategory: 'Artist',
    }
    const lo: DccGraphNodeData = {
      id: 'person:y',
      kind: 'person',
      provenance: 'people',
      label: 'Y',
      displayLabel: 'Y',
      miami: false,
      warmth: 'Cold',
      contactCategory: 'Other',
    }
    expect(scorePersonNode(hi)).toBeGreaterThan(scorePersonNode(lo))
  })
})

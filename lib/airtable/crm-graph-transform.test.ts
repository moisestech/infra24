import { buildCrmGraphElements } from './crm-graph-transform'
import { CRM_GRAPH_FIELD_MAP } from './crm-graph-field-map'
import { filterGraphForHome, scorePersonNode } from './crm-graph-home-filter'
import { getSampleCrmTables, getSampleGraphPayload } from '@/lib/marketing/fixtures/dcc-crm-graph-sample'
import type { DccGraphNodeData } from '@/lib/marketing/dcc-crm-graph-types'

const PF = CRM_GRAPH_FIELD_MAP.people

describe('buildCrmGraphElements', () => {
  it('creates person and institution nodes from sample tables', () => {
    const tables = getSampleCrmTables()
    const els = buildCrmGraphElements(tables, 'home')
    const nodes = els.filter((e) => 'kind' in e.data && !('source' in e.data)).map((e) => e.data as DccGraphNodeData)
    expect(nodes.some((n) => n.kind === 'person' && n.label === 'Alex Rivera')).toBe(true)
    expect(nodes.some((n) => n.kind === 'institution' && n.label === 'Oolite Arts')).toBe(true)
  })

  it('includes opportunities on explorer surface', () => {
    const tables = getSampleCrmTables()
    const els = buildCrmGraphElements(tables, 'explorer')
    const nodes = els.filter((e) => 'kind' in e.data && !('source' in e.data)).map((e) => e.data as DccGraphNodeData)
    expect(nodes.some((n) => n.kind === 'opportunity')).toBe(true)
  })

  it('merges interaction weight into edges', () => {
    const tables = getSampleCrmTables()
    const els = buildCrmGraphElements(tables, 'explorer')
    const edges = els.filter((e) => 'source' in e.data)
    expect(edges.length).toBeGreaterThan(0)
  })

  it('creates stub institution nodes from people links when Institutions table is empty', () => {
    const tables = {
      people: [
        {
          id: 'recPerson1',
          fields: {
            [PF.name]: 'Jordan Lee',
            [PF.institution]: ['recInstOnlyOnPerson'],
          },
        },
      ],
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
})

describe('filterGraphForHome', () => {
  it('returns subset from explorer payload', () => {
    const full = getSampleGraphPayload('explorer')
    const home = filterGraphForHome(full, 2)
    const people = home.elements.filter(
      (e) => 'kind' in e.data && !('source' in e.data) && (e.data as DccGraphNodeData).kind === 'person'
    )
    expect(people.length).toBeLessThanOrEqual(2)
  })
})

describe('scorePersonNode', () => {
  it('scores Miami warm artist higher', () => {
    const hi: DccGraphNodeData = {
      id: 'person:x',
      kind: 'person',
      label: 'X',
      miami: true,
      warmth: 'Very Warm',
      contactCategory: 'Artist',
    }
    const lo: DccGraphNodeData = {
      id: 'person:y',
      kind: 'person',
      label: 'Y',
      miami: false,
      warmth: 'Cold',
      contactCategory: 'Other',
    }
    expect(scorePersonNode(hi)).toBeGreaterThan(scorePersonNode(lo))
  })
})

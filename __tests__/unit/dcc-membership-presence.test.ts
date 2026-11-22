import {
  makeMembershipPresenceGraph,
  MEMBER_PRESENCE_SOURCE,
  PUBLIC_FOUNDERS,
} from '../../lib/dcc/artwork/member-presence'
import { makePeoplePracticeGraph } from '../../lib/dcc/artwork/people-practice-graph'

describe('DCC public network: client rendering data', () => {
  it('builds the real cofounding edge without an undefined founders variable', () => {
    const graph = makeMembershipPresenceGraph()
    expect(graph.marks).toHaveLength(MEMBER_PRESENCE_SOURCE.minimumCount)
    expect(graph.connections).toEqual([{
      from: PUBLIC_FOUNDERS[0].id,
      to: PUBLIC_FOUNDERS[1].id,
      kind: 'documented-cofounding',
    }])
  })

  it('keeps public links valid at small membership counts', () => {
    expect(makeMembershipPresenceGraph(0)).toEqual({ marks: [], connections: [] })
    expect(makeMembershipPresenceGraph(1).connections).toEqual([])
    expect(makeMembershipPresenceGraph(2).connections).toHaveLength(1)
    expect(makeMembershipPresenceGraph(3).connections).toHaveLength(1)
  })

  it('can initialize the 2D and 3D network from the same model', () => {
    const graph = makePeoplePracticeGraph()
    expect(graph.marks.length).toBe(MEMBER_PRESENCE_SOURCE.minimumCount)
    expect(graph.connections).toHaveLength(1)
    expect(graph.practices).toHaveLength(6)
    const ids = new Set([...graph.marks, ...graph.practices].map((node) => node.id))
    for (const link of graph.connections) {
      expect(ids.has(link.from)).toBe(true)
      expect(ids.has(link.to)).toBe(true)
    }
    for (const link of graph.practiceEdges) {
      expect(ids.has(link.source)).toBe(true)
      expect(ids.has(link.target)).toBe(true)
    }
  })
})

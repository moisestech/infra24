import {
  MEMBER_PRESENCE_SOURCE, makeMembershipPresenceGraph, presenceSpherePosition,
} from '../member-presence'

describe('DCC founder-reported membership scale', () => {
  it('shows the mathematical minimum for more than 100 reported members, without invented edges', () => {
    expect(MEMBER_PRESENCE_SOURCE.reportedLabel).toBe('100+')
    expect(MEMBER_PRESENCE_SOURCE.minimumCount).toBe(101)
    expect(MEMBER_PRESENCE_SOURCE.status).toContain('awaiting roster reconciliation')
    const graph = makeMembershipPresenceGraph()
    expect(graph.marks).toHaveLength(101)
    expect(graph.connections).toEqual([])
    expect(new Set(graph.marks.map((m) => m.id)).size).toBe(101)
  })
  it('contains no mapped member IDs or personal attributes', () => {
    for (const mark of makeMembershipPresenceGraph().marks) {
      expect(mark.kind).toBe('membership-mark')
      expect(Object.keys(mark).sort()).toEqual(['id', 'kind', 'label'])
      expect(mark.id).toMatch(/^member-mark-\d{3}$/)
    }
  })
  it('can be updated to a reconciled aggregate without changing node semantics', () => {
    expect(makeMembershipPresenceGraph(114).marks).toHaveLength(114)
    expect(makeMembershipPresenceGraph(114).connections).toEqual([])
    expect(makeMembershipPresenceGraph(-1).marks).toHaveLength(0)
  })
  it('places the same membership-presence marks at stable 3D coordinates', () => {
    const a = presenceSpherePosition(26, 101)
    expect(a).toEqual(presenceSpherePosition(26, 101))
    expect(Object.values(a).every(Number.isFinite)).toBe(true)
  })
})

import {
  MEMBER_PRESENCE_SOURCE, PUBLIC_FOUNDERS, PUBLIC_ARTISTS, makeMembershipPresenceGraph, presenceSpherePosition,
} from '../member-presence'

describe('DCC membership presence, without invented social or poll data', () => {
  it('represents the reported >100 minimum as 101 positions including three visible artists', () => {
    const graph = makeMembershipPresenceGraph()
    expect(MEMBER_PRESENCE_SOURCE.minimumCount).toBe(101)
    expect(MEMBER_PRESENCE_SOURCE.reportedLabel).toBe('100+')
    expect(graph.marks).toHaveLength(101)
    expect(new Set(graph.marks.map((m) => m.id)).size).toBe(101)
    expect(graph.marks.filter((m) => m.kind === 'public-cofounder')).toHaveLength(2)
    expect(graph.marks.filter((m) => m.kind === 'public-artist')).toHaveLength(1)
    expect(graph.marks.filter((m) => m.kind === 'anonymous-presence')).toHaveLength(98)
    expect(graph.marks.slice(0, 2)).toEqual([...PUBLIC_FOUNDERS])
    expect(graph.marks.slice(0, 3)).toEqual([...PUBLIC_ARTISTS])
    expect(graph.marks[2]).toMatchObject({ id: 'angelo-caruso', label: 'Angelo Caruso' })
  })

  it('draws only the documented DCC cofounder relationship', () => {
    const graph = makeMembershipPresenceGraph()
    expect(graph.connections).toEqual([{
      from: 'moises-sanabria',
      to: 'fabiola-larios',
      kind: 'documented-cofounding',
    }])
    expect(graph.connections.every((e) =>
      graph.marks.some((n) => n.id === e.from) &&
      graph.marks.some((n) => n.id === e.to)
    )).toBe(true)
  })

  it('does not derive individual IDs, relationships, or preferences for anonymous marks', () => {
    const anonymous = makeMembershipPresenceGraph().marks.filter((m) => m.kind === 'anonymous-presence')
    expect(anonymous.every((mark) => Object.keys(mark).sort().join(',') === 'id,kind,label')).toBe(true)
    expect(anonymous.every((mark) => /^anonymous-\d{3}$/.test(mark.id))).toBe(true)
    expect(anonymous.every((mark) => !('interests' in mark) && !('whatsAppId' in mark))).toBe(true)
  })

  it('can be updated to an audited count without inventing other social edges', () => {
    const graph = makeMembershipPresenceGraph(114)
    expect(graph.marks).toHaveLength(114)
    expect(graph.marks.filter((mark) => mark.kind === 'anonymous-presence')).toHaveLength(111)
    expect(graph.connections).toHaveLength(1)
    expect(makeMembershipPresenceGraph(0).marks).toEqual([])
    expect(makeMembershipPresenceGraph(1).connections).toEqual([])
  })

  it('uses stable, deterministic geometry, not recovered WhatsApp positions', () => {
    expect(presenceSpherePosition(21, 99)).toEqual(presenceSpherePosition(21, 99))
    expect(Object.values(presenceSpherePosition(21, 99)).every(Number.isFinite)).toBe(true)
  })
})

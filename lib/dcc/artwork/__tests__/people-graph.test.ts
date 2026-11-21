import {
  makeIllustrativePeopleGraph,
  projectApprovedPersonGraph,
  SAMPLE_PEOPLE,
  studyPosition,
} from '../people-graph'

describe('The Network Makes Itself — people and connections', () => {
  it('represents people as nodes and only connects person endpoints', () => {
    const graph = makeIllustrativePeopleGraph()
    const ids = new Set(graph.people.map((p) => p.id))
    expect(ids.size).toBe(graph.people.length)
    expect(graph.people).toHaveLength(30)
    expect(graph.connections.length).toBeGreaterThan(30)
    expect(graph.people.every((p) => p.illustrated === true)).toBe(true)
    expect(graph.connections.every((edge) =>
      ids.has(edge.source) && ids.has(edge.target) &&
      edge.source !== edge.target && edge.kind === 'illustrative'
    )).toBe(true)
    expect(graph.people.every((p) => !p.id.startsWith('hub:'))).toBe(true)
    expect(SAMPLE_PEOPLE.every((person) =>
      !('email' in person) && !('crmId' in person) && !('name' in person)
    )).toBe(true)
  })

  it('adds a purely local, person-to-person illustrated link', () => {
    const baseline = makeIllustrativePeopleGraph()
    const changed = makeIllustrativePeopleGraph({ group: 'code', signal: 'offer' })
    expect(changed.people).toHaveLength(baseline.people.length + 1)
    expect(changed.connections).toHaveLength(baseline.connections.length + 1)
    expect(changed.connections[changed.connections.length - 1].source).toBe('visitor-local')
    expect(changed.connections[changed.connections.length - 1].kind).toBe('local')
    expect(changed.people[changed.people.length - 1].activity).toBe('exchange')
  })

  it('exports stable vector coordinates without representing a real person', () => {
    const p = studyPosition('position-05')
    expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true)
    expect(studyPosition('position-05')).toEqual(p)
  })
})

describe('publishable person connections require consent from both endpoints', () => {
  const people = [
    { artworkId: 'a', publicArtworkConsent: true, consentVersion: 'v1', withdrawn: false },
    { artworkId: 'b', publicArtworkConsent: true, consentVersion: 'v1', withdrawn: false },
    { artworkId: 'c', publicArtworkConsent: false, consentVersion: null, withdrawn: false },
    { artworkId: 'd', publicArtworkConsent: true, consentVersion: 'v1', withdrawn: true },
  ]

  it('never publishes raw relationships based on internal introduction status alone', () => {
    const result = projectApprovedPersonGraph(people, [
      { from: 'a', to: 'b', fromPublicEdgeConsent: true, toPublicEdgeConsent: true, publishedAgreementVersion: 'v1', withdrawn: false },
      { from: 'a', to: 'c', fromPublicEdgeConsent: true, toPublicEdgeConsent: true, publishedAgreementVersion: 'v1', withdrawn: false },
      { from: 'a', to: 'd', fromPublicEdgeConsent: true, toPublicEdgeConsent: true, publishedAgreementVersion: 'v1', withdrawn: false },
      { from: 'b', to: 'a', fromPublicEdgeConsent: true, toPublicEdgeConsent: false, publishedAgreementVersion: 'v1', withdrawn: false },
      { from: 'a', to: 'b', fromPublicEdgeConsent: true, toPublicEdgeConsent: true, publishedAgreementVersion: null, withdrawn: false },
      { from: 'a', to: 'b', fromPublicEdgeConsent: true, toPublicEdgeConsent: true, publishedAgreementVersion: 'v1', withdrawn: true },
    ])
    expect(result.people).toEqual([{ id: 'a' }, { id: 'b' }])
    expect(result.connections).toEqual([{ source: 'a', target: 'b' }])
  })
})

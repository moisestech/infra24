import { makePeoplePracticeGraph, INTEREST_POLL_CATEGORIES, getPracticeNode, isPracticeNode } from '../people-practice-graph'
import { DCC_DISCOVERY_POLL } from '../discovery-poll'
import { PILOT_PREVIEWS } from '@/lib/dcc/community/atlas'

describe('people and practice network from public source data', () => {
  it('includes real 100+ member scale with exactly three publicly featured people', () => {
    const graph = makePeoplePracticeGraph()
    expect(graph.marks).toHaveLength(101)
    expect(graph.marks.filter((mark) => mark.kind !== 'anonymous-presence').map((mark) => mark.id))
      .toEqual(['moises-sanabria', 'fabiola-larios', 'angelo-caruso'])
    expect(graph.marks.filter((mark) => mark.kind === 'anonymous-presence')).toHaveLength(98)
  })

  it('makes six practice nodes whose counts are real aggregate poll selections', () => {
    const graph = makePeoplePracticeGraph()
    expect(graph.practices).toHaveLength(6)
    expect(graph.practices.map((p) => [p.choiceId, p.count])).toEqual(
      DCC_DISCOVERY_POLL.choices.map((choice) => [choice.id, choice.count])
    )
    expect(graph.practices.reduce((sum, p) => sum + p.count, 0)).toBe(72)
  })

  it('links Angelo to fabrication and interactive using the Atlas editorial profile, not the poll', () => {
    const graph = makePeoplePracticeGraph()
    const angelo = graph.practiceEdges.filter((edge) => edge.source === 'angelo-caruso')
    expect(angelo.map((edge) => edge.target)).toEqual(['practice-fabrication', 'practice-xr'])
    expect(angelo.every((edge) => edge.evidence === 'public-Atlas-editorial-profile')).toBe(true)
    expect(angelo.every((edge) => edge.kind === 'listed-practice')).toBe(true)
  })

  it('never turns aggregate poll voters into member-level links', () => {
    const graph = makePeoplePracticeGraph()
    expect(graph.practiceEdges.every((edge) => PILOT_PREVIEWS.some((p) => p.slug === edge.source))).toBe(true)
    expect(graph.practiceEdges.every((edge) => !edge.source.startsWith('anonymous-'))).toBe(true)
    expect(graph.practiceEdges.length).toBe(8)
    expect(graph.connections).toEqual([{
      from: 'moises-sanabria', to: 'fabiola-larios', kind: 'documented-cofounding',
    }])
  })

  it('maps the public practice vocabulary to the poll vocabulary exactly once', () => {
    expect(INTEREST_POLL_CATEGORIES.making).toBe('fabrication')
    expect(INTEREST_POLL_CATEGORIES.interactive).toBe('xr')
    expect(isPracticeNode('practice-xr')).toBe(true)
    expect(isPracticeNode('practice-foobar')).toBe(false)
    expect(getPracticeNode('code')).toBe('practice-code')
  })
})

import { applyShowcaseExhibitionResponse } from '@/lib/memory-agent/apply-showcase-exhibition-response'
import {
  dccInstitutionalMemorySuggestedQuestions,
  mergeDccMemoryAgentSuggestedQuestions,
} from '@/lib/dcc/dcc-institutional-memory-chips'
import {
  matchEdgeZonesExhibitionQuestion,
  TOUCHING_GRASS_EXHIBITION,
} from '@/lib/marketing/edgezones-exhibition'
import type { MemoryAgentAskResult } from '@/types/memory-agent'

const EMPTY_RESULT: MemoryAgentAskResult = {
  answer: 'placeholder',
  artists: [],
  followUps: [],
  dataGaps: ['should clear'],
}

describe('matchEdgeZonesExhibitionQuestion', () => {
  it('matches Touching Grass exhibition questions', () => {
    expect(matchEdgeZonesExhibitionQuestion('Tell me about the Touching Grass exhibition.')).toBe(
      TOUCHING_GRASS_EXHIBITION
    )
    expect(matchEdgeZonesExhibitionQuestion('What is Touching Grass?')).toBe(TOUCHING_GRASS_EXHIBITION)
  })

  it('matches Edge Zones and Jordan Horton exhibition phrasing', () => {
    expect(matchEdgeZonesExhibitionQuestion('Tell me about the Edge Zones exhibition.')).toBe(
      TOUCHING_GRASS_EXHIBITION
    )
    expect(matchEdgeZonesExhibitionQuestion('Who is curating Jordan Horton exhibition?')).toBe(
      TOUCHING_GRASS_EXHIBITION
    )
  })

  it('returns undefined for unrelated questions', () => {
    expect(matchEdgeZonesExhibitionQuestion('What workshops are available?')).toBeUndefined()
  })
})

describe('dccInstitutionalMemorySuggestedQuestions', () => {
  it('does not promote the unrelated Edge Zones exhibition', () => {
    const chips = dccInstitutionalMemorySuggestedQuestions()
    expect(chips).not.toContain('Tell me about the Touching Grass exhibition.')
  })
})

describe('mergeDccMemoryAgentSuggestedQuestions', () => {
  it('keeps network suggestions without adding Touching Grass', () => {
    const merged = mergeDccMemoryAgentSuggestedQuestions([
      'Who has experience with public screens or documentation?',
    ])
    expect(merged).not.toContain('Tell me about the Touching Grass exhibition.')
    expect(merged).toContain('Which artists in the pilot work with born-digital or networked practice?')
  })
})

describe('applyShowcaseExhibitionResponse for dcc', () => {
  it('does not present the Edge Zones exhibition as a DCC showcase', () => {
    const result = applyShowcaseExhibitionResponse({
      orgSlug: 'dcc',
      question: 'Tell me about the Touching Grass exhibition.',
      result: { ...EMPTY_RESULT },
    })
    expect(result.answer).toBe('placeholder')
    expect(result.events).toBeUndefined()
    expect(result.dataGaps).toEqual(['should clear'])
  })

  it('does not override unrelated questions', () => {
    const result = applyShowcaseExhibitionResponse({
      orgSlug: 'dcc',
      question: 'Recommend participants for a clinic.',
      result: { ...EMPTY_RESULT },
    })

    expect(result.answer).toBe('placeholder')
    expect(result.dataGaps).toEqual(['should clear'])
  })
})

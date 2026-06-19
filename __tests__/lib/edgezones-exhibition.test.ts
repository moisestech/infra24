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
  it('includes the Touching Grass exhibition chip', () => {
    const chips = dccInstitutionalMemorySuggestedQuestions()
    expect(chips).toContain('Tell me about the Touching Grass exhibition.')
  })
})

describe('mergeDccMemoryAgentSuggestedQuestions', () => {
  it('appends exhibition chip without duplicating existing entries', () => {
    const merged = mergeDccMemoryAgentSuggestedQuestions([
      'Who has experience with public screens or documentation?',
    ])

    expect(merged).toContain('Tell me about the Touching Grass exhibition.')
    expect(merged.filter((q) => q === 'Tell me about the Touching Grass exhibition.')).toHaveLength(1)
  })
})

describe('applyShowcaseExhibitionResponse for dcc', () => {
  it('returns exhibition title, blurb, multiple artist cards, and clears data gaps', () => {
    const result = applyShowcaseExhibitionResponse({
      orgSlug: 'dcc',
      question: 'Tell me about the Touching Grass exhibition.',
      result: { ...EMPTY_RESULT },
    })

    expect(result.answer).toContain(TOUCHING_GRASS_EXHIBITION.workingTitle)
    expect(result.answer).toContain('Jordan Horton')
    expect(result.answer).toContain('"Touching Grass (working title) explores')
    expect(result.answer).toContain('AFK')
    expect(result.dataGaps).toEqual([])
    expect(result.artists?.length).toBe(7)
    expect(result.artists?.[0]?.name).toBe('Jordan Horton')
    expect(result.artists?.some((a) => a.name === 'Fabiola Larios')).toBe(true)
    expect(result.events?.[0]?.title).toBe('Touching Grass')
    expect(result.events?.[0]?.ctaUrl).toBe('/edgezones#exhibition')
    expect(result.events?.[0]?.curator).toBe('Jordan Horton')
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

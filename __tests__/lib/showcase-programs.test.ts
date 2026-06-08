import { applyShowcaseProgramResponse } from '@/lib/memory-agent/apply-showcase-program-response'
import {
  matchShowcaseProgramQuestion,
  YOUTH_ARTIST_RESIDENCY_SHOWCASE,
} from '@/lib/oolite/showcase-programs'

describe('matchShowcaseProgramQuestion', () => {
  it('matches Youth Artist Residency lookup questions', () => {
    expect(matchShowcaseProgramQuestion('Tell me about the Youth Artist Residency.')).toEqual(
      YOUTH_ARTIST_RESIDENCY_SHOWCASE
    )
    expect(matchShowcaseProgramQuestion('Who are the Youth Artist Residents?')).toEqual(
      YOUTH_ARTIST_RESIDENCY_SHOWCASE
    )
  })
})

describe('applyShowcaseProgramResponse', () => {
  it('returns program copy, resident cards, TTS, and follow-ups', () => {
    const result = applyShowcaseProgramResponse({
      orgSlug: 'oolite',
      question: 'Tell me about the Youth Artist Residency.',
      result: {
        answer: 'placeholder',
        artists: [],
        followUps: [],
        dataGaps: [],
      },
    })

    expect(result.spokenAnswer).toContain('Ana Blanco')
    expect(result.spokenAnswer).toContain('Gonzalo Hernandez')
    expect(result.answer).toContain('Little Haiti Cultural Complex')
    expect(result.artists).toHaveLength(5)
    expect(result.artists[0]?.name).toBe('Ana Blanco')
    expect(result.artists[0]?.galleryImages?.length).toBeGreaterThan(0)
    expect(result.followUps).toContain('When is the Youth Artist Residency exhibition?')
  })
})

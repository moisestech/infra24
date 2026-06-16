import { applyCapitalCampaignResponse } from '@/lib/memory-agent/apply-capital-campaign-response'
import {
  CAPITAL_CAMPAIGN_SHOWCASE,
  matchCapitalCampaignQuestion,
  OOLITE_CAPITAL_CAMPAIGN_URL,
  resolveCapitalCampaignSpokenAnswer,
} from '@/lib/oolite/capital-campaign-showcase'

describe('matchCapitalCampaignQuestion', () => {
  const examples = [
    "Tell me about Oolite's new campus in Little River.",
    'Who designed the new Oolite Arts campus?',
    'What will the Little River campus include?',
    'What is the timeline for the capital project?',
    'How will the public access the new campus?',
    "What is Oolite's educational role at the new campus?",
    'Tell me about the capital campaign.',
    'What is the status of the Barozzi Veiga campus?',
  ]

  it.each(examples)('matches capital campaign question: %s', (question) => {
    expect(matchCapitalCampaignQuestion(question)?.showcase).toEqual(
      CAPITAL_CAMPAIGN_SHOWCASE
    )
  })

  it('resolves topic-specific spoken answers', () => {
    expect(resolveCapitalCampaignSpokenAnswer('Who designed the new campus?')).toContain(
      'Barozzi Veiga'
    )
    expect(resolveCapitalCampaignSpokenAnswer('What is the permitting timeline?')).toContain(
      'permitting'
    )
    expect(resolveCapitalCampaignSpokenAnswer('How many art classes per year?')).toContain(
      '400'
    )
  })

  it('does not match unrelated questions', () => {
    expect(matchCapitalCampaignQuestion('Who are the 2026 Studio Residents?')).toBeUndefined()
  })
})

describe('applyCapitalCampaignResponse', () => {
  it('returns full talking points, gallery, event CTA, and follow-ups', () => {
    const result = applyCapitalCampaignResponse({
      orgSlug: 'oolite',
      question: "Tell me about Oolite's new campus in Little River.",
      result: {
        answer: 'placeholder',
        artists: [],
        followUps: [],
        dataGaps: ['should be cleared'],
      },
    })

    expect(result.answer).toContain('26,850-square-foot')
    expect(result.answer).toContain('Barozzi Veiga')
    expect(result.answer).toContain('Charles Benson')
    expect(result.answer).toContain('Clayton Campbell')
    expect(result.answer).toContain(OOLITE_CAPITAL_CAMPAIGN_URL)
    expect(result.spokenAnswer).toContain('Little River')
    expect(result.artists).toHaveLength(1)
    expect(result.artists[0]?.galleryImages).toHaveLength(3)
    expect(result.events?.[0]?.ctaUrl).toBe(OOLITE_CAPITAL_CAMPAIGN_URL)
    expect(result.followUps).toContain('Who designed the new Oolite Arts campus?')
    expect(result.dataGaps).toEqual([])
  })

  it('ignores non-oolite orgs', () => {
    const base = { answer: 'x', artists: [], followUps: [], dataGaps: [] }
    expect(
      applyCapitalCampaignResponse({
        orgSlug: 'bakehouse',
        question: 'Tell me about the capital campaign.',
        result: base,
      })
    ).toBe(base)
  })
})

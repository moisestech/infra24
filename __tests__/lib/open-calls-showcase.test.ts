import { applyOpenCallsResponse } from '@/lib/memory-agent/apply-open-calls-response'
import {
  findOpenCallOfferingByQuery,
  getPublicOpenCallOfferings,
  matchOpenCallsQuestion,
  OOLITE_ELLIES_OPEN_CALLS_URL,
  OOLITE_OPEN_CALLS_WINDOW,
  OPEN_CALLS_SHOWCASE,
  resolveOpenCallsSpokenAnswer,
} from '@/lib/oolite/open-calls-showcase'

describe('open-calls-showcase', () => {
  it('lists six public 2027 open calls plus two grantee admin forms', () => {
    expect(getPublicOpenCallOfferings()).toHaveLength(6)
  })

  it.each([
    'What are the 2027 open calls?',
    'How do I apply for The Ellies?',
    'How do I apply for the Studio Residency?',
    'When is the application deadline for 2027 open calls?',
    'Where do I submit my grant report?',
  ])('matches open calls question: %s', (question) => {
    expect(matchOpenCallsQuestion(question)?.showcase).toEqual(OPEN_CALLS_SHOWCASE)
  })

  it('resolves specific offering spoken answers', () => {
    const spoken = resolveOpenCallsSpokenAnswer('How do I apply for the Creator Award?')
    expect(spoken).toContain('348632')
    expect(findOpenCallOfferingByQuery('Home + Away')?.key).toBe('home_away_residency_2027')
  })
})

describe('applyOpenCallsResponse', () => {
  it('returns apply links, event cards, and deadline', () => {
    const result = applyOpenCallsResponse({
      orgSlug: 'oolite',
      question: 'What are the 2027 open calls?',
      result: { answer: 'x', artists: [], followUps: [], dataGaps: ['clear me'] },
    })

    expect(result.answer).toContain(OOLITE_ELLIES_OPEN_CALLS_URL)
    expect(result.answer).toContain(OOLITE_OPEN_CALLS_WINDOW.display)
    expect(result.answer).toContain('348632')
    expect(result.answer).toContain('355147')
    expect(result.events?.length).toBe(6)
    expect(result.answer).toContain('356110')
    expect(result.events?.[0]?.ctaLabel).toBe('Apply')
    expect(result.dataGaps).toEqual([])
  })
})

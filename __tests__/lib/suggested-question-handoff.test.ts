import {
  normalizeSuggestedQuestionKey,
  resolveSuggestedQuestionHandoff,
} from '@/lib/memory-agent/suggested-question-handoff'

describe('normalizeSuggestedQuestionKey', () => {
  it('lowercases and strips trailing punctuation', () => {
    expect(normalizeSuggestedQuestionKey("  What's happening this week?  ")).toBe(
      "what's happening this week"
    )
  })
})

describe('resolveSuggestedQuestionHandoff', () => {
  it('returns oolite welcome and canned preface for this week', () => {
    const lines = resolveSuggestedQuestionHandoff('oolite', "What's happening this week?")
    expect(lines.welcomeLine).toContain('Oolite Arts')
    expect(lines.welcomeLine).toContain('Oolite')
    expect(lines.prefaceLine).toMatch(/this week/i)
  })

  it('falls back to generic preface for unknown questions', () => {
    const lines = resolveSuggestedQuestionHandoff('oolite', 'Tell me about ceramic artists')
    expect(lines.welcomeLine).toContain('Oolite Arts')
    expect(lines.prefaceLine).toContain('ceramic artists')
  })

  it('works for bakehouse with generic preface', () => {
    const lines = resolveSuggestedQuestionHandoff(
      'bakehouse',
      'Who are alumni working with digital media?'
    )
    expect(lines.welcomeLine).toContain('Bakehouse')
    expect(lines.prefaceLine).toContain('digital media')
  })

  it('returns oolite preface for Shayla Marshall', () => {
    const lines = resolveSuggestedQuestionHandoff('oolite', 'Tell me about Shayla Marshall.')
    expect(lines.prefaceLine).toMatch(/Shayla Marshall/i)
  })

  it('returns oolite preface for Youth Artist Residency', () => {
    const lines = resolveSuggestedQuestionHandoff(
      'oolite',
      'Tell me about the Youth Artist Residency.'
    )
    expect(lines.prefaceLine).toMatch(/Youth Artist Residency/i)
  })
})

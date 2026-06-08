import { mergeAppSuggestedQuestions } from '@/lib/memory-agent/suggested-questions'
import { showcaseArtistSuggestedQuestions } from '@/lib/oolite/showcase-artists'

describe('mergeAppSuggestedQuestions', () => {
  it('adds missing showcase Tell me about chips after existing ones', () => {
    const merged = mergeAppSuggestedQuestions(
      [
        'What should visitors see at Oolite this week?',
        'Tell me about Mark Delmont.',
        'Tell me about Shayla Marshall.',
        'Who are the 2026 Studio Residents?',
      ],
      showcaseArtistSuggestedQuestions()
    )

    expect(merged).toEqual([
      'What should visitors see at Oolite this week?',
      'Tell me about Mark Delmont.',
      'Tell me about Shayla Marshall.',
      'Tell me about Ricardo E. Zulueta.',
      'Who are the 2026 Studio Residents?',
    ])
  })

  it('does not duplicate chips already present', () => {
    const base = ['Tell me about Ricardo E. Zulueta.', 'Tell me about Mark Delmont.']
    const merged = mergeAppSuggestedQuestions(base, showcaseArtistSuggestedQuestions())
    expect(merged.filter((q) => /ricardo/i.test(q))).toHaveLength(1)
  })
})

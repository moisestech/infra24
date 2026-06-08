import type { MemoryAgentDemoQuestion } from '@/lib/oolite/airtable-question-catalog-shared'

function sortAppSuggestedQuestions(
  questions: MemoryAgentDemoQuestion[]
): MemoryAgentDemoQuestion[] {
  return [...questions].sort((a, b) => {
    const oa = a.appDisplayOrder ?? 999
    const ob = b.appDisplayOrder ?? 999
    if (oa !== ob) return oa - ob
    return a.question.localeCompare(b.question)
  })
}

describe('app suggested question sort', () => {
  it('orders by App Display Order then question text', () => {
    const sorted = sortAppSuggestedQuestions([
      {
        id: 'a',
        question: 'Who are the 2026 Studio Residents?',
        publicSafe: true,
        showInApp: true,
        appDisplayOrder: 2,
        relatedRecognitionIds: [],
        group: 'working_now',
      },
      {
        id: 'b',
        question: 'Tell me about Mark Delmont.',
        publicSafe: true,
        showInApp: true,
        appDisplayOrder: 2,
        relatedRecognitionIds: [],
        group: 'working_now',
      },
      {
        id: 'c',
        question: 'Tell me about Shayla Marshall.',
        publicSafe: true,
        showInApp: true,
        appDisplayOrder: 3,
        relatedRecognitionIds: [],
        group: 'working_now',
      },
    ])

    expect(sorted.map((q) => q.question)).toEqual([
      'Tell me about Mark Delmont.',
      'Who are the 2026 Studio Residents?',
      'Tell me about Shayla Marshall.',
    ])
  })
})

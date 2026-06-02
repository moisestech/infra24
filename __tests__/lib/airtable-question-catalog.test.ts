import {
  DEMO_QUESTION_GROUP_LABELS,
  groupDemoQuestions,
  groupForDemoQuestion,
  type MemoryAgentDemoQuestion,
} from '@/lib/oolite/airtable-question-catalog'

function q(partial: Partial<MemoryAgentDemoQuestion> & { id: string; question: string }): MemoryAgentDemoQuestion {
  return {
    publicSafe: false,
    relatedRecognitionIds: [],
    group: 'working_now',
    ...partial,
  }
}

describe('airtable question catalog grouping', () => {
  it('maps phase 2 to institutional memory', () => {
    expect(groupForDemoQuestion('Phase 2', 'Recognition')).toBe('institutional_memory')
  })

  it('groups hero questions first within working now', () => {
    const grouped = groupDemoQuestions([
      q({ id: '1', question: 'B question', demoPriority: 'Medium', group: 'working_now' }),
      q({ id: '2', question: 'A hero', demoPriority: 'Hero', group: 'working_now' }),
    ])
    expect(grouped.working_now[0]?.question).toBe('A hero')
  })

  it('exposes all group labels', () => {
    expect(DEMO_QUESTION_GROUP_LABELS.working_now).toBe('Working Now')
    expect(DEMO_QUESTION_GROUP_LABELS.institutional_memory).toBe('Institutional Memory')
  })
})

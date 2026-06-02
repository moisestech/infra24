/** Client-safe types and labels for the Oolite Memory Agent demo question catalog. */

export type DemoQuestionGroup =
  | 'working_now'
  | 'hardening'
  | 'institutional_memory'
  | 'staff_intelligence'
  | 'future_direction'

export type MemoryAgentDemoQuestion = {
  id: string
  question: string
  questionCategory?: string
  capabilityPhase?: string
  demoPriority?: string
  audience?: string
  dataDomain?: string
  expectedAnswerPattern?: string
  demoAnswerNotes?: string
  supportStatus?: string
  publicSafe: boolean
  relatedRecognitionIds: string[]
  sourceTables?: string
  testStatus?: string
  lastTested?: string
  group: DemoQuestionGroup
}

export const DEMO_QUESTION_GROUP_LABELS: Record<DemoQuestionGroup, string> = {
  working_now: 'Working Now',
  hardening: 'Hardening',
  institutional_memory: 'Institutional Memory',
  staff_intelligence: 'Staff Intelligence',
  future_direction: 'Future Direction',
}

export const DEMO_QUESTION_GROUP_ORDER: DemoQuestionGroup[] = [
  'working_now',
  'hardening',
  'institutional_memory',
  'staff_intelligence',
  'future_direction',
]

export type LearningPath = 'easy' | 'structured' | 'ai-assisted'

export type GlossaryTerm = {
  term: string
  definition: string
  analogy?: string
}

export type ToolCard = {
  name: string
  feeling: string
  bestFor: string[]
  useWhen: string[]
}

export type ModeConfig = {
  title: string
  tools: string[]
  steps: string[]
  outcome: string
}

export type ChapterPath = {
  id: LearningPath
  title: string
  stack: string
  bestFor: string[]
  steps: string[]
}

export type ChapterData = {
  title: string
  subtitle: string
  description: string
  outcomes: string[]
  paths: ChapterPath[]
  glossary: GlossaryTerm[]
  tools: ToolCard[]
  promptPatterns: { label: string; example: string }[]
  modes: Record<'easy' | 'medium' | 'advanced', ModeConfig>
  reflection: string[]
}

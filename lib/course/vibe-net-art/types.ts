import type { GlossaryTerm, ModuleKey } from '@/lib/course/types'

export type { GlossaryTerm, GlossaryTermType, ModuleKey } from '@/lib/course/types'

export type VcnCourseIndexRow = {
  number: number
  title: string
  summary: string
  module: ModuleKey
  /** Target lesson slug under `/chapters/[slug]`; omit when this row is handbook-only. */
  chapterSlug?: string
  estimatedTimeLabel?: string
  difficultyLabel?: string
}

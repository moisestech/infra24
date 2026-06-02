import 'server-only'

import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'
import {
  OOLITE_AIRTABLE_BASE_ID,
  OOLITE_MEMORY_AGENT_QUESTION_CATALOG_TABLE,
} from '@/lib/oolite/airtable-recognitions-config'
import {
  type DemoQuestionGroup,
  type MemoryAgentDemoQuestion,
} from '@/lib/oolite/airtable-question-catalog-shared'

export type {
  DemoQuestionGroup,
  MemoryAgentDemoQuestion,
} from '@/lib/oolite/airtable-question-catalog-shared'
export {
  DEMO_QUESTION_GROUP_LABELS,
  DEMO_QUESTION_GROUP_ORDER,
} from '@/lib/oolite/airtable-question-catalog-shared'

export type DemoQuestionsFilter = {
  capabilityPhase?: string
  demoPriority?: string
  supportStatus?: string
  publicSafe?: boolean
  questionCategory?: string
  audience?: string
}

const f = OOLITE_MEMORY_AGENT_QUESTION_CATALOG_TABLE.fields

function cellStr(fields: Record<string, unknown>, fieldId: string): string | undefined {
  const raw = fields[fieldId]
  if (raw == null) return undefined
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length ? t : undefined
  }
  if (typeof raw === 'number' && !Number.isNaN(raw)) return String(raw)
  return undefined
}

function cellBool(fields: Record<string, unknown>, fieldId: string): boolean {
  const raw = fields[fieldId]
  if (raw === true) return true
  if (typeof raw === 'string') {
    const t = raw.trim().toLowerCase()
    return ['yes', 'true', '1', 'y', 'checked'].includes(t)
  }
  return false
}

function cellLinks(fields: Record<string, unknown>, fieldId: string): string[] {
  const raw = fields[fieldId]
  if (!Array.isArray(raw)) return []
  return raw.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
}

const DEMO_PRIORITY_ORDER: Record<string, number> = {
  hero: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export function groupForDemoQuestion(
  phase?: string,
  category?: string
): DemoQuestionGroup {
  const p = (phase || '').toLowerCase()
  const c = (category || '').toLowerCase()

  if (/future|direction|grant|curator-facing|roadmap/i.test(c)) return 'future_direction'
  if (/staff|governance|internal|missing images|blocked/i.test(c)) return 'staff_intelligence'
  if (/phase\s*3|staff intelligence/i.test(p)) return 'staff_intelligence'
  if (/phase\s*2|institutional|recognition|florida|consortium|ellies/i.test(p)) {
    return 'institutional_memory'
  }
  if (/hardening|1\.5|qa|test/i.test(p)) return 'hardening'
  if (/phase\s*4|future/i.test(p)) return 'future_direction'
  return 'working_now'
}

function mapCatalogRecord(record: AirtableRecord): MemoryAgentDemoQuestion | null {
  const fields = record.fields
  const question = cellStr(fields, f.question)
  if (!question) return null

  const capabilityPhase = cellStr(fields, f.capabilityPhase)
  const questionCategory = cellStr(fields, f.questionCategory)

  return {
    id: record.id,
    question,
    questionCategory,
    capabilityPhase,
    demoPriority: cellStr(fields, f.demoPriority),
    audience: cellStr(fields, f.audience),
    dataDomain: cellStr(fields, f.dataDomain),
    expectedAnswerPattern: cellStr(fields, f.expectedAnswerPattern),
    demoAnswerNotes: cellStr(fields, f.demoAnswerNotes),
    supportStatus: cellStr(fields, f.supportStatus),
    publicSafe: cellBool(fields, f.publicSafe),
    relatedRecognitionIds: cellLinks(fields, f.relatedRecognitionExhibition),
    sourceTables: cellStr(fields, f.sourceTables),
    testStatus: cellStr(fields, f.testStatus),
    lastTested: cellStr(fields, f.lastTested),
    group: groupForDemoQuestion(capabilityPhase, questionCategory),
  }
}

function matchesFilter(q: MemoryAgentDemoQuestion, filter: DemoQuestionsFilter): boolean {
  if (filter.capabilityPhase && q.capabilityPhase !== filter.capabilityPhase) return false
  if (filter.demoPriority && q.demoPriority !== filter.demoPriority) return false
  if (filter.supportStatus && q.supportStatus !== filter.supportStatus) return false
  if (filter.questionCategory && q.questionCategory !== filter.questionCategory) return false
  if (filter.audience && q.audience !== filter.audience) return false
  if (filter.publicSafe === true && !q.publicSafe) return false
  if (filter.publicSafe === false && q.publicSafe) return false
  return true
}

function sortDemoQuestions(questions: MemoryAgentDemoQuestion[]): MemoryAgentDemoQuestion[] {
  return [...questions].sort((a, b) => {
    const pa = DEMO_PRIORITY_ORDER[(a.demoPriority || '').toLowerCase()] ?? 9
    const pb = DEMO_PRIORITY_ORDER[(b.demoPriority || '').toLowerCase()] ?? 9
    if (pa !== pb) return pa - pb
    return a.question.localeCompare(b.question)
  })
}

export function groupDemoQuestions(
  questions: MemoryAgentDemoQuestion[]
): Record<DemoQuestionGroup, MemoryAgentDemoQuestion[]> {
  const out: Record<DemoQuestionGroup, MemoryAgentDemoQuestion[]> = {
    working_now: [],
    hardening: [],
    institutional_memory: [],
    staff_intelligence: [],
    future_direction: [],
  }
  for (const q of sortDemoQuestions(questions)) {
    out[q.group].push(q)
  }
  return out
}

export async function fetchOoliteDemoQuestions(
  filter: DemoQuestionsFilter = {}
): Promise<
  | { ok: true; questions: MemoryAgentDemoQuestion[]; grouped: Record<DemoQuestionGroup, MemoryAgentDemoQuestion[]> }
  | { ok: false; message: string }
> {
  const conn = getAlumniConnectionForOrg('oolite')
  if (!conn?.apiKey) {
    return { ok: false, message: 'Oolite Airtable is not configured.' }
  }

  try {
    const records = await fetchAllRecords(
      OOLITE_AIRTABLE_BASE_ID,
      OOLITE_MEMORY_AGENT_QUESTION_CATALOG_TABLE.id,
      conn.apiKey,
      { returnFieldsByFieldId: true }
    )

    const questions = records
      .map(mapCatalogRecord)
      .filter(Boolean)
      .filter((q) => matchesFilter(q!, filter)) as MemoryAgentDemoQuestion[]

    return { ok: true, questions, grouped: groupDemoQuestions(questions) }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, message }
  }
}

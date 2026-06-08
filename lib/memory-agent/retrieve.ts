import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { alumniDisplayName } from '@/lib/airtable/alumni-service'
import { personNameMatchesFeatured } from '@/lib/oolite/knowledge-cluster-ids'
import { rowToMemoryContextText } from '@/lib/memory-agent/governance'
const STOP = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'have',
  'are',
  'who',
  'what',
  'which',
  'about',
  'into',
  'their',
  'were',
  'been',
  'would',
  'could',
  'artists',
  'artist',
  'alumni',
  'oolite',
])

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP.has(t))
}

function haystackForRow(row: AlumniAirtableRow): string {
  const tags = [...row.topics, ...row.themes].join(' ')
  return [
    row.name,
    row.artistName,
    row.medium,
    row.program,
    row.cohort,
    row.year,
    row.location,
    row.studioNumber,
    row.currentAlumniStatus,
    tags,
    row.publicBio,
    row.artifacts,
    row.notes,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function keywordRetrieveScore(question: string, row: AlumniAirtableRow): number {
  const qTokens = tokenize(question)
  if (qTokens.length === 0) return 0
  const hay = haystackForRow(row)
  let hits = 0
  for (const t of qTokens) {
    if (hay.includes(t)) hits += 1
  }
  return hits / qTokens.length
}

export function buildEmbeddingInput(row: AlumniAirtableRow): string {
  const name = alumniDisplayName(row)
  const tags = [...row.topics, ...row.themes].join(', ')
  return [
    name,
    row.medium,
    row.program,
    row.year,
    row.location,
    tags,
    row.publicBio || row.artifacts || '',
  ]
    .filter(Boolean)
    .join(' | ')
    .slice(0, 8000)
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb)
  return denom === 0 ? 0 : dot / denom
}

export type ScoredAlumni = { row: AlumniAirtableRow; score: number }

export function rankAlumniForQuestion(
  rows: AlumniAirtableRow[],
  question: string,
  questionEmbedding: number[] | null,
  rowEmbeddings: Map<string, number[]>,
  options?: {
    featuredArtistNames?: string[]
    relatedPeopleIds?: string[]
  }
): ScoredAlumni[] {
  const featured = options?.featuredArtistNames ?? []
  const linkedIds = new Set(options?.relatedPeopleIds ?? [])
  const exhibitionQuestion =
    /\b(exhibit|exhibiting|exhibition|sites of the self|from within|who is in|which artists)\b/i.test(
      question
    )

  const scored: ScoredAlumni[] = []
  for (const row of rows) {
    const kw = keywordRetrieveScore(question, row)
    let sem = 0
    if (questionEmbedding && rowEmbeddings.has(row.id)) {
      sem = cosineSimilarity(questionEmbedding, rowEmbeddings.get(row.id)!)
      sem = (sem + 1) / 2
    }
    let boost = 0
    const display = alumniDisplayName(row)
    if (featured.some((name) => personNameMatchesFeatured(display, name))) {
      boost += exhibitionQuestion ? 0.35 : 0.15
    }
    const crmId = row.id.startsWith('crm_people:') ? row.id.slice('crm_people:'.length) : row.id
    if (linkedIds.has(crmId)) boost += 0.2
    const score = (questionEmbedding ? kw * 0.35 + sem * 0.65 : kw) + boost
    scored.push({ row, score })
  }
  scored.sort((a, b) => b.score - a.score)
  return scored
}

export function selectContextRows(ranked: ScoredAlumni[], maxRows: number): AlumniAirtableRow[] {
  return ranked.slice(0, maxRows).map((r) => r.row)
}

export function buildRetrievedContextBlock(rows: AlumniAirtableRow[]): string {
  return rows
    .map((row, i) => `--- Artist ${i + 1} ---\n${rowToMemoryContextText(row)}`)
    .join('\n\n')
}

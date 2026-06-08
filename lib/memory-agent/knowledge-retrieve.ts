import type { KnowledgeRecord } from '@/lib/memory-agent/knowledge-record'

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
  'week',
  'happening',
])

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP.has(t))
}

function haystackForKnowledgeRecord(r: KnowledgeRecord): string {
  return [
    r.title,
    r.summary,
    r.description,
    r.recordKind,
    r.location,
    r.curator,
    r.featuredArtists,
    r.instructor,
    ...(r.artistNames ?? []),
    ...(r.curatorNames ?? []),
    ...(r.programStaffNames ?? []),
    r.status,
    ...(r.tags || []),
    ...(r.topics || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function keywordRetrieveScoreForKnowledgeRecord(
  question: string,
  record: KnowledgeRecord
): number {
  const qTokens = tokenize(question)
  if (qTokens.length === 0) return 0
  const hay = haystackForKnowledgeRecord(record)
  let hits = 0
  for (const t of qTokens) {
    if (hay.includes(t)) hits += 1
  }
  return hits / qTokens.length
}

export function buildEmbeddingInputForKnowledgeRecord(r: KnowledgeRecord): string {
  return [
    r.recordKind,
    r.title,
    r.summary || r.description || '',
    r.location || '',
    r.curator || '',
    r.featuredArtists || '',
    r.instructor || '',
    (r.artistNames || []).join(', '),
    (r.curatorNames || []).join(', '),
    (r.programStaffNames || []).join(', '),
    (r.tags || []).join(', '),
    r.startsAt || '',
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

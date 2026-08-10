import { createClient } from '@/lib/supabase/server'
import type { MemoryAgentEmbeddingSourceType } from '@/lib/memory-agent/embedding-sync'

export type VectorMatchHit = {
  id: string
  organizationSlug: string
  sourceType: MemoryAgentEmbeddingSourceType
  sourceId: string
  chunkIndex: number
  title: string | null
  metadata: Record<string, unknown>
  similarity: number
}

export type VectorRetrieveResult = {
  ok: true
  hits: VectorMatchHit[]
  usedPgvector: boolean
} | {
  ok: false
  reason: 'no_client' | 'rpc_error' | 'empty_index'
  message?: string
}

/** Query pgvector index for hybrid retrieval boost and dcc_doc context. */
export async function queryMemoryAgentVectors(params: {
  orgSlug: string
  questionEmbedding: number[]
  limit?: number
  sourceTypes?: MemoryAgentEmbeddingSourceType[]
}): Promise<VectorRetrieveResult> {
  const { orgSlug, questionEmbedding, limit = 24, sourceTypes } = params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, reason: 'no_client', message: 'Supabase not configured' }
  }

  const supabase = createClient()

  const { data, error } = await supabase.rpc('match_memory_agent_embeddings', {
    query_embedding: questionEmbedding,
    match_org_slug: orgSlug.trim().toLowerCase(),
    match_count: limit,
    filter_source_types: sourceTypes?.length ? sourceTypes : null,
  })

  if (error) {
    if (/relation.*does not exist|function.*does not exist/i.test(error.message)) {
      return { ok: false, reason: 'empty_index', message: error.message }
    }
    return { ok: false, reason: 'rpc_error', message: error.message }
  }

  const rows = (data ?? []) as Array<{
    id: string
    organization_slug: string
    source_type: MemoryAgentEmbeddingSourceType
    source_id: string
    chunk_index: number
    title: string | null
    metadata: Record<string, unknown> | null
    similarity: number
  }>

  if (rows.length === 0) {
    return { ok: false, reason: 'empty_index' }
  }

  return {
    ok: true,
    usedPgvector: true,
    hits: rows.map((r) => ({
      id: r.id,
      organizationSlug: r.organization_slug,
      sourceType: r.source_type,
      sourceId: r.source_id,
      chunkIndex: r.chunk_index,
      title: r.title,
      metadata: r.metadata ?? {},
      similarity: r.similarity,
    })),
  }
}

/** Map source_id → vector similarity for ranking boost. */
export function vectorBoostMap(hits: VectorMatchHit[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const hit of hits) {
    const prev = map.get(hit.sourceId) ?? 0
    if (hit.similarity > prev) map.set(hit.sourceId, hit.similarity)
  }
  return map
}

export function buildDocContextFromVectorHits(hits: VectorMatchHit[]): string {
  const docHits = hits.filter((h) => h.sourceType === 'dcc_doc').slice(0, 6)
  if (!docHits.length) return ''

  return docHits
    .map((h, i) => {
      const body = typeof h.metadata.body === 'string' ? h.metadata.body : ''
      const file = typeof h.metadata.file === 'string' ? h.metadata.file : h.sourceId
      return `--- DCC reference ${i + 1} (${file}, chunk ${h.chunkIndex}) ---\nRecord id: ${h.sourceId}\n${body}`
    })
    .join('\n\n')
}

export function citationsFromContext(params: {
  contextRows: Array<{ id: string; name?: string; medium?: string }>
  programmingRows: Array<{ id: string; title: string; recordKind?: string }>
  docHits: VectorMatchHit[]
}): Array<{ id: string; type: MemoryAgentEmbeddingSourceType; title: string }> {
  const out: Array<{ id: string; type: MemoryAgentEmbeddingSourceType; title: string }> = []

  for (const row of params.contextRows) {
    out.push({
      id: row.id,
      type: 'alumni',
      title: row.name ?? row.id,
    })
  }
  for (const row of params.programmingRows) {
    out.push({
      id: row.id,
      type: 'programming',
      title: row.title,
    })
  }
  for (const hit of params.docHits) {
    out.push({
      id: hit.sourceId,
      type: 'dcc_doc',
      title: hit.title ?? hit.sourceId,
    })
  }

  const seen = new Set<string>()
  return out.filter((c) => {
    const key = `${c.type}:${c.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

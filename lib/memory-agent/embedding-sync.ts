import { createHash } from 'crypto'
import { readdir, readFile } from 'fs/promises'
import path from 'path'

import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { alumniDisplayName } from '@/lib/airtable/alumni-service'
import { buildEmbeddingInput } from '@/lib/memory-agent/retrieve'
import { buildEmbeddingInputForKnowledgeRecord } from '@/lib/memory-agent/knowledge-retrieve'
import type { KnowledgeRecord } from '@/lib/memory-agent/knowledge-record'
import { embedTexts, getOpenAIClient } from '@/lib/memory-agent/openai-client'
import { createClient } from '@/lib/supabase/server'

export type MemoryAgentEmbeddingSourceType =
  | 'alumni'
  | 'programming'
  | 'recognition'
  | 'dcc_doc'

export type MemoryAgentEmbeddingRow = {
  organization_slug: string
  source_type: MemoryAgentEmbeddingSourceType
  source_id: string
  chunk_index: number
  title: string | null
  content_hash: string
  embedding: number[]
  metadata: Record<string, unknown>
}

export function hashEmbeddingContent(text: string): string {
  return createHash('sha256').update(text.trim()).digest('hex')
}

/** Split markdown/plain text into ~500-token chunks (approx 2000 chars). */
export function chunkTextForEmbedding(text: string, maxChars = 2000): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const chunks: string[] = []
  let current = ''

  for (const para of paragraphs) {
    if (current.length + para.length + 2 <= maxChars) {
      current = current ? `${current}\n\n${para}` : para
    } else {
      if (current) chunks.push(current)
      if (para.length <= maxChars) {
        current = para
      } else {
        for (let i = 0; i < para.length; i += maxChars) {
          chunks.push(para.slice(i, i + maxChars))
        }
        current = ''
      }
    }
  }
  if (current) chunks.push(current)
  return chunks
}

export function alumniToEmbeddingRows(
  orgSlug: string,
  rows: AlumniAirtableRow[]
): Omit<MemoryAgentEmbeddingRow, 'embedding'>[] {
  return rows.map((row) => {
    const text = buildEmbeddingInput(row)
    return {
      organization_slug: orgSlug,
      source_type: 'alumni' as const,
      source_id: row.id,
      chunk_index: 0,
      title: alumniDisplayName(row),
      content_hash: hashEmbeddingContent(text),
      metadata: { body: text.slice(0, 8000) },
    }
  })
}

export function programmingToEmbeddingRows(
  orgSlug: string,
  records: KnowledgeRecord[]
): Omit<MemoryAgentEmbeddingRow, 'embedding'>[] {
  return records.map((record) => {
    const text = buildEmbeddingInputForKnowledgeRecord(record)
    return {
      organization_slug: orgSlug,
      source_type: 'programming' as const,
      source_id: record.id,
      chunk_index: 0,
      title: record.title,
      content_hash: hashEmbeddingContent(text),
      metadata: {
        body: text.slice(0, 8000),
        recordKind: record.recordKind,
      },
    }
  })
}

export async function loadDccDocEmbeddingRows(
  orgSlug: string
): Promise<Omit<MemoryAgentEmbeddingRow, 'embedding'>[]> {
  if (orgSlug.trim().toLowerCase() !== 'dcc') return []

  const dir = path.join(process.cwd(), 'content/dcc')
  let files: string[]
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }

  const rows: Omit<MemoryAgentEmbeddingRow, 'embedding'>[] = []
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const raw = await readFile(fullPath, 'utf8')
    const docId = `dcc_doc:${file.replace(/\.md$/, '')}`
    const title = file.replace(/\.md$/, '').replace(/-/g, ' ')
    const chunks = chunkTextForEmbedding(raw)
    chunks.forEach((chunk, chunkIndex) => {
      rows.push({
        organization_slug: orgSlug,
        source_type: 'dcc_doc',
        source_id: docId,
        chunk_index: chunkIndex,
        title,
        content_hash: hashEmbeddingContent(chunk),
        metadata: { body: chunk, file, chunkIndex },
      })
    })
  }
  return rows
}

export async function upsertEmbeddingRows(
  rows: MemoryAgentEmbeddingRow[]
): Promise<{ upserted: number; skipped: number; errors: string[] }> {
  if (rows.length === 0) return { upserted: 0, skipped: 0, errors: [] }

  const supabase = createClient()
  let upserted = 0
  let skipped = 0
  const errors: string[] = []

  for (const row of rows) {
    const { data: existing } = await supabase
      .from('memory_agent_embeddings')
      .select('id, content_hash')
      .eq('organization_slug', row.organization_slug)
      .eq('source_type', row.source_type)
      .eq('source_id', row.source_id)
      .eq('chunk_index', row.chunk_index)
      .maybeSingle()

    if (existing?.content_hash === row.content_hash) {
      skipped += 1
      continue
    }

    const { error } = await supabase.from('memory_agent_embeddings').upsert(
      {
        organization_slug: row.organization_slug,
        source_type: row.source_type,
        source_id: row.source_id,
        chunk_index: row.chunk_index,
        title: row.title,
        content_hash: row.content_hash,
        embedding: row.embedding,
        metadata: row.metadata,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'organization_slug,source_type,source_id,chunk_index' }
    )

    if (error) {
      errors.push(`${row.source_type}:${row.source_id}[${row.chunk_index}]: ${error.message}`)
    } else {
      upserted += 1
    }
  }

  return { upserted, skipped, errors }
}

export async function embedAndUpsertRows(
  pending: Omit<MemoryAgentEmbeddingRow, 'embedding'>[]
): Promise<{ upserted: number; skipped: number; errors: string[] }> {
  const openai = getOpenAIClient()
  if (!openai) {
    return { upserted: 0, skipped: 0, errors: ['OPENAI_API_KEY is not set'] }
  }
  if (pending.length === 0) return { upserted: 0, skipped: 0, errors: [] }

  const texts = pending.map((p) => {
    const body = typeof p.metadata.body === 'string' ? p.metadata.body : p.title ?? ''
    return body.slice(0, 8000)
  })

  const batchSize = 64
  const embedded: MemoryAgentEmbeddingRow[] = []

  for (let i = 0; i < pending.length; i += batchSize) {
    const slice = pending.slice(i, i + batchSize)
    const vectors = await embedTexts(openai, texts.slice(i, i + batchSize))
    slice.forEach((row, idx) => {
      const v = vectors[idx]
      if (v) embedded.push({ ...row, embedding: v })
    })
  }

  return upsertEmbeddingRows(embedded)
}

export async function countEmbeddingsForOrg(orgSlug: string): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('memory_agent_embeddings')
    .select('*', { count: 'exact', head: true })
    .eq('organization_slug', orgSlug)

  if (error) return 0
  return count ?? 0
}

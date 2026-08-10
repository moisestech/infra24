import {
  chunkTextForEmbedding,
  hashEmbeddingContent,
} from '@/lib/memory-agent/embedding-sync'

describe('embedding-sync helpers', () => {
  it('hashes content deterministically', () => {
    const a = hashEmbeddingContent('hello world')
    const b = hashEmbeddingContent('hello world')
    expect(a).toBe(b)
    expect(a).toHaveLength(64)
  })

  it('chunks long markdown by paragraphs', () => {
    const text = 'Para one.\n\nPara two is here.\n\nPara three.'
    const chunks = chunkTextForEmbedding(text, 30)
    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.join(' ')).toContain('Para one')
  })
})

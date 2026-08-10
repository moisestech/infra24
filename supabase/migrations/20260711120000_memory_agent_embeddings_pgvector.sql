-- pgvector-backed embedding store for Memory Agent hybrid retrieval

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS memory_agent_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_slug TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (
    source_type IN ('alumni', 'programming', 'recognition', 'dcc_doc')
  ),
  source_id TEXT NOT NULL,
  chunk_index INT NOT NULL DEFAULT 0,
  title TEXT,
  content_hash TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_slug, source_type, source_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_memory_agent_embeddings_org
  ON memory_agent_embeddings (organization_slug);

CREATE INDEX IF NOT EXISTS idx_memory_agent_embeddings_org_type
  ON memory_agent_embeddings (organization_slug, source_type);

CREATE INDEX IF NOT EXISTS idx_memory_agent_embeddings_hnsw
  ON memory_agent_embeddings
  USING hnsw (embedding vector_cosine_ops);

ALTER TABLE memory_agent_embeddings ENABLE ROW LEVEL SECURITY;

-- Similarity search (cosine distance; lower is closer)
CREATE OR REPLACE FUNCTION match_memory_agent_embeddings(
  query_embedding vector(1536),
  match_org_slug text,
  match_count int DEFAULT 24,
  filter_source_types text[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  organization_slug text,
  source_type text,
  source_id text,
  chunk_index int,
  title text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.organization_slug,
    e.source_type,
    e.source_id,
    e.chunk_index,
    e.title,
    e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM memory_agent_embeddings e
  WHERE e.organization_slug = match_org_slug
    AND (
      filter_source_types IS NULL
      OR e.source_type = ANY (filter_source_types)
    )
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

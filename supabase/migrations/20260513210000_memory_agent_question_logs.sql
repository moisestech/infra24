-- Usage logs for Memory Agent (optional; service role inserts from API)

CREATE TABLE IF NOT EXISTS memory_agent_question_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_slug TEXT NOT NULL,
  mode TEXT NOT NULL,
  question_length INTEGER NOT NULL DEFAULT 0,
  matched_artist_count INTEGER NOT NULL DEFAULT 0,
  data_gaps TEXT[],
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memory_agent_question_logs_org_created
  ON memory_agent_question_logs (organization_slug, created_at DESC);

ALTER TABLE memory_agent_question_logs ENABLE ROW LEVEL SECURITY;

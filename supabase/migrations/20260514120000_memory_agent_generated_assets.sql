-- Server-backed Memory Agent generated assets (public handoff, staff queue, governance)

CREATE TABLE IF NOT EXISTS memory_agent_generated_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  organization_slug TEXT NOT NULL,
  type TEXT NOT NULL CHECK (
    type IN (
      'public_output',
      'staff_brief',
      'leadership_insight',
      'signage_draft',
      'qr_handoff'
    )
  ),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'review', 'approved', 'published', 'archived')
  ),
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal', 'public')),
  channel TEXT CHECK (
    channel IN ('web', 'lobby_signage', 'qr_handoff', 'staff_brief', 'leadership')
  ),
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL,
  bullets JSONB,
  source_question TEXT NOT NULL,
  source_message_id TEXT,
  audience TEXT,
  location_hint TEXT,
  expires_at TIMESTAMPTZ,
  tags JSONB,
  created_by TEXT,
  approved_by TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ma_gen_assets_org_slug_created
  ON memory_agent_generated_assets (organization_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ma_gen_assets_org_id_created
  ON memory_agent_generated_assets (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ma_gen_assets_org_visibility
  ON memory_agent_generated_assets (organization_id, visibility, status);

CREATE OR REPLACE FUNCTION memory_agent_generated_assets_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ma_gen_assets_updated_at ON memory_agent_generated_assets;
CREATE TRIGGER trg_ma_gen_assets_updated_at
  BEFORE UPDATE ON memory_agent_generated_assets
  FOR EACH ROW
  EXECUTE FUNCTION memory_agent_generated_assets_set_updated_at();

ALTER TABLE memory_agent_generated_assets ENABLE ROW LEVEL SECURITY;

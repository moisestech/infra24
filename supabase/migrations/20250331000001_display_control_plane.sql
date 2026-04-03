-- Display + control plane: departments, screens, playlists, control audit
-- Aligns with docs/technical/INFRA24_DATABASE_SCHEMA.sql signage tables; extends for conversational control.

-- ---------------------------------------------------------------------------
-- Departments (per organization)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_departments_organization_id ON departments(organization_id);

-- ---------------------------------------------------------------------------
-- Announcements: optional department scope
-- ---------------------------------------------------------------------------
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_announcements_department_id ON announcements(department_id);

-- ---------------------------------------------------------------------------
-- Screens (physical / logical displays)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS screens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  device_key TEXT NOT NULL,
  public_slug TEXT,
  device_type TEXT DEFAULT 'browser' CHECK (device_type IN ('browser', 'raspberry_pi', 'chromebox', 'android', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'offline', 'maintenance')),
  last_heartbeat_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (device_key)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_screens_org_public_slug
  ON screens (organization_id, public_slug)
  WHERE public_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_screens_organization_id ON screens(organization_id);

-- ---------------------------------------------------------------------------
-- Playlists
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rotation_config JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_playlists_organization_id ON playlists(organization_id);

-- ---------------------------------------------------------------------------
-- Playlist items (references announcements or raw media; dynamic feed)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS playlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  duration_seconds INTEGER DEFAULT 12,
  item_kind TEXT NOT NULL CHECK (item_kind IN ('announcement', 'media', 'dynamic_announcements', 'workshop_promo')),
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  workshop_id UUID,
  media_url TEXT,
  title_override TEXT,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (playlist_id, order_index)
);

CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist_id ON playlist_items(playlist_id);

-- ---------------------------------------------------------------------------
-- Screen -> playlist assignment (priority: higher wins)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS screen_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  screen_id UUID NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (screen_id, playlist_id)
);

CREATE INDEX IF NOT EXISTS idx_screen_assignments_screen_id ON screen_assignments(screen_id);

-- ---------------------------------------------------------------------------
-- Control: Telegram / OpenClaw identity mapping
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS control_identities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_user_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (telegram_user_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_control_identities_telegram ON control_identities(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_control_identities_clerk ON control_identities(clerk_user_id);

-- ---------------------------------------------------------------------------
-- Two-phase proposals (propose -> commit)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS control_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_clerk_id TEXT NOT NULL,
  actor_channel TEXT NOT NULL DEFAULT 'telegram',
  action_name TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  preview JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'committed', 'expired', 'cancelled')),
  commit_token TEXT NOT NULL,
  idempotency_key TEXT,
  correlation_id TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  committed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_control_proposals_idempotency
  ON control_proposals (organization_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_control_proposals_status_expires ON control_proposals(status, expires_at);

-- ---------------------------------------------------------------------------
-- Audit log for control actions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS control_action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_clerk_id TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'api',
  action_name TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  payload_hash TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  result_message TEXT,
  correlation_id TEXT,
  proposal_id UUID REFERENCES control_proposals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_control_action_logs_org_created ON control_action_logs(organization_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Seed example departments for Oolite (no-op if org missing)
-- ---------------------------------------------------------------------------
INSERT INTO departments (organization_id, name, slug, description, sort_order)
SELECT o.id, 'Digital Lab', 'digital-lab', 'Digital Lab programs', 10
FROM organizations o WHERE o.slug = 'oolite'
ON CONFLICT (organization_id, slug) DO NOTHING;

INSERT INTO departments (organization_id, name, slug, description, sort_order)
SELECT o.id, 'Programs', 'programs', 'Public programs', 20
FROM organizations o WHERE o.slug = 'oolite'
ON CONFLICT (organization_id, slug) DO NOTHING;

INSERT INTO departments (organization_id, name, slug, description, sort_order)
SELECT o.id, 'Residencies', 'residencies', 'Artist residencies', 30
FROM organizations o WHERE o.slug = 'oolite'
ON CONFLICT (organization_id, slug) DO NOTHING;

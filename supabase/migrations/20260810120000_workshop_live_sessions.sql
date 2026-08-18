-- Live classroom sessions for the Infra24 workshop engine (TV + facilitator + join code).
-- Participant progress remains local to the device; this table is shared room state only.

CREATE TABLE IF NOT EXISTS workshop_live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_slug TEXT NOT NULL,
  venue_config_id TEXT NOT NULL DEFAULT 'oolite',
  join_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (
    status IN ('scheduled', 'open', 'live', 'break', 'complete')
  ),
  live_module_id TEXT NOT NULL,
  live_step INTEGER NOT NULL DEFAULT 0,
  tv_screen TEXT NOT NULL DEFAULT 'join' CHECK (
    tv_screen IN ('module', 'join', 'break', 'resources', 'complete')
  ),
  timer_ends_at TIMESTAMPTZ,
  timer_label TEXT,
  started_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop_live_sessions_join_code
  ON workshop_live_sessions (join_code);

CREATE INDEX IF NOT EXISTS idx_workshop_live_sessions_workshop_slug
  ON workshop_live_sessions (workshop_slug);

ALTER TABLE workshop_live_sessions ENABLE ROW LEVEL SECURITY;

-- Service-role / server routes own mutations. Public read by join code can be added later
-- via a constrained policy if anon clients subscribe directly; MVP uses Next.js API polling.

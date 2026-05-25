-- Network Builder: goal-seeking relationship growth layer
-- Durable system of record for agent runs, proposed actions, outcomes, and memory.
-- Airtable remains human-facing CRM + approval UI; Supabase stores execution history.

-- ---------------------------------------------------------------------------
-- Goals (per org, per goal loop)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  goal_loop TEXT NOT NULL CHECK (
    goal_loop IN (
      'network_readiness',
      'program_activation',
      'partner_pipeline',
      'public_signal',
      'opportunity_radar'
    )
  ),
  title TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, goal_loop)
);

CREATE INDEX IF NOT EXISTS idx_network_goals_organization_id ON network_goals(organization_id);

-- ---------------------------------------------------------------------------
-- Agent runs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES network_goals(id) ON DELETE SET NULL,
  goal_loop TEXT NOT NULL,
  status TEXT DEFAULT 'running' CHECK (
    status IN ('running', 'completed', 'failed', 'cancelled')
  ),
  source TEXT DEFAULT 'airtable' CHECK (source IN ('airtable', 'fixture', 'mixed')),
  summary JSONB DEFAULT '{}',
  error TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_network_agent_runs_organization_id ON network_agent_runs(organization_id);
CREATE INDEX IF NOT EXISTS idx_network_agent_runs_goal_loop ON network_agent_runs(goal_loop);

-- ---------------------------------------------------------------------------
-- Proposed actions (mirrors Airtable Agent Approvals)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_proposed_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  run_id UUID REFERENCES network_agent_runs(id) ON DELETE SET NULL,
  external_action_id TEXT,
  airtable_record_id TEXT,
  goal_loop TEXT NOT NULL,
  contact_record_id TEXT,
  contact_name TEXT,
  action_type TEXT NOT NULL,
  relationship_stage TEXT,
  agent_recommendation TEXT,
  reason TEXT,
  proposed_message TEXT,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  approval_status TEXT DEFAULT 'pending' CHECK (
    approval_status IN ('pending', 'approved', 'rejected', 'needs_edit', 'executed')
  ),
  execution_status TEXT DEFAULT 'not_started' CHECK (
    execution_status IN ('not_started', 'running', 'success', 'failed')
  ),
  human_notes TEXT,
  readiness_percent NUMERIC,
  missing_fields JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_network_proposed_actions_org ON network_proposed_actions(organization_id);
CREATE INDEX IF NOT EXISTS idx_network_proposed_actions_approval ON network_proposed_actions(approval_status);
CREATE INDEX IF NOT EXISTS idx_network_proposed_actions_run ON network_proposed_actions(run_id);

-- ---------------------------------------------------------------------------
-- Executed actions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_executed_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  proposed_action_id UUID NOT NULL REFERENCES network_proposed_actions(id) ON DELETE CASCADE,
  execution_type TEXT NOT NULL CHECK (
    execution_type IN ('gmail_draft', 'airtable_task', 'google_doc', 'internal_update', 'other')
  ),
  external_ref TEXT,
  result JSONB DEFAULT '{}',
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_network_executed_actions_proposed ON network_executed_actions(proposed_action_id);

-- ---------------------------------------------------------------------------
-- Outcomes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  proposed_action_id UUID REFERENCES network_proposed_actions(id) ON DELETE SET NULL,
  contact_record_id TEXT,
  outcome TEXT NOT NULL CHECK (
    outcome IN (
      'replied',
      'attended',
      'completed_form',
      'ignored',
      'unsubscribed',
      'meeting_scheduled',
      'unknown'
    )
  ),
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_network_outcomes_org ON network_outcomes(organization_id);

-- ---------------------------------------------------------------------------
-- Policy rules (per org)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_policy_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  requires_approval BOOLEAN DEFAULT true,
  auto_execute BOOLEAN DEFAULT false,
  max_risk_level TEXT DEFAULT 'low' CHECK (max_risk_level IN ('low', 'medium', 'high')),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, action_type)
);

CREATE INDEX IF NOT EXISTS idx_network_policy_rules_org ON network_policy_rules(organization_id);

-- ---------------------------------------------------------------------------
-- Agent memory (patterns learned from outcomes)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_agent_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  pattern TEXT NOT NULL,
  evidence TEXT,
  applies_to TEXT,
  confidence TEXT DEFAULT 'medium' CHECK (confidence IN ('low', 'medium', 'high')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_network_agent_memory_org ON network_agent_memory(organization_id);

-- ---------------------------------------------------------------------------
-- Contact snapshots (optional cache from Airtable sync)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS network_contact_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  airtable_record_id TEXT NOT NULL,
  full_name TEXT,
  readiness_percent NUMERIC,
  network_ready BOOLEAN DEFAULT false,
  relationship_stage TEXT,
  missing_fields JSONB DEFAULT '[]',
  payload JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, airtable_record_id)
);

CREATE INDEX IF NOT EXISTS idx_network_contact_snapshots_org ON network_contact_snapshots(organization_id);

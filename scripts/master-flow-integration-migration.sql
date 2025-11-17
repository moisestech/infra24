-- MASTER Flow Integration Migration
-- Generated: 2025-10-13T16:29:11.376Z
-- Organization: Oolite Arts (cf088ac1-39a5-4948-a72c-d8059c1ab739)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create calendar_integrations table
CREATE TABLE IF NOT EXISTS calendar_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple')),
    external_calendar_id TEXT NOT NULL,
    calendar_name TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    webhook_url TEXT,
    webhook_secret TEXT,
    sync_enabled BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'success', 'error')),
    error_message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL DEFAULT 'system',
    updated_by TEXT NOT NULL DEFAULT 'system',
    
    UNIQUE(organization_id, provider, external_calendar_id)
);

-- Create external_requests table
CREATE TABLE IF NOT EXISTS external_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source TEXT NOT NULL CHECK (source IN ('appsheet', 'google_forms', 'api', 'manual')),
    external_id TEXT NOT NULL,
    request_type TEXT NOT NULL CHECK (request_type IN ('booking', 'inquiry', 'complaint', 'suggestion')),
    request_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'cancelled')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by TEXT,
    processing_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(organization_id, source, external_id)
);

-- Create conflict_logs table
CREATE TABLE IF NOT EXISTS conflict_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    conflict_type TEXT NOT NULL CHECK (conflict_type IN ('double_booking', 'timezone_mismatch', 'resource_unavailable', 'capacity_exceeded')),
    conflict_data JSONB NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'ignored')),
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns to existing tables
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS external_calendar_event_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'infra24' CHECK (source IN ('infra24', 'appsheet', 'google_calendar', 'api', 'manual'));
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS conflict_resolution_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS auto_approved BOOLEAN DEFAULT false;

ALTER TABLE resources ADD COLUMN IF NOT EXISTS external_calendar_id TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS conflict_detection_enabled BOOLEAN DEFAULT true;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS auto_approval_enabled BOOLEAN DEFAULT false;

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS calendar_settings JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ai_settings JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS integration_settings JSONB DEFAULT '{}';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_org_id ON calendar_integrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_external_requests_org_id ON external_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_conflict_logs_org_id ON conflict_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_bookings_external_calendar_event_id ON bookings(external_calendar_event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_source ON bookings(source);

-- Enable RLS
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY IF NOT EXISTS "calendar_integrations_org_isolation" ON calendar_integrations
    FOR ALL USING (organization_id IN (
        SELECT org_id FROM org_memberships 
        WHERE clerk_user_id = auth.uid() AND is_active = true
    ));

CREATE POLICY IF NOT EXISTS "external_requests_org_isolation" ON external_requests
    FOR ALL USING (organization_id IN (
        SELECT org_id FROM org_memberships 
        WHERE clerk_user_id = auth.uid() AND is_active = true
    ));

CREATE POLICY IF NOT EXISTS "conflict_logs_org_isolation" ON conflict_logs
    FOR ALL USING (organization_id IN (
        SELECT org_id FROM org_memberships 
        WHERE clerk_user_id = auth.uid() AND is_active = true
    ));

-- Insert initial configuration for organization
INSERT INTO organizations (id, calendar_settings, ai_settings, notification_settings, integration_settings)
VALUES ('cf088ac1-39a5-4948-a72c-d8059c1ab739', 
        '{"google_calendar_enabled": false, "sync_frequency": "realtime"}',
        '{"digest_enabled": true, "digest_frequency": "weekly"}',
        '{"email_enabled": true, "sms_enabled": false}',
        '{"appsheet_enabled": false, "webhook_secret": ""}')
ON CONFLICT (id) DO UPDATE SET
    calendar_settings = EXCLUDED.calendar_settings,
    ai_settings = EXCLUDED.ai_settings,
    notification_settings = EXCLUDED.notification_settings,
    integration_settings = EXCLUDED.integration_settings;

-- Success message
SELECT 'MASTER Flow Integration schema created successfully!' as message;

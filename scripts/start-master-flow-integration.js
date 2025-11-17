#!/usr/bin/env node

/**
 * MASTER Flow Integration Starter Script
 * 
 * Purpose: Initialize the MASTER flow integration with database setup and basic configuration
 * Prerequisites: Supabase database running, environment variables set
 * Usage: node scripts/start-master-flow-integration.js [orgId]
 * Parameters: orgId (optional) - specific organization ID to configure
 * Output: Sets up initial database schema and configuration
 * Side Effects: Creates new tables and adds columns to existing tables
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Get organization ID from command line or use default
const orgId = process.argv[2] || 'cf088ac1-39a5-4948-a72c-d8059c1ab739' // Oolite Arts

async function main() {
  try {
    console.log('🚀 Starting MASTER Flow Integration Setup...')
    console.log(`📋 Organization ID: ${orgId}`)
    
    // Step 1: Verify organization exists
    console.log('\n🔍 Step 1: Verifying organization...')
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('id', orgId)
      .single()
    
    if (orgError || !org) {
      console.error('❌ Organization not found:', orgError?.message)
      process.exit(1)
    }
    
    console.log(`✅ Found organization: ${org.name} (${org.slug})`)
    
    // Step 2: Check current database schema
    console.log('\n🔍 Step 2: Checking current database schema...')
    let tables = null
    try {
      // Try to check if key tables exist
      const { data: tablesData, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['calendar_integrations', 'external_requests', 'conflict_logs'])
      
      tables = tablesData
    } catch (error) {
      console.log('⚠️ Could not check schema tables, assuming they need to be created')
      tables = []
    }
    
    console.log('📊 Current schema status:')
    console.log('   - calendar_integrations:', tables?.some(t => t.table_name === 'calendar_integrations') ? '✅' : '❌')
    console.log('   - external_requests:', tables?.some(t => t.table_name === 'external_requests') ? '✅' : '❌')
    console.log('   - conflict_logs:', tables?.some(t => t.table_name === 'conflict_logs') ? '✅' : '❌')
    
    // Step 3: Check existing resources
    console.log('\n🔍 Step 3: Checking existing resources...')
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('id, title, type, is_bookable')
      .eq('org_id', orgId)
    
    if (resourcesError) {
      console.error('❌ Error fetching resources:', resourcesError.message)
    } else {
      console.log(`✅ Found ${resources.length} resources`)
      const typeCounts = resources.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1
        return acc
      }, {})
      console.log('   Resource types:', typeCounts)
    }
    
    // Step 4: Check existing bookings
    console.log('\n🔍 Step 4: Checking existing bookings...')
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, title, status, start_time')
      .eq('org_id', orgId)
    
    if (bookingsError) {
      console.error('❌ Error fetching bookings:', bookingsError.message)
    } else {
      console.log(`✅ Found ${bookings.length} bookings`)
      if (bookings.length > 0) {
        const statusCounts = bookings.reduce((acc, b) => {
          acc[b.status] = (acc[b.status] || 0) + 1
          return acc
        }, {})
        console.log('   Booking statuses:', statusCounts)
      }
    }
    
    // Step 5: Generate next steps
    console.log('\n📋 Next Steps for MASTER Flow Integration:')
    console.log('   1. Run database migrations to add new tables')
    console.log('   2. Set up Google Calendar API credentials')
    console.log('   3. Configure AppSheet integration')
    console.log('   4. Implement conflict detection system')
    console.log('   5. Set up AI digest system')
    
    // Step 6: Generate configuration file
    console.log('\n📝 Generating configuration template...')
    const config = {
      organization: {
        id: orgId,
        name: org.name,
        slug: org.slug
      },
      integration: {
        google_calendar: {
          enabled: false,
          api_key: 'YOUR_GOOGLE_CALENDAR_API_KEY',
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
          client_secret: 'YOUR_GOOGLE_CLIENT_SECRET'
        },
        appsheet: {
          enabled: false,
          app_id: 'YOUR_APPSHEET_APP_ID',
          api_key: 'YOUR_APPSHEET_API_KEY'
        }
      },
      features: {
        conflict_detection: true,
        ai_digests: true,
        external_requests: true,
        calendar_sync: true
      },
      created_at: new Date().toISOString()
    }
    
    const configPath = path.join(__dirname, '..', 'config', 'master-flow-config.json')
    const configDir = path.dirname(configPath)
    
    // Create config directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    console.log(`✅ Configuration template created: ${configPath}`)
    
    // Step 7: Generate migration script
    console.log('\n📝 Generating migration script...')
    const migrationScript = `-- MASTER Flow Integration Migration
-- Generated: ${new Date().toISOString()}
-- Organization: ${org.name} (${orgId})

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
VALUES ('${orgId}', 
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
`
    
    const migrationPath = path.join(__dirname, 'master-flow-integration-migration.sql')
    fs.writeFileSync(migrationPath, migrationScript)
    console.log(`✅ Migration script created: ${migrationPath}`)
    
    console.log('\n🎉 MASTER Flow Integration Setup Complete!')
    console.log('\n📋 To continue:')
    console.log('   1. Run the migration: psql -f scripts/master-flow-integration-migration.sql')
    console.log('   2. Update the configuration file with your API keys')
    console.log('   3. Start implementing the integration endpoints')
    console.log('   4. Test the system with sample data')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Run the script
main()

-- Cultural Infrastructure Platform Database Schema
-- This schema supports multi-tenant SaaS architecture for cultural organizations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table - Core tenant data
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#000000',
  secondary_color VARCHAR(7) DEFAULT '#ffffff',
  subscription_tier VARCHAR(50) DEFAULT 'community' CHECK (subscription_tier IN ('community', 'professional', 'enterprise')),
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'unpaid')),
  subscription_current_period_end TIMESTAMP,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table - Organization members
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'member')),
  permissions JSONB DEFAULT '{}',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Forms table - Dynamic form definitions
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  form_schema JSONB NOT NULL, -- Form field definitions, validation rules, etc.
  settings JSONB DEFAULT '{}', -- Form-specific settings (notifications, redirects, etc.)
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  submission_limit INTEGER,
  submission_count INTEGER DEFAULT 0,
  allow_multiple_submissions BOOLEAN DEFAULT false,
  requires_authentication BOOLEAN DEFAULT false,
  custom_css TEXT,
  custom_js TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Form submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  submitter_email VARCHAR(255),
  submitter_name VARCHAR(255),
  submitter_phone VARCHAR(50),
  data JSONB NOT NULL, -- Actual form response data
  files JSONB DEFAULT '[]', -- File upload references
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected', 'archived')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  notes TEXT,
  tags JSONB DEFAULT '[]',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Announcements table - For SmartSign display
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('event', 'opportunity', 'news', 'fun_fact', 'call_for_artists')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'members_only', 'private')),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  duration_minutes INTEGER,
  people JSONB DEFAULT '[]', -- Array of people involved
  partner_orgs JSONB DEFAULT '[]', -- Array of partner organizations
  location VARCHAR(255),
  external_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- File uploads table
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API keys table for external integrations
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  permissions JSONB DEFAULT '[]',
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhooks table for external integrations
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  events JSONB DEFAULT '[]', -- Array of events to trigger webhook
  secret VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP,
  failure_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Billing and usage tracking
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  metric_value INTEGER NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_stripe_customer_id ON organizations(stripe_customer_id);
CREATE INDEX idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_forms_organization_id ON forms(organization_id);
CREATE INDEX idx_forms_is_active ON forms(is_active);
CREATE INDEX idx_submissions_form_id ON submissions(form_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_announcements_organization_id ON announcements(organization_id);
CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_start_date ON announcements(start_date);
CREATE INDEX idx_announcements_is_featured ON announcements(is_featured);
CREATE INDEX idx_file_uploads_organization_id ON file_uploads(organization_id);
CREATE INDEX idx_file_uploads_submission_id ON file_uploads(submission_id);
CREATE INDEX idx_analytics_events_organization_id ON analytics_events(organization_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX idx_webhooks_organization_id ON webhooks(organization_id);
CREATE INDEX idx_usage_tracking_organization_id ON usage_tracking(organization_id);
CREATE INDEX idx_usage_tracking_metric_name ON usage_tracking(metric_name);

-- Row Level Security (RLS) policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM users 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Organization owners can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM users 
      WHERE clerk_user_id = auth.jwt() ->> 'sub' 
      AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can view users in their organization" ON users
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Admins can manage users in their organization" ON users
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE clerk_user_id = auth.jwt() ->> 'sub' 
      AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for forms
CREATE POLICY "Users can view forms in their organization" ON forms
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Editors can manage forms in their organization" ON forms
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE clerk_user_id = auth.jwt() ->> 'sub' 
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- RLS Policies for submissions
CREATE POLICY "Users can view submissions for forms in their organization" ON submissions
  FOR SELECT USING (
    form_id IN (
      SELECT id FROM forms 
      WHERE organization_id IN (
        SELECT organization_id FROM users 
        WHERE clerk_user_id = auth.jwt() ->> 'sub'
      )
    )
  );

CREATE POLICY "Editors can manage submissions in their organization" ON submissions
  FOR ALL USING (
    form_id IN (
      SELECT id FROM forms 
      WHERE organization_id IN (
        SELECT organization_id FROM users 
        WHERE clerk_user_id = auth.jwt() ->> 'sub' 
        AND role IN ('owner', 'admin', 'editor')
      )
    )
  );

-- RLS Policies for announcements
CREATE POLICY "Users can view announcements in their organization" ON announcements
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Editors can manage announcements in their organization" ON announcements
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE clerk_user_id = auth.jwt() ->> 'sub' 
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment submission count
CREATE OR REPLACE FUNCTION increment_submission_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE forms 
    SET submission_count = submission_count + 1 
    WHERE id = NEW.form_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_submission_count_trigger 
    AFTER INSERT ON submissions 
    FOR EACH ROW EXECUTE FUNCTION increment_submission_count();

-- Views for common queries
CREATE VIEW organization_stats AS
SELECT 
    o.id,
    o.name,
    o.slug,
    o.subscription_tier,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT f.id) as form_count,
    COUNT(DISTINCT s.id) as submission_count,
    COUNT(DISTINCT a.id) as announcement_count
FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id
LEFT JOIN forms f ON o.id = f.organization_id
LEFT JOIN submissions s ON f.id = s.form_id
LEFT JOIN announcements a ON o.id = a.organization_id
GROUP BY o.id, o.name, o.slug, o.subscription_tier;

-- Sample data for development
INSERT INTO organizations (name, slug, subscription_tier) VALUES
('Bakehouse Art Complex', 'bakehouse', 'community'),
('Edge Zones', 'edge-zones', 'community'),
('Oolite Arts', 'oolite', 'professional');

-- Create a super admin user (replace with actual Clerk user ID)
-- INSERT INTO users (clerk_user_id, email, first_name, last_name, organization_id, role) VALUES
-- ('user_1234567890', 'admin@example.com', 'Super', 'Admin', (SELECT id FROM organizations WHERE slug = 'bakehouse'), 'owner');


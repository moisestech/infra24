-- Infra24 Database Migrations
-- This file contains all the SQL migrations needed to set up the Infra24 platform

-- Migration 1: Create Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  subdomain VARCHAR(100),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  secondary_color VARCHAR(7) DEFAULT '#1E40AF',
  accent_color VARCHAR(7) DEFAULT '#60A5FA',
  settings JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 2: Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user',
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 3: Create Organization Memberships Table
CREATE TABLE IF NOT EXISTS organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Migration 4: Create Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 1,
  location VARCHAR(255),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 5: Create Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR(50) DEFAULT 'announcement',
  priority VARCHAR(20) DEFAULT 'normal',
  visibility VARCHAR(20) DEFAULT 'internal',
  status VARCHAR(20) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  key_people JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 6: Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 7: Create Forms Table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 8: Create Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 9: Create Workshops Table
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR(50) DEFAULT 'workshop',
  level VARCHAR(20) DEFAULT 'beginner',
  duration_minutes INTEGER,
  max_participants INTEGER,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 10: Create Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 11: Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_domain ON organizations(domain);
CREATE INDEX IF NOT EXISTS idx_organizations_subdomain ON organizations(subdomain);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org ON organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON organization_memberships(status);

CREATE INDEX IF NOT EXISTS idx_announcements_org ON announcements(organization_id);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_visibility ON announcements(visibility);
CREATE INDEX IF NOT EXISTS idx_announcements_scheduled ON announcements(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_announcements_expires ON announcements(expires_at);

CREATE INDEX IF NOT EXISTS idx_bookings_org ON bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_resource ON bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_time ON bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_resources_org ON resources(organization_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_active ON resources(is_active);

CREATE INDEX IF NOT EXISTS idx_submissions_org ON submissions(organization_id);
CREATE INDEX IF NOT EXISTS idx_submissions_form ON submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_org ON analytics_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);

-- Migration 12: Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Migration 13: Create RLS Policies
-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Users: Users can see other users in their organization
CREATE POLICY "Users can view organization members" ON users
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Announcements: Users can see announcements from their organization
CREATE POLICY "Users can view organization announcements" ON announcements
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Bookings: Users can manage their own bookings
CREATE POLICY "Users can manage their bookings" ON bookings
  FOR ALL USING (
    user_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Resources: Users can view resources in their organization
CREATE POLICY "Users can view organization resources" ON resources
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Submissions: Users can manage submissions in their organization
CREATE POLICY "Users can manage organization submissions" ON submissions
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Forms: Users can view forms in their organization
CREATE POLICY "Users can view organization forms" ON forms
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Workshops: Users can view workshops in their organization
CREATE POLICY "Users can view organization workshops" ON workshops
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Analytics: Users can view analytics for their organization
CREATE POLICY "Users can view organization analytics" ON analytics_events
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Migration 14: Create Helper Functions
-- Function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization(user_uuid UUID)
RETURNS TABLE(organization_id UUID, organization_name TEXT, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    om.role
  FROM organizations o
  JOIN organization_memberships om ON o.id = om.organization_id
  WHERE om.user_id = user_uuid AND om.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
  user_uuid UUID,
  org_uuid UUID,
  required_role TEXT DEFAULT 'member'
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM organization_memberships
  WHERE user_id = user_uuid 
    AND organization_id = org_uuid 
    AND status = 'active';
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Role hierarchy: admin > staff > member
  CASE required_role
    WHEN 'admin' THEN
      RETURN user_role = 'admin';
    WHEN 'staff' THEN
      RETURN user_role IN ('admin', 'staff');
    WHEN 'member' THEN
      RETURN user_role IN ('admin', 'staff', 'member');
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migration 15: Create Views for Common Queries
-- View for user organization details
CREATE OR REPLACE VIEW user_organizations AS
SELECT 
  u.id as user_id,
  u.clerk_user_id,
  u.email,
  o.id as organization_id,
  o.name as organization_name,
  o.slug as organization_slug,
  om.role,
  om.status as membership_status
FROM users u
JOIN organization_memberships om ON u.id = om.user_id
JOIN organizations o ON om.organization_id = o.id
WHERE om.status = 'active';

-- View for public announcements
CREATE OR REPLACE VIEW public_announcements AS
SELECT 
  a.*,
  o.name as organization_name,
  o.slug as organization_slug
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.visibility = 'public' 
  AND a.status = 'published'
  AND (a.expires_at IS NULL OR a.expires_at > NOW());

-- Migration 16: Create Triggers for Updated At
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration 17: Insert Default Organizations
INSERT INTO organizations (name, slug, domain, subdomain, primary_color, secondary_color, accent_color, features) VALUES
('Bakehouse Art Complex', 'bakehouse', 'bakehouse.digital', 'bakehouse', '#8B4513', '#D2691E', '#CD853F', '{"smartSign": true, "bookings": true, "submissions": true, "analytics": true, "workshops": true, "calendar": true}'),
('Oolite Arts', 'oolite', 'oolite.digital', 'oolite', '#1E40AF', '#3B82F6', '#60A5FA', '{"smartSign": true, "bookings": true, "submissions": true, "analytics": true, "workshops": true, "calendar": true}'),
('Edge Zones', 'edgezones', 'edgezones.digital', 'edgezones', '#DC2626', '#EF4444', '#F87171', '{"smartSign": true, "bookings": false, "submissions": true, "analytics": true, "workshops": false, "calendar": false}'),
('Locust Projects', 'locust', 'locust.digital', 'locust', '#059669', '#10B981', '#34D399', '{"smartSign": true, "bookings": true, "submissions": true, "analytics": true, "workshops": true, "calendar": true}'),
('AI24', 'ai24', 'ai24.digital', 'ai24', '#7C3AED', '#8B5CF6', '#A78BFA', '{"smartSign": false, "bookings": false, "submissions": false, "analytics": true, "workshops": true, "calendar": false}')
ON CONFLICT (slug) DO NOTHING;

-- Migration 18: Create Sample Resources for Each Organization
INSERT INTO resources (organization_id, name, type, description, capacity, location, settings) 
SELECT 
  o.id,
  '3D Printer A',
  'equipment',
  'High-resolution 3D printer for prototyping',
  1,
  'Digital Lab',
  '{"material_types": ["PLA", "ABS", "PETG"], "max_print_size": "200x200x200mm"}'
FROM organizations o WHERE o.slug = 'bakehouse'
UNION ALL
SELECT 
  o.id,
  'Workstation 1',
  'computer',
  'High-performance workstation for digital art',
  1,
  'Digital Lab',
  '{"specs": {"cpu": "Intel i7", "ram": "32GB", "gpu": "RTX 4070"}}'
FROM organizations o WHERE o.slug = 'bakehouse'
UNION ALL
SELECT 
  o.id,
  'Photo Printer',
  'equipment',
  'Large format photo printer',
  1,
  'Print Studio',
  '{"max_width": "44 inches", "paper_types": ["photo", "canvas", "vinyl"]}'
FROM organizations o WHERE o.slug = 'bakehouse'
UNION ALL
SELECT 
  o.id,
  'Conference Room',
  'space',
  'Meeting and presentation space',
  12,
  'Main Building',
  '{"amenities": ["projector", "whiteboard", "video_conferencing"]}'
FROM organizations o WHERE o.slug = 'bakehouse';

-- Repeat for other organizations as needed...

-- Migration 19: Create Sample Forms
INSERT INTO forms (organization_id, title, description, fields, settings, created_by)
SELECT 
  o.id,
  'Artist Residency Application',
  'Application form for artist residency program',
  '[
    {"name": "full_name", "type": "text", "label": "Full Name", "required": true},
    {"name": "email", "type": "email", "label": "Email Address", "required": true},
    {"name": "portfolio_url", "type": "url", "label": "Portfolio Website", "required": false},
    {"name": "project_description", "type": "textarea", "label": "Project Description", "required": true},
    {"name": "resume", "type": "file", "label": "Resume/CV", "required": true}
  ]',
  '{"allow_anonymous": false, "auto_approve": false}',
  NULL
FROM organizations o WHERE o.slug = 'bakehouse'
ON CONFLICT DO NOTHING;

-- Migration 20: Create Sample Workshops
INSERT INTO workshops (organization_id, title, description, content, type, level, duration_minutes, max_participants, metadata)
SELECT 
  o.id,
  'Introduction to AI Art',
  'Learn the basics of AI-generated art and creative tools',
  'This workshop covers fundamental concepts of AI art generation, including prompt engineering, style transfer, and ethical considerations.',
  'workshop',
  'beginner',
  120,
  15,
  '{"topics": ["AI art", "prompt engineering", "ethics"], "materials": ["laptop", "notebook"]}'
FROM organizations o WHERE o.slug = 'bakehouse'
UNION ALL
SELECT 
  o.id,
  '3D Printing Basics',
  'Hands-on introduction to 3D printing technology',
  'Learn how to design, prepare, and print 3D models using our lab equipment.',
  'workshop',
  'beginner',
  90,
  8,
  '{"topics": ["3D modeling", "slicing", "printing"], "materials": ["laptop", "3D printer"]}'
FROM organizations o WHERE o.slug = 'bakehouse'
ON CONFLICT DO NOTHING;

-- Migration 21: Create Public Access Policies
-- Allow public access to public announcements
CREATE POLICY "Public can view public announcements" ON announcements
  FOR SELECT USING (visibility = 'public' AND status = 'published');

-- Allow public access to public forms
CREATE POLICY "Public can view active forms" ON forms
  FOR SELECT USING (is_active = true);

-- Allow public access to public workshops
CREATE POLICY "Public can view active workshops" ON workshops
  FOR SELECT USING (is_active = true);

-- Migration 22: Create Analytics Functions
-- Function to track events
CREATE OR REPLACE FUNCTION track_event(
  org_uuid UUID,
  event_type_param VARCHAR(100),
  event_data_param JSONB DEFAULT '{}',
  session_id_param VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO analytics_events (
    organization_id,
    event_type,
    event_data,
    session_id,
    ip_address,
    user_agent
  ) VALUES (
    org_uuid,
    event_type_param,
    event_data_param,
    session_id_param,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get analytics summary
CREATE OR REPLACE FUNCTION get_analytics_summary(
  org_uuid UUID,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE(
  event_type VARCHAR(100),
  event_count BIGINT,
  unique_users BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ae.event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT ae.user_id) as unique_users
  FROM analytics_events ae
  WHERE ae.organization_id = org_uuid
    AND ae.created_at BETWEEN start_date AND end_date
  GROUP BY ae.event_type
  ORDER BY event_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migration 23: Create Backup and Maintenance Functions
-- Function to clean up old analytics events
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM analytics_events 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to archive old announcements
CREATE OR REPLACE FUNCTION archive_old_announcements()
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  UPDATE announcements 
  SET status = 'archived'
  WHERE status = 'published' 
    AND expires_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migration 24: Create Performance Monitoring Views
-- View for slow queries (if pg_stat_statements is enabled)
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
WHERE mean_time > 1000  -- Queries taking more than 1 second on average
ORDER BY mean_time DESC;

-- View for table sizes
CREATE OR REPLACE VIEW table_sizes AS
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- Migration 25: Final Setup and Permissions
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create a function to initialize a new organization
CREATE OR REPLACE FUNCTION create_organization(
  org_name VARCHAR(255),
  org_slug VARCHAR(100),
  org_domain VARCHAR(255) DEFAULT NULL,
  org_subdomain VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  org_id UUID;
BEGIN
  INSERT INTO organizations (name, slug, domain, subdomain)
  VALUES (org_name, org_slug, org_domain, org_subdomain)
  RETURNING id INTO org_id;
  
  -- Create default resources for the organization
  INSERT INTO resources (organization_id, name, type, description, capacity, location)
  VALUES 
    (org_id, 'General Workspace', 'space', 'General workspace for activities', 10, 'Main Area'),
    (org_id, 'Meeting Room', 'space', 'Small meeting room', 6, 'Conference Area');
  
  RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to add a user to an organization
CREATE OR REPLACE FUNCTION add_user_to_organization(
  user_uuid UUID,
  org_uuid UUID,
  user_role VARCHAR(50) DEFAULT 'member'
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO organization_memberships (user_id, organization_id, role)
  VALUES (user_uuid, org_uuid, user_role)
  ON CONFLICT (user_id, organization_id) 
  DO UPDATE SET role = user_role, status = 'active';
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migration Complete
-- The database is now ready for the Infra24 multi-tenant platform


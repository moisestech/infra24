-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  logo_url TEXT,
  favicon_url TEXT,
  theme JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Org memberships table
CREATE TABLE IF NOT EXISTS org_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member', 'viewer')),
  permissions JSONB DEFAULT '{}',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(organization_id, user_id)
);

-- Artist profiles table
CREATE TABLE IF NOT EXISTS artist_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  website TEXT,
  instagram TEXT,
  twitter TEXT,
  facebook TEXT,
  portfolio_url TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  skills TEXT[],
  mediums TEXT[],
  location TEXT,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('workshop', 'equipment', 'space', 'event')),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  capacity INTEGER DEFAULT 1,
  duration_minutes INTEGER,
  price DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  location TEXT,
  requirements TEXT[],
  availability_rules JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('workshop', 'equipment', 'space', 'event')),
  resource_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  capacity INTEGER DEFAULT 1,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  location TEXT,
  requirements TEXT[],
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- Booking participants table
CREATE TABLE IF NOT EXISTS booking_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'waitlisted', 'no_show')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  UNIQUE(booking_id, user_id)
);

-- Submission forms table
CREATE TABLE IF NOT EXISTS submission_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('application', 'proposal', 'content', 'feedback', 'survey', 'custom')),
  category TEXT,
  form_schema JSONB NOT NULL DEFAULT '{}',
  validation_rules JSONB DEFAULT '{}',
  submission_settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  requires_authentication BOOLEAN DEFAULT true,
  max_submissions_per_user INTEGER,
  submission_deadline TIMESTAMP WITH TIME ZONE,
  review_deadline TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  form_id UUID NOT NULL REFERENCES submission_forms(id) ON DELETE CASCADE,
  user_id TEXT,
  submitter_name TEXT,
  submitter_email TEXT,
  submitter_phone TEXT,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'needs_revision', 'withdrawn')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  review_notes TEXT,
  reviewer_id TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  score DECIMAL(5,2),
  tags TEXT[],
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Announcements table (if not exists)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'event', 'workshop', 'exhibition', 'fun_fact', 'news')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  visibility TEXT DEFAULT 'internal' CHECK (visibility IN ('internal', 'public', 'members_only')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  key_people JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_org_memberships_organization_id ON org_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_user_id ON org_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_role ON org_memberships(role);

CREATE INDEX IF NOT EXISTS idx_artist_profiles_organization_id ON artist_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user_id ON artist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_is_public ON artist_profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_is_featured ON artist_profiles(is_featured);

CREATE INDEX IF NOT EXISTS idx_resources_organization_id ON resources(organization_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_is_active ON resources(is_active);

CREATE INDEX IF NOT EXISTS idx_bookings_organization_id ON bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_resource_type ON bookings(resource_type);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_booking_participants_booking_id ON booking_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_participants_user_id ON booking_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_participants_status ON booking_participants(status);

CREATE INDEX IF NOT EXISTS idx_submission_forms_organization_id ON submission_forms(organization_id);
CREATE INDEX IF NOT EXISTS idx_submission_forms_type ON submission_forms(type);
CREATE INDEX IF NOT EXISTS idx_submission_forms_category ON submission_forms(category);
CREATE INDEX IF NOT EXISTS idx_submission_forms_is_active ON submission_forms(is_active);
CREATE INDEX IF NOT EXISTS idx_submission_forms_is_public ON submission_forms(is_public);

CREATE INDEX IF NOT EXISTS idx_submissions_organization_id ON submissions(organization_id);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_priority ON submissions(priority);

-- Insert sample organizations
INSERT INTO organizations (name, slug, description, website, email, city, state, theme) VALUES
('Bakehouse Art Complex', 'bakehouse', 'A contemporary art complex supporting emerging and established artists', 'https://bakehouseartcomplex.org', 'info@bakehouseartcomplex.org', 'Miami', 'FL', '{"primary": "#FF6B6B", "secondary": "#4ECDC4", "accent": "#FFE66D", "background": "#F7FFF7", "text": "#2C3E50"}'),
('Oolite Arts', 'oolite', 'Supporting artists and building community through contemporary art', 'https://oolitearts.org', 'info@oolitearts.org', 'Miami', 'FL', '{"primary": "#007BFF", "secondary": "#6C757D", "accent": "#FFC107", "background": "#F8F9FA", "text": "#343A40"}')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  website = EXCLUDED.website,
  email = EXCLUDED.email,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  theme = EXCLUDED.theme;

-- Insert sample resources for each organization
INSERT INTO resources (organization_id, type, title, description, category, capacity, duration_minutes, price, location, requirements, created_by, updated_by)
SELECT 
  o.id,
  'workshop',
  'AI Art Fundamentals',
  'Learn the basics of AI-generated art and creative tools',
  'Digital Art',
  15,
  120,
  50.00,
  'Digital Lab',
  ARRAY['Laptop', 'Internet connection', 'Basic computer skills'],
  'system',
  'system'
FROM organizations o WHERE o.slug IN ('bakehouse', 'oolite');

INSERT INTO resources (organization_id, type, title, description, category, capacity, duration_minutes, price, location, requirements, created_by, updated_by)
SELECT 
  o.id,
  'equipment',
  '3D Printer - Prusa i3 MK3S+',
  'High-quality 3D printer for prototyping and art projects',
  'Fabrication',
  1,
  180,
  25.00,
  'Fabrication Lab',
  ARRAY['3D modeling software', 'Safety glasses'],
  'system',
  'system'
FROM organizations o WHERE o.slug IN ('bakehouse', 'oolite');

INSERT INTO resources (organization_id, type, title, description, category, capacity, duration_minutes, price, location, requirements, created_by, updated_by)
SELECT 
  o.id,
  'space',
  'Digital Lab',
  'Collaborative workspace with high-end computers and software',
  'Workspace',
  12,
  60,
  15.00,
  'Digital Lab',
  ARRAY['Valid ID', 'Lab orientation'],
  'system',
  'system'
FROM organizations o WHERE o.slug IN ('bakehouse', 'oolite');

-- Insert sample submission forms
INSERT INTO submission_forms (organization_id, title, description, type, category, form_schema, is_public, requires_authentication, created_by, updated_by)
SELECT 
  o.id,
  'Artist Residency Application',
  'Apply for our artist residency program',
  'application',
  'Residency',
  '{"fields": [{"name": "name", "type": "text", "label": "Full Name", "required": true}, {"name": "email", "type": "email", "label": "Email", "required": true}, {"name": "portfolio", "type": "url", "label": "Portfolio Website", "required": true}, {"name": "statement", "type": "textarea", "label": "Artist Statement", "required": true}, {"name": "project_proposal", "type": "textarea", "label": "Project Proposal", "required": true}]}',
  true,
  false,
  'system',
  'system'
FROM organizations o WHERE o.slug IN ('bakehouse', 'oolite');

INSERT INTO submission_forms (organization_id, title, description, type, category, form_schema, is_public, requires_authentication, created_by, updated_by)
SELECT 
  o.id,
  'Workshop Proposal',
  'Propose a new workshop for our community',
  'proposal',
  'Education',
  '{"fields": [{"name": "workshop_title", "type": "text", "label": "Workshop Title", "required": true}, {"name": "description", "type": "textarea", "label": "Description", "required": true}, {"name": "duration", "type": "number", "label": "Duration (hours)", "required": true}, {"name": "max_participants", "type": "number", "label": "Max Participants", "required": true}, {"name": "materials_needed", "type": "textarea", "label": "Materials Needed", "required": false}]}',
  true,
  true,
  'system',
  'system'
FROM organizations o WHERE o.slug IN ('bakehouse', 'oolite');


-- Infra24 Platform Database Schema
-- This migration creates all necessary tables for the multi-tenant platform
-- Run this in your Supabase dashboard SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (already exists, just adding missing columns)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Org memberships table (already exists, just adding missing columns)
ALTER TABLE org_memberships ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';
ALTER TABLE org_memberships ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE org_memberships ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Artist profiles table (already exists, just adding missing columns)
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS mediums TEXT[];
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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

-- Artist tips table
CREATE TABLE IF NOT EXISTS artist_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
  tipper_id TEXT, -- Clerk user ID of the person giving the tip
  tipper_name TEXT,
  tipper_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_intent_id TEXT, -- Stripe payment intent ID
  transaction_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization donations table
CREATE TABLE IF NOT EXISTS organization_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  donor_id TEXT, -- Clerk user ID of the donor
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('monthly', 'quarterly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  payment_intent_id TEXT, -- Stripe payment intent ID
  subscription_id TEXT, -- For recurring donations
  transaction_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_org_memberships_org_id ON org_memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_clerk_user_id ON org_memberships(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_role ON org_memberships(role);

CREATE INDEX IF NOT EXISTS idx_artist_profiles_org_id ON artist_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_claimed_by ON artist_profiles(claimed_by_clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_is_public ON artist_profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_is_featured ON artist_profiles(is_featured);

CREATE INDEX IF NOT EXISTS idx_resources_org_id ON resources(org_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_is_active ON resources(is_active);

CREATE INDEX IF NOT EXISTS idx_bookings_org_id ON bookings(org_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_resource_type ON bookings(resource_type);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_booking_participants_booking_id ON booking_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_participants_user_id ON booking_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_participants_status ON booking_participants(status);

CREATE INDEX IF NOT EXISTS idx_submission_forms_org_id ON submission_forms(org_id);
CREATE INDEX IF NOT EXISTS idx_submission_forms_type ON submission_forms(type);
CREATE INDEX IF NOT EXISTS idx_submission_forms_category ON submission_forms(category);
CREATE INDEX IF NOT EXISTS idx_submission_forms_is_active ON submission_forms(is_active);
CREATE INDEX IF NOT EXISTS idx_submission_forms_is_public ON submission_forms(is_public);

CREATE INDEX IF NOT EXISTS idx_submissions_org_id ON submissions(org_id);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_priority ON submissions(priority);

-- Indexes for tipping and donation tables
CREATE INDEX IF NOT EXISTS idx_artist_tips_org_id ON artist_tips(org_id);
CREATE INDEX IF NOT EXISTS idx_artist_tips_artist_profile_id ON artist_tips(artist_profile_id);
CREATE INDEX IF NOT EXISTS idx_artist_tips_tipper_id ON artist_tips(tipper_id);
CREATE INDEX IF NOT EXISTS idx_artist_tips_status ON artist_tips(status);
CREATE INDEX IF NOT EXISTS idx_artist_tips_created_at ON artist_tips(created_at);

CREATE INDEX IF NOT EXISTS idx_org_donations_org_id ON organization_donations(org_id);
CREATE INDEX IF NOT EXISTS idx_org_donations_donor_id ON organization_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_org_donations_status ON organization_donations(status);
CREATE INDEX IF NOT EXISTS idx_org_donations_is_recurring ON organization_donations(is_recurring);
CREATE INDEX IF NOT EXISTS idx_org_donations_created_at ON organization_donations(created_at);

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
INSERT INTO resources (org_id, type, title, description, category, capacity, duration_minutes, price, location, requirements, created_by, updated_by)
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

INSERT INTO resources (org_id, type, title, description, category, capacity, duration_minutes, price, location, requirements, created_by, updated_by)
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

INSERT INTO resources (org_id, type, title, description, category, capacity, duration_minutes, price, location, requirements, created_by, updated_by)
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
INSERT INTO submission_forms (org_id, title, description, type, category, form_schema, is_public, requires_authentication, created_by, updated_by)
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

INSERT INTO submission_forms (org_id, title, description, type, category, form_schema, is_public, requires_authentication, created_by, updated_by)
SELECT 
  o.id,
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

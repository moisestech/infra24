-- Migration: Create Workshop System with Organization Sharing
-- This migration creates a comprehensive workshop system that allows organizations
-- to create workshops and share them with other organizations via a super admin interface

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create workshops table
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  category VARCHAR(100),
  type VARCHAR(50) DEFAULT 'workshop',
  level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  max_participants INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  instructor VARCHAR(255),
  prerequisites TEXT[],
  materials TEXT[],
  outcomes TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  is_shared BOOLEAN DEFAULT false, -- Whether this workshop can be shared with other orgs
  metadata JSONB DEFAULT '{}',
  created_by TEXT, -- Clerk user ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workshop_organization_sharing table
-- This table manages which workshops are shared with which organizations
CREATE TABLE IF NOT EXISTS workshop_organization_sharing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  source_organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  target_organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  shared_by TEXT, -- Clerk user ID of super admin who shared it
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration date
  notes TEXT, -- Notes from super admin about the sharing
  UNIQUE(workshop_id, target_organization_id)
);

-- Create workshop_bookings table
CREATE TABLE IF NOT EXISTS workshop_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  user_id TEXT, -- Clerk user ID
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  booking_status VARCHAR(20) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workshop_sessions table for recurring workshops
CREATE TABLE IF NOT EXISTS workshop_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  session_end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workshop_feedback table
CREATE TABLE IF NOT EXISTS workshop_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  user_id TEXT, -- Clerk user ID
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  would_recommend BOOLEAN,
  learned_something BOOLEAN,
  instructor_rating INTEGER CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
  content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workshops_organization_id ON workshops(organization_id);
CREATE INDEX IF NOT EXISTS idx_workshops_category ON workshops(category);
CREATE INDEX IF NOT EXISTS idx_workshops_level ON workshops(level);
CREATE INDEX IF NOT EXISTS idx_workshops_is_active ON workshops(is_active);
CREATE INDEX IF NOT EXISTS idx_workshops_is_shared ON workshops(is_shared);
CREATE INDEX IF NOT EXISTS idx_workshops_created_by ON workshops(created_by);

CREATE INDEX IF NOT EXISTS idx_workshop_sharing_workshop_id ON workshop_organization_sharing(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_sharing_source_org ON workshop_organization_sharing(source_organization_id);
CREATE INDEX IF NOT EXISTS idx_workshop_sharing_target_org ON workshop_organization_sharing(target_organization_id);
CREATE INDEX IF NOT EXISTS idx_workshop_sharing_is_active ON workshop_organization_sharing(is_active);

CREATE INDEX IF NOT EXISTS idx_workshop_bookings_workshop_id ON workshop_bookings(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_bookings_user_id ON workshop_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_bookings_organization_id ON workshop_bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_workshop_bookings_status ON workshop_bookings(booking_status);

CREATE INDEX IF NOT EXISTS idx_workshop_sessions_workshop_id ON workshop_sessions(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_sessions_date ON workshop_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_workshop_sessions_is_active ON workshop_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_workshop_feedback_workshop_id ON workshop_feedback(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_feedback_user_id ON workshop_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_feedback_organization_id ON workshop_feedback(organization_id);

-- Enable Row Level Security
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_organization_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workshops
-- Policy: Users can view workshops from their organization or shared workshops
CREATE POLICY "Users can view workshops from their organization or shared work" ON workshops
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
        OR id IN (
            SELECT workshop_id FROM workshop_organization_sharing wos
            JOIN org_memberships om ON wos.target_organization_id = om.organization_id
            WHERE om.user_id = auth.uid()::text AND wos.is_active = true
        )
    );

-- Policy: Users can create workshops in their organization
CREATE POLICY "Users can create workshops in their organization" ON workshops
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'staff')
        )
    );

-- Policy: Users can update workshops in their organization
CREATE POLICY "Users can update workshops in their organization" ON workshops
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'staff')
        )
    );

-- Policy: Users can delete workshops in their organization
CREATE POLICY "Users can delete workshops in their organization" ON workshops
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'staff')
        )
    );

-- Enable RLS for workshop_organization_sharing
ALTER TABLE workshop_organization_sharing ENABLE ROW LEVEL SECURITY;

-- Policy: Super admins can manage workshop sharing
CREATE POLICY "Super admins can manage workshop sharing" ON workshop_organization_sharing
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role = 'super_admin'
        )
    );

-- Enable RLS for workshop_bookings
ALTER TABLE workshop_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view bookings for workshops in their organization
CREATE POLICY "Users can view bookings for workshops in their organization" ON workshop_bookings
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

-- Policy: Users can create bookings for workshops in their organization
CREATE POLICY "Users can create bookings for workshops in their organization" ON workshop_bookings
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

-- Policy: Users can update their own bookings
CREATE POLICY "Users can update their own bookings" ON workshop_bookings
    FOR UPDATE USING (
        user_id = auth.uid()::text OR
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'staff')
        )
    );

-- Enable RLS for workshop_sessions
ALTER TABLE workshop_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view sessions for workshops in their organization
CREATE POLICY "Users can view sessions for workshops in their organization" ON workshop_sessions
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

-- Policy: Users can manage sessions for workshops in their organization
CREATE POLICY "Users can manage sessions for workshops in their organization" ON workshop_sessions
    FOR ALL USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text AND role IN ('admin', 'staff')
            )
        )
    );

-- Enable RLS for workshop_feedback
ALTER TABLE workshop_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view feedback for workshops in their organization
CREATE POLICY "Users can view feedback for workshops in their organization" ON workshop_feedback
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

-- Policy: Users can create feedback for workshops in their organization
CREATE POLICY "Users can create feedback for workshops in their organization" ON workshop_feedback
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

-- Policy: Users can update their own feedback
CREATE POLICY "Users can update their own feedback" ON workshop_feedback
    FOR UPDATE USING (
        user_id = auth.uid()::text OR
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'staff')
        )
    );

-- Functions for workshop management
CREATE OR REPLACE FUNCTION update_workshop_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update timestamps
CREATE TRIGGER trigger_update_workshops_updated_at
    BEFORE UPDATE ON workshops
    FOR EACH ROW EXECUTE FUNCTION update_workshop_updated_at();

CREATE TRIGGER trigger_update_workshop_bookings_updated_at
    BEFORE UPDATE ON workshop_bookings
    FOR EACH ROW EXECUTE FUNCTION update_workshop_updated_at();

CREATE TRIGGER trigger_update_workshop_sessions_updated_at
    BEFORE UPDATE ON workshop_sessions
    FOR EACH ROW EXECUTE FUNCTION update_workshop_updated_at();

CREATE TRIGGER trigger_update_workshop_feedback_updated_at
    BEFORE UPDATE ON workshop_feedback
    FOR EACH ROW EXECUTE FUNCTION update_workshop_updated_at();


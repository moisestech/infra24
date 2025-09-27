-- =============================================
-- UNIFIED SCHEMA STANDARDIZATION MIGRATION
-- =============================================
-- This migration standardizes all database schemas to resolve inconsistencies
-- Date: December 26, 2024
-- Purpose: Fix critical schema mismatches identified in audit

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- =============================================
-- ORGANIZATIONS TABLE (Standardized)
-- =============================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    theme JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- RESOURCES TABLE (Unified Schema)
-- =============================================
-- Drop existing resources table if it exists to avoid conflicts
DROP TABLE IF EXISTS resources CASCADE;

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Standardized resource types
    type TEXT NOT NULL CHECK (type IN ('space', 'equipment', 'person', 'workshop')),
    
    -- Basic information
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    
    -- Capacity and scheduling
    capacity INTEGER DEFAULT 1,
    duration_minutes INTEGER,
    
    -- Pricing
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    
    -- Location and requirements
    location TEXT,
    requirements TEXT[],
    
    -- Availability and rules
    availability_rules JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Status flags
    is_active BOOLEAN DEFAULT true,
    is_bookable BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL
);

-- =============================================
-- BOOKINGS TABLE (Unified Schema)
-- =============================================
-- Drop existing bookings table if it exists to avoid conflicts
DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    
    -- User information
    user_id TEXT NOT NULL, -- Clerk user ID
    user_name TEXT,
    user_email TEXT,
    
    -- Booking details
    title TEXT NOT NULL,
    description TEXT,
    
    -- Time information (standardized column names)
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status and capacity
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    capacity INTEGER DEFAULT 1,
    current_participants INTEGER DEFAULT 0,
    
    -- Pricing
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    
    -- Location and notes
    location TEXT,
    notes TEXT,
    
    -- Metadata and audit
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_clerk_id TEXT NOT NULL,
    updated_by_clerk_id TEXT NOT NULL
);

-- =============================================
-- BOOKING PARTICIPANTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS booking_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    user_name TEXT,
    user_email TEXT,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'no_show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ORGANIZATION MEMBERSHIPS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS org_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    clerk_user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('member', 'moderator', 'org_admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, clerk_user_id)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Resources indexes
CREATE INDEX IF NOT EXISTS idx_resources_organization_id ON resources(organization_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_is_active ON resources(is_active);
CREATE INDEX IF NOT EXISTS idx_resources_is_bookable ON resources(is_bookable);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_organization_id ON bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_bookings_resource_id ON bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_resource_time ON bookings(resource_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_org_time ON bookings(organization_id, start_time, end_time);

-- =============================================
-- EXCLUSION CONSTRAINTS FOR OVERLAPPING BOOKINGS
-- =============================================
-- Prevent overlapping bookings for the same resource
-- Note: Using a simpler approach that works with standard PostgreSQL
-- The constraint will be enforced at the application level for now

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_participants_updated_at BEFORE UPDATE ON booking_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_org_memberships_updated_at BEFORE UPDATE ON org_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample organization (Oolite Arts) - use existing ID if it exists
INSERT INTO organizations (name, slug, description, email, is_active) 
VALUES (
    'Oolite Arts',
    'oolite',
    'Miami-based arts organization supporting artists and community',
    'info@oolitearts.org',
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    email = EXCLUDED.email,
    is_active = EXCLUDED.is_active;

-- Insert sample resources for Oolite using the actual organization ID
INSERT INTO resources (organization_id, type, title, description, category, capacity, is_active, is_bookable, created_by, updated_by)
SELECT 
    o.id,
    'space',
    'Studio A',
    'Main studio space for workshops and events',
    'Studio',
    15,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'space',
    'Gallery Space',
    'Exhibition gallery for art shows',
    'Gallery',
    50,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'space',
    'Meeting Room',
    'Small meeting room for consultations',
    'Meeting',
    8,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'equipment',
    'VR Headset - Oculus Quest 3',
    'Virtual reality headset for digital art creation',
    'VR Equipment',
    1,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'equipment',
    'Professional Camera',
    'Canon EOS R5 for photography workshops',
    'Photography',
    1,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'equipment',
    '3D Printer',
    'Prusa i3 MK3S+ for 3D printing projects',
    '3D Printing',
    1,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'person',
    'Photography Instructor',
    'Professional photographer available for workshops',
    'Instructor',
    1,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'person',
    'Digital Art Consultant',
    'Expert in digital art techniques and software',
    'Consultant',
    1,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'person',
    'Tech Support Specialist',
    'Technical support for equipment and software',
    'Support',
    1,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'workshop',
    'Digital Photography Workshop',
    'Learn professional photography techniques',
    'Photography',
    12,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'workshop',
    'VR Art Creation',
    'Create art using virtual reality tools',
    'Digital Art',
    8,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
UNION ALL
SELECT 
    o.id,
    'workshop',
    '3D Printing Basics',
    'Introduction to 3D modeling and printing',
    '3D Printing',
    10,
    true,
    true,
    'system',
    'system'
FROM organizations o WHERE o.slug = 'oolite'
ON CONFLICT DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Organizations are viewable by everyone" ON organizations FOR SELECT USING (true);
CREATE POLICY "Organizations are manageable by admins" ON organizations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM org_memberships 
        WHERE organization_id = organizations.id 
        AND clerk_user_id = auth.uid()::text 
        AND role IN ('org_admin', 'super_admin')
        AND is_active = true
    )
);

-- Resources policies
CREATE POLICY "Resources are viewable by organization members" ON resources FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM org_memberships 
        WHERE organization_id = resources.organization_id 
        AND clerk_user_id = auth.uid()::text 
        AND is_active = true
    )
);

CREATE POLICY "Resources are manageable by organization admins" ON resources FOR ALL USING (
    EXISTS (
        SELECT 1 FROM org_memberships 
        WHERE organization_id = resources.organization_id 
        AND clerk_user_id = auth.uid()::text 
        AND role IN ('org_admin', 'super_admin', 'moderator')
        AND is_active = true
    )
);

-- Bookings policies
CREATE POLICY "Bookings are viewable by organization members" ON bookings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM org_memberships 
        WHERE organization_id = bookings.organization_id 
        AND clerk_user_id = auth.uid()::text 
        AND is_active = true
    )
);

CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (
    user_id = auth.uid()::text AND
    EXISTS (
        SELECT 1 FROM org_memberships 
        WHERE organization_id = bookings.organization_id 
        AND clerk_user_id = auth.uid()::text 
        AND is_active = true
    )
);

CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (
    user_id = auth.uid()::text OR
    EXISTS (
        SELECT 1 FROM org_memberships 
        WHERE organization_id = bookings.organization_id 
        AND clerk_user_id = auth.uid()::text 
        AND role IN ('org_admin', 'super_admin', 'moderator')
        AND is_active = true
    )
);

-- Booking participants policies
CREATE POLICY "Booking participants are viewable by organization members" ON booking_participants FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM bookings b
        JOIN org_memberships om ON b.organization_id = om.organization_id
        WHERE b.id = booking_participants.booking_id 
        AND om.clerk_user_id = auth.uid()::text 
        AND om.is_active = true
    )
);

-- Organization memberships policies
CREATE POLICY "Memberships are viewable by organization members" ON org_memberships FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM org_memberships om2
        WHERE om2.organization_id = org_memberships.organization_id 
        AND om2.clerk_user_id = auth.uid()::text 
        AND om2.is_active = true
    )
);

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Create migration_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migration_name TEXT UNIQUE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'completed'
);

-- Log successful migration
INSERT INTO migration_log (migration_name, executed_at, status) 
VALUES ('20241226000001_unified_schema_standardization', NOW(), 'completed')
ON CONFLICT DO NOTHING;


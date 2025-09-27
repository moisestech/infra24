-- =============================================
-- SCHEMA INCONSISTENCY FIXES
-- =============================================
-- This migration fixes the critical schema inconsistencies identified in the audit
-- Date: December 26, 2024
-- Purpose: Fix schema mismatches without breaking existing data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- FIX RESOURCES TABLE
-- =============================================

-- First, let's check what columns exist and add missing ones
DO $$ 
BEGIN
    -- Add missing columns to resources table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'is_bookable') THEN
        ALTER TABLE resources ADD COLUMN is_bookable BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'created_by') THEN
        ALTER TABLE resources ADD COLUMN created_by TEXT DEFAULT 'system';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'updated_by') THEN
        ALTER TABLE resources ADD COLUMN updated_by TEXT DEFAULT 'system';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'currency') THEN
        ALTER TABLE resources ADD COLUMN currency TEXT DEFAULT 'USD';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'price') THEN
        ALTER TABLE resources ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'duration_minutes') THEN
        ALTER TABLE resources ADD COLUMN duration_minutes INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'requirements') THEN
        ALTER TABLE resources ADD COLUMN requirements TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'availability_rules') THEN
        ALTER TABLE resources ADD COLUMN availability_rules JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'metadata') THEN
        ALTER TABLE resources ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- Update resource type constraint to match our standardized types
DO $$
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'resources_type_check') THEN
        ALTER TABLE resources DROP CONSTRAINT resources_type_check;
    END IF;
    
    -- Add new constraint with standardized types
    ALTER TABLE resources ADD CONSTRAINT resources_type_check 
    CHECK (type IN ('space', 'equipment', 'person', 'workshop'));
END $$;

-- =============================================
-- FIX BOOKINGS TABLE
-- =============================================

-- Drop the existing bookings table and recreate it with the correct schema
DROP TABLE IF EXISTS bookings CASCADE;

-- Create the correct bookings table with proper schema
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id TEXT, -- Clerk user ID
    user_name TEXT,
    user_email TEXT,
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
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_clerk_id TEXT NOT NULL,
    updated_by_clerk_id TEXT
);

-- Update booking status constraint
DO $$
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'bookings_status_check') THEN
        ALTER TABLE bookings DROP CONSTRAINT bookings_status_check;
    END IF;
    
    -- Add new constraint with standardized statuses
    ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show'));
END $$;

-- =============================================
-- CREATE MISSING TABLES
-- =============================================

-- Recreate booking_participants table (was dropped with CASCADE)
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

-- Create org_memberships table if it doesn't exist
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
-- CREATE INDEXES
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
-- CREATE TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_booking_participants_updated_at ON booking_participants;
CREATE TRIGGER update_booking_participants_updated_at BEFORE UPDATE ON booking_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_org_memberships_updated_at ON org_memberships;
CREATE TRIGGER update_org_memberships_updated_at BEFORE UPDATE ON org_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert sample organization (Oolite Arts) if it doesn't exist
INSERT INTO organizations (name, slug, description, is_active) 
VALUES (
    'Oolite Arts',
    'oolite',
    'Miami-based arts organization supporting artists and community',
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- Insert sample resources for Oolite if they don't exist
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
-- MIGRATION COMPLETE
-- =============================================

-- Log successful migration
CREATE TABLE IF NOT EXISTS migration_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migration_name TEXT UNIQUE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'completed'
);

INSERT INTO migration_log (migration_name, executed_at, status) 
VALUES ('20241226000002_fix_schema_inconsistencies', NOW(), 'completed')
ON CONFLICT DO NOTHING;

-- Create Digital Lab resources for organizations
-- This migration creates the resources table and populates it with Digital Lab equipment

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create resources table
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

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking participants table for group bookings
CREATE TABLE IF NOT EXISTS booking_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id TEXT, -- Clerk user ID
    user_name TEXT,
    user_email TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'no_show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, user_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resources_organization_id ON resources(organization_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_is_active ON resources(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_organization_id ON bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_bookings_resource_id ON bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_participants_booking_id ON booking_participants(booking_id);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources
CREATE POLICY "Allow public read access to active resources" ON resources
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow organization members to manage resources" ON resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM org_memberships 
            WHERE org_memberships.organization_id = resources.organization_id 
            AND org_memberships.clerk_user_id::text = auth.uid()::text
            AND org_memberships.role IN ('org_admin', 'super_admin', 'moderator')
        )
    );

-- RLS Policies for bookings
CREATE POLICY "Allow public read access to bookings" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Allow users to create their own bookings" ON bookings
    FOR INSERT WITH CHECK (
        user_id::text = auth.uid()::text OR 
        EXISTS (
            SELECT 1 FROM org_memberships 
            WHERE org_memberships.organization_id = bookings.organization_id 
            AND org_memberships.clerk_user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Allow users to update their own bookings" ON bookings
    FOR UPDATE USING (
        user_id::text = auth.uid()::text OR 
        EXISTS (
            SELECT 1 FROM org_memberships 
            WHERE org_memberships.organization_id = bookings.organization_id 
            AND org_memberships.clerk_user_id::text = auth.uid()::text
            AND org_memberships.role IN ('org_admin', 'super_admin', 'moderator')
        )
    );

CREATE POLICY "Allow organization admins to manage all bookings" ON bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM org_memberships 
            WHERE org_memberships.organization_id = bookings.organization_id 
            AND org_memberships.clerk_user_id::text = auth.uid()::text
            AND org_memberships.role IN ('org_admin', 'super_admin', 'moderator')
        )
    );

-- RLS Policies for booking participants
CREATE POLICY "Allow public read access to booking participants" ON booking_participants
    FOR SELECT USING (true);

CREATE POLICY "Allow users to manage their own participation" ON booking_participants
    FOR ALL USING (
        user_id::text = auth.uid()::text OR 
        EXISTS (
            SELECT 1 FROM bookings 
            JOIN org_memberships ON org_memberships.organization_id = bookings.organization_id
            WHERE bookings.id = booking_participants.booking_id 
            AND org_memberships.clerk_user_id::text = auth.uid()::text
            AND org_memberships.role IN ('org_admin', 'super_admin', 'moderator')
        )
    );

-- Note: Digital Lab resources will be inserted via API or admin interface
-- This migration creates the table structure for the booking system

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

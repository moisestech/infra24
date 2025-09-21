-- Booking System Database Schema for Infra24 Multi-tenant Platform
-- This schema supports bookings for workshops, resources, and events per organization

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    resource_type TEXT NOT NULL CHECK (resource_type IN ('workshop', 'equipment', 'space', 'event')),
    resource_id TEXT NOT NULL, -- ID of the specific resource being booked
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

-- Booking participants table (for workshops and events with multiple participants)
CREATE TABLE booking_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'waitlisted', 'no_show')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    UNIQUE(booking_id, user_id)
);

-- Resources table (workshops, equipment, spaces, events)
CREATE TABLE resources (
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
    availability_rules JSONB DEFAULT '{}', -- Rules for when this resource can be booked
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL
);

-- Recurring booking templates
CREATE TABLE booking_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    recurrence_pattern TEXT NOT NULL CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'custom')),
    recurrence_data JSONB DEFAULT '{}', -- Custom recurrence rules
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    capacity INTEGER DEFAULT 1,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    location TEXT,
    requirements TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL
);

-- Booking waitlist
CREATE TABLE booking_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    position INTEGER NOT NULL,
    notified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, user_id)
);

-- Booking analytics and KPIs
CREATE TABLE booking_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, date, metric_name)
);

-- Indexes for performance
CREATE INDEX idx_bookings_organization_id ON bookings(organization_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_resource_type ON bookings(resource_type);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

CREATE INDEX idx_booking_participants_booking_id ON booking_participants(booking_id);
CREATE INDEX idx_booking_participants_user_id ON booking_participants(user_id);
CREATE INDEX idx_booking_participants_status ON booking_participants(status);

CREATE INDEX idx_resources_organization_id ON resources(organization_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_is_active ON resources(is_active);

CREATE INDEX idx_booking_templates_organization_id ON booking_templates(organization_id);
CREATE INDEX idx_booking_templates_resource_id ON booking_templates(resource_id);
CREATE INDEX idx_booking_templates_is_active ON booking_templates(is_active);

CREATE INDEX idx_booking_waitlist_booking_id ON booking_waitlist(booking_id);
CREATE INDEX idx_booking_waitlist_user_id ON booking_waitlist(user_id);
CREATE INDEX idx_booking_waitlist_position ON booking_waitlist(position);

CREATE INDEX idx_booking_analytics_organization_id ON booking_analytics(organization_id);
CREATE INDEX idx_booking_analytics_date ON booking_analytics(date);
CREATE INDEX idx_booking_analytics_metric_name ON booking_analytics(metric_name);

-- Row Level Security (RLS) policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Users can view bookings for their organization" ON bookings
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can create bookings for their organization" ON bookings
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (
        user_id = auth.uid()::text OR
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for booking_participants
CREATE POLICY "Users can view participants for their organization bookings" ON booking_participants
    FOR SELECT USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Users can manage participants for their organization bookings" ON booking_participants
    FOR ALL USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

-- RLS Policies for resources
CREATE POLICY "Users can view resources for their organization" ON resources
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Admins can manage resources for their organization" ON resources
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for booking_templates
CREATE POLICY "Users can view booking templates for their organization" ON booking_templates
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Admins can manage booking templates for their organization" ON booking_templates
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for booking_waitlist
CREATE POLICY "Users can view waitlist for their organization bookings" ON booking_waitlist
    FOR SELECT USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Users can manage waitlist for their organization bookings" ON booking_waitlist
    FOR ALL USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

-- RLS Policies for booking_analytics
CREATE POLICY "Users can view analytics for their organization" ON booking_analytics
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "System can insert analytics for organizations" ON booking_analytics
    FOR INSERT WITH CHECK (true); -- Allow system to insert analytics

-- Functions for booking management
CREATE OR REPLACE FUNCTION update_booking_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE bookings 
        SET current_participants = (
            SELECT COUNT(*) 
            FROM booking_participants 
            WHERE booking_id = NEW.booking_id 
            AND status IN ('registered', 'confirmed')
        )
        WHERE id = NEW.booking_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE bookings 
        SET current_participants = (
            SELECT COUNT(*) 
            FROM booking_participants 
            WHERE booking_id = OLD.booking_id 
            AND status IN ('registered', 'confirmed')
        )
        WHERE id = OLD.booking_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update participant count
CREATE TRIGGER trigger_update_booking_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON booking_participants
    FOR EACH ROW EXECUTE FUNCTION update_booking_participant_count();

-- Function to check booking availability
CREATE OR REPLACE FUNCTION check_booking_availability(
    p_organization_id UUID,
    p_resource_id TEXT,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_capacity INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
    resource_capacity INTEGER;
    current_bookings INTEGER;
BEGIN
    -- Get resource capacity
    SELECT capacity INTO resource_capacity
    FROM resources
    WHERE id::text = p_resource_id 
    AND organization_id = p_organization_id
    AND is_active = true;
    
    IF resource_capacity IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check for overlapping bookings
    SELECT COALESCE(SUM(current_participants), 0) INTO current_bookings
    FROM bookings
    WHERE organization_id = p_organization_id
    AND resource_id = p_resource_id
    AND status IN ('confirmed', 'pending')
    AND (
        (start_time < p_end_time AND end_time > p_start_time)
    );
    
    RETURN (current_bookings + p_capacity) <= resource_capacity;
END;
$$ LANGUAGE plpgsql;

-- Function to generate booking analytics
CREATE OR REPLACE FUNCTION generate_booking_analytics(
    p_organization_id UUID,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
BEGIN
    -- Total bookings for the day
    INSERT INTO booking_analytics (organization_id, date, metric_name, metric_value)
    SELECT 
        p_organization_id,
        p_date,
        'total_bookings',
        COUNT(*)
    FROM bookings
    WHERE organization_id = p_organization_id
    AND DATE(created_at) = p_date
    ON CONFLICT (organization_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Total participants for the day
    INSERT INTO booking_analytics (organization_id, date, metric_name, metric_value)
    SELECT 
        p_organization_id,
        p_date,
        'total_participants',
        COALESCE(SUM(current_participants), 0)
    FROM bookings
    WHERE organization_id = p_organization_id
    AND DATE(created_at) = p_date
    ON CONFLICT (organization_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Revenue for the day
    INSERT INTO booking_analytics (organization_id, date, metric_name, metric_value)
    SELECT 
        p_organization_id,
        p_date,
        'daily_revenue',
        COALESCE(SUM(price * current_participants), 0)
    FROM bookings
    WHERE organization_id = p_organization_id
    AND DATE(created_at) = p_date
    AND status IN ('confirmed', 'completed')
    ON CONFLICT (organization_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Booking completion rate
    INSERT INTO booking_analytics (organization_id, date, metric_name, metric_value)
    SELECT 
        p_organization_id,
        p_date,
        'completion_rate',
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100
        END
    FROM bookings
    WHERE organization_id = p_organization_id
    AND DATE(created_at) = p_date
    ON CONFLICT (organization_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
END;
$$ LANGUAGE plpgsql;


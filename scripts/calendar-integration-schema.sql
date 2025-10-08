-- Calendar Integration Database Schema
-- This script adds calendar integration support to the existing booking system

-- Create user_calendar_tokens table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS user_calendar_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft')),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Create calendar_events table for tracking created calendar events
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft')),
    external_event_id TEXT NOT NULL, -- ID from Google/Microsoft
    calendar_id TEXT, -- Google calendar ID or Microsoft calendar ID
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    attendees JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, provider)
);

-- Create calendar_availability_cache table for caching availability data
CREATE TABLE IF NOT EXISTS calendar_availability_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft')),
    calendar_id TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_available BOOLEAN NOT NULL,
    reason TEXT,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(user_id, provider, calendar_id, start_time, end_time)
);

-- Add calendar integration fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS calendar_sync_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS calendar_event_created BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS calendar_provider TEXT CHECK (calendar_provider IN ('google', 'microsoft')),
ADD COLUMN IF NOT EXISTS calendar_event_id TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_calendar_tokens_user_provider ON user_calendar_tokens(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_user_calendar_tokens_expires ON user_calendar_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_calendar_events_booking ON calendar_events(booking_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_external ON calendar_events(provider, external_event_id);
CREATE INDEX IF NOT EXISTS idx_calendar_availability_cache_user ON calendar_availability_cache(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_calendar_availability_cache_expires ON calendar_availability_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_bookings_calendar_sync ON bookings(calendar_sync_enabled);

-- Add RLS policies for user_calendar_tokens
ALTER TABLE user_calendar_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own calendar tokens" ON user_calendar_tokens
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own calendar tokens" ON user_calendar_tokens
    FOR ALL USING (auth.uid()::text = user_id);

-- Add RLS policies for calendar_events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own calendar events" ON calendar_events
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own calendar events" ON calendar_events
    FOR ALL USING (auth.uid()::text = user_id);

-- Add RLS policies for calendar_availability_cache
ALTER TABLE calendar_availability_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own availability cache" ON calendar_availability_cache
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "System can manage availability cache" ON calendar_availability_cache
    FOR ALL USING (true); -- Allow system to manage cache

-- Create function to clean up expired availability cache
CREATE OR REPLACE FUNCTION cleanup_expired_availability_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM calendar_availability_cache 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's calendar availability
CREATE OR REPLACE FUNCTION get_user_calendar_availability(
    p_user_id TEXT,
    p_provider TEXT,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    is_available BOOLEAN,
    reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cac.start_time,
        cac.end_time,
        cac.is_available,
        cac.reason
    FROM calendar_availability_cache cac
    WHERE cac.user_id = p_user_id
    AND cac.provider = p_provider
    AND cac.start_time >= p_start_time
    AND cac.end_time <= p_end_time
    AND cac.expires_at > NOW()
    ORDER BY cac.start_time;
END;
$$ LANGUAGE plpgsql;

-- Create function to cache calendar availability
CREATE OR REPLACE FUNCTION cache_calendar_availability(
    p_user_id TEXT,
    p_provider TEXT,
    p_calendar_id TEXT,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_is_available BOOLEAN,
    p_reason TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO calendar_availability_cache (
        user_id,
        provider,
        calendar_id,
        start_time,
        end_time,
        is_available,
        reason,
        expires_at
    ) VALUES (
        p_user_id,
        p_provider,
        p_calendar_id,
        p_start_time,
        p_end_time,
        p_is_available,
        p_reason,
        NOW() + INTERVAL '1 hour' -- Cache for 1 hour
    )
    ON CONFLICT (user_id, provider, calendar_id, start_time, end_time)
    DO UPDATE SET
        is_available = EXCLUDED.is_available,
        reason = EXCLUDED.reason,
        cached_at = NOW(),
        expires_at = EXCLUDED.expires_at;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create calendar events when booking is confirmed
CREATE OR REPLACE FUNCTION create_calendar_event_on_booking_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create calendar event if booking status changed to 'confirmed' and calendar sync is enabled
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' AND NEW.calendar_sync_enabled = true THEN
        -- This would be handled by the application logic, not the database
        -- The trigger is here for future use if needed
        NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_calendar_event
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION create_calendar_event_on_booking_confirmation();

-- Insert sample calendar integration settings for existing bookings
UPDATE bookings 
SET calendar_sync_enabled = false,
    calendar_event_created = false
WHERE calendar_sync_enabled IS NULL;

-- Create a view for calendar integration status
CREATE OR REPLACE VIEW calendar_integration_status AS
SELECT 
    b.id as booking_id,
    b.title,
    b.start_time,
    b.end_time,
    b.status,
    b.calendar_sync_enabled,
    b.calendar_event_created,
    b.calendar_provider,
    b.calendar_event_id,
    uct.provider as token_provider,
    uct.expires_at as token_expires_at,
    ce.external_event_id,
    ce.created_at as calendar_event_created_at
FROM bookings b
LEFT JOIN user_calendar_tokens uct ON b.user_id = uct.user_id
LEFT JOIN calendar_events ce ON b.id = ce.booking_id
ORDER BY b.created_at DESC;

-- Grant permissions
GRANT SELECT ON calendar_integration_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_calendar_availability TO authenticated;
GRANT EXECUTE ON FUNCTION cache_calendar_availability TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_availability_cache TO authenticated;

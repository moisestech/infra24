-- Create waitlist functionality tables
-- This script adds waitlist support to the booking system

-- Waitlist entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    requested_start_time TIMESTAMPTZ NOT NULL,
    requested_end_time TIMESTAMPTZ NOT NULL,
    priority INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'booked', 'expired', 'cancelled')),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_org_resource ON waitlist_entries(org_id, resource_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_status ON waitlist_entries(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_priority ON waitlist_entries(priority);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_expires ON waitlist_entries(expires_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_user ON waitlist_entries(user_email);

-- Add RLS policies
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Policy for organization members to view their waitlist entries
CREATE POLICY "Users can view their own waitlist entries" ON waitlist_entries
    FOR SELECT USING (
        auth.jwt() ->> 'email' = user_email OR
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_id = org_id 
            AND user_id = auth.uid()
        )
    );

-- Policy for organization members to create waitlist entries
CREATE POLICY "Users can create waitlist entries" ON waitlist_entries
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'email' = user_email OR
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_id = org_id 
            AND user_id = auth.uid()
        )
    );

-- Policy for organization members to update their waitlist entries
CREATE POLICY "Users can update their own waitlist entries" ON waitlist_entries
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = user_email OR
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_id = org_id 
            AND user_id = auth.uid()
        )
    );

-- Policy for organization members to delete their waitlist entries
CREATE POLICY "Users can delete their own waitlist entries" ON waitlist_entries
    FOR DELETE USING (
        auth.jwt() ->> 'email' = user_email OR
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_id = org_id 
            AND user_id = auth.uid()
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_waitlist_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_waitlist_entries_updated_at
    BEFORE UPDATE ON waitlist_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_waitlist_entries_updated_at();

-- Function to clean up expired waitlist entries
CREATE OR REPLACE FUNCTION cleanup_expired_waitlist_entries()
RETURNS INTEGER AS $$
DECLARE
    cleaned_count INTEGER;
BEGIN
    UPDATE waitlist_entries 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired entries (if pg_cron is available)
-- SELECT cron.schedule('cleanup-expired-waitlist', '0 * * * *', 'SELECT cleanup_expired_waitlist_entries();');

-- Add waitlist analytics view
CREATE OR REPLACE VIEW waitlist_analytics AS
SELECT 
    we.org_id,
    we.resource_id,
    r.title as resource_title,
    COUNT(*) as total_entries,
    COUNT(CASE WHEN we.status = 'pending' THEN 1 END) as pending_entries,
    COUNT(CASE WHEN we.status = 'notified' THEN 1 END) as notified_entries,
    COUNT(CASE WHEN we.status = 'booked' THEN 1 END) as booked_entries,
    COUNT(CASE WHEN we.status = 'expired' THEN 1 END) as expired_entries,
    COUNT(CASE WHEN we.status = 'cancelled' THEN 1 END) as cancelled_entries,
    AVG(EXTRACT(EPOCH FROM (we.updated_at - we.created_at))/3600) as avg_wait_time_hours,
    MIN(we.created_at) as oldest_entry,
    MAX(we.created_at) as newest_entry
FROM waitlist_entries we
JOIN resources r ON we.resource_id = r.id
GROUP BY we.org_id, we.resource_id, r.title;

-- Grant permissions
GRANT SELECT ON waitlist_analytics TO authenticated;
GRANT ALL ON waitlist_entries TO authenticated;

-- Insert sample waitlist entries for testing (optional)
-- INSERT INTO waitlist_entries (org_id, resource_id, user_email, user_name, requested_start_time, requested_end_time, priority, expires_at)
-- VALUES 
--     ('2133fe94-fb12-41f8-ab37-ea4acd4589f6', '7d683079-3514-4b60-9155-7e4df4c46a30', 'artist1@example.com', 'Artist One', '2025-10-15 14:00:00+00', '2025-10-15 15:00:00+00', 1, NOW() + INTERVAL '24 hours'),
--     ('2133fe94-fb12-41f8-ab37-ea4acd4589f6', '7d683079-3514-4b60-9155-7e4df4c46a30', 'artist2@example.com', 'Artist Two', '2025-10-15 15:00:00+00', '2025-10-15 16:00:00+00', 2, NOW() + INTERVAL '24 hours');

COMMENT ON TABLE waitlist_entries IS 'Stores waitlist entries for fully booked resources';
COMMENT ON COLUMN waitlist_entries.priority IS 'Lower number = higher priority';
COMMENT ON COLUMN waitlist_entries.status IS 'Current status of the waitlist entry';
COMMENT ON COLUMN waitlist_entries.expires_at IS 'When the waitlist entry expires (typically 24 hours)';
COMMENT ON COLUMN waitlist_entries.booking_id IS 'ID of the booking created from this waitlist entry (if any)';






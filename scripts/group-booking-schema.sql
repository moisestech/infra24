-- Group Booking Database Schema Updates
-- This script adds group booking functionality to the existing booking system

-- Add group booking fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS is_group_booking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS group_size INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS available_spots INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS waitlist_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS group_booking_type TEXT CHECK (group_booking_type IN ('public', 'private', 'invite_only')) DEFAULT 'public',
ADD COLUMN IF NOT EXISTS group_organizer_id TEXT, -- Clerk user ID of the person who created the group booking
ADD COLUMN IF NOT EXISTS group_booking_metadata JSONB DEFAULT '{}';

-- Create group_booking_participants table for managing group participants
CREATE TABLE IF NOT EXISTS group_booking_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    participant_name TEXT NOT NULL,
    participant_email TEXT NOT NULL,
    participant_phone TEXT,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'waitlisted', 'no_show')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, user_id)
);

-- Create waitlist table for managing waitlisted participants
CREATE TABLE IF NOT EXISTS booking_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    participant_name TEXT NOT NULL,
    participant_email TEXT NOT NULL,
    participant_phone TEXT,
    position INTEGER NOT NULL, -- Position in waitlist queue
    notified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE, -- When the waitlist spot expires
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'expired', 'converted', 'cancelled')),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, user_id)
);

-- Create group_booking_invitations table for invite-only group bookings
CREATE TABLE IF NOT EXISTS group_booking_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    invited_by_user_id TEXT NOT NULL, -- Clerk user ID of person who sent invitation
    invited_user_id TEXT, -- Clerk user ID of invited person (if they have an account)
    invited_email TEXT NOT NULL,
    invited_name TEXT,
    invitation_token UUID DEFAULT uuid_generate_v4() UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_group_booking ON bookings(is_group_booking);
CREATE INDEX IF NOT EXISTS idx_bookings_group_organizer ON bookings(group_organizer_id);
CREATE INDEX IF NOT EXISTS idx_group_booking_participants_booking ON group_booking_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_group_booking_participants_user ON group_booking_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_group_booking_participants_status ON group_booking_participants(status);
CREATE INDEX IF NOT EXISTS idx_booking_waitlist_booking ON booking_waitlist(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_waitlist_position ON booking_waitlist(booking_id, position);
CREATE INDEX IF NOT EXISTS idx_booking_waitlist_status ON booking_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_booking_waitlist_expires ON booking_waitlist(expires_at);
CREATE INDEX IF NOT EXISTS idx_group_booking_invitations_booking ON group_booking_invitations(booking_id);
CREATE INDEX IF NOT EXISTS idx_group_booking_invitations_token ON group_booking_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_group_booking_invitations_status ON group_booking_invitations(status);

-- Add RLS policies for group_booking_participants
ALTER TABLE group_booking_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants of their bookings" ON group_booking_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings b 
            WHERE b.id = group_booking_participants.booking_id 
            AND (b.user_id = auth.uid()::text OR b.group_organizer_id = auth.uid()::text)
        )
    );

CREATE POLICY "Users can manage their own participation" ON group_booking_participants
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Organizers can manage all participants" ON group_booking_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM bookings b 
            WHERE b.id = group_booking_participants.booking_id 
            AND b.group_organizer_id = auth.uid()::text
        )
    );

-- Add RLS policies for booking_waitlist
ALTER TABLE booking_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view waitlist for their bookings" ON booking_waitlist
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings b 
            WHERE b.id = booking_waitlist.booking_id 
            AND (b.user_id = auth.uid()::text OR b.group_organizer_id = auth.uid()::text)
        )
    );

CREATE POLICY "Users can manage their own waitlist entries" ON booking_waitlist
    FOR ALL USING (auth.uid()::text = user_id);

-- Add RLS policies for group_booking_invitations
ALTER TABLE group_booking_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations for their bookings" ON group_booking_invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings b 
            WHERE b.id = group_booking_invitations.booking_id 
            AND (b.user_id = auth.uid()::text OR b.group_organizer_id = auth.uid()::text)
        )
    );

CREATE POLICY "Users can manage invitations they sent" ON group_booking_invitations
    FOR ALL USING (auth.uid()::text = invited_by_user_id);

-- Create function to get available spots for a group booking
CREATE OR REPLACE FUNCTION get_group_booking_available_spots(p_booking_id UUID)
RETURNS INTEGER AS $$
DECLARE
    booking_capacity INTEGER;
    current_participants INTEGER;
BEGIN
    -- Get booking capacity
    SELECT capacity INTO booking_capacity
    FROM bookings
    WHERE id = p_booking_id;
    
    -- Get current confirmed participants
    SELECT COUNT(*) INTO current_participants
    FROM group_booking_participants
    WHERE booking_id = p_booking_id
    AND status IN ('registered', 'confirmed');
    
    RETURN GREATEST(0, booking_capacity - current_participants);
END;
$$ LANGUAGE plpgsql;

-- Create function to add participant to group booking
CREATE OR REPLACE FUNCTION add_group_booking_participant(
    p_booking_id UUID,
    p_user_id TEXT,
    p_participant_name TEXT,
    p_participant_email TEXT,
    p_participant_phone TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    available_spots INTEGER;
    booking_capacity INTEGER;
    result JSONB;
BEGIN
    -- Check if booking exists and is a group booking
    IF NOT EXISTS (
        SELECT 1 FROM bookings 
        WHERE id = p_booking_id AND is_group_booking = true
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Booking not found or not a group booking'
        );
    END IF;
    
    -- Get available spots
    available_spots := get_group_booking_available_spots(p_booking_id);
    booking_capacity := (SELECT capacity FROM bookings WHERE id = p_booking_id);
    
    -- Check if there are available spots
    IF available_spots <= 0 THEN
        -- Add to waitlist if enabled
        IF EXISTS (
            SELECT 1 FROM bookings 
            WHERE id = p_booking_id AND waitlist_enabled = true
        ) THEN
            INSERT INTO booking_waitlist (
                booking_id,
                user_id,
                participant_name,
                participant_email,
                participant_phone,
                position,
                expires_at
            ) VALUES (
                p_booking_id,
                p_user_id,
                p_participant_name,
                p_participant_email,
                p_participant_phone,
                (SELECT COALESCE(MAX(position), 0) + 1 FROM booking_waitlist WHERE booking_id = p_booking_id),
                NOW() + INTERVAL '24 hours'
            );
            
            RETURN jsonb_build_object(
                'success', true,
                'status', 'waitlisted',
                'position', (SELECT position FROM booking_waitlist WHERE booking_id = p_booking_id AND user_id = p_user_id),
                'message', 'Added to waitlist'
            );
        ELSE
            RETURN jsonb_build_object(
                'success', false,
                'error', 'No available spots and waitlist not enabled'
            );
        END IF;
    END IF;
    
    -- Add participant to group booking
    INSERT INTO group_booking_participants (
        booking_id,
        user_id,
        participant_name,
        participant_email,
        participant_phone,
        notes,
        status
    ) VALUES (
        p_booking_id,
        p_user_id,
        p_participant_name,
        p_participant_email,
        p_participant_phone,
        p_notes,
        'registered'
    );
    
    -- Update booking current_participants count
    UPDATE bookings 
    SET current_participants = (
        SELECT COUNT(*) FROM group_booking_participants 
        WHERE booking_id = p_booking_id AND status IN ('registered', 'confirmed')
    ),
    available_spots = get_group_booking_available_spots(p_booking_id)
    WHERE id = p_booking_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'status', 'registered',
        'available_spots', get_group_booking_available_spots(p_booking_id),
        'message', 'Successfully added to group booking'
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to remove participant from group booking
CREATE OR REPLACE FUNCTION remove_group_booking_participant(
    p_booking_id UUID,
    p_user_id TEXT
)
RETURNS JSONB AS $$
DECLARE
    participant_exists BOOLEAN;
    waitlist_position INTEGER;
BEGIN
    -- Check if participant exists
    SELECT EXISTS(
        SELECT 1 FROM group_booking_participants 
        WHERE booking_id = p_booking_id AND user_id = p_user_id
    ) INTO participant_exists;
    
    IF NOT participant_exists THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Participant not found'
        );
    END IF;
    
    -- Remove participant
    UPDATE group_booking_participants 
    SET status = 'cancelled', cancelled_at = NOW()
    WHERE booking_id = p_booking_id AND user_id = p_user_id;
    
    -- Update booking counts
    UPDATE bookings 
    SET current_participants = (
        SELECT COUNT(*) FROM group_booking_participants 
        WHERE booking_id = p_booking_id AND status IN ('registered', 'confirmed')
    ),
    available_spots = get_group_booking_available_spots(p_booking_id)
    WHERE id = p_booking_id;
    
    -- Check if we can promote someone from waitlist
    IF EXISTS (
        SELECT 1 FROM booking_waitlist 
        WHERE booking_id = p_booking_id 
        AND status = 'waiting' 
        AND expires_at > NOW()
        ORDER BY position 
        LIMIT 1
    ) THEN
        -- Get the next person in waitlist
        SELECT position INTO waitlist_position
        FROM booking_waitlist 
        WHERE booking_id = p_booking_id 
        AND status = 'waiting' 
        AND expires_at > NOW()
        ORDER BY position 
        LIMIT 1;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Participant removed. Next person in waitlist can be notified.',
            'waitlist_position', waitlist_position,
            'available_spots', get_group_booking_available_spots(p_booking_id)
        );
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Participant removed',
        'available_spots', get_group_booking_available_spots(p_booking_id)
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to promote waitlist participant
CREATE OR REPLACE FUNCTION promote_waitlist_participant(
    p_booking_id UUID,
    p_waitlist_id UUID
)
RETURNS JSONB AS $$
DECLARE
    waitlist_record RECORD;
BEGIN
    -- Get waitlist record
    SELECT * INTO waitlist_record
    FROM booking_waitlist
    WHERE id = p_waitlist_id AND booking_id = p_booking_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Waitlist entry not found'
        );
    END IF;
    
    -- Check if there are available spots
    IF get_group_booking_available_spots(p_booking_id) <= 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No available spots'
        );
    END IF;
    
    -- Add to group booking participants
    INSERT INTO group_booking_participants (
        booking_id,
        user_id,
        participant_name,
        participant_email,
        participant_phone,
        status
    ) VALUES (
        p_booking_id,
        waitlist_record.user_id,
        waitlist_record.participant_name,
        waitlist_record.participant_email,
        waitlist_record.participant_phone,
        'registered'
    );
    
    -- Update waitlist status
    UPDATE booking_waitlist 
    SET status = 'converted', responded_at = NOW()
    WHERE id = p_waitlist_id;
    
    -- Update booking counts
    UPDATE bookings 
    SET current_participants = (
        SELECT COUNT(*) FROM group_booking_participants 
        WHERE booking_id = p_booking_id AND status IN ('registered', 'confirmed')
    ),
    available_spots = get_group_booking_available_spots(p_booking_id)
    WHERE id = p_booking_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Waitlist participant promoted successfully'
    );
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_group_booking_available_spots TO authenticated;
GRANT EXECUTE ON FUNCTION add_group_booking_participant TO authenticated;
GRANT EXECUTE ON FUNCTION remove_group_booking_participant TO authenticated;
GRANT EXECUTE ON FUNCTION promote_waitlist_participant TO authenticated;

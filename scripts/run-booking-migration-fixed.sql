-- ============================================================
-- BOOKING SYSTEM DATABASE MIGRATION (FIXED FOR EXISTING SCHEMA)
-- ============================================================

-- 1) Add missing extensions
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2) Migrate existing start_time/end_time to starts_at/ends_at
UPDATE public.bookings 
SET starts_at = start_time, ends_at = end_time
WHERE starts_at IS NULL AND start_time IS NOT NULL;

-- 3) Update resource_uuid_id from existing resource_id
UPDATE public.bookings 
SET resource_uuid_id = r.id
FROM public.resources r
WHERE bookings.resource_id = r.id::text
AND bookings.resource_uuid_id IS NULL;

-- 4) Create workshop-related tables
CREATE TABLE IF NOT EXISTS public.workshops (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    instructor_profile_id uuid REFERENCES public.artist_profiles(id) ON DELETE SET NULL,
    default_resource_id uuid REFERENCES public.resources(id) ON DELETE SET NULL,
    capacity integer,
    is_public boolean NOT NULL DEFAULT true,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
    registration_open_at timestamptz,
    registration_close_at timestamptz,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workshop_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id uuid NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
    booking_id uuid NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    capacity integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workshop_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    workshop_id uuid NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
    session_id uuid REFERENCES public.workshop_sessions(id) ON DELETE SET NULL,
    clerk_user_id text NOT NULL,
    status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'cancelled', 'attended', 'no_show')),
    registered_at timestamptz NOT NULL DEFAULT now(),
    cancelled_at timestamptz,
    checkin_at timestamptz,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT uniq_one_registration UNIQUE (workshop_id, session_id, clerk_user_id)
);

-- 5) Create integration outbox for CRM sync
CREATE TABLE IF NOT EXISTS public.integration_outbox (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    topic text NOT NULL,
    payload jsonb NOT NULL,
    deliver_after timestamptz NOT NULL DEFAULT now(),
    delivered_at timestamptz,
    retry_count integer NOT NULL DEFAULT 0,
    last_error text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 6) Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_org_bookable ON public.resources(organization_id, is_bookable);
CREATE INDEX IF NOT EXISTS idx_workshops_org ON public.workshops(organization_id);
CREATE INDEX IF NOT EXISTS idx_workshops_status ON public.workshops(status);
CREATE INDEX IF NOT EXISTS idx_registrations_org ON public.workshop_registrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.workshop_registrations(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_outbox_due ON public.integration_outbox(organization_id, deliver_after) WHERE delivered_at IS NULL;

-- 7) Add triggers for updated_at
CREATE TRIGGER trg_workshops_updated
BEFORE UPDATE ON public.workshops
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_workshop_sessions_updated
BEFORE UPDATE ON public.workshop_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8) Enable RLS on new tables
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_outbox ENABLE ROW LEVEL SECURITY;

-- 9) Create RLS policies (using existing auth.uid() function)
-- Workshops: members can read, admins can manage
DROP POLICY IF EXISTS wk_select_members ON public.workshops;
CREATE POLICY wk_select_members
ON public.workshops FOR SELECT TO authenticated
USING (
    EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.organization_id = workshops.organization_id
        AND m.clerk_user_id = (auth.uid())::text
    )
);

DROP POLICY IF EXISTS wk_admin_all ON public.workshops;
CREATE POLICY wk_admin_all
ON public.workshops FOR ALL TO authenticated
USING (
    EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.organization_id = workshops.organization_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
)
WITH CHECK (
    EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.organization_id = workshops.organization_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
);

-- Workshop sessions: same as parent workshop
DROP POLICY IF EXISTS ws_select_members ON public.workshop_sessions;
CREATE POLICY ws_select_members
ON public.workshop_sessions FOR SELECT TO authenticated
USING (
    EXISTS(
        SELECT 1 FROM public.workshops w
        JOIN public.org_memberships m ON m.organization_id = w.organization_id
        WHERE w.id = workshop_sessions.workshop_id
        AND m.clerk_user_id = (auth.uid())::text
    )
);

DROP POLICY IF EXISTS ws_admin_all ON public.workshop_sessions;
CREATE POLICY ws_admin_all
ON public.workshop_sessions FOR ALL TO authenticated
USING (
    EXISTS(
        SELECT 1 FROM public.workshops w
        JOIN public.org_memberships m ON m.organization_id = w.organization_id
        WHERE w.id = workshop_sessions.workshop_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
)
WITH CHECK (
    EXISTS(
        SELECT 1 FROM public.workshops w
        JOIN public.org_memberships m ON m.organization_id = w.organization_id
        WHERE w.id = workshop_sessions.workshop_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
);

-- Registrations: users see theirs, admins see all
DROP POLICY IF EXISTS reg_self_select ON public.workshop_registrations;
CREATE POLICY reg_self_select
ON public.workshop_registrations FOR SELECT TO authenticated
USING (
    clerk_user_id = (auth.uid())::text 
    OR EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.organization_id = workshop_registrations.organization_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
);

DROP POLICY IF EXISTS reg_self_insert ON public.workshop_registrations;
CREATE POLICY reg_self_insert
ON public.workshop_registrations FOR INSERT TO authenticated
WITH CHECK (
    clerk_user_id = (auth.uid())::text
    AND EXISTS(
        SELECT 1 FROM public.workshops w
        WHERE w.id = workshop_registrations.workshop_id
        AND w.status = 'published'
    )
);

DROP POLICY IF EXISTS reg_self_update ON public.workshop_registrations;
CREATE POLICY reg_self_update
ON public.workshop_registrations FOR UPDATE TO authenticated
USING (
    clerk_user_id = (auth.uid())::text 
    OR EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.organization_id = workshop_registrations.organization_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
)
WITH CHECK (
    clerk_user_id = (auth.uid())::text 
    OR EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.organization_id = workshop_registrations.organization_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
);

-- Integration outbox: admins only
DROP POLICY IF EXISTS outbox_admin ON public.integration_outbox;
CREATE POLICY outbox_admin
ON public.integration_outbox FOR ALL TO authenticated
USING (
    EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.organization_id = integration_outbox.organization_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
)
WITH CHECK (
    EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.organization_id = integration_outbox.organization_id
        AND m.clerk_user_id = (auth.uid())::text
        AND m.role IN ('org_admin', 'super_admin', 'moderator')
    )
);

-- 10) Seed initial resources for Oolite Digital Lab
INSERT INTO public.resources (organization_id, type, title, description, capacity, is_bookable, metadata, created_by, updated_by)
SELECT 
    o.id,
    'equipment',
    'VR Headset',
    'Oculus Quest 2 VR Headset for immersive experiences',
    1,
    true,
    '{"equipment_type": "vr", "specs": {"model": "Oculus Quest 2", "storage": "128GB"}}'::jsonb,
    'system',
    'system'
FROM public.organizations o
WHERE o.slug = 'oolite'
ON CONFLICT DO NOTHING;

INSERT INTO public.resources (organization_id, type, title, description, capacity, is_bookable, metadata, created_by, updated_by)
SELECT 
    o.id,
    'equipment',
    '3D Printer',
    'Prusa i3 MK3S+ 3D Printer for prototyping',
    1,
    true,
    '{"equipment_type": "3d_printer", "specs": {"model": "Prusa i3 MK3S+", "build_volume": "250x210x200mm"}}'::jsonb,
    'system',
    'system'
FROM public.organizations o
WHERE o.slug = 'oolite'
ON CONFLICT DO NOTHING;

INSERT INTO public.resources (organization_id, type, title, description, capacity, is_bookable, metadata, created_by, updated_by)
SELECT 
    o.id,
    'space',
    'Digital Lab',
    'Main digital lab space for workshops and individual work',
    12,
    true,
    '{"space_type": "lab", "equipment": ["computers", "projector", "whiteboard"]}'::jsonb,
    'system',
    'system'
FROM public.organizations o
WHERE o.slug = 'oolite'
ON CONFLICT DO NOTHING;

-- 11) Create helper functions
CREATE OR REPLACE FUNCTION public.get_available_slots(
    p_resource_id uuid,
    p_start_date timestamptz,
    p_end_date timestamptz,
    p_duration_minutes integer DEFAULT 60
)
RETURNS TABLE (
    start_time timestamptz,
    end_time timestamptz
) AS $$
BEGIN
    RETURN QUERY
    WITH booked_slots AS (
        SELECT starts_at, ends_at
        FROM public.bookings
        WHERE resource_uuid_id = p_resource_id
        AND status IN ('pending', 'confirmed')
        AND starts_at < p_end_date
        AND ends_at > p_start_date
    ),
    time_slots AS (
        SELECT 
            generate_series(
                date_trunc('hour', p_start_date),
                p_end_date,
                (p_duration_minutes || ' minutes')::interval
            ) AS slot_start
    )
    SELECT 
        ts.slot_start,
        ts.slot_start + (p_duration_minutes || ' minutes')::interval
    FROM time_slots ts
    WHERE NOT EXISTS (
        SELECT 1 FROM booked_slots bs
        WHERE ts.slot_start < bs.ends_at
        AND ts.slot_start + (p_duration_minutes || ' minutes')::interval > bs.starts_at
    );
END;
$$ LANGUAGE plpgsql;

-- 12) Create booking capacity check function
CREATE OR REPLACE FUNCTION public.can_book_resource(
    p_resource_id uuid,
    p_start_time timestamptz,
    p_end_time timestamptz,
    p_capacity_needed integer DEFAULT 1
)
RETURNS boolean AS $$
DECLARE
    resource_capacity integer;
    current_bookings integer;
BEGIN
    -- Get resource capacity
    SELECT capacity INTO resource_capacity
    FROM public.resources
    WHERE id = p_resource_id;
    
    -- Get current bookings for the time slot
    SELECT COALESCE(SUM(current_participants), 0) INTO current_bookings
    FROM public.bookings
    WHERE resource_uuid_id = p_resource_id
    AND status IN ('pending', 'confirmed')
    AND starts_at < p_end_time
    AND ends_at > p_start_time;
    
    -- Check if there's enough capacity
    RETURN (current_bookings + p_capacity_needed) <= resource_capacity;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

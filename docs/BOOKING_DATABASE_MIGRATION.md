# Booking System Database Migration

## 🎯 **Migration Overview**

This migration unifies the existing `resources` and `bookings` tables to support a comprehensive booking system while maintaining backward compatibility.

## 📋 **Pre-Migration Checklist**

- [ ] Backup current database
- [ ] Test migration on development environment
- [ ] Verify existing data integrity
- [ ] Plan rollback strategy

## 🔧 **Migration Script**

```sql
-- ============================================================
-- BOOKING SYSTEM DATABASE MIGRATION
-- ============================================================

-- 1) Add missing extensions
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2) Add missing columns to existing resources table
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS time_zone text DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS is_bookable boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS location_note text,
ADD COLUMN IF NOT EXISTS artist_profile_id uuid REFERENCES public.artist_profiles(id) ON DELETE SET NULL;

-- 3) Update existing resources to be bookable by default
UPDATE public.resources 
SET is_bookable = true 
WHERE is_bookable IS NULL;

-- 4) Add time range support to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS starts_at timestamptz,
ADD COLUMN IF NOT EXISTS ends_at timestamptz,
ADD COLUMN IF NOT EXISTS time_range tstzrange 
GENERATED ALWAYS AS (tstzrange(starts_at, ends_at, '[)')) STORED;

-- 5) Migrate existing start_time/end_time to starts_at/ends_at
UPDATE public.bookings 
SET starts_at = start_time, ends_at = end_time
WHERE starts_at IS NULL AND start_time IS NOT NULL;

-- 6) Add resource_id as UUID foreign key (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'resource_uuid_id'
    ) THEN
        ALTER TABLE public.bookings 
        ADD COLUMN resource_uuid_id uuid;
        
        -- Try to match existing resource_id text to resources table
        UPDATE public.bookings 
        SET resource_uuid_id = r.id
        FROM public.resources r
        WHERE bookings.resource_id = r.id::text;
    END IF;
END$$;

-- 7) Add overlap prevention constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'bookings_no_overlap'
    ) THEN
        ALTER TABLE public.bookings
        ADD CONSTRAINT bookings_no_overlap
        EXCLUDE USING gist (
            resource_uuid_id WITH =,
            time_range WITH &&
        ) WHERE (status IN ('pending', 'confirmed'));
    END IF;
END$$;

-- 8) Create workshop-related tables
CREATE TABLE IF NOT EXISTS public.workshops (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
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
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
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

-- 9) Create integration outbox for CRM sync
CREATE TABLE IF NOT EXISTS public.integration_outbox (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    topic text NOT NULL,
    payload jsonb NOT NULL,
    deliver_after timestamptz NOT NULL DEFAULT now(),
    delivered_at timestamptz,
    retry_count integer NOT NULL DEFAULT 0,
    last_error text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 10) Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_org_bookable ON public.resources(org_id, is_bookable);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(org_id, type);
CREATE INDEX IF NOT EXISTS idx_bookings_resource_time ON public.bookings(resource_uuid_id, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_workshops_org ON public.workshops(org_id);
CREATE INDEX IF NOT EXISTS idx_workshops_status ON public.workshops(status);
CREATE INDEX IF NOT EXISTS idx_registrations_org ON public.workshop_registrations(org_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.workshop_registrations(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_outbox_due ON public.integration_outbox(org_id, deliver_after) WHERE delivered_at IS NULL;

-- 11) Add triggers for updated_at
CREATE TRIGGER trg_workshops_updated
BEFORE UPDATE ON public.workshops
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_workshop_sessions_updated
BEFORE UPDATE ON public.workshop_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12) Enable RLS on new tables
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_outbox ENABLE ROW LEVEL SECURITY;

-- 13) Create RLS policies
-- Workshops: members can read, admins can manage
DROP POLICY IF EXISTS wk_select_members ON public.workshops;
CREATE POLICY wk_select_members
ON public.workshops FOR SELECT TO authenticated
USING (
    EXISTS(
        SELECT 1 FROM public.org_memberships m
        WHERE m.org_id = workshops.org_id
        AND m.clerk_user_id = public.current_clerk_id()
    )
);

DROP POLICY IF EXISTS wk_admin_all ON public.workshops;
CREATE POLICY wk_admin_all
ON public.workshops FOR ALL TO authenticated
USING (public.is_admin_for_org(org_id))
WITH CHECK (public.is_admin_for_org(org_id));

-- Workshop sessions: same as parent workshop
DROP POLICY IF EXISTS ws_select_members ON public.workshop_sessions;
CREATE POLICY ws_select_members
ON public.workshop_sessions FOR SELECT TO authenticated
USING (
    EXISTS(
        SELECT 1 FROM public.workshops w
        JOIN public.org_memberships m ON m.org_id = w.org_id
        WHERE w.id = workshop_sessions.workshop_id
        AND m.clerk_user_id = public.current_clerk_id()
    )
);

DROP POLICY IF EXISTS ws_admin_all ON public.workshop_sessions;
CREATE POLICY ws_admin_all
ON public.workshop_sessions FOR ALL TO authenticated
USING (
    EXISTS(
        SELECT 1 FROM public.workshops w
        WHERE w.id = workshop_sessions.workshop_id
        AND public.is_admin_for_org(w.org_id)
    )
)
WITH CHECK (
    EXISTS(
        SELECT 1 FROM public.workshops w
        WHERE w.id = workshop_sessions.workshop_id
        AND public.is_admin_for_org(w.org_id)
    )
);

-- Registrations: users see theirs, admins see all
DROP POLICY IF EXISTS reg_self_select ON public.workshop_registrations;
CREATE POLICY reg_self_select
ON public.workshop_registrations FOR SELECT TO authenticated
USING (clerk_user_id = public.current_clerk_id() OR public.is_admin_for_org(org_id));

DROP POLICY IF EXISTS reg_self_insert ON public.workshop_registrations;
CREATE POLICY reg_self_insert
ON public.workshop_registrations FOR INSERT TO authenticated
WITH CHECK (
    clerk_user_id = public.current_clerk_id()
    AND EXISTS(
        SELECT 1 FROM public.workshops w
        WHERE w.id = workshop_registrations.workshop_id
        AND w.status = 'published'
    )
);

DROP POLICY IF EXISTS reg_self_update ON public.workshop_registrations;
CREATE POLICY reg_self_update
ON public.workshop_registrations FOR UPDATE TO authenticated
USING (clerk_user_id = public.current_clerk_id() OR public.is_admin_for_org(org_id))
WITH CHECK (clerk_user_id = public.current_clerk_id() OR public.is_admin_for_org(org_id));

-- Integration outbox: admins only
DROP POLICY IF EXISTS outbox_admin ON public.integration_outbox;
CREATE POLICY outbox_admin
ON public.integration_outbox FOR ALL TO authenticated
USING (public.is_admin_for_org(org_id))
WITH CHECK (public.is_admin_for_org(org_id));

-- 14) Seed initial resources for Oolite Digital Lab
INSERT INTO public.resources (org_id, type, title, description, capacity, is_bookable, metadata)
SELECT 
    o.id,
    'equipment',
    'VR Headset',
    'Oculus Quest 2 VR Headset for immersive experiences',
    1,
    true,
    '{"equipment_type": "vr", "specs": {"model": "Oculus Quest 2", "storage": "128GB"}}'::jsonb
FROM public.organizations o
WHERE o.slug = 'oolite'
ON CONFLICT DO NOTHING;

INSERT INTO public.resources (org_id, type, title, description, capacity, is_bookable, metadata)
SELECT 
    o.id,
    'equipment',
    '3D Printer',
    'Prusa i3 MK3S+ 3D Printer for prototyping',
    1,
    true,
    '{"equipment_type": "3d_printer", "specs": {"model": "Prusa i3 MK3S+", "build_volume": "250x210x200mm"}}'::jsonb
FROM public.organizations o
WHERE o.slug = 'oolite'
ON CONFLICT DO NOTHING;

INSERT INTO public.resources (org_id, type, title, description, capacity, is_bookable, metadata)
SELECT 
    o.id,
    'space',
    'Digital Lab',
    'Main digital lab space for workshops and individual work',
    12,
    true,
    '{"space_type": "lab", "equipment": ["computers", "projector", "whiteboard"]}'::jsonb
FROM public.organizations o
WHERE o.slug = 'oolite'
ON CONFLICT DO NOTHING;

-- 15) Create helper functions
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

-- 16) Create booking capacity check function
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
```

## ✅ **Post-Migration Verification**

```sql
-- 1) Check that all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('workshops', 'workshop_sessions', 'workshop_registrations', 'integration_outbox');

-- 2) Check that indexes were created
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';

-- 3) Check that RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('workshops', 'workshop_sessions', 'workshop_registrations', 'integration_outbox');

-- 4) Check that resources were seeded
SELECT r.title, r.type, r.capacity, o.name as org_name
FROM public.resources r
JOIN public.organizations o ON o.id = r.org_id
WHERE o.slug = 'oolite';

-- 5) Test helper functions
SELECT * FROM public.get_available_slots(
    (SELECT id FROM public.resources WHERE title = 'Digital Lab' LIMIT 1),
    now(),
    now() + interval '7 days',
    60
);
```

## 🔄 **Rollback Plan**

```sql
-- If rollback is needed, run these in reverse order:

-- 1) Drop new tables
DROP TABLE IF EXISTS public.integration_outbox CASCADE;
DROP TABLE IF EXISTS public.workshop_registrations CASCADE;
DROP TABLE IF EXISTS public.workshop_sessions CASCADE;
DROP TABLE IF EXISTS public.workshops CASCADE;

-- 2) Drop new columns from existing tables
ALTER TABLE public.bookings DROP COLUMN IF EXISTS time_range;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS ends_at;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS starts_at;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS resource_uuid_id;

ALTER TABLE public.resources DROP COLUMN IF EXISTS artist_profile_id;
ALTER TABLE public.resources DROP COLUMN IF EXISTS location_note;
ALTER TABLE public.resources DROP COLUMN IF EXISTS is_bookable;
ALTER TABLE public.resources DROP COLUMN IF EXISTS time_zone;

-- 3) Drop constraints
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_no_overlap;

-- 4) Drop functions
DROP FUNCTION IF EXISTS public.can_book_resource(uuid, timestamptz, timestamptz, integer);
DROP FUNCTION IF EXISTS public.get_available_slots(uuid, timestamptz, timestamptz, integer);
```

## 📊 **Data Migration Notes**

- **Existing bookings**: `start_time`/`end_time` are migrated to `starts_at`/`ends_at`
- **Resource matching**: Attempts to match existing `resource_id` text to UUID
- **Backward compatibility**: Old columns remain for now, can be dropped later
- **RLS policies**: Reuse existing helper functions (`current_clerk_id()`, `is_admin_for_org()`)

## 🚀 **Next Steps After Migration**

1. **Test the migration** on development environment
2. **Install FullCalendar libraries** (see `LIBRARY_INSTALLATION.md`)
3. **Build ResourceCalendar component** (see `COMPONENT_DEVELOPMENT.md`)
4. **Create booking API routes** (see `API_DEVELOPMENT.md`)

---

*This migration provides the foundation for the entire booking system while maintaining backward compatibility with existing data.*

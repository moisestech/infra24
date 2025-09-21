-- Booking System Tables for Infra24
-- This migration creates the necessary tables for the interactive studio map booking system

-- Availability table for resources (studios, equipment, etc.)
CREATE TABLE IF NOT EXISTS public.availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL, -- artist_profiles.id or other resource
  resource_label text,
  date date NOT NULL,
  start_time time with time zone NOT NULL,
  end_time time with time zone NOT NULL,
  capacity int DEFAULT 1,
  price_cents int,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL,
  resource_label text,
  date date NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  booker_clerk_id text,
  booker_name text,
  booker_email text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_avail_org_resource_date
  ON public.availability(org_id, resource_id, date);

CREATE INDEX IF NOT EXISTS idx_bookings_org_resource_date
  ON public.bookings(org_id, resource_id, date);

CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON public.bookings(status);

CREATE INDEX IF NOT EXISTS idx_bookings_booker
  ON public.bookings(booker_clerk_id);

-- Function to prevent overlapping confirmed bookings
CREATE OR REPLACE FUNCTION public.no_overlap()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF new.status IN ('pending','confirmed') THEN
    IF EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.resource_id = new.resource_id
        AND b.status = 'confirmed'
        AND tstzrange(b.start_at, b.end_at, '[)') && tstzrange(new.start_at, new.end_at, '[)')
    ) THEN
      RAISE EXCEPTION 'overlapping booking for this resource';
    END IF;
  END IF;
  RETURN new;
END;
$$;

-- Trigger to prevent overlapping bookings
DROP TRIGGER IF EXISTS trg_bookings_no_overlap ON public.bookings;
CREATE TRIGGER trg_bookings_no_overlap
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.no_overlap();

-- Enable RLS
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for availability
CREATE POLICY IF NOT EXISTS "availability_read_members" ON public.availability
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships m
      WHERE m.org_id = availability.org_id
        AND m.clerk_user_id = public.current_clerk_id()
    )
  );

CREATE POLICY IF NOT EXISTS "availability_admin_all" ON public.availability
  FOR ALL TO authenticated
  USING (public.is_admin_for_org(org_id))
  WITH CHECK (public.is_admin_for_org(org_id));

-- RLS Policies for bookings
CREATE POLICY IF NOT EXISTS "bookings_insert_members" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_memberships m
      WHERE m.org_id = bookings.org_id
        AND m.clerk_user_id = public.current_clerk_id()
    )
  );

CREATE POLICY IF NOT EXISTS "bookings_read_members" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships m
      WHERE m.org_id = bookings.org_id
        AND m.clerk_user_id = public.current_clerk_id()
    )
  );

CREATE POLICY IF NOT EXISTS "bookings_update_self" ON public.bookings
  FOR UPDATE TO authenticated
  USING (booker_clerk_id = public.current_clerk_id())
  WITH CHECK (booker_clerk_id = public.current_clerk_id());

CREATE POLICY IF NOT EXISTS "bookings_admin_all" ON public.bookings
  FOR ALL TO authenticated
  USING (public.is_admin_for_org(org_id))
  WITH CHECK (public.is_admin_for_org(org_id));

-- Helper function to get available time slots for a resource
CREATE OR REPLACE FUNCTION public.get_available_slots(
  p_org_id uuid,
  p_resource_id uuid,
  p_date date
)
RETURNS TABLE(
  start_time time,
  end_time time,
  available boolean
) LANGUAGE sql STABLE AS $$
  WITH time_slots AS (
    SELECT 
      generate_series(
        '09:00'::time,
        '18:00'::time,
        '30 minutes'::interval
      )::time AS start_time
  ),
  slots_with_end AS (
    SELECT 
      start_time,
      (start_time + '30 minutes'::interval)::time AS end_time
    FROM time_slots
  ),
  booked_slots AS (
    SELECT 
      start_at::time AS start_time,
      end_at::time AS end_time
    FROM public.bookings
    WHERE org_id = p_org_id
      AND resource_id = p_resource_id
      AND date = p_date
      AND status IN ('confirmed', 'pending')
  )
  SELECT 
    s.start_time,
    s.end_time,
    NOT EXISTS (
      SELECT 1 FROM booked_slots b
      WHERE tstzrange(
        (p_date::text || ' ' || b.start_time::text)::timestamptz,
        (p_date::text || ' ' || b.end_time::text)::timestamptz,
        '[)'
      ) && tstzrange(
        (p_date::text || ' ' || s.start_time::text)::timestamptz,
        (p_date::text || ' ' || s.end_time::text)::timestamptz,
        '[)'
      )
    ) AS available
  FROM slots_with_end s
  ORDER BY s.start_time;
$$;

-- Function to create a booking
CREATE OR REPLACE FUNCTION public.create_booking(
  p_org_id uuid,
  p_resource_id uuid,
  p_resource_label text,
  p_start_at timestamptz,
  p_end_at timestamptz,
  p_booker_clerk_id text,
  p_booker_name text,
  p_booker_email text,
  p_notes text DEFAULT NULL
)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_booking_id uuid;
BEGIN
  INSERT INTO public.bookings (
    org_id,
    resource_id,
    resource_label,
    date,
    start_at,
    end_at,
    status,
    booker_clerk_id,
    booker_name,
    booker_email,
    metadata
  ) VALUES (
    p_org_id,
    p_resource_id,
    p_resource_label,
    p_start_at::date,
    p_start_at,
    p_end_at,
    'pending',
    p_booker_clerk_id,
    p_booker_name,
    p_booker_email,
    jsonb_build_object('notes', p_notes)
  ) RETURNING id INTO v_booking_id;
  
  RETURN v_booking_id;
END;
$$;

-- Function to get bookings for a resource
CREATE OR REPLACE FUNCTION public.get_resource_bookings(
  p_org_id uuid,
  p_resource_id uuid,
  p_start_date date DEFAULT CURRENT_DATE,
  p_end_date date DEFAULT CURRENT_DATE + INTERVAL '30 days'
)
RETURNS TABLE(
  id uuid,
  date date,
  start_at timestamptz,
  end_at timestamptz,
  status text,
  booker_name text,
  booker_email text,
  metadata jsonb
) LANGUAGE sql STABLE AS $$
  SELECT 
    b.id,
    b.date,
    b.start_at,
    b.end_at,
    b.status,
    b.booker_name,
    b.booker_email,
    b.metadata
  FROM public.bookings b
  WHERE b.org_id = p_org_id
    AND b.resource_id = p_resource_id
    AND b.date BETWEEN p_start_date AND p_end_date
  ORDER BY b.date, b.start_at;
$$;

-- Insert some sample availability data for testing
INSERT INTO public.availability (org_id, resource_id, resource_label, date, start_time, end_time, capacity, notes)
SELECT 
  o.id,
  ap.id,
  'Studio ' || ap.studio_number || ' - ' || ap.name,
  CURRENT_DATE + INTERVAL '1 day',
  '09:00'::time,
  '18:00'::time,
  1,
  'Available for studio visits'
FROM public.organizations o
JOIN public.artist_profiles ap ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.is_claimed = true
  AND ap.studio_number IS NOT NULL
LIMIT 5;

-- Insert availability for the next 7 days
INSERT INTO public.availability (org_id, resource_id, resource_label, date, start_time, end_time, capacity, notes)
SELECT 
  o.id,
  ap.id,
  'Studio ' || ap.studio_number || ' - ' || ap.name,
  CURRENT_DATE + INTERVAL '2 days',
  '09:00'::time,
  '18:00'::time,
  1,
  'Available for studio visits'
FROM public.organizations o
JOIN public.artist_profiles ap ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.is_claimed = true
  AND ap.studio_number IS NOT NULL
LIMIT 5;

-- Add some sample bookings for testing
INSERT INTO public.bookings (
  org_id, 
  resource_id, 
  resource_label, 
  date, 
  start_at, 
  end_at, 
  status, 
  booker_clerk_id, 
  booker_name, 
  booker_email,
  metadata
)
SELECT 
  o.id,
  ap.id,
  'Studio ' || ap.studio_number || ' - ' || ap.name,
  CURRENT_DATE + INTERVAL '1 day',
  (CURRENT_DATE + INTERVAL '1 day')::timestamp + '10:00'::time,
  (CURRENT_DATE + INTERVAL '1 day')::timestamp + '11:00'::time,
  'confirmed',
  'sample_user_123',
  'John Doe',
  'john@example.com',
  jsonb_build_object('notes', 'Studio visit to discuss collaboration')
FROM public.organizations o
JOIN public.artist_profiles ap ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.is_claimed = true
  AND ap.studio_number IS NOT NULL
LIMIT 2;

-- Add another booking for a different time
INSERT INTO public.bookings (
  org_id, 
  resource_id, 
  resource_label, 
  date, 
  start_at, 
  end_at, 
  status, 
  booker_clerk_id, 
  booker_name, 
  booker_email,
  metadata
)
SELECT 
  o.id,
  ap.id,
  'Studio ' || ap.studio_number || ' - ' || ap.name,
  CURRENT_DATE + INTERVAL '1 day',
  (CURRENT_DATE + INTERVAL '1 day')::timestamp + '14:00'::time,
  (CURRENT_DATE + INTERVAL '1 day')::timestamp + '15:00'::time,
  'pending',
  'sample_user_456',
  'Jane Smith',
  'jane@example.com',
  jsonb_build_object('notes', 'Interested in learning about the artist process')
FROM public.organizations o
JOIN public.artist_profiles ap ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.is_claimed = true
  AND ap.studio_number IS NOT NULL
LIMIT 1;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.availability IS 'Defines when resources (studios, equipment) are available for booking';
COMMENT ON TABLE public.bookings IS 'Records of actual bookings made by users';
COMMENT ON FUNCTION public.get_available_slots IS 'Returns available time slots for a resource on a given date';
COMMENT ON FUNCTION public.create_booking IS 'Creates a new booking with validation';
COMMENT ON FUNCTION public.get_resource_bookings IS 'Retrieves bookings for a specific resource within a date range';


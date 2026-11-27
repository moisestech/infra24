-- This fixture may only initialize the dedicated disposable regression database.
DO $$ BEGIN
  IF current_database() <> 'dcc_legacy_permissions_test' THEN
    RAISE EXCEPTION 'Expected the disposable legacy permissions database';
  END IF;
END $$;

CREATE TABLE public.org_memberships (org_id uuid, clerk_user_id text, is_active boolean, role text);
CREATE TABLE public.bookings (id uuid PRIMARY KEY, org_id uuid, status text, notes text, updated_by text, updated_at timestamptz);
CREATE TABLE public.resources (id uuid PRIMARY KEY, org_id uuid, title text, is_active boolean);
CREATE TABLE public.artist_tips (id uuid PRIMARY KEY);
CREATE TABLE public.booking_participants (id uuid PRIMARY KEY);
CREATE TABLE public.organization_donations (id uuid PRIMARY KEY);
CREATE TABLE public.submission_forms (id uuid PRIMARY KEY);
CREATE TABLE public.submissions (id uuid PRIMARY KEY);
GRANT SELECT ON public.org_memberships TO service_role;
GRANT ALL ON public.bookings, public.resources, public.artist_tips, public.booking_participants,
  public.organization_donations, public.submission_forms, public.submissions TO anon, authenticated;
GRANT SELECT(title), UPDATE(title) ON public.resources TO PUBLIC;
INSERT INTO public.resources VALUES ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Historical resource',true);

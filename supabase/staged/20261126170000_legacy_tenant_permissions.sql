-- Review on an isolated copy before placing this file in the deployable migrations.
-- Run as one transaction. A missing legacy relation or inherited grant aborts the cutover.
BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS is_bookable boolean NOT NULL DEFAULT false;

DO $$
DECLARE
  target regclass;
  columns text;
  client_role name;
BEGIN
  FOREACH target IN ARRAY ARRAY[
    'public.artist_tips'::regclass, 'public.booking_participants'::regclass,
    'public.bookings'::regclass, 'public.organization_donations'::regclass,
    'public.resources'::regclass, 'public.submission_forms'::regclass,
    'public.submissions'::regclass
  ] LOOP
    EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', target);
    EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE %s FROM PUBLIC, anon, authenticated', target);
    -- Table-level revocation alone does not clear pre-existing column ACLs.
    SELECT string_agg(quote_ident(attname), ', ' ORDER BY attnum) INTO columns
      FROM pg_attribute WHERE attrelid = target AND attnum > 0 AND NOT attisdropped;
    EXECUTE format('REVOKE ALL PRIVILEGES (%s) ON TABLE %s FROM PUBLIC, anon, authenticated',
                   columns, target);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE %s TO service_role', target);
    FOREACH client_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      IF has_table_privilege(client_role, target, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
         OR has_any_column_privilege(client_role, target, 'SELECT,INSERT,UPDATE,REFERENCES') THEN
        RAISE EXCEPTION 'An inherited privilege on % remains for %', target, client_role;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Only the server may submit the subject returned by Clerk. Repeat the active membership
-- check inside the UPDATE so a change of tenant, role, or membership cannot authorize it.
CREATE OR REPLACE FUNCTION public.legacy_review_booking(
  p_org_id uuid, p_booking_id uuid, p_reviewer text, p_status text, p_notes text
) RETURNS SETOF public.bookings
LANGUAGE sql VOLATILE SECURITY INVOKER SET search_path = ''
AS $$
  UPDATE public.bookings AS b
  SET status = p_status, notes = p_notes, updated_by = p_reviewer, updated_at = now()
  WHERE b.id = p_booking_id AND b.org_id = p_org_id
    AND p_status IN ('pending','confirmed','cancelled','completed','no_show','rejected')
    AND EXISTS (
      SELECT 1 FROM public.org_memberships AS m
      WHERE m.org_id = b.org_id AND m.clerk_user_id = p_reviewer AND m.is_active
        AND m.role::text IN ('org_admin','super_admin','moderator','admin','manager','owner')
    )
  RETURNING b.*;
$$;
REVOKE ALL ON FUNCTION public.legacy_review_booking(uuid,uuid,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.legacy_review_booking(uuid,uuid,text,text,text) TO service_role;
COMMIT;

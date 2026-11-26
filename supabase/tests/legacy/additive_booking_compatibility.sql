-- Run before the seven-table cutover, on the disposable legacy fixture only.
DO $$ BEGIN
  IF current_database() <> 'dcc_legacy_permissions_test' THEN
    RAISE EXCEPTION 'Expected disposable database';
  END IF;
END $$;
-- Model existing server privileges independently of the staged cutover.
GRANT SELECT, UPDATE ON public.bookings TO service_role;
CREATE TEMP TABLE legacy_acl_before AS
SELECT oid, relacl, relrowsecurity FROM pg_class
WHERE oid IN ('public.artist_tips'::regclass,'public.booking_participants'::regclass,
 'public.bookings'::regclass,'public.organization_donations'::regclass,
 'public.resources'::regclass,'public.submission_forms'::regclass,'public.submissions'::regclass);
CREATE TEMP TABLE legacy_column_acl_before AS
SELECT attrelid, attnum, attacl FROM pg_attribute
WHERE attrelid IN (SELECT oid FROM legacy_acl_before) AND attnum > 0 AND NOT attisdropped;
\i supabase/staged/legacy_booking_additive_compatibility.sql
\i supabase/staged/legacy_booking_additive_compatibility.sql
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM legacy_acl_before b JOIN pg_class c USING (oid)
    WHERE b.relacl IS DISTINCT FROM c.relacl OR b.relrowsecurity IS DISTINCT FROM c.relrowsecurity)
    OR EXISTS (SELECT 1 FROM legacy_column_acl_before b JOIN pg_attribute a USING (attrelid,attnum)
    WHERE b.attacl IS DISTINCT FROM a.attacl) THEN
    RAISE EXCEPTION 'Additive candidate changed legacy table or column permissions';
  END IF;
  IF EXISTS (SELECT 1 FROM public.resources WHERE is_bookable IS DISTINCT FROM false) THEN
    RAISE EXCEPTION 'Historical resource enabled';
  END IF;
  IF has_function_privilege('anon','public.legacy_review_booking(uuid,uuid,text,text,text)','EXECUTE')
    OR has_function_privilege('authenticated','public.legacy_review_booking(uuid,uuid,text,text,text)','EXECUTE')
    OR NOT has_function_privilege('service_role','public.legacy_review_booking(uuid,uuid,text,text,text)','EXECUTE') THEN
    RAISE EXCEPTION 'Incorrect RPC execution grants';
  END IF;
END $$;
BEGIN;
INSERT INTO public.org_memberships VALUES
  ('10000000-0000-4000-8000-000000000001','user_owner',true,'owner'),
  ('10000000-0000-4000-8000-000000000001','user_member',true,'member'),
  ('10000000-0000-4000-8000-000000000001','user_inactive',false,'owner'),
  ('10000000-0000-4000-8000-000000000002','user_other',true,'owner');
INSERT INTO public.bookings (id,org_id,status) VALUES
  ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','pending'),
  ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','pending');
SET LOCAL ROLE service_role;
DO $$
DECLARE
  org_a uuid := '10000000-0000-4000-8000-000000000001';
  booking_a uuid := '20000000-0000-4000-8000-000000000001';
  booking_b uuid := '20000000-0000-4000-8000-000000000002';
  actor text;
  updated public.bookings%ROWTYPE;
BEGIN
  FOREACH actor IN ARRAY ARRAY['user_member','user_inactive','user_other','user_unknown'] LOOP
    IF EXISTS (SELECT FROM public.legacy_review_booking(org_a,booking_a,actor,'confirmed',NULL)) THEN
      RAISE EXCEPTION 'Unauthorized review';
    END IF;
  END LOOP;
  IF EXISTS (SELECT FROM public.legacy_review_booking(org_a,booking_b,'user_owner','confirmed',NULL))
     OR EXISTS (SELECT FROM public.legacy_review_booking(org_a,booking_a,'user_owner','invalid',NULL)) THEN
    RAISE EXCEPTION 'Invalid target or state accepted';
  END IF;
  SELECT * INTO STRICT updated FROM public.legacy_review_booking(org_a,booking_a,'user_owner','confirmed','Fixture note');
  IF updated.status <> 'confirmed' OR updated.updated_by <> 'user_owner' OR updated.notes <> 'Fixture note'
     OR (SELECT status FROM public.bookings WHERE id = booking_b) <> 'pending' THEN
    RAISE EXCEPTION 'Owner review or tenant isolation failed';
  END IF;
END $$;
ROLLBACK;

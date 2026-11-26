BEGIN;
DO $$
DECLARE
  target regclass;
  client_role name;
BEGIN
  FOREACH target IN ARRAY ARRAY[
    'public.artist_tips'::regclass, 'public.booking_participants'::regclass, 'public.bookings'::regclass,
    'public.organization_donations'::regclass, 'public.resources'::regclass,
    'public.submission_forms'::regclass, 'public.submissions'::regclass
  ] LOOP
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = target) THEN
      RAISE EXCEPTION 'Missing RLS for %',target;
    END IF;
    FOREACH client_role IN ARRAY ARRAY['anon','authenticated'] LOOP
      IF has_table_privilege(client_role,target,'SELECT,INSERT,UPDATE,DELETE')
         OR has_any_column_privilege(client_role,target,'SELECT,INSERT,UPDATE,REFERENCES') THEN
        RAISE EXCEPTION 'Unexpected client grant for % on %',client_role,target;
      END IF;
      IF has_function_privilege(client_role,'public.legacy_review_booking(uuid,uuid,text,text,text)','EXECUTE') THEN
        RAISE EXCEPTION 'Client can submit an unverified subject to the review function';
      END IF;
    END LOOP;
  END LOOP;
  IF EXISTS (SELECT 1 FROM public.resources WHERE is_bookable IS DISTINCT FROM false) THEN
    RAISE EXCEPTION 'Cutover published a historical resource';
  END IF;
END $$;

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

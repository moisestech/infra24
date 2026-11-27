-- Group booking regression only on the disposable CI database.
DO $$ BEGIN
 IF current_database() <> 'dcc_legacy_permissions_test' THEN
 RAISE EXCEPTION 'Refusing to run group booking fixture outside disposable CI'; END IF;
END $$;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS start_time timestamptz;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS capacity integer;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS current_participants integer DEFAULT 0;
-- Post-migration grants and roles are checked before exercising the functions.
INSERT INTO public.bookings(id,org_id,status,start_time,capacity,current_participants)
 VALUES('40000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','confirmed',now()+interval '1 day',1,0),
 ('40000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','confirmed',now()+interval '1 day',1,0),
 ('40000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001','confirmed',now()+interval '1 day',1,0);
UPDATE public.bookings SET is_group_booking=true,group_booking_type='public',waitlist_enabled=false,available_spots=1
 WHERE id='40000000-0000-4000-8000-000000000001';
UPDATE public.bookings SET is_group_booking=true,group_booking_type='public',waitlist_enabled=true,available_spots=1
 WHERE id='40000000-0000-4000-8000-000000000002';
UPDATE public.bookings SET is_group_booking=true,group_booking_type='private',waitlist_enabled=false,available_spots=1
 WHERE id='40000000-0000-4000-8000-000000000003';
DO $$
DECLARE f regprocedure; r name; t regclass;
BEGIN
 FOREACH f IN ARRAY ARRAY[
 'public.get_group_booking_available_spots(uuid)'::regprocedure,
 'public.add_group_booking_participant(uuid,text,text,text,text,text)'::regprocedure,
 'public.remove_group_booking_participant(uuid,text)'::regprocedure,
 'public.promote_waitlist_participant(uuid,uuid)'::regprocedure
 ] LOOP
   FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
    IF has_function_privilege(r,f,'EXECUTE') THEN RAISE EXCEPTION 'Unsafe public RPC % role %',f,r; END IF;
   END LOOP;
   IF NOT has_function_privilege('service_role',f,'EXECUTE') THEN
    RAISE EXCEPTION 'Server role cannot execute %',f; END IF;
 END LOOP;
 FOREACH t IN ARRAY ARRAY['public.group_booking_participants'::regclass,
 'public.booking_waitlist'::regclass,'public.group_booking_invitations'::regclass] LOOP
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid=t) THEN RAISE EXCEPTION 'RLS absent on %',t; END IF;
  FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
   IF has_table_privilege(r,t,'SELECT,INSERT,UPDATE,DELETE') THEN
     RAISE EXCEPTION 'Client table privilege remains on %',t; END IF;
  END LOOP;
 END LOOP;
END $$;

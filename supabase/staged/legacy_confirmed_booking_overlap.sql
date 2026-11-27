-- STAGED ONLY. Never apply until legacy booking semantics, historical overlaps,
-- extension permissions, backup and rollback have been separately approved.
BEGIN;
SET LOCAL lock_timeout='5s';
CREATE EXTENSION IF NOT EXISTS btree_gist;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM public.bookings WHERE status='confirmed' AND (org_id IS NULL OR resource_id IS NULL OR start_time IS NULL OR end_time IS NULL OR end_time<=start_time)) THEN RAISE EXCEPTION 'Invalid historical confirmed intervals'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='public.bookings'::regclass AND conname='legacy_confirmed_resource_no_overlap') THEN
  ALTER TABLE public.bookings ADD CONSTRAINT legacy_confirmed_resource_no_overlap EXCLUDE USING gist
   (org_id WITH =,resource_id WITH =,tstzrange(start_time,end_time,'[)') WITH &&) WHERE (status='confirmed');
 END IF;
END $$;
COMMIT;

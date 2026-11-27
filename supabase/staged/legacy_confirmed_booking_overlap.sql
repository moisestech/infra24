-- STAGED ONLY. Never apply until legacy booking semantics, historical overlaps,
-- extension permissions, backup and rollback have been separately approved.
BEGIN;
SET LOCAL lock_timeout='5s';
CREATE EXTENSION IF NOT EXISTS btree_gist;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM public.bookings WHERE status='confirmed' AND (org_id IS NULL OR resource_id IS NULL OR start_time IS NULL OR end_time IS NULL OR end_time<=start_time)) THEN RAISE EXCEPTION 'Invalid historical confirmed intervals'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='public.bookings'::regclass AND conname='legacy_confirmed_interval_valid') THEN
  ALTER TABLE public.bookings ADD CONSTRAINT legacy_confirmed_interval_valid CHECK (status IS DISTINCT FROM 'confirmed' OR (org_id IS NOT NULL AND resource_id IS NOT NULL AND start_time IS NOT NULL AND end_time IS NOT NULL AND end_time>start_time));
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='public.bookings'::regclass AND conname='legacy_confirmed_resource_no_overlap') THEN
  ALTER TABLE public.bookings ADD CONSTRAINT legacy_confirmed_resource_no_overlap EXCLUDE USING gist
   (org_id WITH =,resource_id WITH =,tstzrange(start_time,end_time,'[)') WITH &&) WHERE (status='confirmed');
 END IF;
END $$;
-- Serialize same tenant/resource before index insertion to avoid exclusion-index deadlocks.
CREATE OR REPLACE FUNCTION public.legacy_serialize_confirmed_booking() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $
BEGIN
 IF NEW.status='confirmed' THEN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(NEW.org_id::text || ':' || NEW.resource_id,0));
 END IF;
 RETURN NEW;
END $;
REVOKE ALL ON FUNCTION public.legacy_serialize_confirmed_booking() FROM PUBLIC;
DROP TRIGGER IF EXISTS legacy_serialize_confirmed_booking ON public.bookings;
CREATE TRIGGER legacy_serialize_confirmed_booking BEFORE INSERT OR UPDATE OF org_id,resource_id,status,start_time,end_time ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.legacy_serialize_confirmed_booking();
COMMIT;

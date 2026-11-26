-- Standalone staged compatibility candidate; not authorized for hosted application.
-- Does not revoke legacy table privileges or enable booking for existing resources.
BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS is_bookable boolean NOT NULL DEFAULT false;
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

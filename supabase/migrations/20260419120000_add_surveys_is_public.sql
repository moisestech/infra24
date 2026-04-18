-- Portal listing: explicit flag for anonymous org home + /surveys/public
ALTER TABLE surveys
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN surveys.is_public IS 'When true, survey may appear on org portal for anonymous visitors (subject to status and schedule in app layer).';

-- Backfill: preserve prior public-portal behavior for active, non-auth surveys that already allowed the public role
UPDATE surveys
SET is_public = true
WHERE status = 'active'
  AND requires_authentication = false
  AND allowed_roles IS NOT NULL
  AND allowed_roles @> ARRAY['public']::text[];

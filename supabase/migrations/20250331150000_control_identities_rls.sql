-- Lock down control_identities for anon/authenticated PostgREST keys.
-- Application uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). Stray client keys get no access.

ALTER TABLE control_identities ENABLE ROW LEVEL SECURITY;

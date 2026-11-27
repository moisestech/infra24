-- DESIGN ONLY: disposable PostgreSQL rehearsal; not a migration.
-- No hosted execution, exposed schema, network, real CRM data or role provisioning.
BEGIN;
CREATE SCHEMA dcc_archive_private;
REVOKE ALL ON SCHEMA dcc_archive_private FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE dcc_archive_private.source_rows (
  source_base text NOT NULL CHECK (source_base ~ '^app[A-Za-z0-9]{14}$'),
  source_table text NOT NULL CHECK (source_table ~ '^tbl[A-Za-z0-9]{14}$'),
  source_record text NOT NULL CHECK (source_record ~ '^rec[A-Za-z0-9]{14}$'),
  envelope_text text NOT NULL,
  row_sha256 text NOT NULL CHECK (row_sha256 ~ '^[0-9a-f]{64}$'),
  imported_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source_base, source_table, source_record),
  CHECK (jsonb_typeof(envelope_text::jsonb) = 'object'),
  CHECK ((envelope_text::jsonb ->> 'base') IS NOT DISTINCT FROM source_base),
  CHECK ((envelope_text::jsonb ->> 'table') IS NOT DISTINCT FROM source_table),
  CHECK ((envelope_text::jsonb ->> 'record') IS NOT DISTINCT FROM source_record),
  CHECK (encode(sha256(convert_to(envelope_text, 'UTF8')), 'hex') = row_sha256)
);

CREATE TABLE dcc_archive_private.import_batches (
  batch_id uuid PRIMARY KEY,
  manifest_version integer NOT NULL CHECK (manifest_version = 1),
  row_count integer NOT NULL CHECK (row_count > 0),
  manifest_text text NOT NULL,
  manifest_sha256 text NOT NULL CHECK (manifest_sha256 ~ '^[0-9a-f]{64}$'),
  imported_at timestamptz NOT NULL DEFAULT now(),
  CHECK (jsonb_typeof(manifest_text::jsonb) = 'array'),
  CHECK (jsonb_array_length(manifest_text::jsonb) = row_count),
  CHECK (encode(sha256(convert_to(manifest_text, 'UTF8')), 'hex') = manifest_sha256)
);

CREATE TABLE dcc_archive_private.batch_rows (
  batch_id uuid NOT NULL REFERENCES dcc_archive_private.import_batches(batch_id),
  source_base text NOT NULL,
  source_table text NOT NULL,
  source_record text NOT NULL,
  PRIMARY KEY (batch_id, source_base, source_table, source_record),
  FOREIGN KEY (source_base, source_table, source_record)
    REFERENCES dcc_archive_private.source_rows(source_base, source_table, source_record)
);

ALTER TABLE dcc_archive_private.source_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE dcc_archive_private.import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE dcc_archive_private.batch_rows ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA dcc_archive_private FROM PUBLIC, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dcc_archive_private REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dcc_archive_private REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated, service_role;

-- Fail closed until a separate reviewed migration defines dedicated scoped roles.
-- Batch membership/count/hash verification and atomic importer are Phase 2 gates.
-- No SECURITY DEFINER functions, views, grants or Data API exposure.
DO $$
DECLARE r text; t text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon','authenticated','service_role'] LOOP
    IF has_schema_privilege(r, 'dcc_archive_private', 'USAGE') THEN
      RAISE EXCEPTION 'unexpected archive schema privilege';
    END IF;
    FOREACH t IN ARRAY ARRAY['source_rows','import_batches','batch_rows'] LOOP
      IF has_table_privilege(r, 'dcc_archive_private.' || t, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') THEN
        RAISE EXCEPTION 'unexpected archive table privilege';
      END IF;
    END LOOP;
  END LOOP;
END $$;
COMMIT;

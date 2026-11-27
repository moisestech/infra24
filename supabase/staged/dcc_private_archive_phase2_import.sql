-- STAGED ONLY. Run after dcc_private_archive_phase1.sql on a disposable DB.
-- Owner-only, SECURITY INVOKER. No runtime role grants or API exposure.
BEGIN;

CREATE FUNCTION dcc_archive_private.verify_batch(p_batch uuid)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER
SET search_path = pg_catalog
AS $$
DECLARE
  saved dcc_archive_private.import_batches%ROWTYPE;
  actual jsonb;
  actual_count bigint;
BEGIN
  SELECT * INTO STRICT saved FROM dcc_archive_private.import_batches WHERE batch_id = p_batch;
  SELECT count(*), jsonb_agg(jsonb_build_array(s.source_base,s.source_table,s.source_record,s.row_sha256)
    ORDER BY s.source_base COLLATE "C",s.source_table COLLATE "C",s.source_record COLLATE "C")
    INTO actual_count, actual
    FROM dcc_archive_private.batch_rows b JOIN dcc_archive_private.source_rows s
    USING (source_base,source_table,source_record)
    WHERE b.batch_id = p_batch;
  IF actual_count <> saved.row_count OR actual IS DISTINCT FROM saved.manifest_text::jsonb
     OR encode(sha256(convert_to(saved.manifest_text,'UTF8')),'hex') <> saved.manifest_sha256 THEN
    RAISE EXCEPTION 'archive batch integrity failure' USING ERRCODE='22023';
  END IF;
END $$;

CREATE FUNCTION dcc_archive_private.import_batch(
  p_batch uuid, p_manifest text, p_expected_sha text, p_envelopes text[])
RETURNS integer LANGUAGE plpgsql SECURITY INVOKER
SET search_path = pg_catalog
AS $$
DECLARE
  item text;
  row_json jsonb;
  fields text[] := ARRAY['base','table','record','source_record','batch','captured_at','original_name','raw_json'];
  row_digest text;
  actual jsonb;
  existing dcc_archive_private.import_batches%ROWTYPE;
  inserted_count integer := 0;
BEGIN
  IF p_batch IS NULL OR p_manifest IS NULL OR p_expected_sha IS NULL OR
     p_expected_sha !~ '^[0-9a-f]{64}$' OR p_envelopes IS NULL OR
     array_ndims(p_envelopes) IS DISTINCT FROM 1 OR cardinality(p_envelopes) NOT BETWEEN 1 AND 10000
     OR encode(sha256(convert_to(p_manifest,'UTF8')),'hex') <> p_expected_sha THEN
    RAISE EXCEPTION 'invalid manifest' USING ERRCODE='22023';
  END IF;
  IF jsonb_typeof(p_manifest::jsonb) <> 'array' OR jsonb_array_length(p_manifest::jsonb) <> cardinality(p_envelopes) THEN
    RAISE EXCEPTION 'manifest count mismatch' USING ERRCODE='22023';
  END IF;

  -- Serialize all archive imports, including overlapping batches. No lock escape or
  -- race between the preflight, row insert and manifest membership verification.
  PERFORM pg_advisory_xact_lock(684263091, 1);
  IF (SELECT count(DISTINCT (e::jsonb->>'base', e::jsonb->>'table', e::jsonb->>'record'))
      FROM unnest(p_envelopes) AS input(e)) <> cardinality(p_envelopes) THEN
    RAISE EXCEPTION 'duplicate source record' USING ERRCODE='22023';
  END IF;
  FOREACH item IN ARRAY p_envelopes LOOP
    IF item IS NULL THEN RAISE EXCEPTION 'null envelope' USING ERRCODE='22023'; END IF;
    row_json := item::jsonb;
    IF jsonb_typeof(row_json) <> 'object' OR NOT (row_json ?& fields)
      OR (SELECT count(*) FROM jsonb_object_keys(row_json)) <> cardinality(fields)
      OR EXISTS (SELECT 1 FROM jsonb_each(row_json) e WHERE jsonb_typeof(e.value) <> 'string')
      OR (row_json->>'base') !~ '^app[A-Za-z0-9]{14}$'
      OR (row_json->>'table') !~ '^tbl[A-Za-z0-9]{14}$'
      OR (row_json->>'record') !~ '^rec[A-Za-z0-9]{14}$'
      OR (row_json->>'source_record') !~ '^rec[A-Za-z0-9]{14}$'
      OR btrim(row_json->>'batch') = '' OR btrim(row_json->>'original_name') = ''
      OR (row_json->>'captured_at') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[+-][0-9]{2}:[0-9]{2})$'
      OR json_typeof((row_json->>'raw_json')::json) <> 'object' THEN
      RAISE EXCEPTION 'invalid archive envelope' USING ERRCODE='22023';
    END IF;
    PERFORM (row_json->>'captured_at')::timestamptz;
  END LOOP;
  SELECT jsonb_agg(jsonb_build_array(e::jsonb->>'base',e::jsonb->>'table',e::jsonb->>'record',
       encode(sha256(convert_to(e,'UTF8')),'hex'))
       ORDER BY (e::jsonb->>'base') COLLATE "C",(e::jsonb->>'table') COLLATE "C",(e::jsonb->>'record') COLLATE "C")
    INTO actual FROM unnest(p_envelopes) AS input(e);
  IF actual IS DISTINCT FROM p_manifest::jsonb THEN
    RAISE EXCEPTION 'manifest membership mismatch' USING ERRCODE='22023';
  END IF;
  SELECT * INTO existing FROM dcc_archive_private.import_batches WHERE batch_id = p_batch;
  IF FOUND THEN
    IF existing.manifest_text IS DISTINCT FROM p_manifest OR existing.manifest_sha256 IS DISTINCT FROM p_expected_sha
      OR existing.row_count <> cardinality(p_envelopes) THEN
      RAISE EXCEPTION 'immutable batch conflict' USING ERRCODE='23505';
    END IF;
    PERFORM dcc_archive_private.verify_batch(p_batch);
    RETURN 0;
  END IF;

  INSERT INTO dcc_archive_private.import_batches(batch_id,manifest_version,row_count,manifest_text,manifest_sha256)
    VALUES (p_batch,1,cardinality(p_envelopes),p_manifest,p_expected_sha);
  FOREACH item IN ARRAY p_envelopes LOOP
    row_json := item::jsonb;
    row_digest := encode(sha256(convert_to(item,'UTF8')),'hex');
    INSERT INTO dcc_archive_private.source_rows(source_base,source_table,source_record,envelope_text,row_sha256)
      VALUES (row_json->>'base',row_json->>'table',row_json->>'record',item,row_digest)
      ON CONFLICT (source_base,source_table,source_record) DO NOTHING;
    IF FOUND THEN inserted_count := inserted_count + 1; END IF;
    IF NOT EXISTS (SELECT 1 FROM dcc_archive_private.source_rows s
      WHERE s.source_base=row_json->>'base' AND s.source_table=row_json->>'table'
        AND s.source_record=row_json->>'record' AND s.envelope_text=item AND s.row_sha256=row_digest) THEN
      RAISE EXCEPTION 'immutable source conflict' USING ERRCODE='23505';
    END IF;
    INSERT INTO dcc_archive_private.batch_rows(batch_id,source_base,source_table,source_record)
      VALUES(p_batch,row_json->>'base',row_json->>'table',row_json->>'record');
  END LOOP;
  PERFORM dcc_archive_private.verify_batch(p_batch);
  RETURN inserted_count;
END $$;

CREATE FUNCTION dcc_archive_private.restore_batch(p_batch uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER
SET search_path = pg_catalog
AS $$
DECLARE result jsonb;
BEGIN
  PERFORM dcc_archive_private.verify_batch(p_batch);
  SELECT jsonb_agg(s.envelope_text ORDER BY s.source_base COLLATE "C",s.source_table COLLATE "C",s.source_record COLLATE "C")
    INTO result FROM dcc_archive_private.batch_rows b JOIN dcc_archive_private.source_rows s
    USING(source_base,source_table,source_record) WHERE b.batch_id=p_batch;
  RETURN result;
END $$;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA dcc_archive_private FROM PUBLIC, anon, authenticated, service_role;
COMMIT;

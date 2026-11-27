"""Disposable PostgreSQL acceptance; synthetic only, no configurable destination."""
import concurrent.futures
import hashlib
import json
import os
import re
from pathlib import Path
import runpy
import subprocess
import unittest
import uuid

ROOT = Path(__file__).resolve().parents[2]
phase1 = runpy.run_path(str(ROOT / "scripts/dcc/private-archive-rehearsal.py"))
canonical, fixture = phase1["canonical"], phase1["fixture"]
DB = "dcc_archive_test"
RESTORE = "dcc_archive_restore"
ENV = {"PATH": os.environ["PATH"], "PGPASSWORD": "archive-test-only",
       "PGCONNECT_TIMEOUT": "5", "PGCLIENTENCODING": "UTF8", "LC_ALL": "C.UTF-8"}


def cmd(program, database=DB):
    if database not in (DB, RESTORE):
        raise ValueError("disposable databases only")
    container = os.environ.get("DCC_ARCHIVE_TEST_CONTAINER")
    if container:
        if not re.fullmatch(r"[a-f0-9]{12,64}", container):
            raise ValueError("invalid disposable container id")
        return ["docker", "exec", "-i", "-e", "PGPASSWORD=archive-test-only", container, program,
                "-h", "127.0.0.1", "-p", "5432", "-U", "postgres", "-d", database]
    return [program, "-h", "127.0.0.1", "-p", "55432", "-U", "postgres", "-d", database]


def execute(sql, database=DB, error=None):
    out = subprocess.run(cmd("psql", database) + ["-X", "-qAt", "-v", "ON_ERROR_STOP=1", "-v", "VERBOSITY=verbose"],
                         input=sql, text=True, capture_output=True, env=ENV, timeout=30)
    if error:
        if out.returncode == 0 or error not in out.stderr:
            raise AssertionError(f"expected SQLSTATE {error}: {out.stderr}")
    elif out.returncode:
        raise AssertionError(out.stderr)
    return out.stdout.strip()


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def envelope(row):
    return canonical(row).decode("ascii")


def manifest_text(rows):
    entries = [[r["base"], r["table"], r["record"], hashlib.sha256(canonical(r)).hexdigest()] for r in rows]
    return canonical(sorted(entries)).decode("ascii")


def import_sql(batch, rows, manifest=None, sha=None):
    m = manifest if manifest is not None else manifest_text(rows)
    h = sha if sha is not None else hashlib.sha256(m.encode("ascii")).hexdigest()
    arr = "ARRAY[" + ",".join(lit(envelope(r)) for r in rows) + "]::text[]"
    return f"SELECT dcc_archive_private.import_batch({lit(batch)}::uuid,{lit(m)},{lit(h)},{arr});"


def restore(batch, database=DB):
    return json.loads(execute(f"SELECT dcc_archive_private.restore_batch({lit(batch)}::uuid);", database))


def batch():
    return str(uuid.uuid4())


class PostgresAcceptance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if execute("SELECT current_database();") != DB:
            raise AssertionError("not disposable database")
        execute("CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS; CREATE ROLE archive_untrusted NOLOGIN;")
        for name in ("dcc_private_archive_phase1.sql", "dcc_private_archive_phase2_import.sql"):
            execute((ROOT / "supabase/staged" / name).read_text())

    def test_305_roundtrip_and_replay(self):
        rows = [fixture(i) for i in range(305)]
        b = batch()
        self.assertEqual(execute(import_sql(b, rows)), "305")
        self.assertEqual(execute(import_sql(b, rows[::-1])), "0")
        self.assertEqual(restore(b), [envelope(r) for r in rows])
        self.assertEqual(execute(f"SELECT count(*) FROM dcc_archive_private.batch_rows WHERE batch_id={lit(b)}::uuid;"), "305")

    def test_bad_manifest_and_duplicate(self):
        rows = [fixture(310), fixture(311)]
        execute(import_sql(batch(), rows, sha="0"*64), error="22023")
        execute(import_sql(batch(), rows, manifest=manifest_text([fixture(310), fixture(312)])), error="22023")
        execute(import_sql(batch(), [rows[0], rows[0]]), error="22023")

    def test_malformed_payload(self):
        row = fixture(320)
        execute(import_sql(batch(), [dict(row, raw_json="[]")]), error="22023")
        execute(import_sql(batch(), [dict(row, raw_json="{")]), error="22P02")
        execute(import_sql(batch(), [dict(row, captured_at="2026-01-01")]), error="22023")

    def test_conflict_rollback(self):
        r = fixture(330)
        b = batch()
        execute(import_sql(b, [r]))
        execute(import_sql(b, [fixture(331)]), error="23505")
        conflict = batch()
        execute(import_sql(conflict, [fixture(332), dict(r, raw_json="{}")]), error="23505")
        self.assertEqual(execute(f"SELECT count(*) FROM dcc_archive_private.import_batches WHERE batch_id={lit(conflict)}::uuid;"), "0")
        self.assertEqual(execute(f"SELECT count(*) FROM dcc_archive_private.source_rows WHERE source_record={lit(fixture(332)['record'])};"), "0")

    def test_concurrent_same_batch(self):
        rows = [fixture(i) for i in range(340,350)]
        b = batch()
        sql = import_sql(b, rows)
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(execute, [sql, sql]))
        self.assertEqual(sorted(map(int, results)), [0,10])
        self.assertEqual(restore(b), [envelope(r) for r in rows])

    def test_concurrent_conflicting_batches(self):
        row = fixture(360)
        one, two = batch(), batch()
        sqls = [import_sql(one,[row]), import_sql(two,[dict(row,raw_json="{}")])]
        def attempt(sql):
            try:
                return execute(sql)
            except AssertionError as e:
                if "23505" not in str(e):
                    raise
                return "conflict"
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(attempt,sqls))
        self.assertEqual(sorted(results), ["1","conflict"])
        self.assertEqual(execute(f"SELECT count(*) FROM dcc_archive_private.import_batches WHERE batch_id IN ({lit(one)}::uuid,{lit(two)}::uuid);"), "1")

    def test_permission_denial(self):
        for role in ("anon","authenticated","service_role","archive_untrusted"):
            for table in ("source_rows","import_batches","batch_rows"):
                for sql in (f"SELECT * FROM dcc_archive_private.{table};",
                            f"INSERT INTO dcc_archive_private.{table} DEFAULT VALUES;",
                            f"UPDATE dcc_archive_private.{table} SET {('source_base' if table=='source_rows' else 'batch_id')}=DEFAULT;",
                            f"DELETE FROM dcc_archive_private.{table};"):
                    execute(f"SET ROLE {role}; {sql}", error="42501")
            for sql in (import_sql(batch(),[fixture(370)]),
                        f"SELECT dcc_archive_private.restore_batch({lit(batch())}::uuid);",
                        f"SELECT dcc_archive_private.verify_batch({lit(batch())}::uuid);"):
                execute(f"SET ROLE {role}; {sql}", error="42501")
        self.assertEqual(execute("SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='dcc_archive_private' AND c.relkind='r' AND c.relrowsecurity;"), "3")

    def test_tamper_detection(self):
        r = fixture(380)
        b = batch()
        execute(import_sql(b,[r]))
        execute(f"UPDATE dcc_archive_private.source_rows SET row_sha256={'chr(48)'+' || repeat(chr(48),63)'} WHERE source_record={lit(r['record'])};",error="23514")
        execute(f"BEGIN; DELETE FROM dcc_archive_private.batch_rows WHERE batch_id={lit(b)}::uuid; SELECT dcc_archive_private.restore_batch({lit(b)}::uuid); COMMIT;",error="22023")
        self.assertEqual(restore(b),[envelope(r)])

    def test_z_dump_restore(self):
        rows = [fixture(390),fixture(391)]
        b = batch()
        execute(import_sql(b,rows))
        execute("CREATE DATABASE dcc_archive_restore;")
        dump = subprocess.run(cmd("pg_dump") + ["--schema=dcc_archive_private","--no-owner"], env=ENV, capture_output=True, check=True, timeout=30)
        subprocess.run(cmd("psql",RESTORE)+["-X","-q","-v","ON_ERROR_STOP=1"], input=dump.stdout,env=ENV,capture_output=True,check=True,timeout=30)
        self.assertEqual(restore(b,RESTORE),[envelope(r) for r in rows])
        batches = execute("SELECT batch_id FROM dcc_archive_private.import_batches ORDER BY batch_id;").splitlines()
        self.assertEqual(execute("SELECT batch_id FROM dcc_archive_private.import_batches ORDER BY batch_id;",RESTORE).splitlines(), batches)
        for batch_id in batches:
            self.assertEqual(restore(batch_id,RESTORE), restore(batch_id))
        for table, order in (("source_rows","source_base,source_table,source_record"),
                             ("import_batches","batch_id"), ("batch_rows","batch_id,source_base,source_table,source_record")):
            query = f"SELECT jsonb_agg(to_jsonb(t) ORDER BY {order}) FROM dcc_archive_private.{table} t;"
            self.assertEqual(json.loads(execute(query,RESTORE)),json.loads(execute(query)))
        for role in ("anon","authenticated","service_role","archive_untrusted"):
            execute(f"SET ROLE {role}; SELECT * FROM dcc_archive_private.source_rows;",RESTORE,error="42501")
            execute(f"SET ROLE {role}; SELECT dcc_archive_private.restore_batch({lit(b)}::uuid);",RESTORE,error="42501")


if __name__ == "__main__":
    unittest.main(verbosity=2)

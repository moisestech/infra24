"""Offline synthetic archive rehearsal. No network, credentials, or live import."""
import hashlib
import json
import re
import sqlite3
import unittest
from datetime import datetime

FIELDS = {"base", "table", "record", "source_record", "batch", "captured_at", "original_name", "raw_json"}
ID = re.compile(r"(?:app|tbl|rec)[A-Za-z0-9]{14}\Z")


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False).encode("ascii")


def digest(value):
    return hashlib.sha256(canonical(value)).hexdigest()


def reject_constant(_):
    raise ValueError("non-finite JSON number")


def validate(row):
    if not isinstance(row, dict) or set(row) != FIELDS or any(not isinstance(v, str) for v in row.values()):
        raise ValueError("invalid envelope")
    for key, prefix in (("base", "app"), ("table", "tbl"), ("record", "rec"), ("source_record", "rec")):
        if not ID.fullmatch(row[key]) or not row[key].startswith(prefix):
            raise ValueError("invalid source identifier")
    if not row["batch"].strip() or not row["original_name"].strip():
        raise ValueError("missing metadata")
    if datetime.fromisoformat(row["captured_at"].replace("Z", "+00:00")).utcoffset() is None:
        raise ValueError("timestamp needs timezone")
    payload = json.loads(row["raw_json"], parse_constant=reject_constant)
    if not isinstance(payload, dict):
        raise ValueError("payload must be object")
    return (row["base"], row["table"], row["record"])


def manifest(rows):
    indexed = {}
    for row in rows:
        key = validate(row)
        if key in indexed:
            raise ValueError("duplicate source record")
        indexed[key] = digest(row)
    if not indexed:
        raise ValueError("empty batch")
    entries = [[*key, indexed[key]] for key in sorted(indexed)]
    return {"version": 1, "count": len(entries), "sha256": digest(entries)}


def init_db():
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE archive (base TEXT, tab TEXT, record TEXT, envelope TEXT NOT NULL, hash TEXT NOT NULL, PRIMARY KEY(base,tab,record))")
    return db


def import_batch(db, rows, expected):
    if manifest(rows) != expected:
        raise ValueError("manifest mismatch")
    with db:
        for row in rows:
            key = validate(row)
            encoded = canonical(row).decode("ascii")
            old = db.execute("SELECT envelope,hash FROM archive WHERE base=? AND tab=? AND record=?", key).fetchone()
            if old is not None and old != (encoded, digest(row)):
                raise ValueError("immutable source conflict")
            if old is None:
                db.execute("INSERT INTO archive VALUES (?,?,?,?,?)", (*key, encoded, digest(row)))


def restore(db, keys, expected):
    rows = []
    for key in keys:
        item = db.execute("SELECT envelope,hash FROM archive WHERE base=? AND tab=? AND record=?", key).fetchone()
        if item is None:
            raise ValueError("missing record")
        row = json.loads(item[0])
        if validate(row) != key or digest(row) != item[1]:
            raise ValueError("integrity failure")
        rows.append(row)
    if manifest(rows) != expected:
        raise ValueError("restore manifest mismatch")
    return rows


def fixture(i):
    return {"base": "app" + "A" * 14, "table": "tbl" + "B" * 14, "record": "rec" + f"{i:014d}", "source_record": "rec" + f"{i+1000:014d}", "batch": "synthetic-v1", "captured_at": "2026-01-01T00:00:00Z", "original_name": "Synthetic", "raw_json": '{ "fldExample": ["rec00000000000001", "café"], "n": null }'}


class ArchiveTests(unittest.TestCase):
    def setUp(self):
        self.db = init_db()
        self.rows = [fixture(i) for i in range(305)]
        self.expected = manifest(self.rows)

    def test_round_trip_and_replay(self):
        import_batch(self.db, self.rows, self.expected)
        import_batch(self.db, self.rows[::-1], self.expected)
        self.assertEqual(self.db.execute("SELECT count(*) FROM archive").fetchone()[0], 305)
        self.assertEqual(restore(self.db, list(map(validate, self.rows)), self.expected), self.rows)

    def test_duplicate(self):
        with self.assertRaises(ValueError):
            manifest([self.rows[0], self.rows[0]])

    def test_malformed(self):
        for raw in ("{", "[]", '{"n":NaN}'):
            with self.assertRaises(ValueError):
                manifest([dict(self.rows[0], raw_json=raw)])

    def test_bad_metadata(self):
        for patch in ({"record": "wrong"}, {"captured_at": "2026-01-01"}, {"batch": ""}):
            with self.assertRaises(ValueError):
                manifest([dict(self.rows[0], **patch)])

    def test_manifest_mismatch(self):
        with self.assertRaises(ValueError):
            import_batch(self.db, self.rows[:-1], self.expected)
        self.assertEqual(self.db.execute("SELECT count(*) FROM archive").fetchone()[0], 0)

    def test_conflict_rolls_back(self):
        import_batch(self.db, self.rows, self.expected)
        changed = [fixture(999), dict(self.rows[0], raw_json="{}")]
        with self.assertRaises(ValueError):
            import_batch(self.db, changed, manifest(changed))
        self.assertEqual(self.db.execute("SELECT count(*) FROM archive").fetchone()[0], 305)

    def test_tamper_and_missing(self):
        import_batch(self.db, self.rows, self.expected)
        self.db.execute("UPDATE archive SET hash='wrong' WHERE record=?", (self.rows[0]["record"],))
        with self.assertRaises(ValueError):
            restore(self.db, list(map(validate, self.rows)), self.expected)
        with self.assertRaises(ValueError):
            restore(self.db, [validate(fixture(999))], self.expected)


if __name__ == "__main__":
    unittest.main(verbosity=2)

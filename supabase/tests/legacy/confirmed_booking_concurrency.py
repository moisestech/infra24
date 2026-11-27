"""Run ONLY against disposable Postgres; concurrent confirmed intervals must not both commit."""
import os, threading, concurrent.futures
import psycopg
assert os.environ.get("PGDATABASE")=="dcc_booking_integrity_test"
dsn="host=127.0.0.1 port=5432 dbname=dcc_booking_integrity_test user=postgres password=local-ci-only"
barrier=threading.Barrier(2)
def attempt(i):
 with psycopg.connect(dsn) as conn:
  barrier.wait(timeout=10)
  try:
   conn.execute("INSERT INTO bookings(org_id,resource_id,status,start_time,end_time) VALUES ('11111111-1111-4111-8111-111111111111','r','confirmed','2099-01-01 10:00Z','2099-01-01 11:00Z')")
   conn.commit()
   return "created"
  except psycopg.errors.ExclusionViolation:
   conn.rollback()
   return "conflict"
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 assert sorted(pool.map(attempt,[1,2]))==["conflict","created"]
with psycopg.connect(dsn) as conn:
 assert conn.execute("SELECT count(*) FROM bookings").fetchone()[0]==1
 conn.execute("INSERT INTO bookings(org_id,resource_id,status,start_time,end_time) VALUES ('22222222-2222-4222-8222-222222222222','r','confirmed','2099-01-01 10:00Z','2099-01-01 11:00Z'),('11111111-1111-4111-8111-111111111111','r','confirmed','2099-01-01 11:00Z','2099-01-01 12:00Z')")
print("Atomic overlap exclusion, tenant isolation, adjacent intervals passed")

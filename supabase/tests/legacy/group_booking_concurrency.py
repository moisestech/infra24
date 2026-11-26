"""Disposable Postgres concurrency and authorization tests for staged group RPCs."""
import concurrent.futures
import os
import threading
import time
import psycopg

assert os.environ.get("PGDATABASE") == "dcc_legacy_permissions_test"
DSN = "host=127.0.0.1 port=5432 dbname=dcc_legacy_permissions_test user=postgres password=local-ci-only"
A = "40000000-0000-4000-8000-000000000001"
B = "40000000-0000-4000-8000-000000000002"
C = "40000000-0000-4000-8000-000000000003"

def call(conn, booking, user):
    with conn.cursor() as cur:
        cur.execute("SET LOCAL ROLE service_role")
        cur.execute("SELECT public.add_group_booking_participant(%s,%s,%s,%s)", (booking, user, "Test", user+"@example.test"))
        result = cur.fetchone()[0]
        time.sleep(0.15)
    conn.commit()
    return result

def race(booking, waitlisted):
    barrier = threading.Barrier(2)
    def register(index):
        with psycopg.connect(DSN) as conn:
            barrier.wait(timeout=8)
            return call(conn, booking, "race-"+booking[-1]+"-"+str(index))
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        futures = [pool.submit(register, i) for i in range(2)]
        results = [f.result(timeout=15) for f in futures]
    statuses = sorted(r.get("status", "denied") for r in results)
    expected = ["registered", "waitlisted"] if waitlisted else ["denied", "registered"]
    assert statuses == expected, (booking, results)
    with psycopg.connect(DSN) as conn:
        count = conn.execute("SELECT count(*) FROM public.group_booking_participants WHERE booking_id=%s AND status IN ('registered','confirmed')", (booking,)).fetchone()[0]
        assert count == 1, (booking, count)
        assert conn.execute("SELECT current_participants,available_spots FROM public.bookings WHERE id=%s", (booking,)).fetchone() == (1,0)
    return results

race(A, False)
results = race(B, True)
with psycopg.connect(DSN) as conn:
    restricted = call(conn, C, "not-invited")
    assert restricted["success"] is False, restricted
    waitlisted = next(r for r in results if r.get("status") == "waitlisted")
    waitlist_user = conn.execute("SELECT user_id FROM public.booking_waitlist WHERE booking_id=%s", (B,)).fetchone()[0]
    duplicate = call(conn, B, waitlist_user)
    assert duplicate["status"] == "waitlisted" and duplicate["position"] == waitlisted["position"]
    before = conn.execute("SELECT count(*) FROM public.booking_waitlist WHERE booking_id=%s", (B,)).fetchone()[0]
    assert before == 1
    conn.execute("UPDATE public.booking_waitlist SET expires_at=now()-interval '1 minute' WHERE booking_id=%s", (B,))
    conn.commit()
    with conn.cursor() as cur:
        cur.execute("SET LOCAL ROLE service_role")
        wait_id = cur.execute("SELECT id FROM public.booking_waitlist WHERE booking_id=%s", (B,)).fetchone()[0]
        old = cur.execute("SELECT public.promote_waitlist_participant(%s,%s)", (B,wait_id)).fetchone()[0]
        assert old["success"] is False, old
    conn.commit()
print("Group booking concurrency, private booking rejection, retry idempotence, expired waitlist and ACLs passed")

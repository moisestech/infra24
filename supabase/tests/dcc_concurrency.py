"""Real concurrent transactions against the disposable Passport CI database."""
import os
import time
import unittest
import uuid
from concurrent.futures import ThreadPoolExecutor

import psycopg

DISCLOSURE = 'dcc-public-profile-request-v1-2026-11-22'
SAVE = """select public.dcc_save_owner_passport(%s, %s, 'Test artist',
    'Synthetic test biography', '["making"]', '[]', '[]')"""
REQUEST = 'select public.dcc_request_owner_publication(%s, %s, %s)'
WITHDRAW = 'select public.dcc_withdraw_member_publication(%s)'


class ConcurrentConsent(unittest.TestCase):
    def setUp(self):
        if os.environ.get('PGDATABASE') != 'dcc_test' or os.environ.get('PGHOST') not in ('localhost', '127.0.0.1'):
            self.fail('Use the disposable local dcc_test database.')
        self.db = psycopg.connect('', autocommit=True)
        self.addCleanup(self.db.close)
        self.binding = uuid.uuid4()
        self.db.execute("""insert into public.dcc_platform_member_bindings
            (id,clerk_instance,clerk_user_id,state,verified_at,activated_at,airtable_person_id)
            values (%s,'isolated-ci',%s,'active',now(),now(),%s)""",
            (self.binding, 'user_' + self.binding.hex, 'rec' + self.binding.hex[:14]))
        self.addCleanup(self.remove_fixture)
        self.assertEqual(self.db.execute(SAVE, (self.binding, 0)).fetchone()[0], 1)

    def remove_fixture(self):
        for table in ('dcc_member_publication_audit', 'dcc_member_publication_grants', 'dcc_member_profile_drafts'):
            self.db.execute(psycopg.sql.SQL('delete from public.{} where binding_id=%s')
                            .format(psycopg.sql.Identifier(table)), (self.binding,))
        self.db.execute('delete from public.dcc_platform_member_bindings where id=%s', (self.binding,))

    def contend(self, first, second):
        """Release the winner only after PostgreSQL reports the loser is waiting on it."""
        with psycopg.connect('') as winner, psycopg.connect('', autocommit=True) as loser:
            loser.execute("set statement_timeout='10s'")
            result = winner.execute(*first).fetchone()[0]
            with ThreadPoolExecutor(max_workers=1) as pool:
                waiting = pool.submit(lambda: loser.execute(*second).fetchone()[0])
                try:
                    deadline = time.monotonic() + 5
                    while not self.db.execute('select %s=any(pg_blocking_pids(%s))',
                            (winner.info.backend_pid, loser.info.backend_pid)).fetchone()[0]:
                        if waiting.done() or time.monotonic() >= deadline:
                            self.fail('Did not observe the two backends contending on the binding')
                        time.sleep(.01)
                finally:
                    winner.commit()
                return result, waiting.result(timeout=10)

    def test_withdraw_before_request(self):
        self.assertEqual(self.contend((WITHDRAW, (self.binding,)),
            (REQUEST, (self.binding, 1, DISCLOSURE))), ('withdrawn', None))
        self.assert_withdrawn()

    def test_request_before_withdraw(self):
        self.assertEqual(self.contend((REQUEST, (self.binding, 1, DISCLOSURE)),
            (WITHDRAW, (self.binding,))), (2, 'withdrawn'))
        self.assert_withdrawn()

    def test_simultaneous_saves(self):
        self.assertEqual(self.contend((SAVE, (self.binding, 1)), (SAVE, (self.binding, 1))), (2, None))

    def test_withdraw_invalidates_inflight_steward(self):
        self.db.execute(REQUEST, (self.binding, 1, DISCLOSURE))
        claim = self.db.execute('select public.dcc_claim_steward_publication(%s,2,%s,%s)',
            (self.binding, 'test-' + self.binding.hex, 'user_test_steward')).fetchone()[0]
        with self.assertRaises(psycopg.errors.CheckViolation):
            self.contend((WITHDRAW, (self.binding,)),
                ('select public.dcc_finalize_steward_publication(%s,%s,true)', (self.binding, claim)))
        self.assert_withdrawn()

    def assert_withdrawn(self):
        self.assertEqual(self.db.execute("""select g.state, g.approved_at, d.public_request_state
            from public.dcc_member_publication_grants g join public.dcc_member_profile_drafts d
            using(binding_id) where binding_id=%s""", (self.binding,)).fetchone(),
            ('withdrawn', None, 'withdrawal_requested'))


if __name__ == '__main__':
    unittest.main(verbosity=2)

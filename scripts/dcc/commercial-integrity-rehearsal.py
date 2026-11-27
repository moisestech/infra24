"""Synthetic single-job cash reconciliation. Not accounting or live payment processing."""
import unittest

KINDS = {"customer_receipt", "customer_refund", "operator_payout", "material_payment", "payment_fee"}


def reconcile(job_id, events):
    """Only settled, single-job USD accounting movements; amounts in integer cents."""
    if not isinstance(job_id, str) or not job_id.strip():
        raise ValueError("job required")
    seen = {}
    totals = dict.fromkeys(KINDS, 0)
    for e in events:
        if set(e) != {"job_id", "system", "event_id", "kind", "currency", "cents", "state", "evidence"}:
            raise ValueError("unexpected event fields")
        if e["job_id"] != job_id or e["currency"] != "USD" or e["state"] != "settled":
            raise ValueError("wrong job, currency or settlement status")
        if e["kind"] not in KINDS or type(e["cents"]) is not int or e["cents"] <= 0:
            raise ValueError("invalid movement")
        if any(not isinstance(e[k], str) or not e[k].strip() for k in ("system", "event_id", "evidence")):
            raise ValueError("missing accounting evidence")
        key = (e["system"], e["event_id"])
        if key in seen:
            if seen[key] != e:
                raise ValueError("conflicting accounting event")
            continue
        seen[key] = dict(e)
        totals[e["kind"]] += e["cents"]
    net_collected = totals["customer_receipt"] - totals["customer_refund"]
    cash_after_direct_payments = net_collected - totals["operator_payout"] - totals["material_payment"] - totals["payment_fee"]
    return {"unique_movements": len(seen), "net_collected_cents": net_collected,
            "cash_after_direct_payments_cents": cash_after_direct_payments}


def event(i, kind="customer_receipt", cents=5000, **patch):
    return dict({"job_id": "synthetic-job", "system": "synthetic-ledger", "event_id": str(i), "kind": kind,
                 "currency": "USD", "cents": cents, "state": "settled", "evidence": "synthetic-receipt"}, **patch)


class CommercialTests(unittest.TestCase):
    def test_cash_and_replay(self):
        rows = [event(1, cents=50000), event(2, "operator_payout", 40000), event(3, "material_payment", 3000), event(4, "payment_fee", 1000), event(5, "customer_refund", 1000)]
        self.assertEqual(reconcile("synthetic-job", rows + rows), {"unique_movements": 5, "net_collected_cents": 49000, "cash_after_direct_payments_cents": 5000})

    def test_unsettled_or_quote_rejected(self):
        for e in (event(1, state="quoted"), event(2, "invoice")):
            with self.assertRaises(ValueError):
                reconcile("synthetic-job", [e])

    def test_wrong_job_and_currency(self):
        for e in (event(1, job_id="other"), event(2, currency="EUR")):
            with self.assertRaises(ValueError):
                reconcile("synthetic-job", [e])

    def test_conflict(self):
        with self.assertRaises(ValueError):
            reconcile("synthetic-job", [event(1), event(1, cents=999)])

    def test_amount_and_evidence(self):
        for e in (event(1, cents=1.5), event(2, cents=True), event(3, cents=0), event(4, evidence="")):
            with self.assertRaises(ValueError):
                reconcile("synthetic-job", [e])


if __name__ == "__main__":
    unittest.main(verbosity=2)

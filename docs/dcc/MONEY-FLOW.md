# DCC money flow v0.1

Companion to [OPERATING-MODEL.md](./OPERATING-MODEL.md) and [JOB-LIFECYCLE.md](./JOB-LIFECYCLE.md). Prime-contractor economics without encoding imaginary splits.

Job/Transaction fields: [AIRTABLE-CHECKLIST.md](./AIRTABLE-CHECKLIST.md) §§3–5.

---

## Prime contractor

The client pays **DCC Miami**. DCC pays operators. DCC owns quote, invoice references, payment records, and institutional memory.

```
CLIENT PRICE
− material
− operator approved compensation (sum of Assignments)
− external costs
− machine reserve (if actually entered)
= contribution margin  (Admin-only)
```

Do **not** code `operatorShare = total * 0.5` or any permanent DCC/operator percentage. Compensation is **estimated hours × agreed rate** on the Assignment, then actual hours and **Approved Compensation**. After 10–20 real jobs the accounting system can emerge from evidence.

---

## Payment policies (on Service, snapshotted on Job)

| Policy | Meaning | Typical services |
|---|---|---|
| `deposit_50` | 50% to activate; balance before release | FDM, resin, project prep |
| `full_upfront` | Entire amount due before Active | SEO consulting, paid studio visit, small fixed-price work |
| `free` | No charge; still a Person/Interaction | Community virtual studio visit |

Do not add retainers, milestones, subscriptions, or variable deposits this phase. Do not hard-code policy from service **name**; read Service.Payment Policy and copy it onto the Job at quote time.

Public / Associate / Commercial columns on Service remain the **rate card**. There is no Base Price field.

---

## Job payment states

`none` → `deposit_due` → `deposit_paid` → `balance_due` → `paid`  
or `none` → `balance_due` → `paid` (full-upfront)  
or `not_required` (genuinely free)

`refunded` is for confirmed refunds. Do not use `waived` yet.

`balance_due` means whatever is still outstanding: remaining 50% **or** the whole full-upfront amount. Prefer this name over `final_due`.

Locked fabrication rules:

- Quote accept → `deposit_due` (or `balance_due` if `full_upfront`). Does **not** start production.
- Active requires the activation payment (`deposit_paid` or `paid` / `not_required`).
- After client completion approval → `balance_due` if a balance remains.
- Physical work is not released by default until `paid` (or `not_required`).

---

## Two collection events, two reference sets

A generic Job Invoice ID cannot represent a normal fabrication job.

**Deposit:** Payment Provider, Invoice/Payment ID, Payment URL, Amount, Received At  
**Balance:** the same five fields (for full-upfront, use the Balance set as the single collection, or treat the whole amount as Balance Amount — pick one convention in the first real quote and stick to it; default: full-upfront uses **Balance** fields only, Deposit fields empty.)

These fields are **operational pointers** to whatever external tool collected the money (invoice link, QBO, Stripe invoice, Venmo, etc.). They are not a billing system.

---

## Transactions = confirmed cash

Existing table `tbljoW6jK9ZgVuWYg`. Fields today: Name, Amount, Type, Date, Job, Notes ([`DCC_TRANSACTION_FIELDS`](../../lib/dcc/os-field-map.ts)).

[`monthlyRevenue`](../../lib/dcc/transactions.ts) treats a row as revenue when `amount > 0` and Type does **not** contain `expense` or `cost`. [`sumCashAvailable`](../../lib/dcc/transactions.ts) sums **all** amounts. [`listTransactions`](../../lib/dcc/transactions.ts) does not even return `jobId` yet — the Job link exists in the field map.

**Therefore: do not create a Transaction for an issued unpaid invoice.** Pending collection lives on the Job deposit/balance reference fields. Create a Transaction when money is **confirmed** (received or refunded).

### Additive Transaction fields

| Field | Purpose |
|---|---|
| Kind | `deposit` `balance` `full` `refund` `operator_payout` `expense` |
| Person | Client (inbound) or operator (payout) |
| Assignment | **Required for `operator_payout`** — which role/hours the payout satisfied |

Keep existing Type for CEO-scorecard compatibility. New writes must set Type so payouts are not counted as revenue (Type containing `expense` for `operator_payout` and `expense`). When Kind is wired, revenue math should switch to Kind.

Example payout:

- Kind = `operator_payout`
- Job = JOB-041
- Assignment = ASSIGN-018
- Person = Naz
- Amount = $105

Do not derive that amount from a percentage of client price.

---

## Operator visibility

Admin: full client economics (price, material, operator projected/actual, external, contribution).

Operator: their estimated hours, rate, projected compensation, actual approved hours, approved compensation, payout status. Never client total or margin.

---

## Machine Reserve

The field **Machine Reserve** stays on Job for compatibility.

[`setJobQuoteAmount`](../../lib/dcc/jobs.ts) currently sets `Machine Reserve = round(quoteAmount * 0.1, 2)` and logs it. Nothing in the UI calls this helper; [`mapJob`](../../lib/dcc/jobs.ts) does not read the field; the CEO scorecard does not use it.

That 10% is **not** locked doctrine for the new commercial loop. The operating model exists to learn real project economics. The new quote path must **not** auto-impose 10% of client price.

- Legacy helper may remain until nothing calls it.
- New quotes: leave Machine Reserve empty unless an Admin enters a real figure.
- Longer term, machine cost may come from hours/service usage. Do not build that model now.

---

## Stripe, Mercury, QuickBooks

Stripe checkout/webhook routes are **disabled**. Mercury and QBO are **not in the repo**. [STATUS.md](./STATUS.md) states they are a later compounding intent, not this phase.

Keeping Transactions as **cash + kind + job + optional assignment** is what lets those tools attach later without ripping the commercial model. Do not invent tax mapping until the legal entity and tax rule are confirmed.

---

## Credits

[`lib/dcc/credits.ts`](../../lib/dcc/credits.ts) is grant **impact multiplier** (retail value delivered / allocation). It is not operator compensation. Do not reuse the Credits table for payouts.

---

## What stays outside the app this phase

How quotes are composed (prep vs modeling vs failed prints vs rush vs discounts). Invoice creation and card/ACH collection. Operator default hourly rates (spreadsheet until Assignment rates stabilize). Paying operators (record the payout Transaction after the transfer).

# DCC job lifecycle v0.1

Companion to [OPERATING-MODEL.md](./OPERATING-MODEL.md). Source of truth for commercial / payment / fulfillment state. **Stage** is a compatibility projection only.

Human field creation: [AIRTABLE-CHECKLIST.md](./AIRTABLE-CHECKLIST.md).

---

## Three dimensions, not one Stage

The existing Airtable **Stage** (`Inquiry` → `Quoted` → `Approved` → `In Production` → `Post-Processing` → `Delivered` → `Paid` / `Declined` in [`DCC_JOB_STAGES`](../../lib/dcc/os-field-map.ts)) mixes three realities. A job can be quote-accepted but unpaid, in production with balance outstanding, or delivered with accounting incomplete.

v1 source of truth:

| Dimension | Values |
|---|---|
| **commercialStatus** | `inquiry` `scoping` `quoted` `accepted` `active` `closed` `declined` `cancelled` `on_hold` |
| **paymentStatus** | `none` `deposit_due` `deposit_paid` `balance_due` `paid` `not_required` `refunded` |
| **fulfillmentStatus** | `unscheduled` `scheduled` `in_progress` `qa` `client_review` `ready_for_release` `delivered` `completed` |

Keep writing **Stage** on every new/edited job so [`lib/dcc/ceo-scorecard.ts`](../../lib/dcc/ceo-scorecard.ts) and [`app/api/signage/route.ts`](../../app/api/signage/route.ts) do not break. Do not add Stage options for “Open for Fabrication.” Assignment strategy is not a job state. There is no Assignment Mode field; curated assignment is creating Assignment records.

Do not introduce `waived` yet. Free services use `not_required`. `waived` would mean a normally required charge was intentionally forgiven — later, as an exceptional state.

---

## Fabrication happy path (`deposit_50`)

Quote accept does **not** authorize production. Money and client completion approval do.

```
Inquiry
  → Scoping
  → Quoted (snapshot sent)
  → Quote accepted  → paymentStatus = deposit_due
  → Deposit paid    → commercialStatus = active
  → Scheduled / Assignment offered
  → In production
  → QA
  → Client review
  → Client approves → paymentStatus = balance_due
  → Balance paid    → paymentStatus = paid
  → Ready for release
  → Delivered
  → Closed
```

Escape: `declined`, `cancelled`, `on_hold`.

`full_upfront`: after quote accept, `balance_due` (the whole amount) until paid, then Active. `free`: `paymentStatus = not_required`; still record Person + Job/Interaction.

Physical fabrication: do not treat `ready_for_release` as delivered. Do not release by default until the balance is paid.

---

## Dual-read compatibility

Do **not** mutate historic Jobs on field creation.

1. If **Commercial Status** is populated, use the three new fields.
2. If they are blank, infer a **read-time** representation from legacy Stage. Do not write that inference back until a reviewed backfill.
3. All **new writes** and any job an admin **edits** write both the three dimensions and projected Stage.

### Legacy Stage → inferred new state (payment unknown stays `none`)

| Legacy Stage | commercial | payment | fulfillment |
|---|---|---|---|
| Inquiry | inquiry | none | unscheduled |
| Quoted | quoted | none | unscheduled |
| Approved | active | none | unscheduled |
| In Production | active | none | in_progress |
| Post-Processing | active | none | qa |
| Delivered | active | none | delivered |
| Paid | closed | paid | delivered |
| Declined | declined | none | unscheduled |

Old `Approved` meant go-ahead. Do not guess `deposit_paid`.

### New state → Stage projection (compatibility)

| Condition | Stage |
|---|---|
| inquiry or scoping | Inquiry |
| quoted | Quoted |
| accepted + deposit_due | Quoted |
| active + unscheduled or scheduled | Approved |
| in_progress | In Production |
| qa | Post-Processing |
| client_review | Post-Processing |
| **ready_for_release** | **Post-Processing** (must not inflate Delivered metrics) |
| delivered or completed | Delivered |
| closed + paid | Paid |
| declined or cancelled | Declined |

Backfill historic rows only after reviewing this mapping against real records.

---

## Quote snapshot (on Job, not a Quotes table)

Client-facing quote is a **versioned JSON** long text on Job (`Quote Snapshot` + `Quote Version`). The future client portal renders the snapshot. It must not reconstruct price from mutable Service records.

Approximate shape:

- quoteVersion, service, scope
- client-facing line items, subtotal, tax (null until we have a real tax rule — do not encode tax)
- total, paymentPolicy, depositRequired if `deposit_50`
- expected completion window, terms / exclusions

On change: increment Quote Version, replace snapshot, append [Change Log](../../lib/dcc/change-log.ts) with previous vs new total/policy/version.

Today [`setJobQuoteAmount`](../../lib/dcc/jobs.ts) only stamps Quote Amount, Stage=`Quoted`, and a 10% Machine Reserve. That helper is **not** the new quote path. See [MONEY-FLOW.md](./MONEY-FLOW.md) § Machine Reserve.

---

## Client portal token

Field name: **Client Portal Token** (not Quote Token). Same secret may later cover quote accept, deposit instructions, status, completion review, adjustment request, balance payment, delivery status.

Requirements:

- Cryptographically random, high entropy
- Never derived from Job ID, email, name, or other predictable values
- Revocable by **rotation** (new token + Issued At + Change Log; old token dies)
- Public route when built (Clerk-exempt), treated as authentication

Do not build `/fabricate/q/[token]` in the docs phase.

---

## Assignments

New table. One record = one operator role on one job. A job may have several (CAD + resin + QA).

**Status:** `proposed` `offered` `accepted` `declined` `in_progress` `completed` `cancelled`

`cancelled` / withdrawn ends an offered or accepted assignment without pretending it was declined or completed.

Compensation lives on the Assignment: Estimated Hours, Hourly Rate, Estimated Compensation, Actual Hours, Approved Compensation. No client price or DCC margin on this table.

v1 assignment is **curated**: Admin offers; operator accepts or declines. No claim queue. Creating Assignment records **is** direct assignment.

---

## Client completion vs quote accept

Do not conflate:

1. Accepting the commercial quote
2. Approving completed physical work

Client review is lightweight: 2–5 photos, optional video, dimensions/material notes, deviations, internal QA complete. Conceptual actions: **Approve completion** or **Request adjustment**. Software records `Completion Approved At/By` or `Adjustment Request`. Release follows **paid** + fulfillment `ready_for_release` → `delivered`.

---

## Change Log vs Interactions

| Object | Use |
|---|---|
| **Change Log** | Job/system events (inquiry created, quote version N, status change). Already written from `createInquiry` / `setQuote`. |
| **Interactions** | Person-centric participation and CRM touches. Workshop attendance, studio visit, consultation. |

Do not create a generic Activity table or an Attendance table.

Interactions table `tbl4PSVbNU2G6kLVl` already has Date, Type, People, Institution, Related Opportunity. Use Type options `Workshop Attendance`, `Studio Visit`, `Consultation`. Leave Related Opportunity empty (that is grant/program CRM). Add **Notes** only if the table has no notes/details field — required to name the workshop. First Seen Source on Person is acquisition; these rows accumulate afterward.

---

## Additive Job fields (approved)

Keep existing: Job Name, Stage, Customer, Tier, Service, Machine, Due Date, Notes, Quote Amount, Material Cost, Labor Cost, Machine Reserve.

Add: Commercial / Payment / Fulfillment Status; Payment Policy snapshot; Quote Version + Quote Snapshot; Quote Sent/Accepted At, Quote Accepted By; Client Portal Token + Issued At; Deposit Amount, Received At, Payment Provider, Invoice/Payment ID, Payment URL; the same five for **Balance**; Completion Approved At/By; Adjustment Request; Review Assets; External Cost; Internal Notes.

Do **not** add Assignment Mode, operatorId, or operatorPay on Job.

---

## Human Airtable checklist (exact order)

Follow [AIRTABLE-CHECKLIST.md](./AIRTABLE-CHECKLIST.md). Print / gap-check:

`npx tsx scripts/tools/scaffold-dcc-os-v1-fields.ts`

Do not migrate Stage values. Do not enable a writable console until People auth fields exist and at least one Person is `admin`.

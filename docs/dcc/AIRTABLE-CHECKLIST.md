# DCC OS v1 — Airtable checklist

Human (or `npm run dcc-os:scaffold-v1 -- --apply`) creates **additive** schema only. Do **not** change Job **Stage** options. Do **not** backfill historic Jobs.

Architecture: [OPERATING-MODEL.md](./OPERATING-MODEL.md) · [JOB-LIFECYCLE.md](./JOB-LIFECYCLE.md) · [PERMISSIONS.md](./PERMISSIONS.md) · [MONEY-FLOW.md](./MONEY-FLOW.md)

```bash
npx tsx scripts/tools/scaffold-dcc-os-v1-fields.ts           # print + gap report
npx tsx scripts/tools/scaffold-dcc-os-v1-fields.ts --apply   # missing fields only (schema.bases:write)
```

`--apply` never mutates records or Stage. After creating Assignments, add:

```env
AIRTABLE_DCC_OS_TABLE_ASSIGNMENTS=tblXXXXXXXX
```

Base: **DCC OS** `appWoYBRdklcz2RJH`

---

## Do not create

Assignment Mode · Base Price · Quotes table · Attendance table · Activity table · Accounts table · generic Job Invoice ID/URL · Quote Token (use **Client Portal Token**)

---

## Exact creation order

### 1. People `tbltHiqscY80ybsGE`

Do not overload **DCC Signup Status**.

| Field | Type | Options |
|---|---|---|
| Account Status | Single select | None, Invited, Active, Disabled |
| Clerk User ID | Single line text | |
| DCC App Roles | Multiple select | `admin`, `operator` |
| Operator Active | Checkbox | |
| First Seen At | Date | Set on create only |
| First Seen Source | Single select | Workshop, Fabrication, Network Signup, Studio Visit, Journal, Referral, Other |

Then mark the first staff Person **DCC App Roles** = `admin` (and `operator` if they also fabricate).

### 2. Services `tblP0tlOOVQE2gQBG`

Keep Associate / Public / Commercial. Keep existing Category. **No Base Price.**

| Field | Type | Options |
|---|---|---|
| Service Kind | Single select | Fabrication, Consulting, Visit |
| Payment Policy | Single select | Free, Full Upfront, Deposit 50 |
| Fulfillment Notes | Long text | Optional internal |

Set Kind/Policy on sellable services (FDM/Resin/Prep → Fabrication + Deposit 50; SEO → Consulting + Full Upfront; paid visit → Visit + Full Upfront; community visit → Visit + Free).

### 3. Jobs `tblrkDpVTX2eX8QBl`

Keep Stage, Quote Amount, Machine Reserve, Labor Cost, etc. Do **not** add Assignment Mode.

| Field | Type |
|---|---|
| Commercial Status | Single select: Inquiry, Scoping, Quoted, Accepted, Active, Closed, Declined, Cancelled, On Hold |
| Payment Status | Single select: None, Deposit Due, Deposit Paid, Balance Due, Paid, Not Required, Refunded |
| Fulfillment Status | Single select: Unscheduled, Scheduled, In Progress, QA, Client Review, Ready for Release, Delivered, Completed |
| Payment Policy | Same options as Services (snapshot at quote time) |
| Quote Version | Number, integer |
| Quote Snapshot | Long text (JSON) |
| Quote Sent At | Date |
| Quote Accepted At | Date |
| Quote Accepted By | Single line text |
| Client Portal Token | Single line text (high entropy; never from Job ID/email) |
| Client Portal Token Issued At | Date |
| Deposit Amount | Currency |
| Deposit Received At | Date |
| Deposit Payment Provider | Single line text |
| Deposit Invoice / Payment ID | Single line text |
| Deposit Payment URL | URL |
| Balance Amount | Currency |
| Balance Received At | Date |
| Balance Payment Provider | Single line text |
| Balance Invoice / Payment ID | Single line text |
| Balance Payment URL | URL |
| Completion Approved At | Date |
| Completion Approved By | Single line text |
| Adjustment Request | Long text |
| Review Assets | Attachments |
| External Cost | Currency |
| Internal Notes | Long text (admin-only) |

Leave new status fields **blank** on historic jobs (dual-read infers from Stage).

### 4. Assignments (new table)

Name the table **Assignments**. Link to Jobs and People.

| Field | Type |
|---|---|
| Name | Single line text (primary) |
| Job | Link to Jobs |
| Person | Link to People (operator, not client) |
| Role | Single select: Resin production, CAD prep, Finishing/QA, Visit host, Consulting, Other |
| Status | Single select: Proposed, Offered, Accepted, Declined, In Progress, Completed, Cancelled |
| Estimated Hours | Number, 2 decimal |
| Hourly Rate | Currency |
| Estimated Compensation | Formula `{Estimated Hours} * {Hourly Rate}` |
| Actual Hours | Number, 2 decimal |
| Approved Compensation | Currency |
| Offered At / Accepted At / Completed At / Cancelled At | Date |
| Declined Reason | Long text |
| Notes | Long text (operator-visible) |

No client price or margin on this table. Operators must **not** get Grid view on Jobs.

### 5. Transactions `tbljoW6jK9ZgVuWYg`

Keep Type (CEO scorecard still filters `expense`/`cost`). Unpaid invoices stay **off** this table.

| Field | Type |
|---|---|
| Kind | Single select: Deposit, Balance, Full, Refund, Operator Payout, Expense |
| Person | Link to People |
| Assignment | Link to Assignments (required for operator payouts) |

New payout writes should set Type containing `expense` until Kind drives revenue math.

### 6. Interactions `tbl4PSVbNU2G6kLVl`

Keep Date, Type, People, Institution, Related Opportunity. Leave Related Opportunity empty for workshops/visits.

- Add Type options: **Workshop Attendance**, **Studio Visit**, **Consultation** (keep Meeting/Call/Meet).
- Add **Notes** (long text) only if absent.

Do not create an Attendance table.

---

## After Airtable exists

1. Staff Person has `admin` and a Clerk email ready to link.
2. Restricted Airtable Interface for operators (Assignments + production fields only) — not the full base.
3. Then software: field maps are already in [`lib/dcc/os-field-map.ts`](../../lib/dcc/os-field-map.ts) and [`lib/dcc/os-v1-schema.ts`](../../lib/dcc/os-v1-schema.ts). Next product work is Clerk↔Person auth in the same phase as `/dcc/admin/jobs` — not this checklist.

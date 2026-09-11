# DCC operating model v0.1

**Status:** architecture freeze for the fall fabrication pilot. Not a feature backlog.

Related: [JOB-LIFECYCLE.md](./JOB-LIFECYCLE.md) · [PERMISSIONS.md](./PERMISSIONS.md) · [MONEY-FLOW.md](./MONEY-FLOW.md) · [AIRTABLE-CHECKLIST.md](./AIRTABLE-CHECKLIST.md) · living culture status in [STATUS.md](./STATUS.md) · store split in [DCC_DUAL_AIRTABLE.md](../DCC_DUAL_AIRTABLE.md).

Do **not** invent artist names, prices, partners, or documentary photos here. This file describes how DCC *operates*, not what is currently on the public site.

---

## Thesis

DCC should be easy to enter, valuable to participate in, increasingly powerful as trust accumulates, and economically sustainable when its infrastructure creates value.

It is not primarily a makerspace, marketplace, social network, or arts nonprofit. It is three overlapping systems that must reinforce each other rather than assume one produces the others:

| System | Purpose | What exists today |
|---|---|---|
| Cultural network | People, ideas, visibility, relationships | Journal, programs, curated `/artists`, network graph, workshop pages |
| Production network | Make things happen | `/fabricate/quote` + `/api/dcc/make` Inquiry jobs, estimator (not an invoice), Airtable job stages |
| Institutional infrastructure | Make the first two sustainable | Airtable People/Jobs/Transactions, CEO scorecard, Change Log |

The Next.js app does not create community. The studio does not automatically produce revenue. The CRM does not create trust. The missing product is **one commercial loop** on objects we already have, not a feed.

**North star:** DCC creates sustained cultural participation and meaningful collaborations that continue without requiring Moises to coordinate every interaction.

Track underneath that: participation, connection, production, recurrence. Revenue tells us whether the system can continue. Do not optimize for signups or pageviews as primary success.

---

## Canonical stores

| Store | Owns |
|---|---|
| **Airtable DCC OS** (`appWoYBRdklcz2RJH`) | Operational memory: People, Jobs, Services, Machines, Transactions, Credits, Bookings, Change Log, CRM Interactions |
| **Code-native TypeScript** | Public cultural records: artists, programs, journal, fabricate copy |
| **Supabase** | Infra24 **tenant** product only (orgs, memberships, bookings, display screens). Not DCC jobs/people |
| **Clerk** | Authentication: who is this human. Not the DCC Person database |

Do not sync culture into Airtable this phase. Do not migrate DCC OS to Supabase this phase. LIFE OS (`apprswzWnLrHBwFcx`) is the engineering backlog — never treat DCC Jobs as coding tasks.

---

## v1 objects

```
Person
 ├── Account? (optional Clerk link)
 ├── Jobs (as client)
 ├── Assignments (as operator)
 ├── Interactions (workshops, visits, CRM touches)
 └── Activities via Change Log on related Jobs
Service
 └── Jobs
Job
 ├── Client → Person
 ├── Service
 ├── Quote snapshot (fields on Job, not a Quotes table)
 ├── Assignments
 ├── Transactions (confirmed cash only)
 └── Change Log
Assignment
 ├── Job
 └── Operator → Person
Transaction
 ├── Job
 ├── Person?
 └── Assignment? (required for operator_payout)
```

**Only new table this phase: Assignments.** Everything else is additive fields on existing tables, plus Type options on Interactions.

Do not create: Quotes, Activity, Accounts, Attendance, marketplace/claim-queue tables.

Credits remain **grant impact**, not operator pay. CRM Opportunities remain **institutional/grant CRM**, not fabrication jobs.

---

## Person is not Account

A Person exists when DCC has a real contact: workshop, fabrication request, studio visit, journal, referral, or network signup. They do not need a login.

- **Account Status:** `none` | `invited` | `active` | `disabled`
- **Clerk User ID:** optional. Staff linking for the DCC app. See [PERMISSIONS.md](./PERMISSIONS.md).
- **DCC App Roles:** multi-select `admin`, `operator`. Empty = no DCC app authorization. One Person may hold both.
- **Operator Active:** availability to receive assignments, not a role.
- **First Seen At / First Seen Source:** acquisition only. Set on create. Later participation accumulates as **Interactions**, and must not overwrite First Seen Source.

Identity key is normalized **email**. Fabrication intake and signup must merge into the same Person. Name-only rows are staff-created; never auto-merge on name. Culture `DccArtist` records are not auto-synced into People.

`DCC Signup Status` stays network-onboarding (`Not Invited` → `Network Ready`). It is not Account Status.

---

## DCC is the prime contractor

```
Client → DCC Miami → Operator
```

DCC owns the quote, invoice, payment record, client communication, project record, production standard, QA expectation, and institutional memory. The operator has an agreement with DCC for their part of the work. Relationships are not property; staying inside DCC should be more useful than circumventing it.

Operators keep independent practices. When a project is sourced, managed, fabricated, scheduled, paid, documented, or otherwise supported through DCC infrastructure, it remains a DCC project and the agreed DCC economics apply.

---

## Services

One commercial backbone, different fulfillment. Do not hard-code payment logic from service names.

| Attribute | Values |
|---|---|
| Service Kind | `fabrication` \| `consulting` \| `visit` |
| Payment Policy | `free` \| `full_upfront` \| `deposit_50` |

Existing Associate / Public / Commercial columns are the **rate card**. There is no separate Base Price. Copy Payment Policy onto the Job at quote time so history does not drift if the Service later changes.

Initial sellable set (data, not code): FDM printing, resin printing, fabrication/project preparation (`deposit_50` + fabrication); SEO consulting (`full_upfront` + consulting); virtual studio visit paid (`full_upfront` + visit) or community (`free` + visit). A $0 visit is still a Person → Interaction → follow-up loop.

---

## Encode vs keep human

If we do not yet know exactly how the human decision should work, keep it outside the software. If we are repeating the same decision with the same rules, encode it.

| Encode (this phase, after schema exists) | Keep human |
|---|---|
| Person record, optional Account link | Whether a request is a good fit |
| Service configuration | Quote composition and exceptions |
| Job + three status dimensions | Who should be offered the work |
| Quote snapshot + client accept | QA judgment |
| Deposit / balance **state** and invoice **references** | Collecting money (external tools) |
| Assignment offer/accept/hours | Negotiating operator rates |
| Client completion approval state | Adjustment conversations |
| Interaction for workshop/visit | Editorial / Journal coverage |
| Change Log | Physical fabrication itself |

Out of this phase entirely: member messaging, social feeds, operator marketplace claiming, Stripe checkout, QuickBooks, Mercury, CMS, live smart-sign DCC jobs, workshop paywall.

---

## Flywheels we are not building yet

Workshop → attendance Interaction → capability introduced → assisted job → verified capability → operator is the intended real-world loop. Run it manually. Practice Tags stay **declared interest**, not verified skill, until completed Assignments exist as evidence.

---

## Metrics (when the loop is observable)

Commercial funnel: People Engaged → Requests → Qualified Jobs → Quotes → Deposits → Completed Work → Repeat Work.

Production network: Active Operators → Assignments Offered → Assignments Accepted → Jobs Completed → Paid Operator Hours → Repeat Operators.

Do not treat network signups as compounding value. Accumulated evidence is the compounding asset.

---

## Current code ground truth

| Path | Role |
|---|---|
| [`lib/dcc/os-config.ts`](../../lib/dcc/os-config.ts) | DCC OS connection + table IDs |
| [`lib/dcc/os-field-map.ts`](../../lib/dcc/os-field-map.ts) | Machines, Services, Jobs, Transactions, Credits, Bookings, Change Log |
| [`lib/dcc/jobs.ts`](../../lib/dcc/jobs.ts) | Inquiry create; `setJobQuoteAmount` (legacy 10% reserve — not doctrine) |
| [`app/api/dcc/make/route.ts`](../../app/api/dcc/make/route.ts) | Public intake → Person upsert + Inquiry job |
| [`lib/dcc/signup/upsert-person.ts`](../../lib/dcc/signup/upsert-person.ts) | Email-keyed Person upsert |
| [`lib/network-builder/field-map.ts`](../../lib/network-builder/field-map.ts) | People CRM columns |
| [`lib/airtable/crm-graph-field-map.ts`](../../lib/airtable/crm-graph-field-map.ts) | Interactions: Date, Type, Institution, People, Related Opportunity |
| [`lib/dcc/scale-up-auth.ts`](../../lib/dcc/scale-up-auth.ts) | Legacy password cookie for CEO scorecard — **not** DCC Admin auth |

---

## Implementation boundary

This document and its siblings are the freeze. Next human step: [AIRTABLE-CHECKLIST.md](./AIRTABLE-CHECKLIST.md). Next software step (after Airtable exists, **not this commit**): Clerk↔Person staff linking in the same phase as a writable Admin Jobs console. No marketplace, no checkout, no new tables beyond Assignments.

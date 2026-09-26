# DCC Miami — operating progress

**This is the scoreboard.** [`STATUS.md`](./STATUS.md) is public-memory for routes and records. This file tracks whether the *operating loop* is real: inquiry → quote → pay → make → document → return.

External narrative (do not treat as repo truth): [Operating Alignment Report](https://docs.google.com/document/d/1zmKi14prebgCb1TIxniAClPFPeJFD5SmPcgqmMQxr-U/edit) · [Scale Up folder](https://drive.google.com/drive/folders/1x1mYj8UDJf7SF_Acwn-u6qS6p7V7ifT9)

**Working principle:** automate coordination and transactions. Keep trust, judgment, hospitality, and conflict human.

**Current constraint:** DCC has enough public surface to begin a *controlled* pilot. The gap is ownership, verified workflows, economic evidence, and delegation — not more pages.

---

## How to use this file

Cursor / ChatGPT / humans: **read this before adding fabricate, workshop checkout, Airtable, or operator features.**

| Status | Meaning | Allowed claim |
|---|---|---|
| **B** | Built — live route, record, payment, or demonstrated behavior | “This works” |
| **P** | Partly — UI, schema, or copy exists; loop incomplete | “Scaffolded” |
| **N** | Not built | Do not imply it exists |
| **U** | Unknown — not verifiable from the repo | Audit, then re-mark |

**To show progress:** change a letter, add a one-line evidence note (route or record), append a dated row in [Progress log](#progress-log). Do not mark **B** from a design or a conversation.

**Do not invent:** paid jobs, operator commitments, entity/money decisions, Oolite endorsement, documentary photos.

Related: [`STATUS.md`](./STATUS.md) (what’s on the site) · [`RECORD.md`](../../lib/dcc/culture/RECORD.md) (how to publish a culture record) · [`IMAGE_SHOT_LIST.md`](./IMAGE_SHOT_LIST.md)

---

## Snapshot

| Field | Value |
|---|---|
| Last scored | 12 September 2026 |
| Branch scored | `main` @ `0ef6de9` |
| Loop complete? | **No.** Intake + planning estimate exist. Paid promise → operator → books → case study does not. |
| Unmerged (not scored as main) | [PR #11](https://github.com/moisestech/infra24/pull/11) — OS v0.1 docs + *You Can’t Buy Digital Culture* |

### On `main` today

- Culture: 3 artists, Clandestine coming-soon, **5 journal essays**, `DCC_PROJECTS = []`
- Education: public workshop pages; enrollment = inquiry / free RSVP
- Fabricate: Field Lab, estimate ($151 seed, **not an invoice**), quote intake, internal test projects
- Money: Stripe checkout **disabled**; Oolite paid classes on QGiv; Mercury/QBO **not in repo**

### Still on PR #11 (open, not merged)

- *You Can’t Buy Digital Culture*
- Constrained markdown `bodyPath` loader (`load-editorial-body.ts`)
- OS v0.1: `OPERATING-MODEL.md`, `JOB-LIFECYCLE.md`, `MONEY-FLOW.md`, `PERMISSIONS.md`, `AIRTABLE-CHECKLIST.md`, `os-v1-schema.ts`

---

## Next measurable win

All of these must run through **the same workflow**. Count only closed records, not conversations.

| Target | Today | Evidence when done |
|---|---|---|
| 3 paid fabrication projects | **N** — `/fabricate/projects` are internal tests | Job records: pay + delivery + costs |
| 1 paid DCC workshop | **N** — inquiry only | Registration + payment + attendance |
| 3 verified operators | **N** | Skills, machines, rates, reject rights |
| 1 operations steward | **N** — open seat | Named owner of queue / follow-up / records |
| Complete cost + activity records | **N** | Estimate vs actual on every paid job |
| 1 published case study | **N** — `DCC_PROJECTS` empty | Culture project record + journal/site proof |

**90-day target (from the alignment report):** 10 documented paid jobs, revised pricing, backup estimator, 3 operators, monthly workshop loop, 2 case studies, written financial structure. Do not treat as current performance.

---

## Milestone gates

Advance only with evidence. Do not skip.

| Gate | Evidence | Status |
|---|---|---|
| 0 Clarity | Build inventory scored; entity chosen; 3 offers locked; owner per step | **P** — this file is the inventory; entity/offers/owners still open |
| 1 Reliable transaction | 3–5 paid jobs through intake → pay → make → document → books | **N** |
| 2 Validated economics | 10 jobs with estimate vs actual; pricing revised | **N** |
| 3 Delegated production | 3 operators + ops owner + backup estimator | **N** |
| 4 Repeatable programming | Monthly paid workshop with CRM next action | **N** |
| 5 Cultural cadence | Workshop + gathering + 1–3 projects + 2 proof assets / month | **N** |
| 6 Partner nodes | Two written node agreements | **N** |
| 7 Sustainable scale | Recurring work covers ops, founder pay, reserve, operators | **N** |

---

## Build-verification checklist (36)

A **B** needs a working route, record, payment, automation, or live demo — not only code.

### Identity and CRM

| # | Capability | Status | Evidence / next |
|---|---|---|---|
| 1 | Account signup | **P** | `/dcc/signup`, `/network/signup` → Airtable People when OS env set. Not a DCC membership account. |
| 2 | Login | **P** | Clerk for Infra24 tenant SaaS. DCC marketing is public (`lib/auth/public-routes.ts`). |
| 3 | Public member / artist profiles | **B** | `/artists` — Moises, Fabiola, Angelo. Not a Clandestine roster. |
| 4 | Internal CRM person records | **P** | Airtable People via `lib/dcc/os-config.ts` if configured. Culture artists are code, not CRM. |
| 5 | Skills on people | **P** | Tags on network/signup maps; not an operator-permission product. |
| 6 | Operator roles and permissions | **N** | No fabrication-operator ACL. Org roles are tenant SaaS. |

### Workshops

| # | Capability | Status | Evidence / next |
|---|---|---|---|
| 7 | Workshop pages | **B** | `/workshops`, `/workshop/3d-school`, `/workshop/3d-printing-for-artists`, `/workshop/ai-3d-physical-object`, `/workshop/resin-printing` |
| 8 | Workshop registration | **P** | Newsletter interest + `/api/workshop-registrations` RSVP. No DCC paid SKU. |
| 9 | Workshop payment | **N** | Stripe routes `.disabled`. Oolite Digital Lab = QGiv (not DCC). |
| 10 | Paid attendee materials | **N** | |
| 11 | Attendance on person record | **N** | |

### Fabrication

| # | Capability | Status | Evidence / next |
|---|---|---|---|
| 12 | Intake form | **B** | `/fabricate/start` (redirect from `/fabricate/quote`), `/make` → `POST /api/dcc/fabricate/start` and `/api/dcc/make` (Inquiry job if OS configured; email if Resend configured) |
| 13 | Automated estimator | **B** | `/fabricate/estimate` — $151 seed; **planning estimate, not an invoice** |
| 14 | Human-created quote | **P** | Password-gated `/fabricate/proposals/heather-deitch` ($625 Prototype 1) + Carol shell. Not a live quote system. |
| 15 | Client quote acceptance | **N** | |
| 16 | Client invoice payment | **N** | |
| 17 | Project status pipeline | **P** | Rich enum in `lib/dcc/fabrication/job-status.ts` on git proposals; Airtable create = Inquiry. Not live. |
| 18 | Operator project claim | **N** | |
| 19 | Open for Fabrication queue | **N** | `/fabricate` queue copy is pricing labels, not a job board |
| 20 | Operator compensation | **N** | |

### Finance, publishing, programs, network

| # | Capability | Status | Evidence / next |
|---|---|---|---|
| 21 | QuickBooks + payment accounting | **N** | QBO/Mercury not in repo. Airtable Transactions = read for CEO scorecard. |
| 22 | Journal infrastructure | **B** | `/journal` — thesis-driven index; 5 published essays; Cost + Public Art are the two reference MDX articles; Essays + Conversations only |
| 23 | Journal publishing workflow | **P** | Code records + `content/journal/*.mdx`. No CMS. Newsletter/RSS pending. |
| 24 | Events / program calendar | **P** | `/events` hardcoded; Clandestine coming soon |
| 25 | Studio visit booking | **P** | Infra24 booking exists; DCC OS bookings are read helpers. 360 tours: Moises + Fabiola. |
| 26 | Member-to-member messaging | **N** | Do not build until Gate 1 |
| 27 | Collaboration / request actions | **N** | |
| 28 | Open-call applications | **N** | Oolite product, not DCC |

### Physical interface and admin

| # | Capability | Status | Evidence / next |
|---|---|---|---|
| 29 | SmartSign software | **P** | `lib/display-plane`, `/api/signage`, `app/display/dcc/` |
| 30 | SmartSigns physically installed | **U** | Studio 43 signs exist as ops fact; not commissioned in-repo |
| 31 | SmartSigns pull live DCC data | **P** | Possible when OS configured; else planned fleet |
| 32 | Admin dashboard | **P** | `/dashboard/ceo` if OS configured; `/dashboard` is tenant SaaS |
| 33 | Content calendar | **N** | |
| 34 | Email / newsletter automation | **P** | `/newsletter`; provider = `NEXT_PUBLIC_MARKETING_NEWSLETTER_FORM_ACTION` if set |
| 35 | Cross-system analytics | **P** | PostHog present; no DCC ops analytics product |
| 36 | Airtable operational backend | **P** | Libs + config. Live column drift vs code = **U** until a base audit. Culture records stay in git. |
| — | Canonical data ownership documented | **P** | Culture = `lib/dcc/culture/*`. Ops/CRM = Airtable. Civic `/projects` ≠ culture ≠ `/fabricate/projects`. Entity/money still open. |

---

## Open decisions (block expansion)

Score **N** until written. Order matters.

1. Entity: AI24 line during pilot vs standalone DCC
2. Pilot ask: customers, operators, capital, or a defined mix
3. Equipment ownership + any profit share (incl. Micah terms)
4. Founder compensation before “profit”
5. DCC margin by job type
6. Named collaborator commitments (role, hours, rate, permissions)
7. Documentation / portfolio rights
8. Conduct, suspension, removal
9. Insurance / liability
10. Canonical system for quotes, payments, and books

**Founder keeps:** mission, partnerships, standards, high-risk exceptions, cultural direction.  
**Transfer when a steward exists:** queue, scheduling, missing-info follow-up, payment status, records, monthly reporting.

People named in the alignment report (Augusto, Naz, Micah, Leo, Alec, ops steward) are **capability signals, not staffing**, until recorded here with a commitment date.

---

## Capacity cap (until Gate 1)

| Work | Cap | Why |
|---|---|---|
| Active paid client projects | 3 concurrent | Unknown real capacity |
| Paid workshops | 1 / month | After a DCC SKU exists |
| Public gathering | 1 / month | Needs a hospitality owner |
| Editorial | 2 strong pieces / month | Record → publish workflow |
| Infra improvement | 1 / month | Prior change must be in use |

Stop accepting work if the quote hides labor, the operator/machine is unverified, scope isn’t accepted, the cap is exceeded, a partner claim isn’t authorized, or previous jobs are unpaid/undocumented.

---

## What to stop

- More software surface (messaging, extra fabricate UI, Stripe) before Gate 1
- Treating informal interest as an operating commitment
- Marking capabilities **B** without a live path
- Mixing culture records with fabricate jobs or civic `/projects`
- Enabling Stripe until a DCC SKU and entity are confirmed ([STATUS.md](./STATUS.md) money section)

**Next software move, if any:** one offline-tolerant loop — quote intake → recorded job → payment noted → documented close. Not a new product area.

---

## Progress log

Append; do not rewrite history.

| Date | What changed | Scoreboard effect |
|---|---|---|
| 2026-09-26 | Fabrication OS schema proposed in [`FABRICATION-OS.md`](./FABRICATION-OS.md) and [`FABRICATION-OS-SCHEMA.md`](./FABRICATION-OS-SCHEMA.md). Domain types in `lib/dcc/fabrication-os`. No Airtable writes, no queue UI, no Stripe, no QuickBooks. | Checklist #17 still **P**; #19, #20, #21 still **N**; #36 still **P**. Schema is proposed, not built. |
| 2026-09-21 | DCC 3D School curriculum hub at `/workshop/3d-school` (seven mental-model records, labeled asset placeholders, inquiry CTAs). No dates, instructors, or checkout. | Checklist #7 still **B** with hub evidence. |
| 2026-09-21 | Heather pricing layer: five-line $625 client breakdown, resin reference (~$42.47, client-supplied), staff `/fabricate/internal/heather-deitch` economics ($15/$35 machine/operator, $125/hr founder warning). No Stripe. | Checklist #12 still **B**; #14 **P**; payments still **N**. |
| 2026-09-21 | Fabricate Phase 1 studio surfaces: `/fabricate/services/*`, `/fabricate/start`, password-gated Heather + Carol proposals. No Stripe. See [`FABRICATE.md`](./FABRICATE.md). | Checklist #12 still **B**; #14 **P** with private proposal evidence; #15/#16 still **N**. |
| 2026-09-21 | Public Art essay published as second Journal reference (figures, heavier citations, Technical Rider). No municipal APIs or fake costs. | Checklist #22 still **B**; #23 still **P**. |
| 2026-09-21 | Cost essay published as Journal reference article (living metadata, citations, native diagrams, frameworks). No fake operating values. | Checklist #22 still **B**; #23 still **P**. |
| 2026-09-12 | Four journal diagrams live as SVG (`capability-network`, `different-kinds-of-labor`, `distributed-cultural-network`, `idea-to-realization-distance`). Heroes/photos stay PLACEHOLDER. | Checklist #22 still **B**; no scoreboard letter change. |
| 2026-09-12 | Scored `main` against the Operating Alignment Report. PR #11 still unmerged. | This file created. Loop = not complete. |
| 2026-09-12 | Journal essays 02–03 on `main` via MDX `bodyPath`. | Checklist #22 **B**; #23 still **P**. |
| 2026-09-12 | Clandestine kept as coming-soon. | Programs stay **P**. |
| 2026-09-11 | First journal essay + workshops webcore + fabricate Phase 2 already on `main`. | Surfaces **B**; payments **N**. |

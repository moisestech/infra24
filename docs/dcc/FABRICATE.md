# DCC Fabricate — Phase 1 architecture

This file is the operating note for the studio surfaces added beside the existing `/fabricate` marketing tree. It does not replace [`OPERATING-PROGRESS.md`](./OPERATING-PROGRESS.md).

## Architecture

Public studio copy, proposal pages, materials, machines, operators, and job **types** live in git under `lib/dcc/fabrication/`.

Intake writes:

1. Staff email via Resend (`MARKETING_CONTACT_TO`) when configured
2. A DCC OS Inquiry job via `createInquiryJob` when Airtable OS env is set — extra fields go in notes, prefixed `[web:/fabricate/start]`

Do not treat Airtable Job **Stage** as the rich fabrication enum. OS stages stay `Inquiry` / `Quoted` / … until a later mapping milestone.

Payments, operator claim, and live status are **manual**. Stripe is not enabled.

## Routes

| Path | Kind |
|---|---|
| `/fabricate` | Existing public home (unchanged narrative) |
| `/fabricate/services` | Public index of the two studio services |
| `/fabricate/services/fabricate-my-file` | Public |
| `/fabricate/services/prepare-and-fabricate` | Public |
| `/fabricate/start` | Public intake |
| `/fabricate/quote` | Redirects to `/start` (query preserved) |
| `/fabricate/proposals/*` | Private, password cookie, noindex |
| `/fabricate/internal/[slug]` | Staff-only economics estimator, scale-up / CEO gate, noindex |

Proposal slugs are **not** registered in `lib/cdc/routes.ts` and must stay out of the sitemap.

## Two views, two gates

| Surface | Audience | Gate |
|---|---|---|
| `/fabricate/proposals/*` | Client (Heather, Carol) | Shared proposal password |
| `/fabricate/internal/[slug]` | DCC staff | `hasScaleUpAccess()` or `DCC_CEO_DASHBOARD_ENABLED` |

Never mix them. Clients see **quote line items** (packaged amounts). Staff see **cost line items** (machine/operator/consumables) and contribution math.

Locked pilot rates (internal only):

- Machine **$15/hr**
- Operator **$35/hr**
- Founder margin warning **$125/hr**

Client packaging ≠ internal allocation. Heather’s five client lines sum to **$625**; internal direct cost uses hours × rates plus consumables and a payment-fee estimate.

## Proposal content model

Each client page is hand-assembled from modules in `components/dcc/fabrication/proposal/`. Records live in `lib/dcc/fabrication/proposals/<slug>.ts`.

Types in `lib/dcc/fabrication/schema.ts`:

- `QuoteLineItem` — client-visible packaging (`clientVisible`, `amount`, expandable copy)
- `CostLineItem` — staff-only direct costs (`internalRate`, never on client pages)
- `QuoteEconomics` — contribution and founder margin/hr from `quote-economics.ts`

A proposal can show a **static** `ProjectStatus` from `FabricationJob.status`. That is not a live production feed.

Internal economics (`hourlyRateInternal`, `costLineItems`, founder margin) may exist on records. They must not render on client proposal pages. Use `serializeClientPricingView()` in tests to guard the client path.

## File conventions

Approved proposal **images** (renders, diagrams, slicer previews):

```
content/dcc/fabricate/private/<proposal-slug>/<filename>
```

Served only at `/api/dcc/fabricate/media/<slug>/<filename>` after the shared password cookie. CAD / source (`.pm7m`, `.stl`, `.3mf`, `.obj`, `.zip`) is never served — keep it off the website.

Heather expected filenames are listed in `content/dcc/fabricate/private/README.md`.

## Public vs private

| Public | Private |
|---|---|
| Service explanations, process strips | Client names, quotes, files, hardware notes |
| `/fabricate/projects` DCC tests | `/fabricate/proposals/*` |
| Placeholder service pages | Job records with documentation-rights flags |

Public documentation permissions default **false** except internal process notes on the job record. A future case study is a separate public object, not a flipped private proposal.

## What remains manual

- Password distribution to Heather and Carol (one shared `DCC_FABRICATE_PROPOSALS_PASSWORD`)
- Material SKU / supplier / reference price
- Machine ownership / access confirmation
- Deposit and balance (offline)
- Operator assignment and production
- Carol scope, references, and quote
- Mapping rich job statuses onto Airtable columns

## Future Airtable

Do not add columns in this phase. When ready, map `FabricationJob` fields onto DCC OS Jobs (or a child table) without rebuilding the git schema. Intake already creates Inquiry rows.

## Future Stripe

Wait until OPERATING-PROGRESS Gate 1: DCC SKU + legal entity. Then a deposit checkout can attach to `quoteAmount` / `depositAmount`. Do not collect payment from the proposal page until that exists.

## Future operator workflow

Types already include `OPEN_FOR_FABRICATION` → `CLAIMED` → `PRODUCTION`. MVP stores the assigned operator on the git record. A claim UI comes after operators are verified.

## Environment

```
DCC_FABRICATE_PROPOSALS_PASSWORD=
```

Reuse: `INFRA24_CONTROL_SERVICE_TOKEN` (HMAC), `RESEND_*`, `MARKETING_CONTACT_TO`, `AIRTABLE_DCC_OS_*`.

Production without the proposal password returns 503 on unlock. Locally, an unset password allows access (same pattern as `/scale-up`).

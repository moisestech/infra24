# DCC Signup Workflow

Public entry points:

- [`/network/signup`](../../app/(marketing)/network/signup/page.tsx) — primary signup under network routes
- [`/dcc/signup`](../../app/(marketing)/dcc/signup/page.tsx) — legacy alias (still works)
- QR: `/network/signup/qr` or `/dcc/signup/qr`
- Legacy redirects: `/contact/dcc-index`, `/contact/artist-index`

## Pathways

### 1. Join Miami's Digital Culture Map

Writes to **People** via `POST /api/dcc/signup` (email upsert).

### 2. Help Build the Research View

Writes to **Seed Candidates** via `POST /api/dcc/signup/suggest` (create-only).

## Network graph surfaces

| Route | Mode | Visibility |
|-------|------|------------|
| `/network` | active | public |
| `/network/living` | combined (toggle) | public |
| `/network/research` | research | public (anonymized) |
| `/network/immersive` | combined (toggle) | public |
| `/network/admin` | admin | internal (requires `DCC_NETWORK_ADMIN_ENABLED=true`) |

API: `GET /api/marketing/dcc-network-graph?surface=explorer&mode=active|research|combined|admin&visibility=public|internal`

## Graph mode rules

**Active Network:** People with `Graph Layer = Network Node or Both`, public consent gate, `Demo Readiness ≠ Do Not Show`.

**Research View:** Seed Candidates with `Graph Layer = Research Node or Both`, names anonymized on public view.

**Combined:** Both sources, deduped by name (People preferred).

**Admin:** Full metadata for staff review.

## Env vars

```env
AIRTABLE_DCC_CRM_API_KEY=pat...
AIRTABLE_DCC_CRM_BASE_ID=appWoYBRdklcz2RJH
AIRTABLE_DCC_CRM_TABLE_PEOPLE=tbltHiqscY80ybsGE
AIRTABLE_DCC_CRM_TABLE_SEED_CANDIDATES=tbl5xmCirpEoHPSbG
AIRTABLE_DCC_CRM_CAMPAIGN_INDEX_SEED_ID=recXXXXXXXX   # optional
DCC_NETWORK_ADMIN_ENABLED=true   # optional, for /network/admin
```

## Code

- Form: [`components/dcc/signup/DccSignupForm.tsx`](../../components/dcc/signup/DccSignupForm.tsx)
- Join module: [`lib/dcc/signup/`](../../lib/dcc/signup/)
- Suggest module: [`lib/dcc/signup/suggest/`](../../lib/dcc/signup/suggest/)
- Graph transform: [`lib/airtable/crm-graph-transform.ts`](../../lib/airtable/crm-graph-transform.ts)
- Node cards: [`components/marketing/dcc-network/GraphNodeCard.tsx`](../../components/marketing/dcc-network/GraphNodeCard.tsx)

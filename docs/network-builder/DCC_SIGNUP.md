# DCC Signup Workflow

Public entry points:

- [`/network/signup`](../../app/(marketing)/network/signup/page.tsx) — primary signup under network routes
- [`/dcc/signup`](../../app/(marketing)/dcc/signup/page.tsx) — legacy alias (still works)
- QR: `/network/signup/qr` or `/dcc/signup/qr`
- Short link: `/join` → `/network/signup` (preserves UTM query params)
- Legacy redirects: `/contact/dcc-index`, `/contact/artist-index`

## Form modes

- **Quick (default)** — campaign/QR signup: name, email, role, interests, consent (`?form=quick` optional)
- **Full index** — complete intake: `/network/signup?form=full`

UTM / `source` / `qr` params are stored in `localStorage` on first page load and sent with the API payload.

## Campaign URLs (staff)

See `DCC_CAMPAIGN_URLS` in [`lib/dcc/signup/attribution.ts`](../../lib/dcc/signup/attribution.ts).

TV QR target example:

`/network/signup?source=dcc-tv&utm_source=tv&utm_medium=qr&utm_campaign=dcc_tv_launch&utm_content=tv_loop&qr=dcc_tv_main`

## Welcome email

On successful signup, sends **Welcome to DCC Miami** via Resend when `RESEND_API_KEY` is set (`DCC_SIGNUP_FROM_EMAIL` optional).

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

## Airtable field map

See **[DCC_SIGNUP_FIELD_MAP.md](./DCC_SIGNUP_FIELD_MAP.md)** for exact column names, URL→field behavior, dedupe rules, and optional fields.

## Env vars

```env
AIRTABLE_DCC_CRM_API_KEY=pat...
AIRTABLE_DCC_CRM_BASE_ID=appWoYBRdklcz2RJH
AIRTABLE_DCC_CRM_TABLE_PEOPLE=tbltHiqscY80ybsGE
AIRTABLE_DCC_CRM_TABLE_SEED_CANDIDATES=tbl5xmCirpEoHPSbG
AIRTABLE_DCC_CRM_CAMPAIGN_TV_ID=recXXXXXXXX
AIRTABLE_DCC_CRM_CAMPAIGN_EDGE_ZONES_ID=recXXXXXXXX
AIRTABLE_DCC_CRM_CAMPAIGN_GENERAL_ID=recXXXXXXXX
AIRTABLE_DCC_CRM_CAMPAIGN_INDEX_SEED_ID=recXXXXXXXX   # legacy fallback
DCC_NETWORK_ADMIN_ENABLED=true   # optional, for /network/admin
RESEND_API_KEY=
DCC_SIGNUP_FROM_EMAIL=DCC Miami <onboarding@yourdomain.com>
```

## Code

- Form: [`components/dcc/signup/DccSignupForm.tsx`](../../components/dcc/signup/DccSignupForm.tsx)
- Join module: [`lib/dcc/signup/`](../../lib/dcc/signup/)
- Suggest module: [`lib/dcc/signup/suggest/`](../../lib/dcc/signup/suggest/)
- Graph transform: [`lib/airtable/crm-graph-transform.ts`](../../lib/airtable/crm-graph-transform.ts)
- Node cards: [`components/marketing/dcc-network/GraphNodeCard.tsx`](../../components/marketing/dcc-network/GraphNodeCard.tsx)

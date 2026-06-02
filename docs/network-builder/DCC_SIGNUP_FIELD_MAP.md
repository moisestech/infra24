# DCC Signup → Airtable People field map

Authoritative mapping for `POST /api/dcc/signup`. Code source: `lib/network-builder/field-map.ts` + `lib/dcc/signup/map-to-airtable.ts`.

## URL parameters → Airtable

| URL param | Example | Airtable field | Notes |
|-----------|---------|----------------|-------|
| `source` | `dcc-tv` | **Signup Source** | Label: `TV QR` (see `signup-source-labels.ts`) |
| `utm_source` | `tv` | **UTM Source** | |
| `utm_medium` | `qr` | **UTM Medium** | |
| `utm_campaign` | `dcc_tv_launch` | **UTM Campaign** | |
| `utm_content` | `tv_loop` | **UTM Content** | |
| `utm_term` | *(any)* | **UTM Term** | **Optional** — only written if present in URL; safe to omit column in Airtable |
| `qr` or `qr_code_id` | `dcc_tv_main` | **QR Code ID** | Both aliases supported |
| *(first path)* | `/edgezones` | **Landing Page** | First-touch in localStorage |
| `document.referrer` | | **Referrer** | First-touch in localStorage |

**Not mapped from URL:**

| Field | Value on signup |
|-------|-----------------|
| **Source** | Always `Online` (CRM channel — not the activation) |
| **Campaigns** | Linked record — only when env campaign `rec…` is set (see below) |

**Removed:** singular text field `Campaign` — use **UTM Campaign** + **Campaigns** linked record instead.

## Signup Source labels (`source` param)

| `source` value | Signup Source |
|----------------|---------------|
| `dcc-tv` | TV QR |
| `edgezones` | Edge Zones |
| `born-digital-era-may` | Born-Digital Era May |
| `dcc-general` | DCC General Join |
| *(other)* | Raw string as-is |

## Form fields (both quick + full)

| Form | Airtable field |
|------|----------------|
| Full name | Full Name |
| Email | Email (dedupe key) |
| Role | Contact Category |
| Interests | Interest Tags |
| Practice areas (full only) | Practice Tags |
| City (full only) | City |
| Digital statement (full only) | Digital Orientation Statement |
| Consent radios + newsletter checkbox | Consent Status + **Consent to Updates** (checkbox) |
| Public listing (full only) | Public Profile Consent |
| Instagram / website / org | Instagram, Website, Institution |

## Duplicate email (PATCH merge)

| Field | Behavior |
|-------|----------|
| Email | Dedupe key — never duplicated |
| Full Name | Update only if existing empty |
| Contact Category | Update only if existing empty |
| City, Institution, Digital Orientation | Update only if existing empty |
| Interest Tags, Practice Tags | **Merge** (union) |
| UTM Source/Medium/Campaign/Content, QR Code ID, Landing Page, Referrer, Signup Source | **Latest touch** |
| Agent Notes | **Append** timestamped resubmission line |
| Signup Submitted At | Latest timestamp |
| Campaigns (linked) | **Append** record id if env set |

## localStorage attribution

| Rule | Behavior |
|------|----------|
| Landing Page, Referrer | **First-touch** preserved |
| UTM + `source` + QR | **Latest-touch** overwrites on new campaign URL |
| Submit | Client sends stored values + current `source` |

## Campaign linked records (env)

| Env var | Used when `source=` |
|---------|---------------------|
| `AIRTABLE_DCC_CRM_CAMPAIGN_TV_ID` | `dcc-tv` |
| `AIRTABLE_DCC_CRM_CAMPAIGN_EDGE_ZONES_ID` | `edgezones` |
| `AIRTABLE_DCC_CRM_CAMPAIGN_GENERAL_ID` | `dcc-general`, `join` |
| `AIRTABLE_DCC_CRM_CAMPAIGN_INDEX_SEED_ID` | Legacy fallback |

## Welcome email (non-blocking)

- Runs after Airtable success via `void sendDccSignupWelcomeEmail(...).catch(...)`
- Missing `RESEND_API_KEY` → signup still succeeds; email skipped with warning log
- From: `DCC_SIGNUP_FROM_EMAIL` → `RESEND_FROM_EMAIL` → `DCC Miami <onboarding@resend.dev>` (dev fallback — set verified domain in production)

## Airtable columns you should have (MVP)

**Required for tracking:**

- UTM Source, UTM Medium, UTM Campaign, UTM Content
- Landing Page, QR Code ID, Referrer, Signup Source
- Consent to Updates (checkbox)

**Optional:**

- UTM Term (only if you add the column; app only sends when URL includes `utm_term`)

**Do not add unless needed:**

- `Campaign` (text) — use UTM Campaign + Campaigns link instead

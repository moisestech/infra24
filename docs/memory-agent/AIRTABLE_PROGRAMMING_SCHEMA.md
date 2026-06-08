# Airtable Programming schema (Memory Agent)

Airtable is the **editorial source of truth** for exhibitions, events, workshops, and other programming. Supabase announcements/workshops remain supported as a **transition fallback** until each org migrates fully.

## Architecture

```txt
Airtable Programming table
  → mapAirtableProgrammingRow()
  → KnowledgeRecord
  → merge + dedupe with Supabase / Soho demo
  → retrieve + rank
  → event cards / signage / QR handoffs

Supabase (runtime)
  → auth, generated assets, approvals, handoffs, logs, analytics, embeddings cache
```

## Table: `Programming`

Create this table in the org Airtable base (Oolite: `OOLITE ARTS` / `appBvA0pWq9XkthTc`).

| Field | Type | Purpose |
| ----- | ---- | ------- |
| **Title** | Single line text | Primary field |
| **Organization** | Linked record → Institutions | Tenant / source org |
| **Record Type** | Single select | See [Record types](#record-types) below |
| **Status** | Single select | `draft`, `coming_soon`, `on_view`, `published`, `canceled`, `archived` |
| **Visibility** | Single select | `public`, `internal`, `members_only` |
| **Start Date** | Date | Start |
| **End Date** | Date | End |
| **Location Name** | Text | Venue |
| **Address** | Text | Street address |
| **Summary** | Long text | Short card copy |
| **Description** | Long text | Full body |
| **Curator** | Text | Optional |
| **Featured Artists** | Long text | Semicolon-separated names (linked Artists table later) |
| **Image URL** | URL | Hero / card image |
| **Public URL** | URL | Optional public page |
| **RSVP URL** | URL | Optional — only surfaced when grounded |
| **Bookable** | Checkbox | Workshop / bookable logic |
| **Smart Sign Eligible** | Checkbox | May appear in signage drafts |
| **Public AI Approved** | Checkbox | Governance gate for public mode |
| **Priority** | Number | Retrieval boost (higher = preferred for smart sign) |
| **Tags** | Multiple select | e.g. `youth residents`, `exhibition`, `vitrine` |
| **Source Notes** | Long text | Admin notes (not sent to model unless mapped) |
| **Do Not Use In AI** | Checkbox | Exclude from all retrieval |

### Public mode governance

Rows are **excluded** in public Memory Agent mode when:

- `Do Not Use In AI` is checked
- `Public AI Approved` is unchecked (when field is present)
- `Visibility` = `internal`
- `Status` is `draft`, `canceled`, or `archived`

Staff operator mode sees draft/internal rows unless `Do Not Use In AI` is set.

### Record types

Supported values (use lowercase snake_case in seed JSON; Airtable UI may use Title Case):

| Type | Use for |
| ---- | ------- |
| `exhibition` / `upcoming_exhibition` | Gallery exhibitions |
| `workshop` | Classes and workshops |
| `artist_talk` | Talks and panels |
| `screening` | Film / video screenings |
| `open_studio` | Open studio days |
| `residency_event` | Residency milestones |
| `application_deadline` | Calls and deadlines |
| `public_announcement` | General announcements |
| `bookable_event` | RSVP / ticketed events |

Full list: `data/oolite-programming-airtable-options.json`

### Dual-source policy (Oolite pilot)

**Keep both sources for now:**

- **Airtable Programming** — editorial source of truth for exhibitions and new programming
- **Supabase announcements/workshops** — existing operational content during transition

When the same title + start date exists in both, **Airtable wins** on dedupe. Do not delete Supabase announcements until each program is migrated and verified.

### Coming soon exhibitions

Set `Status` = `coming_soon` for programs not yet open. Event cards show a **Coming soon** badge plus the date range (e.g. Jul 8 – Oct 4, 2026). Keep `Summary` short until more details are ready; expand `Description` later in Airtable.

## Environment variables

Per-org pattern (`oolite` → `OOLITE`):

```bash
# Reuse alumni/base token when shared
AIRTABLE_OOLITE_PROGRAMMING_BASE_ID=appBvA0pWq9XkthTc
AIRTABLE_OOLITE_PROGRAMMING_TABLE_ID=tblY3pg6ksCWgsp9F
AIRTABLE_OOLITE_PROGRAMMING_ORG_RECORD_ID=recRiKB2W96uzTfY0

# Optional: client-side org name match when ORG_RECORD_ID unset
AIRTABLE_OOLITE_PROGRAMMING_ORG_NAME=Oolite Arts

# Optional view + field overrides
AIRTABLE_OOLITE_PROGRAMMING_VIEW_ID=
AIRTABLE_OOLITE_PROGRAMMING_FIELD_TITLE=Title
```

Legacy Oolite fallback (no org token):

```bash
AIRTABLE_PROGRAMMING_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appBvA0pWq9XkthTc
AIRTABLE_API_KEY=pat...
```

API key resolution order: `AIRTABLE_{ORG}_PROGRAMMING_API_KEY` → `AIRTABLE_ALUMNI_API_KEY` → `AIRTABLE_API_KEY`.

## Code map

| Module | Role |
| ------ | ---- |
| `lib/airtable/programming-config.ts` | Env + field map |
| `lib/memory-agent/airtable-programming.ts` | Fetch + map rows → `KnowledgeRecord` |
| `lib/memory-agent/programming.ts` | Merge Airtable + Supabase + dedupe |
| `lib/memory-agent/programming-fixtures.ts` | Test fixtures (`From Within`, `Sites of the Self`) |
| `data/oolite-programming-seed.json` | Editorial seed data for Airtable import |
| `scripts/import-oolite-programming.ts` | JSON → Airtable import utility |

## Dedupe rules

When the same program exists in Airtable and Supabase:

1. Match key: normalized `title` + `startDate` (YYYY-MM-DD)
2. **Airtable wins** over Supabase announcements/workshops
3. Higher `Priority` wins within the same source tier

## Setup checklist

1. Create `Programming` table with fields above (done — `tblY3pg6ksCWgsp9F`)
2. Link `Organization` → Institutions (`recRiKB2W96uzTfY0` = Oolite Arts)
3. Copy env vars into `.env.local` (table + org IDs; base falls back to `AIRTABLE_OOLITE_ALUMNI_BASE_ID`)
4. Create Airtable field options (tags, record types, statuses):

```bash
npm run setup:oolite-programming-options
# preview: npx tsx scripts/setup-oolite-programming-options.ts --dry-run
```

5. Upsert seed exhibitions (safe to re-run — updates by title, no duplicates):

```bash
npm run import:oolite-programming
```

6. Restart dev server
6. Open Memory Agent with `?dev=1` — confirm **Programming records found: 2**
7. Hit `/api/organizations/by-slug/oolite/memory-agent/status` — confirm `airtableProgrammingConfigured: true` and `airtableProgrammingRecords: 2`
8. Ask: *What exhibitions are coming up?*

## Seed rows (Oolite)

### From Within

- **Record Type:** exhibition  
- **Status:** coming_soon  
- **Dates:** 2026-07-08 → 2026-10-04  
- **Location:** Oolite Arts Vitrine · 924 Lincoln Rd., Miami Beach, FL 33139  
- **Featured Artists:** Ana Blanco; Noa Garcia; Emely Yanji; Melina Walsh; TJ Wright  
- **Image:** `https://res.cloudinary.com/dkod1at3i/image/upload/v1780505821/teens-resident-TJ-PHOTO-scaled_diiopj.jpg`  
- **Smart Sign Eligible:** yes · **Public AI Approved:** yes · **Priority:** 8  

### Sites of the Self

- **Record Type:** exhibition  
- **Status:** coming_soon  
- **Dates:** 2026-07-08 → 2026-10-04  
- **Curator:** René Morales, Senior Curatorial Fellow, Bakehouse Art Complex  
- **Featured Artists:** Diego Gabaldon; Gonzalo Hernández; … (full resident cohort)  
- **Image:** `https://res.cloudinary.com/dkod1at3i/image/upload/v1780506079/sites-of-the-self-28A69007-7EDE-4518-9C0F-DE5D25C9098E_jy7j09.jpg`  
- **Smart Sign Eligible:** yes · **Public AI Approved:** yes · **Priority:** 10  

## Manual QA questions

After seeding Airtable:

| Question | Expected |
| -------- | -------- |
| What exhibitions are coming up? | From Within + Sites of the Self with dates and Vitrine location |
| What is on view this summer? | Both July–Oct 2026 exhibitions |
| What should go on the smart sign this summer? | Sites of the Self first (priority 10), then From Within; no invented RSVP |
| Tell me about Sites of the Self | Curator René Morales + resident artist list when in context |

Supabase-only announcements should still appear when **not** duplicated in Airtable.

# Multiple Airtable bases (budget + alumni)

The app uses the same [Airtable REST API](https://airtable.com/developers/web/api/introduction) for different products. Each product is a **base** (`app…`) and one or more **tables** (`tbl…` or encoded table names). A single **Personal Access Token** (PAT) can access every base it has been granted access to.

## Shared HTTP layer

- `lib/airtable/client.ts` — `fetchAllRecords` (optional `viewId` / `filterFormula`), `patchAirtableRecord`, `isAirtableConnectionConfigured`
- `lib/airtable/org-alumni-config.ts` — per-org alumni env resolver
- `lib/airtable/budget-service.ts` — budget line items (existing env + behavior)
- `lib/airtable/alumni-service.ts` — alumni directory (separate base/table per org)

Never expose the PAT to the browser; only server routes and scripts should call Airtable.

## Budget (Oolite)

| Variable | Purpose |
|----------|---------|
| `AIRTABLE_API_KEY` | PAT with read (and optional write for Purpose sync) on the budget base |
| `AIRTABLE_BASE_ID` | Budget base id |
| `AIRTABLE_BUDGET_TABLE_ID` | Main budget table |
| `AIRTABLE_SUMMIT_TABLE_ID` | Optional separate table for summit / Digital Conference |
| `AIRTABLE_FIELD_*` | Optional column name overrides (see `budget-service.ts`) |
| `AIRTABLE_VALUE_DIGITAL_LAB` / `AIRTABLE_VALUE_DIGITAL_CONFERENCE` | Optional single-select values for bucket filter |

## Alumni (multi-org)

Org slug is turned into an env token: **uppercase**, hyphens → underscores (e.g. `oolite` → `OOLITE`, `mad-arts` → `MAD_ARTS`).

### Per-org variables (preferred)

Replace `{ORG}` with that token, e.g. for Oolite Arts:

| Variable | Example (Oolite alumni base) |
|----------|------------------------------|
| `AIRTABLE_{ORG}_ALUMNI_BASE_ID` | `appBvA0pWq9XkthTc` |
| `AIRTABLE_{ORG}_ALUMNI_TABLE_ID` | `tblLvTGxkv6pHoUvp` |
| `AIRTABLE_{ORG}_ALUMNI_API_KEY` | Optional PAT; if omitted, `AIRTABLE_ALUMNI_API_KEY` then `AIRTABLE_API_KEY` |
| `AIRTABLE_{ORG}_ALUMNI_VIEW_ID` | Optional; list records scoped to this view (e.g. `viwdItH4CtoSi4vzJ`) |
| `AIRTABLE_{ORG}_ALUMNI_FIELD_NAME` | Optional; overrides Airtable column name for that semantic field |

**Semantic fields** (each optional to override; defaults in parentheses):

| Env suffix | Default Airtable name | Used for |
|------------|----------------------|----------|
| `FIELD_NAME` | Name | Required display name |
| `FIELD_EMAIL`, `FIELD_PHONE` | Email, Phone | Contact |
| `FIELD_COHORT`, `FIELD_PROGRAM`, `FIELD_YEAR` | Cohort, Program, Year | Filters, sort, grouping |
| `FIELD_NOTES` | Notes | General notes |
| `FIELD_WEBSITE` | Website | External portfolio / site link |
| `FIELD_TOPICS` | Topics | Multi-select or comma-separated tags; topic filter on `/o/.../alumni` |
| `FIELD_MEDIUM` | Medium | Discipline; also used for “video” detection with `FIELD_VIDEOART` |
| `FIELD_ARTIFACTS` | Artifacts | Long text: work produced at Oolite (shown as “Work at Oolite”) |
| `FIELD_DIGITALARTIST` | Digital artist | Checkbox → “Digital artists” filter |
| `FIELD_INCOLLECTION` | In collection | Checkbox → “In collection” filter |
| `FIELD_VIDEOART` | Video art | Checkbox; combined with medium containing “video”, “film”, “moving image” |

Concrete Oolite example:

```env
AIRTABLE_OOLITE_ALUMNI_BASE_ID=appBvA0pWq9XkthTc
AIRTABLE_OOLITE_ALUMNI_TABLE_ID=tblLvTGxkv6pHoUvp
# Optional:
# AIRTABLE_OOLITE_ALUMNI_VIEW_ID=viwdItH4CtoSi4vzJ
```

### Legacy flat variables (Oolite only)

If **prefixed** `AIRTABLE_OOLITE_ALUMNI_*` vars are not set, **org `oolite`** still resolves from:

| Variable | Purpose |
|----------|---------|
| `AIRTABLE_ALUMNI_BASE_ID` | Alumni base id |
| `AIRTABLE_ALUMNI_TABLE_ID` | Alumni table id or name |
| `AIRTABLE_ALUMNI_VIEW_ID` | Optional view id or name |
| `AIRTABLE_ALUMNI_API_KEY` | Optional; else `AIRTABLE_API_KEY` |
| `AIRTABLE_ALUMNI_FIELD_NAME` | Default: `Name` (and same `_*` set as above) |

Other org slugs **do not** use this legacy block; they require `AIRTABLE_{ORG}_ALUMNI_*`.

## API

- **Budget**: `GET /api/organizations/by-slug/[slug]/budget` (Airtable when configured for `oolite`)
- **Alumni**: `GET /api/organizations/by-slug/[slug]/alumni/airtable` — returns `{ organizationSlug, supported, configured, count, alumni }`. `configured` is true only when that org’s alumni env resolves. `502` if env is present but the Airtable request fails.

## UI

- **Alumni page**: `/o/[slug]/alumni` (e.g. `/o/oolite/alumni`) loads data on the **server** via `fetchAlumniFromAirtable(slug)` (same source as the JSON route). The UI supports **search**, **sort** (name, year, cohort), **group by** (cohort, year, program), **cohort/year/topic** dropdowns, and toggles for **digital artists**, **in collection**, and **video / moving image** when the mapped columns exist. Add auth if the directory should not be public.

See also `docs/AIRTABLE_BUDGET_AUDIT.md` if present for budget-specific notes.

# Data seed & migration safety registry

Use this file before running any script against **shared, staging, or production** databases.  
Goal: **no silent loss** of prior months’ rows—know what each tool does.

## Risk levels

| Level | Meaning |
|--------|---------|
| **safe** | Upsert / insert-only / update by stable key; does not delete unrelated rows. |
| **mutating** | Overwrites or deactivates **specific** rows it knows about (e.g. by title); read the script. |
| **destructive** | **Deletes** a whole slice of data (often entire org) then replaces; treat like a reset for that slice. |

## npm scripts (`package.json`)

| Script | What it runs | Risk |
|--------|----------------|------|
| `workshops:seed` | `seed-oolite-workshops-catalog.js` (after compile) | **safe** (upsert by workshop `metadata.slug`) |
| `seed:oolite-adult-classes` | workshop seed + `upsert-oolite-adult-art-classes-spring-2026.js` | **safe** / **mutating** (announcements upsert by title for that JSON set) |
| `seed:oolite-adult-classes-announcements` | adult-class announcements only | **mutating** (same) |
| `seed:oolite-residents` | `upsert-oolite-studio-residents-2026.js` | **mutating** (artists + announcements for that program; read file) |
| `seed:oolite-artists` | `populate-oolite-artists.js` | **destructive** (see below) |
| `seed:oolite-announcements-2026` | `update-oolite-announcements-2026.js` | **mutating** (upsert by title; see `archiveTitles` in file) |
| `db:sync` | `database-sync.js` | **destructive** if `clearExisting` path is used |
| `db:artists` | `populate-artists.js` | verify file (legacy) |

## Destructive: full org replace (artists)

These scripts **delete all `artist_profiles` for the target organization** (after resolving org by slug or id), then insert the bundled catalog. **Any manually added artists or other months’ data in that org are removed.**

- `scripts/populate-oolite-artists.js` — Oolite (`slug: oolite`)
- `scripts/populate-bakehouse-artists.js` — Bakehouse

**Do not run** on production without backup and an explicit decision. Prefer **`upsert-oolite-studio-residents-2026.js`** for resident-driven updates when that matches your workflow.

## Mutating: announcements (Oolite 2026 master script)

- `scripts/data/seed/update-oolite-announcements-2026.js`
  - **Upserts by exact `title`** for rows in the script (updates existing, inserts new).
  - **Also sets `is_active: false`** for a hardcoded list of legacy titles (`archiveTitles` in file). That **hides** those announcements; it does not delete rows.
  - Safe for “other months” **only** in the sense that it does not wipe the table—but titles in `archiveTitles` are intentionally deactivated.
  - **Run** against the target Supabase project: `npm run seed:oolite-announcements-2026` (requires `.env.local` URL + service role). The app **only shows rows that exist in `announcements`**; the repo script is not applied automatically.
  - **Film poster rows** use `type: 'cinematic'` (migration `20260409130000_announcements_type_cinematic.sql` adds the type and can migrate narrow `promotion` rows with film/poster tags or `metadata.image_only`). Older DBs need `20260408130000_announcements_expand_type_check.sql` first, then the cinematic migration, then re-run the seed.

### Smart sign QR / scan URLs

- Column **`qr_destination_url`** (migration `20260409120000_add_qr_destination_url_to_announcements.sql`): optional HTTPS target for the stable route **`/o/{orgSlug}/announcements/{id}/scan`**, which redirects (302) after validation. If unset, **`primary_link`** is used when valid.
- Seeds often set **`primary_link: '#'`** as a placeholder; those rows **will not** show a QR until you set real `https://` URLs in the admin edit form or in the seed object.
- Production: set **`NEXT_PUBLIC_SITE_URL`** (see `lib/marketing/site-url.ts`) so encoded QR origins match the public hostname if the sign is opened from a non-canonical host.

### Smart sign display program (timed segments)

- The display route `app/o/[slug]/announcements/display/page.tsx` uses a versioned JSON **DisplayProgram** (`lib/display/display-program.ts`): carousel, fullscreen announcement, and 3-column grids for workshops, artists, and cinematic announcements.
- **V1 persistence**: `localStorage` key `display-program:v1:{orgSlug}`, optional kiosk URL `?program=` (base64url JSON). The same JSON shape can later be stored in `screens.settings` or playlist metadata when wired to the display control plane (`lib/display-plane/resolver.ts`).
- **Single-segment preview**: query `?view=` with one of `announcement_carousel`, `announcement_fullscreen`, `grid_workshops`, `grid_artists`, or `grid_cinematic` locks the page to that layout (no rotation). If both `program` and `view` are present, **`program` wins**. Optional `announcementId=` with `view=announcement_fullscreen` targets a specific row.
- **Calendar month on announcement segments**: segment param `displayCalendarMonth` (YYYY-MM, e.g. `2026-04`) limits the **carousel**, **fullscreen** pool, and **cinematic** grid to announcements whose date anchors fall in that month (`lib/display/announcement-month.ts`). **Workshop** and **artist** grids are unchanged. Default month is `SMART_SIGN_DEFAULT_DISPLAY_MONTH` in `lib/display/display-program.ts`.
- **Audit / bulk deactivate by month** (mutating with `--apply`): `npm run audit:announcements-display-month -- --org=oolite --month=2026-04` prints a TSV (ids, month key, protected flag, title, description snippet). With `--apply`, sets `is_active: false` for active rows whose month ≠ target **excluding** workshop-class and artist/resident listing rows (`lib/display/announcement-deactivate-guards.ts`). Rows with no derivable month key are listed but not auto-deactivated.

## Safe / mostly additive (announcements & workshops)

| Script | Notes |
|--------|--------|
| `scripts/data/seed/seed-oolite-workshops-catalog.js` | Upsert workshops by `metadata->>slug`. |
| `scripts/data/seed/upsert-oolite-adult-art-classes-spring-2026.js` | Upsert announcements for adult classes **by title** from JSON. |
| `scripts/data/seed/add-march-oolite-announcements-2026.js` | Inserts (skips duplicates per script logic). |
| `scripts/data/seed/add-miami-film-fest-announcements-2026.js` | Insert batch. |
| `scripts/data/seed/add-crossing-the-bridge-announcements.js` | Insert batch. |
| `scripts/data/seed/update-announcement-dates-and-images.js` | Targeted updates. |
| `scripts/data/seed/update-miami-film-fest-images.js` | Targeted updates. |
| `scripts/data/seed/create-oolite-announcements.js` | Large insert (check idempotency before re-run). |
| Other `scripts/data/seed/*.js` | Open the file header; most are insert/upsert for a named campaign. |

## Other destructive tooling

| Location | Risk |
|----------|------|
| `scripts/database-sync.js` | `importTableData(..., clearExisting = true)` runs **delete all** on the target table (see `.neq('id', '00000000-...')` pattern). |
| `scripts/populate-sample-surveys.js` | If any survey exists, deletes **every row** in `surveys` (whole table), then inserts samples. |
| `scripts/cleanup-duplicate-announcements.sql` | **DELETE** statements—run only with review. |
| `scripts/database/migrations/cleanup-*.sql` | One-off **DELETE**; not part of normal seeding. |
| `supabase db reset` | **Wipes local DB** and reapplies migrations + `supabase/seed.sql`. |

## Operational rules (recommended)

1. **Production**: never run **destructive** scripts without backup + written intent. Prefer **safe** upsert scripts and app/API edits.
2. **Staging**: mirror production policy; use dumps or branches if you need to test destructive flows.
3. **Local**: `db reset` is expected to wipe data; anything pointing at **remote** `.env.local` uses **remote** data—treat like staging.
4. When adding a new seed script, add a row to this file and tag the file header with `DATA_SEED_SAFETY:` (see `populate-oolite-artists.js`).

## Quick grep (find dangerous patterns)

```bash
rg -n "\\.delete\\(|DELETE FROM|TRUNCATE|clearExisting|Clearing" scripts supabase/migrations
```

Last reviewed: maintain this file when adding or changing seed/sync scripts.

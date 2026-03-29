# Oolite Announcements Data Ingestion

## Overview

Announcements for the Oolite organization are stored in the `announcements` table and linked via `org_id` to the organization with `slug = 'oolite'`.

## Data Ingestion Methods

### 1. Add-only script (no title-based deduplication)

**Script:** `scripts/data/seed/add-march-oolite-announcements-2026.js`

- **Purpose:** Add new announcements without updating existing ones.
- **Deduplication:** Skips only if the exact `image_url` already exists for this org (prevents accidental double-add when re-running).
- **Use when:** Adding a small set of new announcements (e.g., March 2026 images).

```bash
node scripts/data/seed/add-march-oolite-announcements-2026.js
```

### 2. Full update/upsert script (title-based)

**Script:** `scripts/data/seed/update-oolite-announcements-2026.js`

- **Purpose:** Sync the full canonical set of Oolite announcements.
- **Deduplication:** Matches by `title`; updates existing rows, inserts new ones.
- **Use when:** Refreshing all announcements or adding many at once.

```bash
node scripts/data/seed/update-oolite-announcements-2026.js
```

### 3. API (POST)

**Endpoint:** `POST /api/organizations/by-slug/oolite/announcements`

- **Purpose:** Create announcements via the app (requires auth).
- **Deduplication:** None; each request creates a new row.

## Schema (relevant fields)

| Field           | Type   | Notes                                      |
|----------------|--------|--------------------------------------------|
| org_id         | UUID   | Required; links to `organizations.id`      |
| title          | TEXT   | Required                                   |
| body           | TEXT   | Main content                               |
| image_url      | TEXT   | Cloudinary or other image URL              |
| image_layout   | TEXT   | e.g. `card`, `hero`, `split-left`          |
| status         | TEXT   | `published` for visible announcements     |
| type           | TEXT   | e.g. `news`, `event`                       |
| sub_type       | TEXT   | e.g. `general`, `exhibition`               |
| visibility     | TEXT   | `public` for carousel/display               |
| is_active      | BOOLEAN| Must be true for display                   |
| published_at   | TIMESTAMPTZ | When published                         |

## Deduplication Summary

| Layer              | Behavior                                                                 |
|--------------------|--------------------------------------------------------------------------|
| Add script         | Skips insert if `image_url` already exists for org                       |
| Update script      | Upserts by `title` (update existing, insert new)                          |
| Carousel (client)   | Dedupes by `id` to avoid showing same announcement twice in one fetch    |
| Cleanup SQL        | `scripts/cleanup-duplicate-announcements.sql` removes duplicate titles   |

## Checking for Duplicates

Run this SQL to find duplicate titles for Oolite:

```sql
SELECT title, COUNT(*) as cnt, array_agg(id) as ids
FROM announcements
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
GROUP BY title
HAVING COUNT(*) > 1;
```

To find duplicate `image_url`:

```sql
SELECT image_url, COUNT(*) as cnt, array_agg(title) as titles
FROM announcements
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
  AND image_url IS NOT NULL
GROUP BY image_url
HAVING COUNT(*) > 1;
```

## March 2026 Images Added

| Image filename                                      | Title                                      |
|-----------------------------------------------------|--------------------------------------------|
| march-oolite-crossing-the-bridge-opening-reception-recap | Crossing the Bridge: Opening Reception Recap |
| march-oolite-coming-up-weekly-curatorial-tours       | Coming Up: Weekly Curatorial Tours         |
| march-oolite-alumni-grant-winner-honoring-dan-weitendorf | Alumni Grant Winner: Honoring Dan Weitendorf |

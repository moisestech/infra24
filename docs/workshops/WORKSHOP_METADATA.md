# Workshop `metadata` (JSONB)

Rich marketing and future LMS fields live in `workshops.metadata` alongside core columns (`title`, `description`, `level`, etc.).

## Slug uniqueness

- **`metadata.slug`** must be **unique per `organization_id`**.
- Public URLs use `/o/{orgSlug}/workshops/{slug}` when set; otherwise the workshop UUID is used.
- **Short marketing URL**: `/workshops/{slug}` redirects to `/o/{defaultOrg}/workshops/{slug}`. Set `NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG` (default `oolite`) to choose the catalog org.
- Use **lowercase kebab-case** (e.g. `vibe-coding-net-art`). Avoid spaces and special characters beyond hyphens.

## Roadmap fields (optional)

- **`track`**: `presence` | `ai_literacy` | `creative_coding` | `systems_archive` — used for detail badges and org workshop list filters.
- **`buildPriority`**: integer 1–99 — roadmap ordering (lower = build first).
- **`placeholderImagePrompt`**: string — brief for batch image generation; not shown on the public page by default.
- **`packetConcept`**: string — long-form packet / async primer; shown on the workshop detail page when set.

## Digital Lab catalog (`/o/{org}/workshops/digital-lab`)

Optional fields for the Digital Lab workshop catalog filters, cards, and sorting. All are optional; the catalog derives sensible defaults from `status`, `level`, and `duration_minutes` when omitted.

| Field | Type | Purpose |
|-------|------|---------|
| `catalog` | `digital_lab` | Explicit membership in the Digital Lab catalog (rows with `track` already qualify). |
| `releaseStatus` | `website_ready` \| `in_development` \| `coming_soon` | Primary card badge and “Status” filter. Default: `published` → `website_ready`, `draft` → `in_development`, else `coming_soon`. |
| `sessionFormat` | `one_day` \| `series` \| `talk_demo` \| `clinic_lab` | “Format” filter (not the same as delivery `format`). |
| `marketingLevel` | `beginner` \| `beginner_intermediate` \| `intermediate` \| `advanced_experimental` | “Level” filter; default inferred from DB `level`. |
| `packetStatus` | `strategy_defined` \| `homepage_ready` \| `syllabus_ready` \| `packet_in_progress` \| `packet_ready` \| `lms_ready` | Secondary badge + “Packet Status” filter. |
| `websiteReadiness` | `ready` \| `needs_build` | “Website” filter. |
| `resourcesAvailability` | `packet_available` \| `packet_coming_soon` | “Resources” filter + secondary badge. |
| `durationBucket` | `two_h` \| `two_to_three_h` \| `three_h` \| `three_to_four_h` | Chip override; if omitted, derived from `duration_minutes`. |

**Audience:** reuse `audienceTags` with slugs such as `artists`, `teaching_artists`, `residents`, `educators`, `interdisciplinary_practitioners`, `arts_organizations` (see `lib/workshops/digital-lab-catalog-constants.ts`).

## Markdown authoring (preferred)

- Edit **`content/catalog/<org>/<slug>/marketing.md`** — see [`content/catalog/README.md`](../../content/catalog/README.md) for the frontmatter contract and [`CATALOG_VS_LEARN_SLUGS.md`](./CATALOG_VS_LEARN_SLUGS.md) for aligning Learn folders with slugs.
- **`npm run workshops:compile`** regenerates [`data/workshops/oolite-first-eight.json`](../../data/workshops/oolite-first-eight.json) and validates `metadata` with the Zod schema.
- **`npm run workshops:seed`** runs compile, then seeds Supabase (`scripts/data/seed/seed-oolite-workshops-catalog.js`).
- To regenerate MD from JSON once: `node scripts/build/export-json-to-marketing-md.js`.

## Catalog JSON & related workshops

- Generated output: [`data/workshops/oolite-first-eight.json`](../../data/workshops/oolite-first-eight.json) (`organizationSlug` + `workshops[]`). Commit this file so PRs show copy diffs without running compile.
- Author **`relatedSlugs`** per workshop (sibling to `metadata` in JSON; top-level array in MD frontmatter). The seed script resolves them to **`relatedWorkshopIds`** after upsert. Do not hand-edit UUIDs in source files.

## Validation

Application code validates with `workshopMarketingMetadataSchema` in [`lib/workshops/marketing-metadata.ts`](../../lib/workshops/marketing-metadata.ts). Seed scripts should produce objects that pass strict parse.

## LMS migration

Optional fields (`lmsCourseId`, `modulesPreview`, `resourceLinks`) are placeholders until courses live in a dedicated LMS schema. The workshop row remains the catalog anchor.

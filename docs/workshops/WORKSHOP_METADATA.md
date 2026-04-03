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

# Marketing workshop catalog (authoring)

Source of truth for **public org workshop pages** (listing + detail copy) before seeding to Supabase.

## Layout

```
content/catalog/<organizationSlug>/<workshop-slug>/marketing.md
```

- **Folder name** must equal `metadata.slug` in the file (the compile script enforces this).
- **Learn content** (syllabus, chapters) stays under `content/workshops/` and may use different folder names until aligned; see [docs/workshops/CATALOG_VS_LEARN_SLUGS.md](../../docs/workshops/CATALOG_VS_LEARN_SLUGS.md).

## File format

Each `marketing.md` is [gray-matter](https://github.com/jonschlinkert/gray-matter): YAML frontmatter + Markdown body.

**Frontmatter**

- Row fields (Supabase columns): `title`, `description`, `category`, `level`, `duration_minutes`, `max_participants`, `price`, `instructor`, `outcomes`, `prerequisites`, `materials`, `featured`, `status`, `is_active`, `is_public`, `slug`.
- `relatedSlugs`: string array (resolved to UUIDs by the seed script).
- `metadata`: object validated by `workshopMarketingMetadataSchema` in `lib/workshops/marketing-metadata.ts` (subtitle, format, track, agenda, faq, ctas, etc.).

**Body**

- Becomes the workshop row `content` field (“About this session”). Plain text or Markdown; the detail page currently renders it as pre-wrapped text.

## Pipeline

1. Edit `marketing.md` files under `content/catalog/<org>/`.
2. `npm run workshops:compile` — writes `data/workshops/oolite-first-eight.json` (for `oolite`) and validates metadata.
3. `npm run workshops:seed` — compile then `node scripts/data/seed/seed-oolite-workshops-catalog.js`.

To bootstrap MD from an existing JSON catalog once:

`node scripts/build/export-json-to-marketing-md.js [path/to/catalog.json]`

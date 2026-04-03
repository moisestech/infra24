# Catalog slug vs Learn content folders

## Marketing catalog

Public workshop pages and seed data use **`metadata.slug`** (kebab-case). Authoring lives in:

`content/catalog/<org>/<slug>/marketing.md`

The folder name **must** match `metadata.slug` (enforced by `scripts/build/compile-workshop-catalog.ts`).

## Learn / filesystem workshops

Optional syllabus and chapters live under:

`content/workshops/<path>/`

Paths may historically differ from the marketing slug. **Aligned:**

| Marketing slug (`metadata.slug`) | Learn folder (Oolite) |
|----------------------------------|------------------------|
| `own-your-digital-presence` | `content/workshops/oolite/own-your-digital-presence/` (renamed from `digital-presence-workshop`) |
| `seo-workshop` | `content/workshops/oolite/seo-workshop/` |

When adding a new workshop, use the **same** slug for both trees so future `/learn` wiring and deep links stay consistent.

## SEO workshop title

The row **`title`** in marketing MD/JSON is the public name (e.g. “SEO for Artists in the Age of AI Search”). The **slug** remains `seo-workshop` for stable URLs and idempotent seeds.

# Culture record packet

Org status (living report): [`docs/dcc/STATUS.md`](../../../docs/dcc/STATUS.md).

One page for ChatGPT, humans, and Cursor. Fill a packet, then edit **one** registry file. Do not invent blank fields.

## Namespaces — pick one per change

| NAMESPACE | Source of truth | Public routes | Do not mix with |
|---|---|---|---|
| `culture` | `lib/dcc/culture/{artists,programs,editorial,projects}.ts` | `/artists`, `/programs`, `/journal` | civic `/projects`, `/fabricate` |
| `studios` | `lib/dcc/studios/tours.ts` | `/knight#knight-founders-360` | culture artists until a slug is published |
| `fabricate` | `lib/dcc/fabrication/*` | `/fabricate/*` | workshop curriculum, culture records |
| `civic-projects` | `lib/cdc/routes.ts` `PROJECT_ENTRIES` | `/projects` | culture `DCC_PROJECTS`, `/fabricate/projects` |

Commit rule: one namespace per commit. Paste this header on every Cursor / ChatGPT handoff:

```
NAMESPACE: culture | fabricate | civic-projects | studios
INTENT: add-record | update-copy | swap-image | ux-motion | do-not-touch
RECORD: id / slug
FACTS CONFIRMED:
FACTS UNKNOWN: leave empty
IMAGES: Cloudinary public_id or path + alt
MOTION: none | gated-on-this-surface
CURSOR MUST NOT: invent names, partners, prices in workshops, Airtable
```

## Where to edit

| Record | File | Publish helper |
|---|---|---|
| Artist | `artists.ts` → `DCC_ARTISTS` | `status: 'published'` (default) |
| Program | `programs.ts` → `DCC_PROGRAMS` | `status` not `draft` |
| Journal | `editorial.ts` → `DCC_EDITORIAL` | `status: 'published'` |
| Culture work | `projects.ts` → `DCC_PROJECTS` | attaches to artist/program/journal pages only |
| 360 tour | `lib/dcc/studios/tours.ts` | swap `embedSrc`, `title`, `artistSlug` |

Cross-links: set IDs only (`programIds`, `artistIds`, …). Pages resolve via `lib/dcc/culture/relations.ts`.

Reserved artist slugs: `claim`, `create`. Do not use a UUID.

## Images

Prefer Cloudinary on the record (`portrait`, `heroImage`, alts).

```
dccmiami/artists/{slug}/
dccmiami/programs/{slug}/
dccmiami/journal/{slug}/
```

Local drop (force-add; `public/` is gitignored):

```
public/dcc/culture/artists/{slug}/portrait.webp
public/dcc/culture/artists/{slug}/hero.webp
public/dcc/culture/programs/{slug}/hero.webp
public/dcc/culture/editorial/{slug}/hero.webp
```

Empty image → honest fallback. No fake portraits. Hover / scale motion runs **only** when `heroImage` / `portrait` is set.

## Artist (minimum to publish)

- `id`, `slug`, `name`
- Optional: `location`, `shortBio`, `bio`, `practiceTags`, `portrait` + `portraitAlt`, `heroImage` + `heroImageAlt`, `websiteUrl`, `instagramUrl`, `programIds`, `featured`
- Studio 360: only if a row in `tours.ts` uses the **same** `artistSlug`. Do not publish founders as culture artists just because a tour exists.

## Program (minimum)

- `id`, `slug`, `title`, `type`, `status`, `node: 'DCC MIA'`
- Optional: dates, `locationName`, `heroImage`, `artistIds`, `description`
- Relation roles if shown: host / venue / teaching-venue / collaborator / client / peer / research-visit. **Partner only when formal.**
- Do not encode sales or commission until disclosed.

## Journal (minimum)

- `id`, `slug`, `title`, `type`, `status`
- Optional: `dek`, `publishedAt`, `author`, `body` or `bodyPath`, `heroImage`, `videoUrl`, `audioUrl`, `artistIds`, `programIds`
- No podcast product in this phase.

## Motion

- Surfaces with real media may hover / click-to-enter (homepage terms, Knight studios, cards **with** an image).
- Empty culture grids stay still.

## Preview after a drop

- `/` — Now band
- `/programs` and `/programs/art-fairs/clandestine-art-fair-2026`
- `/artists/{slug}`
- `/journal/{category}/{slug}`
- `/knight#knight-founders-360` for tours
- `/fabricate` — fabricate namespace only

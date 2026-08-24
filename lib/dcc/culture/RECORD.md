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
- Studio 360: only if a row in `tours.ts` uses the **same** `artistSlug`. Tours do not auto-publish culture artists. Founders on `/artists` were added by an explicit culture commit, not because a 360 existed.

## Founders vs Clandestine

- Moises, Fabiola, and Angelo may appear as culture artists without being the fair roster.
- Do **not** set `programIds: ['clandestine-2026']` or Clandestine `artistIds` until the participating artists are confirmed in a packet.
- Angelo has no studio tour — do not invent one.

## Clandestine artist packet (later)

Required before publishing a fair artist: preferred spelling, slug, 80–120 word short bio, location, 3–5 practice tags, website, Instagram.

Media: portrait; 3–5 works with artist-approved captions (title, year, medium, dimensions, photo credit).

Fair: which work(s), one paragraph on the selected work, why it belongs in the DCC presentation.

Editorial permissions: conversation, video, audio, transcript, approval expectations.

## Conversation spine (no podcast product)

Canonical artifact: website interview. Recurring questions:

1. What are you trying to understand through the work right now?
2. What technologies, systems, materials or conditions are affecting how you make it?
3. Where does producing the work become difficult?
4. What is currently working—or not working—about making art in Miami?
5. What do you wish existed here that currently doesn't?

Do not launch a podcast feed in this phase.

## Open Studios capture (ops, not a program record)

Do not add a `DccProgram` until date and venue are confirmed. If a live studio day happens, capture: studio photo/video, fabrication demo, short artist thought, documentary H2D hero if the machine is installed, finish samples, QR → `/?source=open-studios` or `/newsletter?source=open-studios`.

## Newsletter

Reuse `/newsletter`. Optional provider: `NEXT_PUBLIC_MARKETING_NEWSLETTER_FORM_ACTION`. Pass `?source=` (`home-now`, `artist-profile`, `clandestine`, `open-studios`, `journal`). Do not build a newsletter platform in the culture namespace.

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

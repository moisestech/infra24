# DCC MIA — living status

**Update this file every sprint.** It is the public-memory dashboard for ChatGPT, Cursor, and humans.

- **Not this file:** [`docs/PROJECT_STATUS.md`](../PROJECT_STATUS.md) and [`docs/CURRENT_STATUS_SUMMARY.md`](../CURRENT_STATUS_SUMMARY.md) are Dec 2024 Infra24 SaaS snapshots (booking, tenant orgs). Do not treat them as DCC MIA cultural status.
- **Record packet (one artist/program/journal change):** [`lib/dcc/culture/RECORD.md`](../../lib/dcc/culture/RECORD.md)
- **Culture content gaps:** [`lib/dcc/culture/CONTENT.md`](../../lib/dcc/culture/CONTENT.md)
- **Image production list (what to shoot, types, alternates):** [`IMAGE_SHOT_LIST.md`](./IMAGE_SHOT_LIST.md)
- **Fabricate image drop list:** [`public/dcc/fabrication/ASSETS.md`](../../public/dcc/fabrication/ASSETS.md)
- **Resin teaching stills:** [`docs/workshops/RESIN_PRINTING_MEDIA_SHOT_LIST.md`](../workshops/RESIN_PRINTING_MEDIA_SHOT_LIST.md)

**Do not invent:** artist names, bios, quotations, dates, venue, sales %, ITS3D partnership, documentary photos that do not exist.

---

## Snapshot

| Field | Value |
|---|---|
| Date | 26 August 2026 |
| Branch | `main` after education PR #5 (resin Cloudinary, technique boards, DCC offering stills) |
| Last culture commits | primitives → founder artists `0301f73` → offerings `1d7eb46` → public routes `09f96c0` |
| Working language | DCC MIA is a digital cultural center for artists working through the technological conditions of the present. |
| Culture records published | 1 program (Clandestine 2026). **3 artists** (Moises, Fabiola, Angelo — not attached to Clandestine). 0 journal entries. 0 culture projects. |
| Fabricate Phase 2 | Merging onto `main`: Field Lab, estimate planner, `/fabricate/projects`. Hero is **conceptual** (not documentary). |
| Images | **Filled vs not:** [`IMAGE_SHOT_LIST.md`](./IMAGE_SHOT_LIST.md) § Filled vs not. Teaching stills are conceptual; documentary fabricate/Clandestine/Bakehouse/class shots are not filled. |

### Namespace commit rule

One namespace per commit: `culture` / `studios` / `fabricate` / `civic-projects` / `education`. Do not mix fabrication pricing into workshop curriculum. Do not mix civic `/projects` with culture `DccProject` or `/fabricate/projects`.

Paste this header on Cursor / ChatGPT handoffs:

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

---

## Flywheel (architecture, not automation)

Artist → Program / Exhibition → Conversation + Documentation → Website → Instagram / Newsletter → Audience → Workshop / Fabrication / Institutions → Revenue + Relationships → New Artists / Programs.

A second loop exists for production: Project → Revenue → Production data → Documentation / SOP → Better capability.

The site stores the **records and links**. It does not auto-post to Instagram or sync Airtable in this phase.

---

## Public surfaces

| Route | Namespace | Image | Motion / interactivity | Status |
|---|---|---|---|---|
| `/` hero, collage, pathways | marketing | Real Cloudinary photography | Rotating headlines (reduced-motion aware); card hover scale | Shipped |
| `/` `#now` band | culture | None (text slots) | Links only | Shipped; Artist slot shows featured founder (Moises); Journal still hidden |
| `/artists` | culture | Knight / Edge Zones portraits | Hover when `src` exists | Three founders published; not a Clandestine roster |
| `/artists/[slug]` | culture | Portrait + hero where confirmed | Hover with `src`; 360 on Moises + Fabiola | Angelo has no tour |
| `/programs` | culture + CDC | Clandestine card has fallback | CardGrid hover on taxonomy cards | Shipped; Current/Upcoming + existing service catalog |
| `/programs/art-fairs/clandestine-art-fair-2026` | culture | No hero | Still; no fake gallery/testimonials | Program 001; known facts only |
| `/journal` | culture + CDC | None for DCC Conversations | CardGrid hover on category tiles | Shipped; empty conversations copy; no podcast |
| `/journal/conversations` | culture | None | Still | Empty on purpose |
| `/journal/[category]/[slug]` | CDC scaffold + culture | Title-only CDC posts | Culture body when a record exists | CDC shells still say body TBD |
| `/workshops` | education | Saturday Lab / vibe / IP banners plus two 3D catalog cards on conceptual educational stills | Live catalog client; org grid omitted when empty | Public 3D pair is 3D Printing for Artists + AI → 3D; resin is not a catalog card |
| `/workshop/3d-printing-for-artists` | education | Conceptual stills (`PRINT` `CLEANUP` `FINISH` `MEASURE` `COMPARE`) | Editorial page; inquiry via newsletter | HTML labels; caption **Conceptual educational image** |
| `/workshop/ai-3d-physical-object` | education | Conceptual stills (`MODEL` `IMAGINE` `PREPARE` `PRINT` `FINISH` `TEST` `OUTCOME`); PRINT reuses machine detail | Editorial page; inquiry via newsletter | Can land on PLA FDM or resin SLA |
| `/workshop/resin-printing` | education | Cloudinary banners `00–08`, concepts `107–135`, boards `200–214` | Workshop-engine clients (session/TV) | SLA syllabus engine; linked from the 3D pages, not a fifth catalog card |
| `/fabricate` | fabricate | Conceptual Cloudinary hero; local conceptual stills for lanes/pricing/access/quote; Cloudinary finish ladder `300–305` | Estimate planner; quote handoff | Hero is labeled conceptual, not Studio 43 documentary |
| `/fabricate/estimate` | fabricate | — | Calculator; $151 seed; “planning estimate, not an invoice” | Not a binding quote |
| `/fabricate/field-lab` | fabricate | Conceptual overhead joint-testing still | Capability maturity + public field tests | Peer/vendor notes stay unpublished |
| `/fabricate/projects` | fabricate | — | Three DCC test-case pages | Internal tests, not client commissions |
| `/projects` | civic-projects | Marketing cards/gradients | CardGrid hover | Infra24 civic proof — **do not take over** |
| `/knight#knight-founders-360` | studios | Posters + Momento360 | Click-to-enter 360 | Moises + Fabiola; no Angelo tour |
| `/for-artists` | marketing | — | Redirect | → `/network/signup?pathway=index` (join the map, not curated `/artists`) |

Hover rule for culture media: [`cultureMediaMotionEnabled`](../../lib/dcc/culture/media.ts) — empty frames stay still.

---

## What shipped in this conversation

### Culture (committed on this branch)

- Data: `lib/dcc/culture/*` (artists, programs, editorial, projects, relations, taxonomy, media)
- Nav cluster: Programs, Artists, Workshops, Fabricate, Journal, About (Era / Network / Projects / Partners / Grants kept)
- `/artists` is public (Clerk had been sending it to sign-in)
- Studio tours do **not** leak onto `/artists` until a matching published culture record exists (Moises + Fabiola now match; Angelo still has no tour)
- Tests: `__tests__/lib/dcc-culture.test.ts`, `__tests__/integration/dcc-culture-layer.spec.ts`

### Fabrication proof (this branch)

Field Lab, estimate planner ($151 seed — **planning estimate, not an invoice**), Learn→Test→Make flywheel, `/fabricate/projects` DCC tests, Scale Up evidence. Conceptual hero + field-lab stills wired and labeled. Documentary `01-fabricate-hero.webp` still missing.

### Studios (committed)

Moises Studio 43 + Fabiola 360s. Light `tone` on artist pages. Angelo: no tour — do not invent.

---

## Image inventory

Full production list (types, sizes, primary + alternate, make order): [`IMAGE_SHOT_LIST.md`](./IMAGE_SHOT_LIST.md).

### Culture — founder portraits; Clandestine still has no program images

Published artists reuse Knight / Edge Zones / homepage Cloudinary URLs. `DCC_EDITORIAL = []`, `DCC_PROJECTS = []`. Clandestine has no `heroImage`.

When new: `public/dcc/culture/artists/{slug}/` or Cloudinary `dccmiami/artists/{slug}/`.

### Studios — has posters + 360

- Moises: Momento360 + homepage `digitalDivinities` poster
- Fabiola: Momento360 + `fabiolaSurveillanceCutie2024` poster
- Angelo: none

### Homepage — has photography

[`lib/marketing/dcc-home-photography.ts`](../../lib/marketing/dcc-home-photography.ts). NOW band is text-only.

### Fabricate — mixed

- Missing documentary: `01-fabricate-hero.webp` (shop still)
- Conceptual Cloudinary hero wired on `/fabricate` (caption: not a documentary photo)
- Conceptual local: `02`, `03`, `05`, `06`
- Conceptual Cloudinary: finish 300 + L0–L4 (`301–305`); field-lab overhead still on `/fabricate/field-lab`

### Workshops — teaching stills

Eleven conceptual educational stills wired on `/workshop/3d-printing-for-artists` and `/workshop/ai-3d-physical-object` (registry: `lib/dcc/education/photo-stills.ts`). Resin banners / technique boards stay on the SLA syllabus hub. Fabricate hero + field-lab conceptuals are now wired on `/fabricate` (fabricate namespace). Not Clandestine artist portraits. No prices in curriculum images.

---

## Motion / interactivity vs still

**Moves:** homepage hero rotation; collage/pathway hover; studio click-to-enter; fabricate estimate/quote; workshop catalog/engine; culture card hover **only with a real `src`**.

**Stays still:** Clandestine skeleton, journal empty conversations, culture related lists, empty image frames.

**Do not build this phase:** Instagram generation, podcast product, live slicer/machine status, gallery checkout, Airtable culture sync.

---

## Content gaps (blocked on real facts)

- Three Clandestine participating artist names (founders on `/artists` are **not** that roster)
- Exact dates, location, DCC program statement
- Sales / commission terms (do not encode until disclosed)
- First DCC Conversation guests + recording/transcript
- Post-fair installation photography
- Longer founder bios / practice tags beyond Edge Zones one-liners

### Education / money (do not build checkout this sprint)

`/workshops` public catalog is the DCC sessions band (`lib/dcc/education/offerings.ts`: Saturday Lab, 3D Printing for Artists, AI → 3D Physical Object, Vibecoding & Net Art, IP in the Age of AI). Resin SLA stays at `/workshop/resin-printing` and is linked from the 3D pages — not a third 3D catalog card. **No prices, no invented capacity** on the new offerings. Enrollment is inquiry (`/newsletter?source=workshop-3d-printing-for-artists` / `workshop-ai-3d-physical-object`). The optional filterable org grid (`NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG`, default `oolite`) is omitted when that org is missing or empty — the public page must not show operator env-var copy.

**What is actually live for money**

- In-app workshop path: free RSVP / interest (`/api/workshop-registrations`). No card charge.
- Oolite paid Digital Lab: **QGiv / Bloomerang** (`lib/orgs/oolite/digital-lab-qgiv-offerings.ts`) — Infra24 promotes, QGiv converts.
- Stripe: code exists (`lib/stripe/service.ts`) but **checkout/webhook routes are disabled**. Not wired to workshops.
- Mercury: **not in the repo**.
- QuickBooks: **not in the repo** (Scale Up stays public numbers only).
- DCC OS Transactions: Airtable read for fabrication/ops, not workshop tuition.

**Later compounding (ops intent, not encoded)**

1. Syllabus + capacity + inquiry (`/newsletter?source=workshops`) — this step.
2. A DCC-owned paid SKU only if QGiv is not the system of record (do not duplicate Oolite checkout).
3. Then: Stripe Checkout → Mercury → QuickBooks as books of record. Do not invent tax mapping in code until the entity is confirmed.

Architecture is ready: set IDs on records; pages resolve via `lib/dcc/culture/relations.ts`. Journal long form: `body` or `bodyPath` under `content/journal/<slug>.md`.

---

## Leftovers (ops, not invented content)

- Documentary `/fabricate` hero (`01-fabricate-hero.webp`); Bakehouse room still; resin kit/class/video; physical evidence 314 — see IMAGE_SHOT_LIST § Filled vs not
- Scale Up culture-flywheel numbers (public only; no QuickBooks)
- Newsletter: `/newsletter` exists; provider is `NEXT_PUBLIC_MARKETING_NEWSLETTER_FORM_ACTION` if set — no dedicated DCC list confirmed in-repo
- Optional later: flatten journal to `/journal/[slug]` (today `/journal/[category]/[slug]`)

**Non-goals:** podcast launch; Airtable culture schema; ITS3D lockup; merging `/projects` meanings; enabling Stripe checkout.

Local Next production build succeeded 24 Aug 2026 (`/artists` SSG for Moises, Fabiola, Angelo; `/workshops` offerings band). `tsc --noEmit` still fails on pre-existing files outside this branch.

---

## Open questions

1. Names of the three Clandestine participating artists (founders are published; fair roster is still unknown).
2. Exact Clandestine dates, venue, booth/program statement?
3. Sales: 0% artist-direct vs test 10–15% only if DCC invoices — encode later?
4. First Conversation: who, and is the website interview the canonical artifact?
5. Homepage H1: keep service/infra hero, or lean harder into the cultural-center line?
6. Instagram five pillars (Artists / Programs / Lab / Production / Learn): ops doc only, or metadata on records?
7. Which email provider should `/newsletter` post to before Art Week?
8. DCC-owned workshop checkout: wait until a DCC SKU exists, or keep Oolite paid classes on QGiv?

---

## ChatGPT next-sprint prompt

Copy this after reading this file and the record packet:

> Read `docs/dcc/STATUS.md` and `lib/dcc/culture/RECORD.md`. DCC MIA is a small cultural org whose website is the public memory. Culture architecture is live; Clandestine is Program 001 with no participating artists yet. Founders (Moises, Fabiola, Angelo) are published on `/artists` and are not attached to the fair. Do not invent names. Propose the next two-week sprint: Clandestine content ops vs conversations vs homepage evolution. Rank by Content Yield (downstream assets per hour), not Instagram likes.

---

## How to update this file

1. Change the **Snapshot** date, branch, and last commit.
2. Update the **Public surfaces** row that actually changed (image / motion / status).
3. Move items from **Content gaps** to shipped only when records exist in `lib/dcc/culture/`.
4. Keep uncommitted work labeled uncommitted.
5. Commit STATUS.md with the namespace it describes (`culture` if the sprint was cultural; or a tiny docs-only commit).

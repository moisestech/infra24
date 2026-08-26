# DCC MIA — what we built and every image to make

Living org status: [`STATUS.md`](./STATUS.md). Culture packet: [`lib/dcc/culture/RECORD.md`](../../lib/dcc/culture/RECORD.md). Fabricate drop filenames: [`public/dcc/fabrication/ASSETS.md`](../../public/dcc/fabrication/ASSETS.md). Resin documentary IDs: [`docs/workshops/RESIN_PRINTING_MEDIA_SHOT_LIST.md`](../workshops/RESIN_PRINTING_MEDIA_SHOT_LIST.md).

Live on **main** / [dcc.miami](https://www.dcc.miami): culture ([PR #3](https://github.com/moisestech/infra24/pull/3)), `/workshops` empty-catalog fix ([PR #4](https://github.com/moisestech/infra24/pull/4)), resin Cloudinary + DCC offering stills ([PR #5](https://github.com/moisestech/infra24/pull/5)). Fabricate Phase 2 (estimate planner, `/fabricate/projects`) is still on sibling `feature/dcc-fabricate-phase2` and is **not** on production.

**Hard rules for every frame:** no invented artist names; no prices, logos, or readable UI in fabricate/workshop stills; caption **conceptual** vs **documentary**; founders on `/artists` are **not** the Clandestine roster.

```mermaid
flowchart LR
  home["/"] --> now["Now band"]
  home --> collage["Hero collage"]
  now --> programs["/programs"]
  now --> artists["/artists"]
  now --> workshops["/workshops"]
  now --> fabricate["/fabricate"]
  now --> journal["/journal"]
  artists --> artistPage["/artists/slug"]
  artistPage --> tour["360 tour if exists"]
  workshops --> threeD["/workshop/3d-printing-for-artists"]
  workshops --> ai3d["/workshop/ai-3d-physical-object"]
  workshops --> satlab["/workshop/saturday-lab"]
  threeD --> resin["/workshop/resin-printing"]
  fabricate --> quote["/fabricate/quote"]
```

---

## What we built (product, not images)

### Culture (live)

- Records in `lib/dcc/culture/`: programs, artists, editorial, projects, relations.
- **Program 001:** Clandestine Art Fair 2026 — known-facts skeleton, **no** `heroImage`, **no** `artistIds`.
- **3 published artists** (founders, not the fair): Moises (featured on `/` `#now`), Fabiola, Angelo. Bios are Edge Zones one-liners only.
- Routes: `/artists`, `/artists/[slug]`, `/programs`, `/programs/art-fairs/clandestine-art-fair-2026`, `/journal` (conversations empty on purpose).
- Studio 360s: Moises + Fabiola in [`lib/dcc/studios/tours.ts`](../../lib/dcc/studios/tours.ts). **Angelo: no tour — do not invent.**
- Clerk: `/artists`, `/workshops`, `/fabricate`, `/fabrication` → `/fabricate`, `/programs`, `/journal` are public.

### Education (live)

- DCC sessions band on `/workshops` from [`lib/dcc/education/offerings.ts`](../../lib/dcc/education/offerings.ts): Saturday Lab, **3D Printing for Artists**, **AI → 3D Physical Object**, Vibecoding & Net Art, IP in the Age of AI. **No prices.** Resin SLA is a path inside 3D printing (`/workshop/resin-printing`) — not a fifth catalog card. The two 3D cards use conceptual educational stills from [`lib/dcc/education/photo-stills.ts`](../../lib/dcc/education/photo-stills.ts). The optional org-catalog grid is omitted when that slug is missing — the page must not show operator env-var copy.
- Resin engine stays the SLA syllabus: **conceptual** Cloudinary banners `00–08`, instructional `107–135`, technique boards `200–214` (not shop photos, not catalog heroes).

### Fabricate (partially live)

- On **main (this pass):** `/fabricate`, `/pricing`, `/finishes`, `/quote`, `/estimate`, `/field-lab`, `/projects`. Conceptual hero + field-lab stills wired from Cloudinary (labeled not documentary). Local conceptual stills `02/03/05/06`. Finish ladder `300–305` on Cloudinary.
- Documentary `01-fabricate-hero.webp` is still missing.

---

## Filled vs not (26 Aug 2026)

What we can **deliver today** vs what is still empty. Conceptual teaching stills count as filled. Documentary room/class/shop photos do not, until they exist.

### Filled (wired, ships with the resin/education work)

| Slot | What is live | Kind |
|---|---|---|
| `/workshops#offerings` Saturday Lab | Cloudinary `01_start-here` | Existing lab banner |
| `/workshops#offerings` 3D Printing for Artists | Cloudinary conceptual stills (`3d-printing-machine-detail` + series) | Conceptual educational |
| `/workshops#offerings` AI → 3D Physical Object | Cloudinary conceptual stills (`ai-3d-model-review` + series; PRINT reuses machine detail) | Conceptual educational |
| `/workshop/3d-printing-for-artists` | Same 3D printing stills, HTML labels (`PRINT` `CLEANUP` `FINISH` `MEASURE` `COMPARE`) | Conceptual educational |
| `/workshop/ai-3d-physical-object` | Same AI→3D stills, HTML labels (`MODEL` `IMAGINE` `PREPARE` `PRINT` `FINISH` `TEST` `OUTCOME`) | Conceptual educational |
| `/workshops#offerings` vibe-coding | Handbook catalog still `vibe-coding-with-net-art` | Existing banner |
| `/workshops#offerings` IP Age of AI | `IP_AGE_OF_AI_LANDSCAPE_BANNER_URL` | Existing banner |
| Resin hub + 9 module banners | Cloudinary `00–08` — SLA syllabus engine, not a catalog card | Conceptual ultra-wide |
| Instructional concepts | Cloudinary `107–135` | Conceptual |
| Technique boards | Cloudinary `200–214` | Conceptual |
| `oolite-resin-workshop-m00`…`m08` PNGs | Duplicate teaching-board class (same job as `200–214`, denser/infographic) | Conceptual infographic — **do not swap photographic pages to these** |
| Media shot list | Same banners/stills + local zone + workflow SVGs | Conceptual / diagram |
| Oolite venue page | Conceptual M7 Max still `120` — **not** a Studio 106 room photo | Conceptual |
| `/o/oolite/workshops` resin teaser | Same welcome banner | Conceptual |
| Founder portraits | Knight / Edge Zones (Moises, Fabiola, Angelo) | Documentary (approved) |
| Homepage collage | [`dcc-home-photography.ts`](../../lib/marketing/dcc-home-photography.ts) | Documentary |
| Studio 360 | Moises + Fabiola only | Existing tours |
| `/fabricate` hero | Cloudinary `01-fabricate-hero-conceptual-01` | Conceptual — not documentary |
| `/fabricate/field-lab` | Cloudinary `field-lab-joint-testing-overhead-conceptual-01` | Conceptual |
| `/fabricate` lanes/pricing/access/quote | Local `02/03/05/06` WebP | Conceptual |
| `/fabricate/finishes` hero + L0–L4 | Cloudinary `300–305` | Conceptual |

### Not filled (honest empty / placeholder — do not invent)

| Slot | Why empty | Blocked on |
|---|---|---|
| `01-fabricate-hero.webp` | Documentary shop hero still missing. Conceptual `01-fabricate-hero-conceptual-01` is **wired** on `/fabricate` and labeled conceptual | Real desk still with no people, no UI |
| Bakehouse venue still | Room TBD; page stays placeholder | Confirmed DCC/Bakehouse room + shot |
| `resin-hero-01` documentary, `resin-room-wide-01`, `resin-oolite-brand-01` | Hub uses welcome banner instead; no documentary room | DigiLab/Oolite stills with no readable UI |
| Kit trays `resin-kit-00` … `08` | IDs listed, no files | One tray per module |
| Physical evidence `310–315` | `310–313` present on CDN; **`314` missing** so the resin evidence sequence stays blocked; `315` metadata is ready | Cloudinary `314` (washed/cured) |
| Tutorial / class video loops | Placeholder slots, no `src` | Optional after a real class |
| `resin-tv-break-01`, `resin-tv-join-01` | Not drawn | Diagrams, not photos |
| Clandestine portraits / hang / program hero | Program 001 has **no** `heroImage`, **no** `artistIds` | Three participating names |
| `angelo-hero`, Angelo 360 | Portrait only; **no tour** | One work image; do not fake 360 |
| Journal / Conversations stills | Empty on purpose | First real guest |
| `/` `#now` thumbs | Text-only | Optional; reuse program/artist heroes when they exist |
| 3D Printing filament/material macro | Finish-comparison covers surface judgment; no dedicated filament still | Documentary or conceptual material close-up |

**Deliverable this week without documentary photography:** public `/workshops` with Saturday Lab / vibe / IP banners plus two 3D catalog cards on conceptual educational stills; editorial `/workshop/3d-printing-for-artists` and `/workshop/ai-3d-physical-object`; full resin teaching engine (banners, 107–135, 200–214) at the hub URL. **Not deliverable as documentary:** fabricate shop hero, Bakehouse room, Clandestine fair, class/kit photos. Filament/material macro still missing (finish-comparison covers surface judgment).

---

## Image types (use these labels on disk and in alt)

| Type | What it is | Label in UI |
|---|---|---|
| **Portrait** | Face / upper body, approved | Artist name |
| **Work documentation** | Installation or object, credit + year | Title (year) |
| **Program hero** | Booth / hang / fair context | Program title |
| **Selected work** | One object, 4:5, caption fields | Title, year, medium, credit |
| **Studio 360 poster** | Still that sits under click-to-enter | “Click to enter” |
| **Documentary process** | Real shop/fair/class; people need releases | Honest location/gear |
| **Conceptual illustration** | Teaching/marketing still, not a shop photo | “Conceptual — not a documentary photo” |
| **Teaching still** | Real gear, no people, no readable UI | Venue/module |
| **Kit pack shot** | Tray of teaching objects | Kit name |
| **Failure specimen** | **Fully cured** fail, labeled | Symptom name |
| **Diagram** | Floor plan / workflow graphic | No photo needed |
| **Ultra-wide banner** | 21:9 module/section | HTML titles, no text in pixels |

**Drop folders**

- Culture: Cloudinary `dccmiami/artists/{slug}/`, `dccmiami/programs/{slug}/`, `dccmiami/journal/{slug}/` **or** `public/dcc/culture/...` (force-add; `public/` gitignored).
- Fabricate: `public/dcc/fabrication/{filename}` then `ready: true` in `section-media.ts`.
- Resin: keep existing `assetId`s in the resin shot list.

---

## A. Culture — make these (highest yield)

### A1. Clandestine program (blocked on three real names)

Do **not** shoot “Moises/Fabiola/Angelo at Clandestine.” Wait for the packet.

Once names exist, per artist:

| ID | Type | Aspect | Size | Primary | Alternate |
|---|---|---|---|---|---|
| `clandestine-{slug}-portrait` | Portrait | 4:5 | 1200×1500 | Neutral, even light, Bakehouse/studio, no booth signage yet | Crop of approved existing portrait if they refuse a new one |
| `clandestine-{slug}-hero` | Work documentation | 16:9 | 2400×1350 | One selected work, full object, raking light | Installation crop if the object is huge |
| `clandestine-{slug}-work-01` … `05` | Selected work | 4:5 | 1600×2000 | Object on seamless / plinth | Detail macro of the same work |
| `clandestine-program-hero` | Program hero | 21:9 | 1920×823 | Empty / install-in-progress booth **after** venue is known | Fair exterior or hang diagram (graphic) if booth photo is late |
| `clandestine-install-01` | Documentary | 16:9 | 2400×1350 | Hang / lighting, no unread contracts | Crowd shot **only with releases** |
| `clandestine-recap-01` | Documentary | 16:9 | 2400×1350 | After-fair documentation for the program recap | Conversation still of the same hang |

Program page today: **no image** — honest fallback. That is correct until the packet exists.

### A2. Founders already published — upgrades, not required to ship

| ID | Who | Have now | Make | Alternate |
|---|---|---|---|---|
| `angelo-hero` | Angelo | Portrait only, **no hero** | One exhibition work 16:9 | Second work 4:5 for related grid later |
| `angelo-360-poster` | Angelo | **No tour** | Only if a real Momento360/Kuula exists — poster still 16:9 | Do not fake a 360 |
| `moises-portrait-refresh` | Moises | Knight PFP | Optional studio portrait 4:5 matching Fabiola/Angelo lighting | Keep current |
| `fabiola-location-still` | Fabiola | Portrait + Surveillance Cutie hero | Optional studio context 16:9 (no invented address) | Keep current |
| `founder-practice-grid-*` | Each | Homepage already has extra Fabiola works | 3–5 captioned works **if they approve** | Reuse homepage Cloudinary set (already shot) |

Homepage collage **already has** real photography in [`lib/marketing/dcc-home-photography.ts`](../../lib/marketing/dcc-home-photography.ts). Do not reshoot unless you want a cultural-center H1. `/` `#now` is **text-only** — optional later: 4:5 thumbs for Clandestine / featured artist / journal (same files as program/artist/editorial heroes).

### A3. Journal / Conversations (empty on purpose)

When the first guest is real:

| ID | Type | Aspect | Size | Primary | Alternate |
|---|---|---|---|---|---|
| `journal-{slug}-hero` | Portrait or still | 16:9 | 2400×1350 | Guest + work in studio | Pull-frame from video |
| `journal-{slug}-still-01` | Documentary | 4:5 | 1600×2000 | Hands/work during talk | Audio-only: typographic card (diagram type) |

No podcast artwork this phase.

---

## B. Fabricate — make these (shop / still life)

Canonical filenames in [`public/dcc/fabrication/ASSETS.md`](../../public/dcc/fabrication/ASSETS.md). **Main still shows color placeholders** until `ready: true`.

| File | Type | Aspect | Size | Where | Primary | Alternate |
|---|---|---|---|---|---|---|
| `01-fabricate-hero.webp` | Documentary process | 21:9 | 1920×823 | `/fabricate` hero | **P0.** Bakehouse / Studio 43 desk: printer silhouette, cured or FDM samples, **no people, no UI** | Conceptual desk still (label it); or crop of `120-m7-max-equipment-portrait` until the real hero exists |
| `02-service-lanes.webp` | Conceptual or documentary | 16:9 | 1600×900 | Landing lanes | Triptych: USB/file, mesh on laptop silhouette, sketch-to-object. **No text in frame** | Three separate 1:1 tiles if a triptych is too tight (phase-2 already has a conceptual ready) |
| `03-pricing-transparency.webp` | Still life | 16:9 | 1600×900 | `/fabricate` + `/pricing` | Scale cube, spool silhouette, timer form, **blank** estimate card — **no numbers** | Instructional `112-project-planning-drivers` (already used as planning stand-in) |
| `04-finishes-states.webp` | Documentary sequence | 16:9 | 1600×900 | `/fabricate/finishes` | **Same object** raw → cleaned → assembly → primed → finished, L→R | Keep resin `113-post-processing-states` (current stand-in) |
| `05-artist-access.webp` | Still life | 16:9 | 1600×900 | Access | Badge / checklist / token, **no logos, no $** | Conceptual (phase-2 ready) |
| `06-quote-intake.webp` | Still life | 16:9 | 1600×900 | `/fabricate/quote` | Labeled USB, closed box, blank form silhouette, **no PII** | Conceptual (phase-2 ready) |
| `finish-l0-raw.webp` | Specimen | 4:5 | 1200×1500 | Finishes L0 | Supports just off, raking light | Cloudinary `301` conceptual (phase-2) |
| `finish-l1-clean.webp` | Specimen | 4:5 | 1200×1500 | L1 | Sanding evidence, no paint | `302` |
| `finish-l2-assembly.webp` | Specimen | 4:5 | 1200×1500 | L2 | Pins/seams, unpainted | `303` |
| `finish-l3-exhibition.webp` | Specimen | 4:5 | 1200×1500 | L3 | Primed/filled | `304` |
| `finish-l4-finished.webp` | Specimen | 4:5 | 1200×1500 | L4 | Painted/coated presentation | `305` |

**P0 = `01-fabricate-hero.webp`.** Everything else has a conceptual or instructional alternate already designed.

Day-of Open Studios (ops, not a program record): H2D hero **if the machine is installed**, finish samples, QR still → `/?source=open-studios`. Same constraints as fabricate hero.

---

## C. Education / resin — mostly shot as **conceptual**; replace with documentary when honest

### C1. Offerings band

Five cards on `/workshops#offerings`. The 3D pair uses conceptual educational photography (caption: **Conceptual educational image**). Resin is not a catalog card.

| ID | Session | In use now | Later documentary alternate |
|---|---|---|---|
| `offering-saturday-lab` | Saturday Lab | Banner `01_start-here` | In-room website/vibe table, no accounts on screens |
| `offering-3d-printing-for-artists` | 3D Printing for Artists | Cloudinary conceptual stills (`3d-printing-*-conceptual-01`) | Filament/material macro + confirmed room stills |
| `offering-ai-3d-physical-object` | AI → 3D Physical Object | Cloudinary conceptual stills (`ai-3d-*-conceptual-01`); PRINT reuses machine detail | Real concept-to-object sequence after a class |
| `offering-vibe-coding` | Net art | Existing vibe catalog still | Browser-as-medium still |
| `offering-ip-ai` | IP Age of AI | Landscape banner in `ip-age-of-ai-video.ts` | Typographic / diagram card |

### C2. Resin — already have conceptual Cloudinary (keep until documentary exists)

**Ultra-wide banners (21:9, ~1915×821)** — HTML titles, never bake text: welcome, why-resin, safety-zones, complete-workflow, file-readiness, slicer-lab, print-wash-cure, failure-clinic, project-readiness.

**Technique boards 200–214** (16:9 conceptual teaching boards). Alternate: documentary stills from the resin shot list A–B with the **same IDs**. Folder also holds `oolite-resin-workshop-m00`…`m08` PNGs — denser infographic boards for the **same teaching job**. Leave the engine on `200–214`; do not promote those PNGs to catalog or editorial photography.

**Instructional concepts 107–135** (slicer compare, PPE atlas, failure specimens, tool cards). Alternate: real slicer screenshots **without** private data for 119; real cured fails for 129–131.

### C3. Resin documentary shot list

Shoot **once**, natural light, DigiLab/Oolite gear. Prefer no people except class shots (releases). Full IDs live in the resin shot list.

**Hub (16:10 / 16:9) — not filled (documentary)**  
`resin-hero-01` (local PNG exists but hub/media use Cloudinary welcome instead), `resin-room-wide-01`, `resin-oolite-brand-01`, `resin-bakehouse-brand-01` (Bakehouse: keep placeholder until the room is confirmed).

**Per-module stills**  
welcome TVs+QR; why-resin macro pair; safety zones + PPE portrait; five-stage workflow; file good/bad; slicer UI + five step screenshots; stations wide + plate/vat; failure grid + five isolated specimens; readiness kit.

**Kit pack shots 4:5**  
`resin-kit-00` … `resin-kit-08` (one tray per module).

**Class (releases)**  
wide class, pair on slicer, facilitator demo, hands on **cured** print, outcome card with PII scrubbed.

**Video loops (optional)**  
5–12s: model, slice, print, wash, cure; 15–30s zone walk; 60–90s reel after a real class.

**Diagrams (design, not photo)**  
**Filled:** `resin-diagram-zones-01`, `resin-diagram-workflow-01` (local SVG, on the media page). **Not filled:** `resin-tv-break-01`, `resin-tv-join-01` (QR stays live-generated).

---

## D. Other workshops (already imaged — optional refresh)

Saturday Lab banners `01–07` and IP Age of AI landscape banner already on Cloudinary. Only reshoot if you want them to match resin’s “no baked titles” rule.

---

## Make order (so you are not shooting 80 frames on day one)

1. **`01-fabricate-hero.webp`** — unlocks the fabricate landing as a real shop, not a placeholder.
2. **Finish ladder L0–L4 on one object** (`finish-l0` … `l4` + optional `04-finishes-states` strip) — same prop, five states.
3. **Clandestine** — wait for names; then portrait + 1 hero + 3 works **per artist** + one program hero.
4. **`angelo-hero`** — fills the only founder page with a missing work image.
5. **Resin documentary hero + safety + failure specimens** — replace conceptual only where you have real cured parts.
6. **Journal stills** — only after a real conversation.
7. Everything else is alternate/optional.

---

## What not to make

- Fake Clandestine portraits or booth photos.
- Angelo 360.
- Instagram templates / podcast cover as a product.
- Fabricate stills with dollar amounts or live slicer UI.
- Workshop curriculum images that encode fabricate rate cards.

---

## How to update this file

1. When a slot ships, mark it in the matching table (or move it to “have now”).
2. Keep Clandestine rows unnamed until the culture packet has real slugs.
3. Do not copy fabricate prices into resin IDs.
4. Commit with the namespace of the images you added (`culture` / `fabricate` / `education` / `studios`).

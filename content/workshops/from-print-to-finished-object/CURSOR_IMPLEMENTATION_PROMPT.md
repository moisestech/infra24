# Cursor implementation prompt — From Print to Finished Object

You are working in the **moisestech/infra24** repo on branch:

`feat/3d-school-from-print-to-finished-object`

The goal is to make the new DCC 3D School workshop visible inside the **existing 3D School architecture**, without creating a parallel workshop system and without turning provisional R&D into published facts.

Read first:

- `content/workshops/from-print-to-finished-object/README.md`
- `content/workshops/from-print-to-finished-object/image-manifest.json`
- `app/(marketing)/workshop/3d-school/page.tsx`
- `app/(marketing)/workshop/3d-school/[slug]/page.tsx`
- `lib/dcc/education/3d-curriculum/types.ts`
- `lib/dcc/education/3d-curriculum/workshops.ts`
- `lib/dcc/education/3d-curriculum/assets.ts`
- `lib/dcc/education/3d-curriculum/icons.ts`
- `lib/dcc/education/3d-curriculum/map.ts`
- `lib/dcc/education/3d-curriculum/pathway.ts`
- `components/dcc/education/3d-curriculum/CurriculumWorkshopDetail.tsx`
- `components/dcc/education/3d-curriculum/CurriculumMedia.tsx`

## Product intent

Workshop:

**From Print to Finished Object**  
**Finishing, Surface & Material Craft**

This fills a missing layer in the school:

**Model → Print → Finish → Present**

and:

**digital competency → machine competency → material competency**

The class is not a generic post-processing appendix. It teaches professional judgment about how to materially resolve a 3D-printed object.

Canonical workshop logic:

**SEE → DECIDE → REMOVE → ADD → REVEAL → CORRECT → TRANSLATE → RESOLVE**

Decision framework:

**ACCEPT / REMOVE / ADD / REPRINT**

Upstream principle:

**BETTER PRINT → LESS FINISHING**

## Critical status rules

This workshop is **in development**.

Do not claim:
- a confirmed public duration;
- a confirmed ticket price;
- final material brands;
- final PPE or ventilation guidance;
- verified competencies;
- results from Gianni Case 001;
- that generated images are documentary evidence.

Gianni Case 001 is a real future pilot. Generated workshop imagery is conceptual/instructional only.

## First implementation goal

Create the smallest production-ready integration that makes this workshop appear inside:

`/workshop/3d-school`

and resolves at:

`/workshop/3d-school/from-print-to-finished-object`

using the existing `ThreeDCurriculumWorkshop` system.

Do not create a separate route unless the existing system demonstrably cannot support a requirement.

## Data model changes

### 1. Add a finishing mental model

Extend `ThreeDMentalModelId` with a new semantically correct value:

`surface`

Use label:

`Surface / material craft`

Update the icon map with an existing Lucide icon appropriate for surface/material craft. Prefer a restrained icon already available in the dependency; do not add a package.

### 2. Add the workshop record

Add a `ThreeDCurriculumWorkshop` record:

- id: `from-print-to-finished-object`
- slug: `from-print-to-finished-object`
- title: `From Print to Finished Object`
- subtitle: `Finishing, Surface & Material Craft`
- order: place it after `from-file-to-physical-object` and before software-specific modeling workshops unless the current school map strongly suggests a better placement
- status: `in-development`
- level: `foundation`
- mentalModel: `surface`
- mentalModelLabel: `Surface / material craft`
- software: `[]`
- duration: `Pilot format in validation`
- formatNote: explain that the final duration is being validated through physical pilot work; do not promise 2h/3h/4h yet
- prerequisites: `From File to Physical Object, or equivalent 3D-printing literacy` — keep this as recommended rather than an exclusionary hard gate if the existing wording supports it

### 3. Outcomes

Use concise public-facing outcomes based on:

1. Diagnose print artifacts and decide **Accept / Remove / Add / Reprint**.
2. Use files, abrasives, and filler without erasing intended form or detail.
3. Use primer and raking light as an inspection loop rather than assuming paint hides bad preparation.
4. Translate digital visual intention into physical surface decisions: matte, satin, gloss, color separation, and hierarchy.
5. Build a finish plan for a personal printed object.

### 4. Topics

Include the useful foundation topics, not every possible advanced technique:

- defect diagnosis
- support and nub cleanup
- files and abrasive selection
- convex vs planar sanding
- edge and detail preservation
- localized filling and seam repair
- primer inspection
- raking light
- localized correction
- masking and basic paint control
- matte / satin / gloss
- material hierarchy
- upstream print decisions
- finish planning

Do **not** make advanced airbrush/weathering/electroplating/etc. core Foundation topics.

### 5. Pipeline

Use:

- See
- Decide
- Remove
- Add
- Reveal
- Correct
- Translate
- Resolve

Use session links where appropriate.

### 6. Curriculum sessions

Create lightweight session records for:

1. `see-the-surface`
2. `accept-remove-add-reprint`
3. `remove-with-control`
4. `add-and-repair`
5. `primer-tells-the-truth`
6. `correct-locally`
7. `translate-material-intent`
8. `resolve-and-present`
9. `finish-plan-for-your-object`

Each body should explain the conceptual lesson in 1–3 sentences. Do not pretend these are independently timed modules yet.

### 7. What participants make

Use a careful statement such as:

`A materially improved printed object plus a finish plan you can apply to future prints. Foundation practice begins on a controlled DCC surface study before transferring decisions to a personal object.`

The DCC Surface Study is still being physically validated, so do not say a final STL is included yet.

### 8. Related workshops

Relate to:
- `from-file-to-physical-object`
- `fix-my-3d-file`
- `blender-for-artists`
- `plasticity-for-artists`

Also add the new workshop back into the relevant related-workshop arrays where that improves navigation and does not create noisy circular lists.

Do not invent fabrication service IDs. Inspect `lib/dcc/fabrication/studio-services` first and only use existing valid IDs when they make conceptual sense.

## Image integration

The media naming/source of truth is:

`content/workshops/from-print-to-finished-object/image-manifest.json`

Cloudinary target root:

`dccmiami/workshops/from-print-to-finished-object/`

Add strongly typed 3D School asset IDs for the first canonical set only. Suggested IDs:

- `3D-FINISH-HERO-001` — raw vs resolved
- `3D-FINISH-RAKING-001` — raking-light comparison
- `3D-FINISH-SAND-001` — sanding convex dome
- `3D-FINISH-FILE-001` — filing raised defect
- `3D-FINISH-FILL-001` — localized filler
- `3D-FINISH-INSPECT-001` — inspection station
- `3D-FINISH-MATERIAL-001` — finish/material comparison
- `3D-FINISH-FINAL-001` — fully resolved Instructor Master
- `3D-FINISH-TOOLS-001` — complete workstation

Do not add every exploratory image to the typed public asset registry.

If the manifest does not yet contain a Cloudinary URL for an asset:
- add the typed asset slot with accurate metadata;
- leave `src` undefined so existing placeholder behavior is used;
- do not fabricate a Cloudinary URL.

Once URLs are available, use the existing `cdn()` / Cloudinary pattern in `assets.ts`.

Recommended workshop media:
- hero: `3D-FINISH-HERO-001`
- gallery: sanding, fill, material, final
- diagrams/comparison media: raking-light comparison and/or inspection image where the existing detail component can support them cleanly

Do not use:
- the wrong-object robot/cat painting image;
- the active aerosol primer image;
- red-finish drift images;
- text-heavy generated grids as primary public course media.

## UI scope

For this first pass, reuse `CurriculumWorkshopDetail` rather than redesigning the whole 3D School.

If the current generic detail page makes the workshop coherent with:
- hero;
- outcomes;
- workflow;
- curriculum;
- tools;
- next;
- related;
then stop there.

Only introduce a generic optional richer-media field if there is a clear reusable need across multiple 3D School workshops. Do not special-case a large one-off component solely for this workshop in the first pass.

## 3D School hub / path

Inspect:
- `ThreeDSchoolHub.tsx`
- `map.ts`
- `pathway.ts`
- `nav.ts`

Make the smallest updates necessary so the new workshop appears naturally in the 3D School discovery experience.

Conceptually it belongs after print literacy and before/alongside deeper software pathways because it teaches the missing **Finish** layer.

Do not remove or reorder existing workshops destructively.

## Copy discipline

Public copy should distinguish:

**RESEARCH / PILOT / VERIFIED**

Avoid claims such as:
- “professional-grade results”
- “master finishing”
- “verified fabricator”
- “complete collectible in one session”

Prefer:
- materially resolved
- controlled surface preparation
- diagnose
- inspect
- preserve detail
- choose the appropriate intervention
- practice
- build a finish plan

## Accessibility

For every new image asset:
- write a useful alt description of the visual learning content;
- do not describe generated imagery as a real class photograph;
- preserve existing responsive media behavior;
- avoid relying on color alone to communicate matte/satin/gloss or before/after states.

## Validation

After implementation:

1. Run the repo's relevant typecheck/lint/tests.
2. Verify `/workshop/3d-school` renders the new card.
3. Verify `/workshop/3d-school/from-print-to-finished-object` renders.
4. Verify static params include the slug.
5. Verify no missing asset ID/type errors.
6. Verify dark/light themes.
7. Verify mobile navigation and sticky section nav.
8. Verify placeholder media renders gracefully for Cloudinary images not uploaded yet.
9. Do not merge to main.

## Deliverable

When complete, report:

- files changed;
- new workshop record;
- new asset slots;
- 3D School hub/path changes;
- tests run and results;
- Cloudinary URLs still missing;
- unresolved curriculum decisions that should wait for Gianni Case 001 and the Surface Study pilot.

The objective is not to finalize the class. The objective is to give the ongoing R&D a **real home inside the DCC 3D School** without turning hypotheses into facts.

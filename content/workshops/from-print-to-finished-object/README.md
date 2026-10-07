# From Print to Finished Object — R&D report

**DCC 3D School**  
**Workshop:** From Print to Finished Object: Finishing, Surface & Material Craft  
**Status:** in development  
**Working branch:** `feat/3d-school-from-print-to-finished-object`

## Workshop thesis

This workshop fills the missing material layer in the DCC 3D School stack:

**Model → Print → Finish → Present**

and:

**digital competency → machine competency → material competency**

The workshop is not a generic post-processing appendix to 3D printing. It teaches participants to improve one real printed object while understanding why each intervention is being made.

Two frameworks organize the curriculum:

1. **SEE → CORRECT → REBUILD → REVEAL → TRANSLATE → RESOLVE**
2. **ACCEPT / REMOVE / ADD / REPRINT**

A third principle reconnects finishing to upstream fabrication:

**BETTER PRINT → LESS FINISHING**

## What has been completed

### Curriculum architecture
- Core workshop thesis and distinction from Intro FDM/Resin, Fix My 3D File, Blender, Plasticity, and other 3D School classes.
- Professional finishing workflow covering diagnosis, trimming, filing, sanding, filling, primer inspection, correction, material translation, painting, detail, assembly, protection, and presentation.
- Two-object pedagogy:
  - a standardized DCC Surface Study for controlled practice and safe mistakes;
  - a participant's personal object for judgment and transfer.
- Instructor Master concept for online/instructor demonstrations.
- Gianni Case 001 defined as a real pilot and curriculum R&D case.
- Initial competency map: Print Defect Diagnosis, FDM Surface Preparation, Filling & Repair, Primer Inspection, Surface Painting, Assembly & Adhesion, Post-Processing Safety.
- Workshop ladder concept: Foundation workshop → Open Finishing Lab → Finishing Clinic → Surface & Detail → Character to Collectible.

### Visual system
A coherent generated visual language is established:
- realistic desktop-FDM material behavior;
- warm artist-fabrication workbench;
- tactile dust, abrasives, filler, primer, and paint;
- hands only when they clarify an action;
- gray raw/primed material and dark charcoal resolved finish;
- no futuristic fabrication-lab aesthetic.

The generated library currently contains 39 image explorations. The strongest images have been classified into curriculum sections and given canonical target names in `image-manifest.json`.

### Strong visual coverage already available
- raw vs resolved transformation;
- fully resolved Instructor Master;
- raking-light comparison;
- sanding a convex dome;
- filing a raised defect;
- knife/scrape cleanup;
- localized filler application;
- inspection station;
- dust/surface cleanup;
- finish/sample comparison;
- painting the canonical object;
- remove toolkit;
- additive/filler materials;
- full workstation;
- painting/finish station;
- failed print vs clean reprint;
- abrasive/file progression.

### Infra24 / 3D School integration audit
The live DCC 3D School already has the architecture needed for this workshop.

Relevant route:
`/workshop/3d-school/[slug]`

Primary data:
`lib/dcc/education/3d-curriculum/`

Relevant files:
- `types.ts`
- `workshops.ts`
- `assets.ts`
- `icons.ts`
- `index.ts`
- `map.ts`
- `nav.ts`

Primary presentation:
`components/dcc/education/3d-curriculum/CurriculumWorkshopDetail.tsx`

The existing workshop detail template already supports:
- hero;
- What you'll make;
- What you'll learn;
- workflow;
- curriculum sessions;
- tools & materials;
- next skills;
- fabrication services;
- related workshops.

Therefore this workshop should extend the existing 3D School system rather than create a parallel page architecture.

## Cloudinary target structure

All workshop media should live under:

`dccmiami/workshops/from-print-to-finished-object/`

with:

- `00-core/`
- `01-see/`
- `02-decide/`
- `03-remove/`
- `04-add/`
- `05-reveal/`
- `06-correct/`
- `07-translate/`
- `08-resolve/`
- `09-tools-materials/`
- `10-case-studies/`
- `90-drafts-archive/exploration/`
- `90-drafts-archive/reference/`
- `90-drafts-archive/rejected/`

The folder hierarchy has been created in Cloudinary. Upload/public-ID mapping is tracked in `image-manifest.json`.

## What is still missing visually

Generated visuals should stop after the remaining decision/failure gaps are filled:

- ACCEPT: minor artifact intentionally left alone;
- correct vs oversanded edge;
- preserved vs lost detail;
- controlled filler vs excessive filler;
- successful print with poor seam/support placement vs better planned print;
- four material macros: raw PLA, sanding scratches, filler/PLA interface, primed unified surface;
- compact take-home kit;
- personal-object diagnosis;
- finish-plan scene.

After those, generated-image production should be considered complete.

## What must become real documentation

The following should not be simulated as documentary evidence:

### Gianni Case 001
Capture the real object:
- digital reference;
- raw front/back/side;
- head seam macro;
- layer texture;
- support/contact scars;
- defect map;
- cleanup;
- sanding;
- filler;
- primer inspection;
- failures before correction;
- correction;
- material/finish map;
- painting;
- assembly;
- final object;
- digital reference / raw print / finished physical object.

### DCC Surface Study
The student practice object still needs to be physically modeled, sliced, printed, and tested. It should expose:
- convex curve;
- flat plane;
- crisp edge;
- concavity/groove;
- small hole;
- raised detail;
- removable nub;
- recessed seam;
- sacrificial oversanding area;
- a low-priority cosmetic artifact that should be accepted.

### Real technique video
The online workshop should progressively replace generated action imagery with short real demonstrations, generally 30 seconds to 3 minutes:
- trim;
- file;
- sand curve;
- sand plane;
- fill;
- inspect with primer/raking light;
- local correction;
- masking;
- paint/material finish.

## Product / curriculum work remaining

1. Lock the real BOM: files, abrasives, filler, primer, paint/finish, masking, cleanup, adhesives, and relevant PPE.
2. Verify safety and ventilation against the actual products' manufacturer guidance/SDS.
3. Model and print DCC Surface Study v0.1; batch-test it.
4. Run Gianni Case 001 while logging hands-on time, wait/dry/cure time, materials, failures, perceptual improvement, and whether upstream printing could have prevented each defect.
5. Use real timing to choose the public format: 2h, 3h, 4h, or two sessions.
6. Lock the Foundation syllabus only after the pilot.
7. Build the online lesson layer around concept → visual → short demo → practice → checkpoint → transfer.
8. Replace generated placeholders with real DCC evidence as the workshop matures.

## Proposed 3D School record

The workshop should begin as **in-development**, not pilot, until the Surface Study and Gianni case validate the format.

Provisional record:
- id/slug: `from-print-to-finished-object`
- title: `From Print to Finished Object`
- subtitle: `Finishing, Surface & Material Craft`
- level: `foundation`
- mental model: add a new `surface` or `finish` category rather than reusing an unrelated existing mental model
- mental model label: `Surface / material craft`
- software: none required
- duration: deliberately provisional until pilot timing
- related workshops:
  - From File to Physical Object
  - Fix My 3D File
  - Blender for Artists
  - Plasticity for Artists

Provisional outcomes:
- diagnose print artifacts and decide Accept / Remove / Add / Reprint;
- use files, abrasives, and filler without erasing intended form;
- use primer and raking light as an inspection loop;
- translate digital visual intent into physical material/sheen decisions;
- make a finish plan for a personal printed object.

Provisional pipeline:
**SEE → DECIDE → REMOVE → ADD → REVEAL → CORRECT → TRANSLATE → RESOLVE**

## Implementation principle

Do not create a second workshop system. Extend the existing DCC 3D School types, workshop record, asset registry, and detail UI with the smallest changes needed.

Do not publish generated Gianni documentation.  
Do not lock public duration, safety claims, or exact product recommendations before the pilot.

# DCC 3D School — asset production checklist

Manifest source of truth: [`lib/dcc/education/3d-curriculum/assets.ts`](../../lib/dcc/education/3d-curriculum/assets.ts).

**Swap contract:** update `src` and `productionStatus` in the manifest only. Presentation components read the manifest — do not hard-code image paths in JSX.

**Branding in images:** generated art must not contain DCC logos, workshop titles, software names, captions, or illegible UI text. Typography and labels belong to the website layer.

**Delivery:** prefer Cloudinary URLs under `dccmiami/workshops/` (see `THREE_D_CURRICULUM_CDN` in the manifest). Local drops to `public/dcc/education/3d-curriculum/` are optional when gitignore allows.

**Visual QA (development):** `/workshop/3d-school/visual-test` — full heroes, card crops, production status badges.

---

## PRIMARY — HERO FAMILY

| ID | Filename | Ratio | Workshop | Visual verb | Status | Source | Focal | Notes |
|---|---|---|---|---|---|---|---|---|
| 3D-HERO-001 | dcc-3d-hero-001.webp | 16:9 | Hub | compare | placeholder | — | 50% 45% | **Next to generate.** Triptych: mesh / solid / precision + optional foreground print. |
| 3D-FOUNDATION-HERO-001 | dcc-3d-foundation-hero-001.webp | 16:9 | From File to Physical Object | translate | generated-candidate | Cloudinary | 50% 50% | Wireframe → slice → print. Only workshop using slice progression as primary motif. |
| 3D-BLENDER-HERO-001 | dcc-3d-blender-hero-001.webp | 16:9 | Blender for Artists | sculpt-mutate | needs-regeneration | Cloudinary | 50% 50% | Regenerate: primitives → mesh mutation, not slice layers. |
| 3D-PLASTICITY-HERO-001 | dcc-3d-plasticity-hero-001.webp | 16:9 | Plasticity for Artists | cut-join-fillet | generated-candidate | Cloudinary | 50% 50% | Harder, more controlled than Blender. |
| 3D-RHINO-HERO-001 | dcc-3d-rhino-hero-001.webp | 16:9 | Rhino for Artists | curve-surface | generated-candidate | Cloudinary | 50% 50% | Sparse curves → continuous surface. |
| 3D-FIX-HERO-001 | dcc-3d-fix-hero-001.webp | 16:9 | Fix My 3D File | diagnose-repair | generated-candidate | Cloudinary | 50% 50% | Broken → clean printable geometry. |
| 3D-GRASSHOPPER-HERO-001 | dcc-3d-grasshopper-hero-001.webp | 16:9 | Grasshopper / Computational Objects | vary-proliferate | generated-candidate | Cloudinary | 50% 50% | One rule → family of outcomes. |
| 3D-PARAMETRIC-HERO-001 | dcc-3d-parametric-hero-001.webp | 16:9 | Parametric CAD | constrain-assemble | generated-candidate | Cloudinary | 50% 50% | Relationships / constraints, not direct solids. |

Do not mark `approved` merely because a file exists on CDN.

---

## SECONDARY — INSTRUCTIONAL

Generate only after the primary hero family is visually approved.

| ID | Filename | Ratio | Workshop | Status | Phase |
|---|---|---|---|---|---|
| 3D-FOUNDATION-FORMATS-001 | dcc-3d-foundation-formats-001.webp | 4:3 | Foundation | placeholder | A |
| 3D-FOUNDATION-PRINTABILITY-001 | dcc-3d-foundation-printability-001.webp | 4:3 | Foundation | placeholder | A |
| 3D-BLENDER-STAGES-001 | dcc-3d-blender-stages-001.webp | 21:9 | Blender | placeholder | D |
| 3D-BLENDER-OBJECT-001 | dcc-3d-blender-object-001.webp | 4:5 | Blender | placeholder | B |
| 3D-PLASTICITY-BOOLEAN-001 | dcc-3d-plasticity-boolean-001.webp | 4:3 | Plasticity | placeholder | A |
| 3D-PLASTICITY-STUDIO-OBJECTS-001 | dcc-3d-plasticity-studio-objects-001.webp | 21:9 | Plasticity | placeholder | D |
| 3D-PLASTICITY-BRIDGE-001 | dcc-3d-plasticity-bridge-001.webp | 16:9 | Plasticity | placeholder | C |
| 3D-RHINO-JEWELRY-001 | dcc-3d-rhino-jewelry-001.webp | 4:3 | Rhino | placeholder | A |
| 3D-FIX-DIAGNOSIS-001 | dcc-3d-fix-diagnosis-001.webp | 21:9 | Fix My File | placeholder | D |

---

## NATIVE / DEFERRED

These raster slots stay **deferred**. The live site uses responsive HTML/CSS instead:

| ID | Live representation |
|---|---|
| 3D-MAP-001 | [`CurriculumMap`](../../components/dcc/education/3d-curriculum/CurriculumMap.tsx) on the hub |
| 3D-PIPELINE-001 | [`WorkflowStrip`](../../components/dcc/education/3d-curriculum/WorkflowStrip.tsx) on workshop detail pages |
| 3D-OPERATOR-PATH-001 | [`LearningPath`](../../components/dcc/education/3d-curriculum/LearningPath.tsx) staged list on the hub |

Raster versions may be added later for editorial or social use only.

---

## Alt-text rule

Describe informational content. Avoid “DCC-style image” or “workshop banner.”

Example: *An organic mesh sculpture progresses from simple polygon primitives into a smooth printable form.*

---

## Custom icons (not this pass)

Search the UI for `ASSET_TODO` — Lucide stand-ins for mesh, solid, curve, dimensions, print, repair, slice, material, machine, instructor, skill level, time, participants.

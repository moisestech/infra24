# Resin printing workshop — media shot list

Production checklist for the Infra24 resin workshop engine. Documentary natural light. Prefer real DigiLab / Oolite gear. Do **not** present AI-generated imagery as documentary evidence. Shoot larger than minimum when easy.

Canonical IDs below are wired into curriculum media placeholders (`lib/workshop-engine/resin-printing/media.ts`). UI placeholders show the same `assetId` values.

**Booklet edition note:** August 10, 2026 Canva export (`Oolite-Arts-Resin-Printing-Guide.pdf`) — 21 physical PDF sheets with printed logical page labels 1–44 (printer-imposed spreads). Logical pages **10** and **35** are missing from this upload. Module→page mapping is verified against the handoff inventory; a reading-order PDF is forthcoming.

---

## A. Hub + venue proof

| ID | What to shoot | Aspect | Min size | Notes |
|---|---|---|---:|---|
| `resin-hero-01` | Photon Mono M7 Max + cured samples on clean workstation; **no people, no readable UI text** | 16:10 | 2400×1500 | Hub hero |
| `resin-room-wide-01` | Full Studio 106 showing **clean participant zone** and **controlled resin zone** in one frame; both TVs if possible | 16:9 | 2400×1350 | Welcome / venue |
| `resin-oolite-brand-01` | Room corner with Oolite/DigiLab context (no private screens) | 16:9 | 2400×1350 | Oolite venue page |
| `resin-bakehouse-brand-01` | Bakehouse/DCC.MIAMI context when available (or keep placeholder) | 16:9 | 2400×1350 | Bakehouse venue |

---

## B. Per-module teaching stills

| ID | Module | Exact frame | Aspect | Min size |
|---|---|---|---|---:|
| `resin-mod-welcome-01` | welcome | Wide: both smart TVs on join/QR screen + printed QR backup card + cured samples in foreground | 16:10 | 2400×1500 |
| `resin-mod-why-01` | why-resin | Macro pair: **small fine-detail** cured object beside **larger** cured object with ruler/coin scale | 4:5 | 1600×2000 |
| `resin-mod-safety-01` | safety-zones | Straight-on: labeled clean vs controlled zones, PPE laid out, spill kit, waste, resin station visible | 16:9 | 2400×1350 |
| `resin-mod-safety-ppe-01` | safety-zones | Portrait detail: gloves, glasses, apron/smock, mats, labeled bottles (labels readable only if non-sensitive) | 4:5 | 1600×2000 |
| `resin-mod-workflow-01` | complete-workflow | Top-down **five-stage line**: (1) laptop/STL, (2) slicer screenshot printout or screen, (3) supported print on plate/raft, (4) washed part, (5) fully cured finished object | 16:9 | 2400×1350 |
| `resin-mod-file-good-01` | file-readiness | Screen/render: watertight manifold model at correct mm scale | 16:9 | 2400×1350 |
| `resin-mod-file-bad-01` | file-readiness | Same framing: thin walls / open geometry / trapped cavity callouts (can be annotated later) | 16:9 | 2400×1350 |
| `resin-mod-slicer-01` | slicer-lab | Full slicer UI: demo model oriented, supports on, hollow+drain visible, layer preview panel | 16:9 | 2400×1350 |
| `resin-mod-slicer-steps-01` | slicer-lab | Screenshot: import | 16:9 | 1920×1080 |
| `resin-mod-slicer-steps-02` | slicer-lab | Screenshot: units/scale | 16:9 | 1920×1080 |
| `resin-mod-slicer-steps-03` | slicer-lab | Screenshot: orient | 16:9 | 1920×1080 |
| `resin-mod-slicer-steps-04` | slicer-lab | Screenshot: supports | 16:9 | 1920×1080 |
| `resin-mod-slicer-steps-05` | slicer-lab | Screenshot: preview/export | 16:9 | 1920×1080 |
| `resin-mod-stations-01` | print-wash-cure | From **participant clean-zone viewpoint**: printer \| wash \| cure in one wide frame | 16:9 | 2400×1350 |
| `resin-mod-stations-detail-01` | print-wash-cure | Build plate + vat (empty/safe), scraper tools — instructor zone, no wet resin on floor | 16:9 | 2400×1350 |
| `resin-mod-fail-grid-01` | failure-clinic | Labeled grid of **cured** failures: plate/film fail, detached part, crack, white bloom, soft/warp detail | 16:9 | 2400×1350 |
| `resin-mod-fail-01` | failure-clinic | Plate/film failure specimen, isolated on neutral mat with label card | 4:5 | 1600×2000 |
| `resin-mod-fail-02` | failure-clinic | Detached part / support failure specimen | 4:5 | 1600×2000 |
| `resin-mod-fail-03` | failure-clinic | Crack specimen | 4:5 | 1600×2000 |
| `resin-mod-fail-04` | failure-clinic | White bloom specimen | 4:5 | 1600×2000 |
| `resin-mod-fail-05` | failure-clinic | Soft detail / warp specimen | 4:5 | 1600×2000 |
| `resin-mod-ready-01` | project-readiness | Top-down kit: printed checklist, cured sample, labeled USB, resource QR card | 4:5 | 1600×2000 |

---

## C. Physical teaching-kit pack shots (4:5, ≥1600×2000)

| ID | Kit bin | Contents to show |
|---|---|---|
| `resin-kit-00` | Welcome | Join sign + printed QR backup |
| `resin-kit-01` | Why resin | Multi-scale cured successes |
| `resin-kit-02` | Safety | PPE + zone markers + sealed resin/SDS + waste examples |
| `resin-kit-03` | Workflow | Five staged pipeline objects |
| `resin-kit-04` | File readiness | Thin wall, open geo, fragile detail, hollow cavity samples |
| `resin-kit-05` | Slicer | Demo model + USB + printed screenshot backup |
| `resin-kit-06` | Post | Removal tools + wash/cure props (dry/safe staging) |
| `resin-kit-07` | Failures | Full cured failure set in tray |
| `resin-kit-08` | Readiness | Appointment checklist + resource QR |

---

## D. Live-class / case-study (needs releases)

| ID | Frame | Aspect | Privacy |
|---|---|---|---|
| `resin-class-wide-01` | Whole class, TVs, facilitators | 16:9 | Releases |
| `resin-pair-medium-01` | Two artists on slicer exercise | 4:5 | No readable private data on screens |
| `resin-facilitator-demo-01` | Instructor holding staged sample; PPE + controlled zone accurate | 16:9 | OK if staff |
| `resin-hands-cured-detail-01` | Hands inspecting **fully cured** print | 4:5 | Caption as cured |
| `resin-participant-outcome-01` | Ready/repair/consultation card or prepared file — names removed | 4:5 | Scrub PII |

---

## E. Process video loops (horizontal first)

| ID | Length | Action |
|---|---|---|
| `resin-loop-model-01` | 5–12s | Orbit/inspect demo STL on screen |
| `resin-loop-slice-01` | 5–12s | Supports + hollow/drain in slicer |
| `resin-loop-print-01` | 5–12s | Plate with supported print (or staged) |
| `resin-loop-wash-01` | 5–12s | Wash station motion (instructor) |
| `resin-loop-cure-01` | 5–12s | Cure chamber / turntable |
| `resin-walkthrough-01` | 15–30s | Room walk clean → controlled zones |
| `resin-reel-01` | 60–90s | Post-pilot teaching reel |

---

## F. Diagrams / graphics (can be designed)

| ID | Asset | Use |
|---|---|---|
| `resin-diagram-zones-01` | Clean vs controlled zone floor plan for Studio 106 | Safety TV full-bleed |
| `resin-diagram-workflow-01` | Model→slice→print→wash→cure icons | Workflow TV |
| `resin-tv-break-01` | Branded break screen | Break mode |
| `resin-tv-join-01` | High-contrast join backdrop (QR stays live-generated) | Join screen |

---

## G. Possibly already on hand (check before reshooting)

- `3d-resin-printing-for-artists-digilab-2026-*.jpg/png`
- `oolite-360-faby-3d-printer-pc.*`, `oolite-digilab-360-pcs-3d-printer-2.*`
- `preview-3d-consulting-digilab-oolite.*`
- `FROM-TOY-TO-RESIN.mp4` (process video candidate — verify rights/context)

---

## Capture rules

1. Prefer people learning and outcomes over equipment-only images for case study shots; equipment-only is fine for hero/module placeholders that forbid people.
2. Never show readable private participant data or account screens.
3. Caption cured vs uncured accurately; failure specimens must be fully cured for handling photos.
4. When an asset is uploaded (Cloudinary or otherwise), keep the same `assetId` and replace the placeholder `src` — do not rename IDs without updating curriculum media metadata.

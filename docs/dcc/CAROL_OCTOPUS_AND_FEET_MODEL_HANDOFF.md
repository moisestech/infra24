# Carol Haggiag — 3D model verification, color selection and fabrication handoff

**Date:** November 14, 2026  
**Owner:** DCC Miami / Moises Sanabria  
**Status:** Scoping only; zero approved client fabrication orders, printer slots, material purchases or deposits.

This document covers **two separate projects**:
1. Carol's **octopus earring** for Moonlighter's postponed *From Image to Object* workshop. Meshy is a **model-generation tool**, not a third commission.
2. Carol's **chicken-foot lightweight earrings**, DCC-JOB-002, a private prospective fabrication commission using her own existing brass casts.

Do not merge project economics, workshop fees, consent, deliverables, print commitments, or client records. An earlier Augusto + Naz 3D printed mesh/textile collaboration is also independent, not automatically Carol's project.

## Evidence and asset inventory (verified November 14)

| Asset | Current evidence | Confidence / next action |
|---|---|---|
| Octopus reference/image | Referenced in Moonlighter workshop planning | Request actual private reference file or Meshy project URL |
| Octopus exported Meshy STL/3MF/OBJ/GLB | No matching file located in connected Google Drive or infra24 repo | **Absent from verified inventory**; locate or generate from approved reference |
| Generic octopus FDM geometry proof | DCC created original, unrelated sample generator at `scripts/dcc/octopus_fdm_geometry_proof.py` | **Generated test only**; a 58.32 × 64.08 × 3.96 mm, single connected watertight octopus contour with two raised eyes and a small hole; NOT Carol's artistic octopus export; no physical test yet |
| Chicken-foot source | Carol's real brass casts at Bakehouse Studio 43 and archival photos/reference | Confirmed objects; measure/photograph condition/weigh |
| Chicken-foot 3D model | Moises says one exists, but no corresponding STL/OBJ/3MF/GLB located on the inspected infra24 Git tree or matching Drive search | **Model existence reported by owner; exact file, scale and validity unverified**. Ask Moises for path/share link before operator handoff |
| FDM machine, filament, operator rate | Two separate Augusto emails currently drafts; no confirmed capacity | Confirm actual machine and material availability before quote |
| Jewelry-safe final result | No tested attachment, wear/contact or weight data | **Do not describe PLA sample or uncured resin as final wearable jewelry** |

### File naming and private storage

Use separate **private** folders (no client CAD in the public Git repo):
- `carol/workshop_octopus/00-reference/`
- `carol/workshop_octopus/01-meshy-original/` (GLB/OBJ native source + task/project link)
- `carol/workshop_octopus/02-printable/` (versioned repaired `octopus_fdm_v01.stl`, `octopus_fdm_v01.3mf`)
- `carol/chicken_foot/00-brass-capture/`
- `carol/chicken_foot/01-original-mesh/`
- `carol/chicken_foot/02-operator-handoff/`
- `carol/chicken_foot/03-print-QA/`

For each mesh, record: owner, provenance, permission, raw filename and sha256, units and measured bounding box in mm, watertight and component count, orientation and support/overhang notes, minimum feature thickness, source and printable version, operator, printer/nozzle/filament, slicer settings/estimate, success/failure and artist review.

**Never hand off only a screenshot or AI render as a printable file.** Do not circulate originals or brand-sensitive case study media without permission.

## Carol's FDM color choice: one primary + one backup

Show **proposed colors**, not guaranteed machine stock. A strong high-visibility fluorescent palette from Polymaker Panchroma Neon PLA (1.75 mm) is:

| Choice | Product color | HEX (digital approximation) | Use |
|---|---|---|---|
| A — recommended | Neon Pink | `#FF3670` | Vivid hot fluorescent pink |
| B — recommended | Neon Magenta | `#F21185` | Deeper electric fuchsia |
| C | Neon Green | `#00F263` | Bright signal/neon green |
| D | Neon Orange | `#FF7800` | Warm high-visibility option |

Official color/manufacturer reference: https://shop.polymaker.com/products/neon-pla/ . Manufacturer lists material as UV-reactive fluorescent PLA, but a UV-reactive claim is not a glow-in-the-dark or certified skin-contact claim. Supplier variants may be backordered; operator's available spool matters more than a conceptual swatch. **Do not buy** until machine/nozzle suitability and pricing are confirmed.

FDM color selection for an octopus workshop print does **not** replace the separately requested **translucent fuchsia/green resin** material direction in the chicken-foot job. Those are different materials and quoted scopes.

Suggested short question: *“For the first FDM octopus test, which color feels most like you: A neon pink, B electric magenta/fuchsia, C high-vis green, or D neon orange? Pick one favorite and one backup. These are color directions while we check actual filament availability—nothing has been purchased.”*

## Production sequence and stop/go gates

### Track W — workshop octopus (not paid DCC-JOB-002)

- [ ] W1. Ask for Carol's original octopus reference/approved Meshy model project link or already exported mesh.
- [ ] W2. If no Meshy model: run a controlled **Image to 3D**, use a single clean subject photo; for multiple views use accurate front/profile/back. Meshy 7.1 high-detail is supported; plans/credits can vary.
- [ ] W3. Export **source GLB/OBJ** and print **STL or 3MF**, preserving provenance and scale. Do not mistake generated geometry for print-ready jewelry.
- [x] W4. Create a DCC-owned **generic FDM geometry proof** for workflow rehearsals only; generator in GitHub; QA asserts one connected watertight mesh. This is not her model.
- [ ] W5. Inspect her actual mesh: no missing tentacles, floating pieces, inverted normals, holes or impossible thin bridges. Repair only as justified.
- [ ] W6. Set physical dimensions with Carol, then choose suitable PLA, nozzle, layer height, support strategy, and actual machine profile; run slicer estimate.
- [ ] W7. Carol picks one primary and backup color (A/B/C/D); operator confirms actual stock, surcharge and print window.
- [ ] W8. Confirm workshop date, included print allowance/queue and whether any separate paid test is authorized. Workshop postponed from Nov 14; Moonlighter offered Dec 12 or Jan 9.
- [ ] W9. Print only after operator approval; record as an educational print, not a paid DCC commissioned job; collect client feedback.

### Track F — chicken-foot commission (DCC-JOB-002)

- [ ] F1. Find the exact alleged **existing chicken-foot STL/3MF/OBJ/GLB** and determine whether it comes from her brass casts or another source. No file located yet.
- [ ] F2. Take private photo reference and inspect/weigh/measure Carol's brass cast at Studio 43. Record source provenance and custody.
- [ ] F3. Resolve target length: Carol's original Sept 23 email says 2.5 in; repo working copy says about 2 in. Mirroring and attachment are still technical decisions.
- [ ] F4. Validate the actual model at **agreed physical dimensions**; make an L/R mirrored pair only in digital preview if scoped. Detail/weight/texture may favor resin instead of FDM.
- [ ] F5. Compare priced operator options: Bakehouse Augusto (peer/FDM inquiry), Moonlighter Augusto (institutional FDM inquiry), and independent validated resin capacity. Both Augusto inquiries are **drafts, not sent**.
- [ ] F6. Confirm first material/one color and physical prototype boundaries. **$225 remains a one-tint planning allowance**, not an approved fixed price or three-color scope.
- [ ] F7. Send an actual fixed quote with distinct geometry, printing/material, setup, revision and delivery terms. Obtain written approval and payment before manufacturing.
- [ ] F8. Perform one technical test and QA. Artist approves texture, measured mass, form, attachment and wearability. Extra color/pair is change order, never silently included.
- [ ] F9. Seek separate **public documentation** permission before any DCC story, images or Reel.

## Operator handoff checklist (no sending until ready)

- [ ] client authorization to show model/working reference; distinguish rights from public posting
- [ ] exact file name and private share link, source and version
- [ ] orientation + dimensions in mm and number of parts
- [ ] desired printed color **plus backup** and material compatibility
- [ ] printer type/nozzle and operator identified
- [ ] slice screenshot, support estimate, time, grams, failure policy and total price
- [ ] written go-ahead on exact scope and date
- [ ] final QA and pickup handoff

## Review links

- GitHub draft PR: https://github.com/moisestech/infra24/pull/37
- Private commercial proposal route: https://dcc.miami/fabricate/proposals/carol-haggiag
- Meshy Image to 3D: https://help.meshy.ai/en/articles/9996860-how-to-use-meshy-image-to-3d
- Meshy export documentation: https://docs.meshy.ai/en/webapp/getting-started

**Completion means verified artifacts and documented handoffs, not simply updating a status field.**

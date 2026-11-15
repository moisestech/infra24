# Carol Octopus · Meshy 7.1 Image → 3D → FDM STL (v1)

**Date:** 2026-11-15  
**Scope:** Octopus concept ONLY. Chicken-foot source STL is a separate project.
**Status:** Preparatory workflow — no Meshy generation has been run here; no Carol STL has been exported or approved. Do not confuse the generic octopus proof in `scripts/dcc/` with Carol's model.

## Verified Meshy requirements (official documentation, checked Nov 15, 2026)

- **Workspace:** https://www.meshy.ai/workspace → **Model → Image to 3D**.
- **Image inputs:** PNG, JPG/JPEG or WebP, max **20 MB** per image. Use one centered subject on a simple background. Meshy help recommends 1024×1024 for printing; webapp guide says 512×512 or larger. Upscaling an underspecified source does **not** add real details.
- **Generation:** **High Detail / Meshy 7.1** to prioritize printable geometry detail. Choose Standard resolution for the first comparison; only pay for higher resolution after checking shape accuracy and thin feature viability. Prefer untextured base geometry for single-filament FDM.
- **Multi-view:** One main/front image plus up to three views, only if they truly represent **the same physical shape**; front first. If inconsistent, use one reference instead. Paid subscription may be needed.
- **Image Enhancement:** Optional; can alter existing features. Compare to original reference before approving.
- **Output:** Export raw GLB or OBJ for later editing AND **STL/3MF for slicing**; color/metal textures do not survive STL export. Size model explicitly in mm during print prep and verify in slicer. Meshy offers printability checks and repair tools; slicer/operator confirmation is still required.
- **Private/commercial usage:** Meshy webapp documentation distinguishes free-plan CC BY 4.0 from paid Private license. Confirm Carol's original-image rights and actual Meshy plan/license before commercial use; uploading to Meshy is a third-party data transfer and needs client approval.

Official: https://docs.meshy.ai/en/webapp/image-to-3d
Official: https://help.meshy.ai/en/articles/9996860-how-to-use-meshy-image-to-3d
Official: https://help.meshy.ai/en/articles/12634481-how-to-use-multi-view
Official: https://help.meshy.ai/en/articles/16231806-how-can-i-create-my-own-3d-printing-files
Official: https://help.meshy.ai/en/articles/15724161-how-to-export-meshy-models-with-colors-and-textures

## The actual reference assets

User provided a single **1080×1080 composite** sheet showing paired metal octopus earrings and separate side/back/draft views. Cropped/padded source views were prepared in the conversation (not published to the public repo):

1. `01_front_reference.png` — strongest isolated **front** test view; **still contains stud/post/clasp hardware**, which must be removed or separated in a later editable mesh.
2. `02_side_reference.png` — conceptual **side** view, **not yet validated** as the exact same object.
3. `03_back_reference.png` — conceptual **back** view, **not yet validated** as the exact same object.
4. `00_original_collage_reference.png` — complete source sheet, archive/reference only; **do not upload this collage as one Image-to-3D input**.

**Prepared 2026-11-15:** The downloadable private reference pack from this conversation contains these four PNGs and a README. Each crop is padded to 1024×1024 with aspect ratio preserved, but is upscaled from the small original sheet, so resolution is not magically recovered. **Do not check the pictures into Git, `/public`, Cloudinary or unauthenticated Airtable attachments.** A separate `01_front_body` crop was deliberately rejected because removing the hardware by cutting the image also severed part of the head; do not use it. Image cleanup that actually removes hardware must preserve octopus anatomy and be approved by the artist.

**Multi-view gate:** inspect exact head, curl, loop and tentacle correspondence. Current source's side/back may differ illustratively from front. Meshy multi-view should receive only truly coherent alternate viewpoints; otherwise run a **single front image** first and inspect the invented backside critically.


The original sheet shows about **55 mm indicated height** but the **14 mm callout is by the top assembly**, not proof of the octopus body's maximum width. Some viewpoint/stud/tentacle relationships differ. These images are **reference art, not engineering drawings**. Request permission to send an artist/client reference to an outside generative platform.

Images stay as private conversation artifacts; never commit proprietary/source artwork to the public infra24 Git repository. If not in the user's device library, retrieve the image pack from the original conversation attachment.

## Two-pass creative workflow

### Pass 1: one-image geometry study (preferred)

1. Get permission to use the octopus reference on Meshy. Open **Model → Image to 3D**, High Detail / Meshy 7.1, 1 image.
2. Upload `01_front_reference.png`. Do **not** use the entire labeled 1080px collage.
3. With first run, choose Standard geometry; no texture is necessary for lime-green PLA FDM.
4. Generate. Inspect the mesh front, side, back and top. Look for fused tentacles, false stud/clasp geometry, invented back anatomy, collapsed negative spaces and missing suction cups.
5. Save the Meshy task URL/id and screenshot for the private project record. **Do not order printing yet.**
6. If Meshy copied the post, delete hardware by mesh edit/Blender and retain only body plus intentional **approved** attachment area (not a tiny fragile integrated post).

### Pass 2: upgrade source only if first mesh fails

Option A: **Make one cleaner artwork reference** first using Meshy's Image-generation/Image-to-image editor or another chosen image tool. This is a design-editing step requiring Carol's authorization. The prompts below are for **generating reference imagery**, not guaranteed parameters in Meshy's Image-to-3D panel.

**Front reference prompt (under 800 characters):**
```text
Orthographic FRONT product reference of ONE sculptural octopus jewelry pendant BODY, matching the supplied octopus concept's identity: bulbous expressive head, eight flowing asymmetrical tentacles with elegant curling tips, and visible round suction-cup relief. A complete single object with clear negative spaces between tentacles, centered upright, full silhouette visible, no cropping. Matte neutral gray clay material so geometry is readable, diffuse studio lighting, simple warm-white background. No metal stud, butterfly clutch, earring post, chain, label, dimensions, text, watermark, display stand, second object or human. Preserve the source silhouette and style; do not redesign the animal.
```

**Side view prompt (use approved front as image reference; do not make a new unrelated octopus):**
```text
Strict SIDE orthographic elevation of EXACTLY the same single octopus pendant body as in the approved front reference. Keep identical head geometry, tentacle count, curls, overlap, scale, clay material and lighting. Reveal genuine depth and backside volume; do not add new appendages or jewelry hardware. Center the entire object on the same warm-white background, same camera distance and vertical orientation. No caption or dimensions. This image is one supplementary view of the same object, not a new design.
```

**Back view prompt (use the same approved front as reference):**
```text
Strict BACK orthographic elevation of EXACTLY the same octopus pendant body from the approved front. Preserve the same eight tentacles and their distinct curls, head proportions, depth, material and light. Show the actual reverse of those same forms, without inventing extra tentacles or adding studs, clips, chains, labels, logos or captions. Entire silhouette centered, same size on warm-white background. Consistent with the front and side views.
```

**Three-quarter view prompt (optional fourth image):**
```text
Three-quarter 45-degree product reference of the SAME octopus pendant body as the approved front and side, not a new design. Preserve head, tentacle placement, eight curled tips, suction cup relief and relative thickness. Neutral matte gray clay, same scale, clear full silhouette, simple warm-white background, even light, no jewelry hardware, text, label, stand or extra object.
```

Quality gate: visually compare all views one by one for matching silhouette and tentacle structure. If they differ, **do not submit as Meshy multi-view**. One reliable view is better than three contradictory views.

Option B: use the **existing cropped side/back views** as multi-view, *only* after confirming the actual shapes are coherent. Multi-view may cost credits; do not run it automatically.

## Geometry → printable STL

1. Export **raw** GLB/OBJ and STL with source ID, date and version to private storage.
2. Separate/remove post and butterfly clasp; confirm a robust attachment strategy **independent of Meshy**. Do not assume Meshy's metal findings are printable or structurally viable.
3. Define actual physical target height with Carol. The illustration's “55 mm” is provisional and might include hardware.
4. Blender/Mesh repair: close unintended holes, check manifold watertightness, disconnected islands, face normals, visible self-intersections, thin tentacles, cup details, and clearances at the chosen FDM nozzle.
5. Make one **size and silhouette prototype**, not final wearable earrings. For small curled tentacles, first compare vertical vs flat printing and supports in the actual operator's slicer.
6. Export `carol_octopus_fdm_v01.stl` and (optional) `carol_octopus_fdm_v01.3mf`; record units **millimeters**, bounding box, triangle count, wall features, slicer orientation, material/nozzle/estimated hours and grams.
7. Preview the STL locally on Carol's project page using the new **“Preview an STL from this device”** control. The selected file stays in that browser and does not upload. Client-facing hosted file remains separate and requires privacy gates.
8. Only after geometry is validated and Carol permits vendor sharing, provide the exact same STL + spec to both Augustos for comparable quotes.

## 3D viewer / GitHub workflow

Existing branch PR: https://github.com/moisestech/infra24/pull/37

- Component: `components/dcc/fabrication/proposal/FdmStlViewer.tsx` — three.js orbit view, lime-green preview tint, triangle count and STL bounds, local-file browse input, private-storage backend as a separate path.
- Routes: `/fabricate/proposals/carol-haggiag/octopus` and `/fabricate/proposals/carol-haggiag/chicken-foot`; dashboard links the two under Carol.
- Optional local file selection does NOT save the STL or send it to server. Important: viewer-only success ≠ printable / priced / paid / safe-to-wear.
- Client page access currently uses a shared proposal unlock cookie. **Do not deploy client-confidential hosted STL without client-scoped access control.**

## First-run acceptance sheet

| Criterion | Pass only if... |
|---|---|
| Reference fidelity | Recognizably reflects Carol's approved design, without a phantom stud or doubled tentacles |
| Shape | Correct number of distinct appendages and clean gaps |
| Mesh topology | Manifold watertight (or explicitly planned multipart geometry), no floating parts |
| Scale | Physical size in mm approved; octopus alone vs hardware length clarified |
| FDM | Thin features and supports reviewed for **actual** machine and nozzle |
| Material | High-vis lime-green PLA availability verified with the operator |
| Operator quote | Both jobs independently priced; octopus workshop entitlement separately checked |
| Sharing | Client authorized tool upload and later external operator sharing |
| Public use | No social / case study without distinct permission |

## Next recorded outcome

No Meshy task was run or paid credits spent here. First user action is to upload the **front crop** to Meshy and capture a draft screenshot + STL/GLB; then inspect it in the repo viewer locally. No client price is final.

## Meshy 2026 printability verification update

Meshy's Print workflow offers a Printability card and a `Print Check` to identify watertightness, holes and non-manifold edges; `Make Printable` may repair and thicken geometry (and may consume credits). For an FDM physical test, the official guide gives approximately 1.2 mm minimum wall thickness as an *illustrative* starting value dependent on nozzle diameter. **Do not assume that is sufficient for unsupported curled tentacles or the attachment ring**: the selected operator must test orientation, contact points, effective neck thickness, break risk and post-processing. The Print menu allows mm resizing/download as STL/3MF, sometimes plan-gated. All STL dimensions must still be verified in a slicer.

Official: https://docs.meshy.ai/en/webapp/guides/use-cases/3d-printing

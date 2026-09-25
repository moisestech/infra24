# DCC 3D School — asset production checklist

Drop files into [`public/dcc/education/3d-curriculum/`](../../public/dcc/education/3d-curriculum/) using the exact filename, then set `src` on the matching record in [`lib/dcc/education/3d-curriculum/assets.ts`](../../lib/dcc/education/3d-curriculum/assets.ts).

Until `src` is set, the UI shows a labeled placeholder (title, purpose, filename, ratio). Do not use Unsplash, documentary Studio 43 photography, or generic AI stock.

No prices, logos, readable software UI, or invented instructor portraits.

Manifest source of truth: `lib/dcc/education/3d-curriculum/assets.ts`.

| ID | Asset | Ratio | Page | Status |
|---|---|---|---|---|
| 3D-HERO-001 | Main 3D School hero | 16:9 | 3D School | Cloudinary wired |
| 3D-MAP-001 | 3D modeling mental models (future illustration; v1 is HTML) | 16:9 | 3D School | TODO |
| 3D-PIPELINE-001 | Digital-to-physical pipeline | 21:9 | 3D School + Foundation | TODO |
| 3D-FOUNDATION-HERO-001 | From File to Physical Object hero | 16:9 | Foundation | Cloudinary wired |
| 3D-FOUNDATION-FORMATS-001 | STL / OBJ / STEP / 3MF comparison | 4:3 | Foundation | TODO |
| 3D-FOUNDATION-PRINTABILITY-001 | Printability problems | 4:3 | Foundation | TODO |
| 3D-BLENDER-HERO-001 | Blender for Artists hero | 16:9 | Blender | Cloudinary wired |
| 3D-BLENDER-STAGES-001 | Primitive → printed | 21:9 | Blender | TODO |
| 3D-BLENDER-OBJECT-001 | Student-scale sculptural object | 4:5 | Blender | TODO |
| 3D-PLASTICITY-HERO-001 | Plasticity for Artists hero | 16:9 | Plasticity | Cloudinary wired |
| 3D-PLASTICITY-BOOLEAN-001 | Boolean cut / join | 4:3 | Plasticity | TODO |
| 3D-PLASTICITY-STUDIO-OBJECTS-001 | Studio object set | 21:9 | Plasticity | TODO |
| 3D-PLASTICITY-BRIDGE-001 | Plasticity → Blender → slicer → print | 16:9 | Plasticity | TODO |
| 3D-RHINO-HERO-001 | Rhino for Artists hero | 16:9 | Rhino | Cloudinary wired |
| 3D-RHINO-JEWELRY-001 | Precision wearable | 4:3 | Rhino | TODO |
| 3D-FIX-HERO-001 | Fix My 3D File hero | 16:9 | Fix My File | Cloudinary wired |
| 3D-FIX-DIAGNOSIS-001 | Diagnosis examples | 21:9 | Fix My File | TODO |
| 3D-GRASSHOPPER-HERO-001 | Grasshopper hero | 16:9 | Grasshopper | Cloudinary wired |
| 3D-PARAMETRIC-HERO-001 | Parametric CAD hero | 16:9 | Parametric CAD | Cloudinary wired |
| 3D-OPERATOR-PATH-001 | Learn → future operator pathway | 21:9 | 3D School path | TODO |

## Visual purpose (short)

- **3D-HERO-001** — Three modeling languages converging into one printed object. No baked-in text.
- **3D-MAP-001** — Mesh / solid / NURBS / parametric converging toward fabrication. Optional later; the live map is HTML/CSS.
- **3D-PIPELINE-001** — Idea → Model → Prepare → Slice → Fabricate → Review → Document.
- **3D-FOUNDATION-HERO-001** — Digital model through inspection and slicing into a small print.
- **3D-FOUNDATION-FORMATS-001** — STL, OBJ, STEP, 3MF as distinct objects. No captions inside the frame.
- **3D-FOUNDATION-PRINTABILITY-001** — Thin wall, floating geometry, bad orientation, unsupported overhang.
- **3D-BLENDER-HERO-001** — Primitive evolving into a strange printable sculpture. Not generic Blender tutorial chrome.
- **3D-BLENDER-STAGES-001** — Primitive → modified → sculpted → repaired → printed.
- **3D-BLENDER-OBJECT-001** — Workshop-scale sculptural object.
- **3D-PLASTICITY-HERO-001** — Precise but playful functional object: solids, cuts, fillets.
- **3D-PLASTICITY-BOOLEAN-001** — A solid being cut or joined.
- **3D-PLASTICITY-STUDIO-OBJECTS-001** — Phone stand, bracket, lamp part, enclosure, pedestal connector. Artist-made, not catalog gloss.
- **3D-PLASTICITY-BRIDGE-001** — Plasticity → Blender → Bambu Studio → print.
- **3D-RHINO-HERO-001** — Jewelry-like / precision curved object. Avoid architecture wireframe clichés.
- **3D-RHINO-JEWELRY-001** — Curves → surface → fabricated wearable prototype.
- **3D-FIX-HERO-001** — Broken mesh becoming clean printable geometry.
- **3D-FIX-DIAGNOSIS-001** — Open mesh, non-manifold, thin wall, intersections, wrong scale.
- **3D-GRASSHOPPER-HERO-001** — One base form proliferating into a family. Not a node-graph screenshot.
- **3D-PARAMETRIC-HERO-001** — Functional object visibly driven by dimensions.
- **3D-OPERATOR-PATH-001** — Learn → practice → fabricate → assist → document → future verified operator.

## Custom icons (not this pass)

Search the UI for `ASSET_TODO` — Lucide stand-ins for mesh, solid, curve, dimensions, print, repair, slice, material, machine, instructor, skill level, time, participants.

import type {
  AssetProductionStatus,
  ThreeDCurriculumAsset,
  ThreeDCurriculumAssetFocalPoint,
  ThreeDCurriculumAssetId,
} from '@/lib/dcc/education/3d-curriculum/types'

const BASE = '/dcc/education/3d-curriculum'

export const THREE_D_CURRICULUM_CDN =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto'

export const ASSET_PRODUCTION_STATUS_LABEL: Record<AssetProductionStatus, string> = {
  placeholder: 'Placeholder',
  'generated-candidate': 'Generated candidate',
  approved: 'Approved',
  'needs-regeneration': 'Needs regeneration',
  deferred: 'Deferred (native HTML preferred)',
}

export const PRIMARY_HERO_ASSET_IDS = [
  '3D-HERO-001',
  '3D-FOUNDATION-HERO-001',
  '3D-BLENDER-HERO-001',
  '3D-PLASTICITY-HERO-001',
  '3D-RHINO-HERO-001',
  '3D-FIX-HERO-001',
  '3D-GRASSHOPPER-HERO-001',
  '3D-PARAMETRIC-HERO-001',
] as const satisfies readonly ThreeDCurriculumAssetId[]

function cdn(path: string): string {
  return `${THREE_D_CURRICULUM_CDN}${path}`
}

function slot(
  asset: Omit<ThreeDCurriculumAsset, 'src'> & {
    src?: string
  }
): ThreeDCurriculumAsset {
  const { src, ...rest } = asset
  return { ...rest, src }
}

export function focalPointToObjectPosition(
  focalPoint: ThreeDCurriculumAssetFocalPoint
): string {
  return `${Math.round(focalPoint.x * 100)}% ${Math.round(focalPoint.y * 100)}%`
}

export function curriculumAssetObjectPosition(
  asset: ThreeDCurriculumAsset
): string | undefined {
  if (asset.objectPosition) return asset.objectPosition
  if (asset.focalPoint) return focalPointToObjectPosition(asset.focalPoint)
  return undefined
}

export function isCurriculumAssetRenderable(asset: ThreeDCurriculumAsset): boolean {
  if (!asset.src?.trim()) return false
  return (
    asset.productionStatus !== 'placeholder' &&
    asset.productionStatus !== 'deferred'
  )
}

/**
 * Swap-ready 3D School media.
 * Update `src` and `productionStatus` here only — presentation components read the manifest.
 */
export const THREE_D_CURRICULUM_ASSETS: Record<
  ThreeDCurriculumAssetId,
  ThreeDCurriculumAsset
> = {
  '3D-HERO-001': slot({
    id: '3D-HERO-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'DCC 3D School Hero',
    alt: 'Three distinct digital forms show mesh, solid CAD, and precision surface modeling together on a fabrication workbench.',
    promptPurpose:
      'Three forms or modeling languages converging into one physical printed object. No text baked into the image.',
    usedOn: ['/workshop/3d-school'],
    visualVerb: 'compare',
    focalPoint: { x: 0.5, y: 0.45 },
    notes:
      'Hub triptych: mesh left, solid center, precision right. Optional foreground print. Next asset to generate.',
  }),
  '3D-MAP-001': slot({
    id: '3D-MAP-001',
    productionStatus: 'deferred',
    filename: 'dcc-3d-map-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: '3D Modeling Mental Models Diagram',
    alt: 'Diagram of mesh, solid, NURBS, and parametric modeling languages converging toward fabrication.',
    promptPurpose:
      'Represent mesh, solid, NURBS / precision, and parametric approaches converging toward fabrication. Future illustration — v1 of the map is native HTML.',
    usedOn: ['/workshop/3d-school#curriculum-map'],
    notes: 'Live map is native HTML in CurriculumMap — defer raster unless editorial need arises.',
  }),
  '3D-PIPELINE-001': slot({
    id: '3D-PIPELINE-001',
    productionStatus: 'deferred',
    filename: 'dcc-3d-pipeline-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Digital-to-Physical Pipeline',
    alt: 'Wide sequence from idea through model, prepare, slice, fabricate, review, and document.',
    promptPurpose:
      'Idea → Model → Prepare → Slice → Fabricate → Review → Document as a wide landscape pipeline.',
    usedOn: ['/workshop/3d-school', '/workshop/3d-school/from-file-to-physical-object'],
    notes: 'WorkflowStrip is the live pipeline — defer raster.',
  }),
  '3D-FOUNDATION-HERO-001': slot({
    id: '3D-FOUNDATION-HERO-001',
    productionStatus: 'generated-candidate',
    filename: 'dcc-3d-foundation-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'From File to Physical Object hero',
    alt: 'A digital wireframe form moves through sliced layers into a physical 3D-printed object.',
    promptPurpose:
      'Digital geometry → slice layers → tangible print. The one workshop where wireframe/slice progression is primary.',
    usedOn: ['/workshop/3d-school/from-file-to-physical-object'],
    workshopSlug: 'from-file-to-physical-object',
    visualVerb: 'translate',
    focalPoint: { x: 0.5, y: 0.5 },
    src: cdn('/v1790040788/dccmiami/workshops/dcc-3d-foundation-hero-001_x0k9k5.webp'),
  }),
  '3D-FOUNDATION-FORMATS-001': slot({
    id: '3D-FOUNDATION-FORMATS-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-foundation-formats-001.webp',
    aspectRatio: '4/3',
    width: 1600,
    height: 1200,
    title: 'File format comparison',
    alt: 'The same simple object shown through visibly different geometric structures associated with different file types.',
    promptPurpose:
      'Same object as mesh, point cloud, solid body, and print-ready representation. No captions inside the frame.',
    usedOn: ['/workshop/3d-school/from-file-to-physical-object'],
    workshopSlug: 'from-file-to-physical-object',
    notes: 'Phase A secondary — after hero family approval.',
  }),
  '3D-FOUNDATION-PRINTABILITY-001': slot({
    id: '3D-FOUNDATION-PRINTABILITY-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-foundation-printability-001.webp',
    aspectRatio: '4/3',
    width: 1600,
    height: 1200,
    title: 'Printability problems',
    alt: 'One object showing thin walls, floating geometry, bad orientation, and an unsupported overhang.',
    promptPurpose:
      'One object showing common printability problems: thin wall, floating geometry, bad orientation, unsupported overhang.',
    usedOn: ['/workshop/3d-school/from-file-to-physical-object'],
    workshopSlug: 'from-file-to-physical-object',
    notes: 'Phase A secondary — after hero family approval.',
  }),
  '3D-BLENDER-HERO-001': slot({
    id: '3D-BLENDER-HERO-001',
    productionStatus: 'needs-regeneration',
    filename: 'dcc-3d-blender-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Blender for Artists hero',
    alt: 'A sculptural form combines visible polygon topology, primitive geometry, and smooth organic mutations.',
    promptPurpose:
      'Primitives becoming strange through artistic manipulation — mesh mutation, not slice layers.',
    usedOn: ['/workshop/3d-school/blender-for-artists'],
    workshopSlug: 'blender-for-artists',
    visualVerb: 'sculpt-mutate',
    focalPoint: { x: 0.5, y: 0.5 },
    src: cdn('/v1790040785/dccmiami/workshops/dcc-3d-blender-hero-001_sk65ak.webp'),
    notes: 'Current candidate reads too generative — regenerate with clear primitive → mutation progression.',
  }),
  '3D-BLENDER-STAGES-001': slot({
    id: '3D-BLENDER-STAGES-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-blender-stages-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Blender workshop stages',
    alt: 'A form shown as primitive, modified, sculpted, repaired, then printed.',
    promptPurpose: 'Primitive → Modified → Sculpted → Repaired → Printed.',
    usedOn: ['/workshop/3d-school/blender-for-artists'],
    workshopSlug: 'blender-for-artists',
    notes: 'Phase D secondary — 21:9 wide process.',
  }),
  '3D-BLENDER-OBJECT-001': slot({
    id: '3D-BLENDER-OBJECT-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-blender-object-001.webp',
    aspectRatio: '4/5',
    width: 1280,
    height: 1600,
    title: 'Student-scale Blender object',
    alt: 'A small sculptural object at a scale that could be finished during a workshop session.',
    promptPurpose:
      'Workshop-scale strange sculpture — achievable in session, not museum perfection.',
    usedOn: ['/workshop/3d-school/blender-for-artists'],
    workshopSlug: 'blender-for-artists',
    notes: 'Phase B secondary — 4:5 project image.',
  }),
  '3D-PLASTICITY-HERO-001': slot({
    id: '3D-PLASTICITY-HERO-001',
    productionStatus: 'generated-candidate',
    filename: 'dcc-3d-plasticity-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Plasticity for Artists hero',
    alt: 'A precise bracket-like form develops through solid volumes, boolean openings, fillets, and a fabricated prototype.',
    promptPurpose:
      'One coherent object: solids, boolean subtraction, fillets, chamfers — harder and more controlled than mesh sculpting.',
    usedOn: ['/workshop/3d-school/plasticity-for-artists'],
    workshopSlug: 'plasticity-for-artists',
    visualVerb: 'cut-join-fillet',
    focalPoint: { x: 0.5, y: 0.5 },
    src: cdn('/v1790040794/dccmiami/workshops/dcc-3d-plasticity-hero-001_k1qvhf.webp'),
  }),
  '3D-PLASTICITY-BOOLEAN-001': slot({
    id: '3D-PLASTICITY-BOOLEAN-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-plasticity-boolean-001.webp',
    aspectRatio: '4/3',
    width: 1600,
    height: 1200,
    title: 'Boolean operations',
    alt: 'A solid being cut and joined through boolean operations.',
    promptPurpose:
      'Simple visualization of a solid being cut / joined through boolean operations.',
    usedOn: ['/workshop/3d-school/plasticity-for-artists'],
    workshopSlug: 'plasticity-for-artists',
    notes: 'Phase A secondary.',
  }),
  '3D-PLASTICITY-STUDIO-OBJECTS-001': slot({
    id: '3D-PLASTICITY-STUDIO-OBJECTS-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-plasticity-studio-objects-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Studio object projects',
    alt: 'A small collection of artist-made studio objects: phone stand, bracket, lamp component, enclosure, pedestal connector.',
    promptPurpose:
      '4–5 strange useful studio objects. Artist-made, not catalog gloss.',
    usedOn: ['/workshop/3d-school/plasticity-for-artists'],
    workshopSlug: 'plasticity-for-artists',
    notes: 'Phase D secondary — 21:9.',
  }),
  '3D-PLASTICITY-BRIDGE-001': slot({
    id: '3D-PLASTICITY-BRIDGE-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-plasticity-bridge-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Plasticity to print bridge',
    alt: 'A Plasticity object moving through Blender modification and a slicer toward a physical print.',
    promptPurpose:
      'Solid object → mesh/artistic manipulation → slicer → physical print.',
    usedOn: ['/workshop/3d-school/plasticity-for-artists'],
    workshopSlug: 'plasticity-for-artists',
    notes: 'Phase C secondary — do not repeat Foundation hero composition.',
  }),
  '3D-RHINO-HERO-001': slot({
    id: '3D-RHINO-HERO-001',
    productionStatus: 'generated-candidate',
    filename: 'dcc-3d-rhino-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Rhino for Artists hero',
    alt: 'Precise construction curves become a continuous jewelry-like surface and polished object.',
    promptPurpose:
      'Curve → surface → precise object. Sparse construction curves, not architecture wireframe clichés.',
    usedOn: ['/workshop/3d-school/rhino-for-artists'],
    workshopSlug: 'rhino-for-artists',
    visualVerb: 'curve-surface',
    focalPoint: { x: 0.5, y: 0.5 },
    src: cdn('/v1790040796/dccmiami/workshops/dcc-3d-rhino-hero-001_ufyvtt.webp'),
  }),
  '3D-RHINO-JEWELRY-001': slot({
    id: '3D-RHINO-JEWELRY-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-rhino-jewelry-001.webp',
    aspectRatio: '4/3',
    width: 1600,
    height: 1200,
    title: 'Precision wearable',
    alt: 'A jewelry-scale wearable moving from curves to surface to a fabricated prototype.',
    promptPurpose:
      'Curves → surface → fabricated wearable prototype at jewelry scale.',
    usedOn: ['/workshop/3d-school/rhino-for-artists'],
    workshopSlug: 'rhino-for-artists',
    notes: 'Phase A secondary.',
  }),
  '3D-FIX-HERO-001': slot({
    id: '3D-FIX-HERO-001',
    productionStatus: 'generated-candidate',
    filename: 'dcc-3d-fix-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Fix My 3D File hero',
    alt: 'A fragmented and damaged mesh progresses through repair stages into clean printable geometry.',
    promptPurpose:
      'Problematic geometry transitioning to watertight printable form. Coral on problems, teal on resolved.',
    usedOn: ['/workshop/3d-school/fix-my-3d-file'],
    workshopSlug: 'fix-my-3d-file',
    visualVerb: 'diagnose-repair',
    focalPoint: { x: 0.5, y: 0.5 },
    src: cdn('/v1790040786/dccmiami/workshops/dcc-3d-fix-hero-001_shqf2x.webp'),
  }),
  '3D-FIX-DIAGNOSIS-001': slot({
    id: '3D-FIX-DIAGNOSIS-001',
    productionStatus: 'placeholder',
    filename: 'dcc-3d-fix-diagnosis-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Mesh diagnosis examples',
    alt: 'Distinct examples of an open mesh, non-manifold geometry, a thin wall, intersecting parts, and wrong scale.',
    promptPurpose:
      'Five visually distinct failure zones — website supplies labels, not baked-in text.',
    usedOn: ['/workshop/3d-school/fix-my-3d-file'],
    workshopSlug: 'fix-my-3d-file',
    notes: 'Phase D secondary — 21:9.',
  }),
  '3D-GRASSHOPPER-HERO-001': slot({
    id: '3D-GRASSHOPPER-HERO-001',
    productionStatus: 'generated-candidate',
    filename: 'dcc-3d-grasshopper-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Grasshopper / computational objects hero',
    alt: 'A single procedural form develops into a family of related variations driven by the same geometric rule.',
    promptPurpose:
      'One rule, many legitimate outcomes — not node-graph screenshots or generic generative blobs.',
    usedOn: ['/workshop/3d-school/grasshopper-computational-objects'],
    workshopSlug: 'grasshopper-computational-objects',
    visualVerb: 'vary-proliferate',
    focalPoint: { x: 0.5, y: 0.5 },
    src: cdn('/v1790040789/dccmiami/workshops/dcc-3d-grasshopper-hero-001_vmcv6q.webp'),
  }),
  '3D-PARAMETRIC-HERO-001': slot({
    id: '3D-PARAMETRIC-HERO-001',
    productionStatus: 'generated-candidate',
    filename: 'dcc-3d-parametric-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Parametric CAD hero',
    alt: 'An adjustable mechanical bracket shows constrained linear and rotational movement through ghosted positions.',
    promptPurpose:
      'Functional assembly where geometry depends on relationships and constraints — not direct form-making like Plasticity.',
    usedOn: ['/workshop/3d-school/parametric-cad-functional-objects'],
    workshopSlug: 'parametric-cad-functional-objects',
    visualVerb: 'constrain-assemble',
    focalPoint: { x: 0.5, y: 0.5 },
    src: cdn('/v1790040793/dccmiami/workshops/dcc-3d-parametric-hero-001_urvc3c.webp'),
  }),
  '3D-OPERATOR-PATH-001': slot({
    id: '3D-OPERATOR-PATH-001',
    productionStatus: 'deferred',
    filename: 'dcc-3d-operator-path-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Learning to operator pathway',
    alt: 'Diagram of learn, practice, fabricate, assist, document, then a future verified operator pathway.',
    promptPurpose:
      'Learn → Practice → Fabricate → Assist → Document → Verified Operator, with Verified Operator clearly labeled as a future pathway.',
    usedOn: ['/workshop/3d-school#path'],
    notes: 'LearningPath native <ol> is the live representation — defer raster.',
  }),
}

export const THREE_D_CURRICULUM_ASSET_IDS = Object.keys(
  THREE_D_CURRICULUM_ASSETS
) as ThreeDCurriculumAssetId[]

export function getCurriculumAsset(
  id: ThreeDCurriculumAssetId
): ThreeDCurriculumAsset {
  return THREE_D_CURRICULUM_ASSETS[id]
}

export function listCurriculumAssets(): ThreeDCurriculumAsset[] {
  return THREE_D_CURRICULUM_ASSET_IDS.map((id) => THREE_D_CURRICULUM_ASSETS[id])
}

export function listPrimaryHeroAssets(): ThreeDCurriculumAsset[] {
  return PRIMARY_HERO_ASSET_IDS.map((id) => THREE_D_CURRICULUM_ASSETS[id])
}

export function curriculumAssetPublicPath(filename: string): string {
  return `${BASE}/${filename}`
}

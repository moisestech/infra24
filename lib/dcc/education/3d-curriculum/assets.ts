import type {
  ThreeDCurriculumAsset,
  ThreeDCurriculumAssetId,
} from '@/lib/dcc/education/3d-curriculum/types'

const BASE = '/dcc/education/3d-curriculum'

const THREE_D_CURRICULUM_CDN =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto'

function cdn(path: string): string {
  return `${THREE_D_CURRICULUM_CDN}${path}`
}

function slot(
  asset: Omit<ThreeDCurriculumAsset, 'src' | 'status'> & {
    src?: string
  }
): ThreeDCurriculumAsset {
  return {
    ...asset,
    status: asset.src ? 'ready' : 'placeholder',
    src: asset.src,
  }
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

export const SUPPORTING_READY_ASSET_IDS = [
  '3D-MAP-001',
  '3D-PIPELINE-001',
  '3D-FOUNDATION-FORMATS-001',
  '3D-FOUNDATION-PRINTABILITY-001',
  '3D-PLASTICITY-STUDIO-OBJECTS-001',
  '3D-SCHOOL-OVERALL-LANDSCAPE-001',
] as const satisfies readonly ThreeDCurriculumAssetId[]

/**
 * Swap-ready 3D School media.
 * Drop files into `public/dcc/education/3d-curriculum/` using `filename`,
 * then set `src` (local `${BASE}/${filename}` or a Cloudinary URL).
 */
export const THREE_D_CURRICULUM_ASSETS: Record<
  ThreeDCurriculumAssetId,
  ThreeDCurriculumAsset
> = {
  '3D-HERO-001': slot({
    id: '3D-HERO-001',
    filename: 'dcc-3d-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'DCC 3D School Hero',
    alt: 'Three contrasting digital forms — mesh, solid CAD, and precision surfaces — converging toward one fabricated object.',
    promptPurpose:
      'Three forms or modeling languages converging into one physical printed object. No text baked into the image.',
    usedOn: ['/workshop/3d-school'],
    src: cdn('/v1790040791/dccmiami/workshops/dcc-3d-hero-001_l3l3ps.webp'),
  }),
  '3D-MAP-001': slot({
    id: '3D-MAP-001',
    filename: 'dcc-3d-map-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: '3D Modeling Mental Models Diagram',
    alt: 'Diagram of mesh, solid, NURBS, and parametric modeling languages converging toward fabrication.',
    promptPurpose:
      'Represent mesh, solid, NURBS / precision, and parametric approaches converging toward fabrication. Future illustration — v1 of the map is native HTML.',
    usedOn: ['/workshop/3d-school#curriculum-map'],
    src: cdn('/v1790377947/dccmiami/workshops/dcc-3d-map-001_slnkul.webp'),
  }),
  '3D-PIPELINE-001': slot({
    id: '3D-PIPELINE-001',
    filename: 'dcc-3d-pipeline-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Digital-to-Physical Pipeline',
    alt: 'Wide sequence from idea through model, prepare, slice, fabricate, review, and document.',
    promptPurpose:
      'Idea → Model → Prepare → Slice → Fabricate → Review → Document as a wide landscape pipeline.',
    usedOn: ['/workshop/3d-school', '/workshop/3d-school/from-file-to-physical-object'],
    src: cdn('/v1790377950/dccmiami/workshops/dcc-3d-pipeline-001_gox1wg.webp'),
  }),
  '3D-FOUNDATION-HERO-001': slot({
    id: '3D-FOUNDATION-HERO-001',
    filename: 'dcc-3d-foundation-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'From File to Physical Object hero',
    alt: 'A digital model passing through inspection and slicing and becoming a small physical print.',
    promptPurpose:
      'A digital model passing through inspection, slicing and becoming a small physical print.',
    usedOn: ['/workshop/3d-school/from-file-to-physical-object'],
    src: cdn('/v1790040788/dccmiami/workshops/dcc-3d-foundation-hero-001_x0k9k5.webp'),
  }),
  '3D-FOUNDATION-FORMATS-001': slot({
    id: '3D-FOUNDATION-FORMATS-001',
    filename: 'dcc-3d-foundation-formats-001.webp',
    aspectRatio: '4/3',
    width: 1600,
    height: 1200,
    title: 'File format comparison',
    alt: 'Visual comparison of STL, OBJ, STEP, and 3MF as distinct object representations.',
    promptPurpose:
      'Visual comparison of STL, OBJ, STEP, and 3MF. No small explanatory text inside the image.',
    usedOn: ['/workshop/3d-school/from-file-to-physical-object'],
    src: cdn('/v1790377940/dccmiami/workshops/dcc-3d-foundation-formats-001_lpdp9k.webp'),
  }),
  '3D-FOUNDATION-PRINTABILITY-001': slot({
    id: '3D-FOUNDATION-PRINTABILITY-001',
    filename: 'dcc-3d-foundation-printability-001.webp',
    aspectRatio: '4/3',
    width: 1600,
    height: 1200,
    title: 'Printability problems',
    alt: 'One object showing thin walls, floating geometry, bad orientation, and an unsupported overhang.',
    promptPurpose:
      'One object showing common printability problems: thin wall, floating geometry, bad orientation, unsupported overhang.',
    usedOn: ['/workshop/3d-school/from-file-to-physical-object'],
    src: cdn('/v1790377942/dccmiami/workshops/dcc-3d-foundation-printability-001_g5ugtd.webp'),
  }),
  '3D-BLENDER-HERO-001': slot({
    id: '3D-BLENDER-HERO-001',
    filename: 'dcc-3d-blender-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Blender for Artists hero',
    alt: 'A simple sculptural object evolving from primitive geometry into a strange but printable form.',
    promptPurpose:
      'Simple sculptural object evolving from primitive geometry into a strange but printable form. Artistic, not generic Blender tutorial imagery.',
    usedOn: ['/workshop/3d-school/blender-for-artists'],
    src: cdn('/v1790040785/dccmiami/workshops/dcc-3d-blender-hero-001_sk65ak.webp'),
  }),
  '3D-BLENDER-STAGES-001': slot({
    id: '3D-BLENDER-STAGES-001',
    filename: 'dcc-3d-blender-stages-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Blender workshop stages',
    alt: 'A form shown as primitive, modified, sculpted, repaired, then printed.',
    promptPurpose: 'Primitive → Modified → Sculpted → Repaired → Printed.',
    usedOn: ['/workshop/3d-school/blender-for-artists'],
  }),
  '3D-BLENDER-OBJECT-001': slot({
    id: '3D-BLENDER-OBJECT-001',
    filename: 'dcc-3d-blender-object-001.webp',
    aspectRatio: '4/5',
    width: 1280,
    height: 1600,
    title: 'Student-scale Blender object',
    alt: 'A small sculptural object at a scale that could be finished during a workshop session.',
    promptPurpose:
      'A believable student-scale object that could be completed during the workshop.',
    usedOn: ['/workshop/3d-school/blender-for-artists'],
  }),
  '3D-PLASTICITY-HERO-001': slot({
    id: '3D-PLASTICITY-HERO-001',
    filename: 'dcc-3d-plasticity-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Plasticity for Artists hero',
    alt: 'A precise but playful functional object made from solids, cuts, fillets, and smooth surfaces.',
    promptPurpose:
      'Precise but playful functional object composed through solids, cuts, fillets and smooth surfaces.',
    usedOn: ['/workshop/3d-school/plasticity-for-artists'],
    src: cdn('/v1790040794/dccmiami/workshops/dcc-3d-plasticity-hero-001_k1qvhf.webp'),
  }),
  '3D-PLASTICITY-BOOLEAN-001': slot({
    id: '3D-PLASTICITY-BOOLEAN-001',
    filename: 'dcc-3d-plasticity-boolean-001.webp',
    aspectRatio: '4/3',
    width: 1600,
    height: 1200,
    title: 'Boolean operations',
    alt: 'A solid being cut and joined through boolean operations.',
    promptPurpose:
      'Simple visualization of a solid being cut / joined through boolean operations.',
    usedOn: ['/workshop/3d-school/plasticity-for-artists'],
  }),
  '3D-PLASTICITY-STUDIO-OBJECTS-001': slot({
    id: '3D-PLASTICITY-STUDIO-OBJECTS-001',
    filename: 'dcc-3d-plasticity-studio-objects-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Studio object projects',
    alt: 'A small collection of artist-made studio objects: phone stand, bracket, lamp component, enclosure, pedestal connector.',
    promptPurpose:
      'Small collection of potential student projects: phone stand, bracket, lamp component, electronics enclosure, pedestal connector. Experimental and artist-made, not a glossy product catalog.',
    usedOn: ['/workshop/3d-school/plasticity-for-artists'],
    src: cdn('/v1790377945/dccmiami/workshops/dcc-3d-plasticity-studio-objects-001_c4ktms.webp'),
  }),
  '3D-PLASTICITY-BRIDGE-001': slot({
    id: '3D-PLASTICITY-BRIDGE-001',
    filename: 'dcc-3d-plasticity-bridge-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Plasticity to print bridge',
    alt: 'A Plasticity object moving through Blender modification and a slicer toward a physical print.',
    promptPurpose:
      'Plasticity object → Blender modification/render → Bambu Studio → physical print.',
    usedOn: ['/workshop/3d-school/plasticity-for-artists'],
  }),
  '3D-RHINO-HERO-001': slot({
    id: '3D-RHINO-HERO-001',
    filename: 'dcc-3d-rhino-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Rhino for Artists hero',
    alt: 'A precision curved object with jewelry-like geometry built from surfaces.',
    promptPurpose:
      'Precision curved object / jewelry-like geometry / surface construction. Avoid architecture-wireframe clichés.',
    usedOn: ['/workshop/3d-school/rhino-for-artists'],
    src: cdn('/v1790040796/dccmiami/workshops/dcc-3d-rhino-hero-001_ufyvtt.webp'),
  }),
  '3D-RHINO-JEWELRY-001': slot({
    id: '3D-RHINO-JEWELRY-001',
    filename: 'dcc-3d-rhino-jewelry-001.webp',
    aspectRatio: '4/3',
    width: 1600,
    height: 1200,
    title: 'Precision wearable',
    alt: 'A jewelry-scale wearable moving from curves to surface to a fabricated prototype.',
    promptPurpose:
      'Precision wearable / jewelry component going from curves to surface to fabricated prototype.',
    usedOn: ['/workshop/3d-school/rhino-for-artists'],
  }),
  '3D-FIX-HERO-001': slot({
    id: '3D-FIX-HERO-001',
    filename: 'dcc-3d-fix-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Fix My 3D File hero',
    alt: 'A broken digital mesh on one side becoming clean printable geometry on the other.',
    promptPurpose:
      'Broken/glitched digital mesh on one side becoming clean printable geometry on the other.',
    usedOn: ['/workshop/3d-school/fix-my-3d-file'],
    src: cdn('/v1790040786/dccmiami/workshops/dcc-3d-fix-hero-001_shqf2x.webp'),
  }),
  '3D-FIX-DIAGNOSIS-001': slot({
    id: '3D-FIX-DIAGNOSIS-001',
    filename: 'dcc-3d-fix-diagnosis-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Mesh diagnosis examples',
    alt: 'Distinct examples of an open mesh, non-manifold geometry, a thin wall, intersecting parts, and wrong scale.',
    promptPurpose:
      'Open mesh, non-manifold geometry, thin wall, intersecting parts, and wrong scale shown as visually distinct examples.',
    usedOn: ['/workshop/3d-school/fix-my-3d-file'],
  }),
  '3D-GRASSHOPPER-HERO-001': slot({
    id: '3D-GRASSHOPPER-HERO-001',
    filename: 'dcc-3d-grasshopper-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Grasshopper / computational objects hero',
    alt: 'A simple base geometry proliferating into a rule-driven family of related forms.',
    promptPurpose:
      'A simple base geometry proliferating into a rule-driven family of forms. Do not rely on screenshots of node graphs as the hero.',
    usedOn: ['/workshop/3d-school/grasshopper-computational-objects'],
    src: cdn('/v1790040789/dccmiami/workshops/dcc-3d-grasshopper-hero-001_vmcv6q.webp'),
  }),
  '3D-PARAMETRIC-HERO-001': slot({
    id: '3D-PARAMETRIC-HERO-001',
    filename: 'dcc-3d-parametric-hero-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: 'Parametric CAD hero',
    alt: 'A functional object whose geometry visibly responds to dimensions and constraints.',
    promptPurpose:
      'Functional object whose geometry visibly responds to dimensions and constraints.',
    usedOn: ['/workshop/3d-school/parametric-cad-functional-objects'],
    src: cdn('/v1790040793/dccmiami/workshops/dcc-3d-parametric-hero-001_urvc3c.webp'),
  }),
  '3D-OPERATOR-PATH-001': slot({
    id: '3D-OPERATOR-PATH-001',
    filename: 'dcc-3d-operator-path-001.webp',
    aspectRatio: '21/9',
    width: 1920,
    height: 823,
    title: 'Learning to operator pathway',
    alt: 'Diagram of learn, practice, fabricate, assist, document, then a future verified operator pathway.',
    promptPurpose:
      'Learn → Practice → Fabricate → Assist → Document → Verified Operator, with Verified Operator clearly labeled as a future pathway.',
    usedOn: ['/workshop/3d-school#path'],
  }),
  '3D-SCHOOL-OVERALL-LANDSCAPE-001': slot({
    id: '3D-SCHOOL-OVERALL-LANDSCAPE-001',
    filename: 'dcc-3d-school-overall-landscape-001.webp',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    title: '3D School overall landscape',
    alt: 'Mesh, solid, and surface forms together in a studio landscape — an editorial view of DCC 3D School.',
    promptPurpose:
      'Overall 3D School landscape: mesh, solid, and surface forms together. No baked-in text.',
    usedOn: ['/workshop/3d-school'],
    src: cdn(
      '/v1790377952/dccmiami/workshops/dcc-3d-school-overall-landscape-001_jcimkg.webp'
    ),
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

export function listCurriculumHeroAssets(): ThreeDCurriculumAsset[] {
  return PRIMARY_HERO_ASSET_IDS.map((id) => THREE_D_CURRICULUM_ASSETS[id]).filter(
    (asset) => Boolean(asset.src?.trim())
  )
}

export function curriculumAssetPublicPath(filename: string): string {
  return `${BASE}/${filename}`
}

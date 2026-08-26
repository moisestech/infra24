/**
 * Conceptual educational photography for DCC 3D workshops.
 * Files currently live in the resin Cloudinary folder; IDs stay semantic.
 * These are not documentary class, shop, or participant photos.
 */

const CLOUD = 'dck5rzi4h'
const FOLDER = 'dccmiami/workshops/resin-printing-for-artist'

function still(version: number, fileWithHashAndExt: string): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/q_auto,f_auto/v${version}/${FOLDER}/${fileWithHashAndExt}`
}

export const CONCEPTUAL_EDUCATIONAL_CAPTION = 'Conceptual educational image'

/** Wired into /workshop/3d-printing-for-artists and /workshop/ai-3d-physical-object. */
export const DCC_EDUCATION_PHOTO_STILLS = {
  '3d-printing-machine-detail': still(
    1787769803,
    '3d-printing-machine-detail-conceptual-01_kmveml.webp'
  ),
  '3d-printing-support-removal': still(
    1787769804,
    '3d-printing-support-removal-detail-conceptual-01_w5ldpd.webp'
  ),
  '3d-printing-finishing': still(
    1787769803,
    '3d-printing-finishing-detail-conceptual-01_iik87w.webp'
  ),
  '3d-printing-measure-validate': still(
    1787769804,
    '3d-printing-measure-validate-conceptual-01_ymz0by.webp'
  ),
  '3d-printing-finish-comparison': still(
    1787769803,
    '3d-printing-finish-comparison-conceptual-01_fhi1mu.webp'
  ),
  'ai-3d-concept-selection': still(
    1787769809,
    'ai-3d-concept-selection-conceptual-01_oslhi3.webp'
  ),
  'ai-3d-model-review': still(
    1787769810,
    'ai-3d-model-review-conceptual-01_nv9zlv.webp'
  ),
  'ai-3d-slicing': still(
    1787769809,
    'ai-3d-slicing-detail-conceptual-01_pwzbw6.webp'
  ),
  'ai-3d-finishing': still(
    1787769810,
    'ai-3d-finishing-detail-conceptual-01_mxvroy.webp'
  ),
  'ai-3d-measure-validate': still(
    1787769811,
    'ai-3d-measure-validate-conceptual-01_lyluq3.webp'
  ),
  'ai-3d-final-object': still(
    1787769808,
    'ai-3d-final-object-gallery-conceptual-01_njumg9.webp'
  ),
} as const

export type DccEducationPhotoStillId = keyof typeof DCC_EDUCATION_PHOTO_STILLS

/**
 * Uploaded to the same Cloudinary folder; not wired this pass.
 * Fabricate namespace — do not treat as documentary Studio 43 evidence.
 */
export const DCC_EDUCATION_PHOTO_HOLDS = {
  'fabricate-hero-conceptual': still(
    1787769817,
    '01-fabricate-hero-conceptual-01_hxs1v9.webp'
  ),
  'field-lab-joint-testing': still(
    1787769817,
    'field-lab-joint-testing-overhead-conceptual-01_tkk8ip.webp'
  ),
} as const

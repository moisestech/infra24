import type { ModuleBanner } from '@/lib/workshop-engine/types'

export const RESIN_BANNER_SIZE = { width: 1915, height: 821 } as const

const BASE = '/workshops/resin-printing/banners'

function banner(
  file: string,
  alt: string,
  accent: string
): ModuleBanner {
  return {
    src: `${BASE}/${file}.webp`,
    masterSrc: `${BASE}/png/${file}.png`,
    width: RESIN_BANNER_SIZE.width,
    height: RESIN_BANNER_SIZE.height,
    alt,
    objectPosition: 'center right',
    kind: 'illustration',
    accent,
  }
}

/**
 * Ultra-wide (21:9) illustrative module banners.
 * Titles/labels stay in HTML — never baked into the image.
 */
export const RESIN_MODULE_BANNERS: Record<string, ModuleBanner> = {
  welcome: banner(
    '00-welcome-join',
    'Illustrative translucent resin sculpture and cured sample arranged on a workshop table.',
    'cyan'
  ),
  'why-resin': banner(
    '01-why-resin',
    'Three illustrative resin studies showing fine organic detail, lattice structure, and smooth surface.',
    'ocean-cyan'
  ),
  'safety-zones': banner(
    '02-safety-zones',
    'Illustrative clean and controlled work areas separated by an amber boundary.',
    'amber'
  ),
  'complete-workflow': banner(
    '03-complete-workflow',
    'One sculptural form shown as digital, supported, cleaned, and finished states.',
    'cyan-amber'
  ),
  'file-readiness': banner(
    '04-file-printable',
    'Illustrative resin model under sectional and dimensional inspection.',
    'cyan'
  ),
  'slicer-lab': banner(
    '05-slicer-lab',
    'Supported resin model intersected by translucent slicing planes.',
    'cyan'
  ),
  'print-wash-cure': banner(
    '06-print-wash-cure',
    'Illustrative supported print, sealed wash vessel, and curing stage.',
    'amber-coral'
  ),
  'failure-clinic': banner(
    '07-failure-clinic',
    'Cured resin specimens displaying separation, warping, cracking, and support scarring.',
    'coral-rose'
  ),
  'project-readiness': banner(
    '08-project-readiness',
    'Finished resin project arranged with a closed project box and review materials.',
    'green'
  ),
}

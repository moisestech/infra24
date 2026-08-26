import type { ModuleBanner } from '@/lib/workshop-engine/types'
import { RESIN_BANNER_CDN } from '@/lib/workshop-engine/resin-printing/cloudinary'

export const RESIN_BANNER_SIZE = { width: 1915, height: 821 } as const

function banner(
  moduleId: keyof typeof RESIN_BANNER_CDN,
  alt: string,
  accent: string
): ModuleBanner {
  return {
    src: RESIN_BANNER_CDN[moduleId],
    width: RESIN_BANNER_SIZE.width,
    height: RESIN_BANNER_SIZE.height,
    alt,
    objectPosition: 'center right',
    kind: 'illustration',
    accent,
  }
}

/**
 * Ultra-wide (21:9) illustrative module banners from Cloudinary.
 * Titles/labels stay in HTML — never baked into the image.
 */
export const RESIN_MODULE_BANNERS: Record<string, ModuleBanner> = {
  welcome: banner(
    'welcome',
    'Illustrative translucent resin sculpture and cured sample arranged on a workshop table.',
    'cyan'
  ),
  'why-resin': banner(
    'why-resin',
    'Three illustrative resin studies showing fine organic detail, lattice structure, and smooth surface.',
    'ocean-cyan'
  ),
  'safety-zones': banner(
    'safety-zones',
    'Illustrative clean and controlled work areas separated by an amber boundary.',
    'amber'
  ),
  'complete-workflow': banner(
    'complete-workflow',
    'One sculptural form shown as digital, supported, cleaned, and finished states.',
    'cyan-amber'
  ),
  'file-readiness': banner(
    'file-readiness',
    'Illustrative resin model under sectional and dimensional inspection.',
    'cyan'
  ),
  'slicer-lab': banner(
    'slicer-lab',
    'Supported resin model intersected by translucent slicing planes.',
    'cyan'
  ),
  'print-wash-cure': banner(
    'print-wash-cure',
    'Illustrative supported print, sealed wash vessel, and curing stage.',
    'amber-coral'
  ),
  'failure-clinic': banner(
    'failure-clinic',
    'Cured resin specimens displaying separation, warping, cracking, and support scarring.',
    'coral-rose'
  ),
  'project-readiness': banner(
    'project-readiness',
    'Finished resin project arranged with a closed project box and review materials.',
    'green'
  ),
}

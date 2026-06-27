import { SATURDAY_LAB_CHEAT_SHEET_IMAGES, SATURDAY_LAB_CHEAT_SHEET_PDFS } from '@/lib/workshops/saturday-lab-media'

/** Handout URLs — PNG + PDF on Cloudinary. */
export const SATURDAY_LAB_HANDOUT_ASSETS = {
  beginnerPng: SATURDAY_LAB_CHEAT_SHEET_IMAGES.beginner,
  vibePng: SATURDAY_LAB_CHEAT_SHEET_IMAGES.vibeCoding,
  beginnerPdf: SATURDAY_LAB_CHEAT_SHEET_PDFS.beginner,
  vibePdf: SATURDAY_LAB_CHEAT_SHEET_PDFS.vibeCoding,
} as const

/**
 * Public student hub — site root, not under `/o/oolite`.
 * Middleware treats all `/workshop/*` as public (no Clerk sign-in).
 * Org workshop UI at `/o/oolite/workshops/*` still requires sign-in.
 */
export const SATURDAY_LAB_STARTER_ZIP = '/workshops/saturday-lab-starter.zip' as const
export const SATURDAY_LAB_QR_IMAGE = '/workshops/saturday-lab-qr.png' as const
export const SATURDAY_LAB_HUB_PATH = '/workshop/saturday-lab' as const
export const SATURDAY_LAB_FACILITATOR_HREF = '/workshop/saturday-lab/facilitator' as const

export {
  SATURDAY_LAB_CHEAT_SHEET_IMAGES,
  SATURDAY_LAB_CHEAT_SHEET_PDFS,
  SATURDAY_LAB_TOOL_LOGOS,
  SATURDAY_LAB_TOOL_SCREENSHOTS,
  SATURDAY_LAB_VIBE_TOOLS,
} from '@/lib/workshops/saturday-lab-media'

export type SaturdayLabHandoutAssetKey = keyof typeof SATURDAY_LAB_HANDOUT_ASSETS

export type SaturdayLabHandoutAvailability = Record<SaturdayLabHandoutAssetKey, boolean>

/** All four handouts are live on Cloudinary. */
export function getSaturdayLabHandoutAvailability(): SaturdayLabHandoutAvailability {
  return {
    beginnerPng: true,
    vibePng: true,
    beginnerPdf: true,
    vibePdf: true,
  }
}

/**
 * Saturday Lab media on Cloudinary (Digital Lab / Oolite workshops folder).
 * Primary handouts: graphic cheat sheet PNGs for print and hub preview.
 */

const CLOUDINARY_BASE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/dccmiami/workshops/vibe-coding-net-art'

/** Optimized delivery URLs (q_auto,f_auto). */
export const SATURDAY_LAB_CHEAT_SHEET_IMAGES = {
  /** Latest beginner handout (vkvcvl). */
  beginner:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562774/dccmiami/workshops/vibe-coding-net-art/artist_website_cheat_sheet_for_beginners_vkvcvl.png',
  /** Earlier beginner variant — keep for reference/reprint if needed. */
  beginnerAlt:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562507/dccmiami/workshops/vibe-coding-net-art/artist_website_cheat_sheet_for_beginners_wypfdl.png',
  vibeCoding:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562773/dccmiami/workshops/vibe-coding-net-art/vibe_coding_cheat_sheet_for_artists_pnqqgz.png',
} as const

/** Print-ready PDFs on Cloudinary. */
export const SATURDAY_LAB_CHEAT_SHEET_PDFS = {
  beginner:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1782563500/dccmiami/workshops/vibe-coding-net-art/Beginner_Website_Cheat_Sheet_ervujp.pdf',
  vibeCoding:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1782563500/dccmiami/workshops/vibe-coding-net-art/Vibe_Coding_Cheat_Sheet_rjbyld.pdf',
} as const

export const SATURDAY_LAB_TOOL_SCREENSHOTS = {
  codepen:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562749/dccmiami/workshops/vibe-coding-net-art/codepen-screenshot-vibe-coding-netart-workshop-digilab-oolite_g9btsi.jpg',
  replit:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562750/dccmiami/workshops/vibe-coding-net-art/replit-screenshot-vibe-coding-netart-workshop-digilab-oolite_ukptmz.avif',
  cursor:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562750/dccmiami/workshops/vibe-coding-net-art/vibe-coding-cursor-screenshot-digilab-oolite_yaqbun.png',
} as const

export const SATURDAY_LAB_TOOL_LOGOS = {
  codepen:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562924/dccmiami/workshops/vibe-coding-net-art/codepen-logo_mwzomu.png',
  replit:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562925/dccmiami/workshops/vibe-coding-net-art/replit-logo_praify.png',
  cursor:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782562926/dccmiami/workshops/vibe-coding-net-art/cursor-logo_ld96a4.jpg',
} as const

export type SaturdayLabVibeToolKey = keyof typeof SATURDAY_LAB_TOOL_SCREENSHOTS

export const SATURDAY_LAB_VIBE_TOOLS: {
  key: SaturdayLabVibeToolKey
  level: 1 | 2 | 3
  title: string
  subtitle: string
  href: string
  logo: string
  screenshot: string
  screenshotAlt: string
}[] = [
  {
    key: 'codepen',
    level: 1,
    title: 'CodePen',
    subtitle: 'Try it in the browser',
    href: 'https://codepen.io/pen/',
    logo: SATURDAY_LAB_TOOL_LOGOS.codepen,
    screenshot: SATURDAY_LAB_TOOL_SCREENSHOTS.codepen,
    screenshotAlt: 'CodePen editor screenshot for vibe coding workshop',
  },
  {
    key: 'replit',
    level: 2,
    title: 'Replit',
    subtitle: 'Share a live prototype',
    href: 'https://replit.com',
    logo: SATURDAY_LAB_TOOL_LOGOS.replit,
    screenshot: SATURDAY_LAB_TOOL_SCREENSHOTS.replit,
    screenshotAlt: 'Replit project screenshot for vibe coding workshop',
  },
  {
    key: 'cursor',
    level: 3,
    title: 'Cursor',
    subtitle: 'Work in real files',
    href: 'https://cursor.com',
    logo: SATURDAY_LAB_TOOL_LOGOS.cursor,
    screenshot: SATURDAY_LAB_TOOL_SCREENSHOTS.cursor,
    screenshotAlt: 'Cursor editor screenshot for vibe coding workshop',
  },
]

/** @deprecated unused base — kept for future folder-relative URLs */
export const SATURDAY_LAB_CLOUDINARY_FOLDER = CLOUDINARY_BASE

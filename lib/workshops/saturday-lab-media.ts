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

/**
 * Saturday Lab UI icons on Cloudinary.
 * Folder: `dccmiami/workshops/vibe-coding-net-art/icons/`
 * Public ID pattern: `saturday-lab/icons/icon-*` (uploaded as icon-N-*-digilab-oolite)
 */
export const SATURDAY_LAB_ICONS = {
  /** 01 — sitemap / structure */
  sitemap:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567890/dccmiami/workshops/vibe-coding-net-art/icons/icon-1-sitemap-digilab-oolite_rpcq9u.png',
  /** 02 — homepage / browser layout */
  homepage:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567889/dccmiami/workshops/vibe-coding-net-art/icons/icon-2-homepage-digilab-oolite_lyqejr.png',
  /** 03 — projects / portfolio grid */
  projects:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567888/dccmiami/workshops/vibe-coding-net-art/icons/icon-3-projects-digilab-oolite_tayf86.png',
  /** 04 — about / profile */
  about:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567888/dccmiami/workshops/vibe-coding-net-art/icons/icon-4-about-digilab-oolite_ov2evz.png',
  /** 05 — CV / resume / document */
  cv:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567887/dccmiami/workshops/vibe-coding-net-art/icons/icon-5-cv-digilab-oolite_gxunqj.png',
  /** 06 — contact / email */
  contact:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567886/dccmiami/workshops/vibe-coding-net-art/icons/icon-6-contact-digilab-oolite_ubz7db.png',
  /** 07 — QR scan / mobile access */
  qr:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567885/dccmiami/workshops/vibe-coding-net-art/icons/icon-7-qr-digilab-oolite_ny1qsb.png',
  /** 08 — prompt / spark / AI message */
  prompt:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567884/dccmiami/workshops/vibe-coding-net-art/icons/icon-8-prompt-digilab-oolite_tr9v7u.png',
  /** 09 — code / HTML CSS JS */
  code:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567884/dccmiami/workshops/vibe-coding-net-art/icons/icon-9-code-digilab-oolite_gsiylw.png',
  /** 10 — browser test / preview */
  test:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567883/dccmiami/workshops/vibe-coding-net-art/icons/icon-10-test-digilab-oolite_hvxgot.png',
  /** 11 — debug / bug fix */
  debug:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567861/dccmiami/workshops/vibe-coding-net-art/icons/icon-11-debug-digilab-oolite_r2gfrq.png',
  /** 12 — publish / upload */
  publish:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567860/dccmiami/workshops/vibe-coding-net-art/icons/icon-12-publish-digilab-oolite_znfrao.png',
  /** 13 — folder / files / codebase */
  files:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567859/dccmiami/workshops/vibe-coding-net-art/icons/icon-13-files-digilab-oolite_hp4esb.png',
  /** 14 — AI partner / assistant */
  ai:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567858/dccmiami/workshops/vibe-coding-net-art/icons/icon-14-ai-digilab-oolite_vmy5qa.png',
  /** 15 — choose path / branching */
  path:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567857/dccmiami/workshops/vibe-coding-net-art/icons/icon-15-path-digilab-oolite_tvjdcp.png',
  /** 16 — goal / target / done */
  goal:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782567857/dccmiami/workshops/vibe-coding-net-art/icons/icon-16-goal-digilab-oolite_cjqgev.png',
} as const

export type SaturdayLabIconKey = keyof typeof SATURDAY_LAB_ICONS

/**
 * Section banners on Cloudinary.
 * Folder: `dccmiami/workshops/vibe-coding-net-art/banners/`
 */
export const SATURDAY_LAB_BANNERS = {
  /** 01 — hub / start here / two paths */
  startHere:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782568213/dccmiami/workshops/vibe-coding-net-art/banners/01_start-here-two-paths_vibe-coding-digilab-oolite_ocaiah.png',
  /** 02 — beginner artist website workflow */
  beginner:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782568215/dccmiami/workshops/vibe-coding-net-art/banners/02_beginner-artist-website-workflow_vibe-coding-digilab-oolite_m934yj.png',
  /** 03 — vibe coding workspace */
  vibeCoding:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782568214/dccmiami/workshops/vibe-coding-net-art/banners/03_vibe-coding-workspace_vibe-coding-digilab-oolite_xew0wz.png',
  /** 04 — resources / tutorial library */
  resources:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782568213/dccmiami/workshops/vibe-coding-net-art/banners/04_resources-tutorial-library_vibe-coding-digilab-oolite_jym1z1.png',
  /** 05 — starter template download */
  starterTemplate:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782568211/dccmiami/workshops/vibe-coding-net-art/banners/05_starter-template-download_vibe-coding-digilab-oolite_qnjqgi.png',
  /** 06 — done by 1 PM outcomes */
  outcomes:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782568212/dccmiami/workshops/vibe-coding-net-art/banners/06_done-by-1pm-workshop-outcomes_vibe-coding-digilab-oolite_jl5zve.png',
  /** 07 — exit ticket / next steps */
  exitTicket:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto,f_auto/v1782568211/dccmiami/workshops/vibe-coding-net-art/banners/07_exit-ticket-next-steps_vibe-coding-digilab-oolite_pzayo0.png',
} as const

export type SaturdayLabBannerKey = keyof typeof SATURDAY_LAB_BANNERS

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

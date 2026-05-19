export const SOHO_PITCH_EMAIL = 'm@moises.tech'

export const SOHO_WALKTHROUGH_MAILTO = `mailto:${SOHO_PITCH_EMAIL}?subject=${encodeURIComponent(
  'Soho House Member Signal Agent walkthrough'
)}`

/** Drop mockup images into public/assets/sohohouse/mockups/ using these filenames. */
export const SOHO_FUNNEL_MOCKUP_BASE = '/assets/sohohouse/mockups'

export type SohoFunnelMockupKey =
  | 'hero'
  | 'interaction'
  | 'smartSign'
  | 'mobileHandoff'
  | 'staffGovernance'

export const SOHO_FUNNEL_MOCKUPS: Record<
  SohoFunnelMockupKey,
  {
    file: string
    alt: string
    caption: string
    hint: string
    aspect: 'phone' | 'screen' | 'wide' | 'video'
  }
> = {
  hero: {
    file: 'hero-member-signal.webp',
    alt: 'Member Signal Agent — voice and chat interface in the House',
    caption: 'Member Signal Agent',
    hint: 'hero-member-signal.webp',
    aspect: 'phone',
  },
  interaction: {
    file: 'experience-cards.webp',
    alt: 'Member route, bookable experiences, and smart sign outputs',
    caption: 'One question → full experience loop',
    hint: 'experience-cards.webp',
    aspect: 'wide',
  },
  smartSign: {
    file: 'smart-sign-lobby.webp',
    alt: 'Smart sign in a House lobby with approved programming and QR',
    caption: 'Smart sign · lobby moment',
    hint: 'smart-sign-lobby.webp',
    aspect: 'wide',
  },
  mobileHandoff: {
    file: 'mobile-handoff.webp',
    alt: 'Mobile member journey after scanning an approved QR handoff',
    caption: 'Mobile route after scan',
    hint: 'mobile-handoff.webp',
    aspect: 'phone',
  },
  staffGovernance: {
    file: 'staff-approval.webp',
    alt: 'Staff brief, approval controls, and governance panel',
    caption: 'Staff approves before anything goes live',
    hint: 'staff-approval.webp',
    aspect: 'screen',
  },
}

export function sohoMockupSrc(key: SohoFunnelMockupKey): string {
  return `${SOHO_FUNNEL_MOCKUP_BASE}/${SOHO_FUNNEL_MOCKUPS[key].file}`
}

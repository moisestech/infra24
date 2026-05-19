export const SOHO_PITCH_EMAIL = 'm@moises.tech'

export const SOHO_WALKTHROUGH_MAILTO = `mailto:${SOHO_PITCH_EMAIL}?subject=${encodeURIComponent(
  'Soho House Member Signal Agent walkthrough'
)}`

/** Drop mockup images into public/assets/sohohouse/mockups/ using `{fileStem}-light.webp` and `{fileStem}-dark.webp`. */
export const SOHO_FUNNEL_MOCKUP_BASE = '/assets/sohohouse/mockups'

export type SohoFunnelTheme = 'light' | 'dark'

export type SohoFunnelMockupKey =
  | 'hero'
  | 'interaction'
  | 'smartSign'
  | 'mobileHandoff'
  | 'staffGovernance'

export const SOHO_FUNNEL_MOCKUPS: Record<
  SohoFunnelMockupKey,
  {
    /** Filename stem — resolved to `{fileStem}-light.webp` / `{fileStem}-dark.webp` */
    fileStem: string
    alt: string
    caption: string
    aspect: 'phone' | 'screen' | 'wide' | 'video'
  }
> = {
  hero: {
    fileStem: 'hero-member-signal',
    alt: 'Member Signal Agent — voice and chat interface in the House',
    caption: 'Member Signal Agent',
    aspect: 'phone',
  },
  interaction: {
    fileStem: 'experience-cards',
    alt: 'Member route, bookable experiences, and smart sign outputs',
    caption: 'One question → full experience loop',
    aspect: 'wide',
  },
  smartSign: {
    fileStem: 'smart-sign-lobby',
    alt: 'Smart sign in a House lobby with approved programming and QR',
    caption: 'Smart sign · lobby moment',
    aspect: 'wide',
  },
  mobileHandoff: {
    fileStem: 'mobile-handoff',
    alt: 'Mobile member journey after scanning an approved QR handoff',
    caption: 'Mobile route after scan',
    aspect: 'phone',
  },
  staffGovernance: {
    fileStem: 'staff-approval',
    alt: 'Staff brief, approval controls, and governance panel',
    caption: 'Staff approves before anything goes live',
    aspect: 'screen',
  },
}

/** Optional Cloudinary (or CDN) overrides per theme; local public/ path is fallback. */
export const SOHO_FUNNEL_MOCKUP_URLS: Partial<
  Record<SohoFunnelMockupKey, Partial<Record<SohoFunnelTheme, string>>>
> = {
  hero: {
    dark: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1779162050/ai-assistant/soho-house/hero-member-signal-dark_lhyejs.png',
  },
  smartSign: {
    dark: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1779162003/ai-assistant/soho-house/smart-sign-lobby-dark_phvdbh.png',
  },
  staffGovernance: {
    dark: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1779162003/ai-assistant/soho-house/staff-approval-dark_mburnt.png',
  },
}

export function sohoMockupFilename(key: SohoFunnelMockupKey, theme: SohoFunnelTheme): string {
  return `${SOHO_FUNNEL_MOCKUPS[key].fileStem}-${theme}.webp`
}

export function sohoMockupLocalSrc(key: SohoFunnelMockupKey, theme: SohoFunnelTheme): string {
  return `${SOHO_FUNNEL_MOCKUP_BASE}/${sohoMockupFilename(key, theme)}`
}

/** Remote URL for theme, then opposite theme, then local asset path. */
export function sohoMockupSrc(key: SohoFunnelMockupKey, theme: SohoFunnelTheme): string {
  const remote = SOHO_FUNNEL_MOCKUP_URLS[key]
  const opposite: SohoFunnelTheme = theme === 'light' ? 'dark' : 'light'
  return (
    remote?.[theme] ??
    remote?.[opposite] ??
    sohoMockupLocalSrc(key, theme)
  )
}

/** Props for {@link SohoFunnelMockupFrame} minus `mockupKey`. */
export function sohoMockupDisplayProps(key: SohoFunnelMockupKey) {
  const { alt, caption, aspect } = SOHO_FUNNEL_MOCKUPS[key]
  return { alt, caption, aspect }
}

/** Hint shown in placeholder UI when assets are missing. */
export function sohoMockupDropHint(key: SohoFunnelMockupKey): string {
  const remote = SOHO_FUNNEL_MOCKUP_URLS[key]
  if (remote?.light || remote?.dark) {
    const parts = [
      remote.light ? 'light URL set' : null,
      remote.dark ? 'dark URL set' : null,
    ].filter(Boolean)
    return `${SOHO_FUNNEL_MOCKUPS[key].fileStem} (${parts.join(', ')})`
  }
  const stem = SOHO_FUNNEL_MOCKUPS[key].fileStem
  return `${stem}-light.webp, ${stem}-dark.webp`
}

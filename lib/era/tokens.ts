/**
 * Born-Digital Era — design tokens.
 *
 * Scoped to `--era-*` CSS custom properties so they sit alongside (not on top of)
 * the existing `--cdc-*` marketing tokens. Importing this module is side-effect
 * free; the actual CSS variables live in `app/(marketing)/cdc-marketing-theme.css`
 * (or any consumer that injects them via inline style). Components that read these
 * tokens via `getEraVar('accentNet')` always go through this single source of truth.
 */

export type EraChannelEffect =
  | 'mesh-field'
  | 'venue-node'
  | 'knowledge-lattice'
  | 'signal-pulse'
  | 'live-loop'
  | 'city-scan'
  | 'particle-dispatch';

/**
 * Per-channel accent colors. Light enough to layer on white, saturated enough
 * to read on dark. Each effect picks its accent from this map so a card moved
 * between channels keeps a consistent color story.
 */
export const eraAccent = {
  network: '#2dd4bf',
  irlEvents: '#f59e0b',
  workshops: '#a78bfa',
  clinics: '#60a5fa',
  openLab: '#34d399',
  publicCorridor: '#fb7185',
  newsletter: '#facc15',
} as const;

export type EraAccentKey = keyof typeof eraAccent;

/**
 * Semantic CSS variable names. Prefer these over hard-coded hexes in components
 * so future theming swaps in one place. Kept disjoint from `--cdc-*` so we can
 * delete or rename Era tokens without touching the existing marketing theme.
 */
export const eraCssVar = {
  accentNetwork: '--era-accent-network',
  accentIrlEvents: '--era-accent-irl-events',
  accentWorkshops: '--era-accent-workshops',
  accentClinics: '--era-accent-clinics',
  accentOpenLab: '--era-accent-open-lab',
  accentPublicCorridor: '--era-accent-public-corridor',
  accentNewsletter: '--era-accent-newsletter',
  surface: '--era-surface',
  surfaceMuted: '--era-surface-muted',
  ink: '--era-ink',
  inkMuted: '--era-ink-muted',
  border: '--era-border',
  beamFrom: '--era-beam-from',
  beamTo: '--era-beam-to',
  ladderFill: '--era-ladder-fill',
  ladderTrack: '--era-ladder-track',
} as const;

/**
 * Inline style block — call once at the root of an Era surface (e.g. /era,
 * inflection band on the homepage) so descendants can read `var(--era-*)`.
 * Light mode variant; dark mode is handled by `eraTokensDark`.
 */
export const eraTokensLight: Record<string, string> = {
  [eraCssVar.accentNetwork]: eraAccent.network,
  [eraCssVar.accentIrlEvents]: eraAccent.irlEvents,
  [eraCssVar.accentWorkshops]: eraAccent.workshops,
  [eraCssVar.accentClinics]: eraAccent.clinics,
  [eraCssVar.accentOpenLab]: eraAccent.openLab,
  [eraCssVar.accentPublicCorridor]: eraAccent.publicCorridor,
  [eraCssVar.accentNewsletter]: eraAccent.newsletter,
  [eraCssVar.surface]: '#ffffff',
  [eraCssVar.surfaceMuted]: '#f5f5f5',
  [eraCssVar.ink]: '#0a0a0a',
  [eraCssVar.inkMuted]: 'rgba(10,10,10,0.6)',
  [eraCssVar.border]: 'rgba(15, 23, 42, 0.12)',
  [eraCssVar.beamFrom]: '#2dd4bf',
  [eraCssVar.beamTo]: '#a78bfa',
  [eraCssVar.ladderFill]: '#0a0a0a',
  [eraCssVar.ladderTrack]: 'rgba(15, 23, 42, 0.08)',
};

export const eraTokensDark: Record<string, string> = {
  [eraCssVar.accentNetwork]: eraAccent.network,
  [eraCssVar.accentIrlEvents]: eraAccent.irlEvents,
  [eraCssVar.accentWorkshops]: eraAccent.workshops,
  [eraCssVar.accentClinics]: eraAccent.clinics,
  [eraCssVar.accentOpenLab]: eraAccent.openLab,
  [eraCssVar.accentPublicCorridor]: eraAccent.publicCorridor,
  [eraCssVar.accentNewsletter]: eraAccent.newsletter,
  [eraCssVar.surface]: '#0a0a0a',
  [eraCssVar.surfaceMuted]: '#171717',
  [eraCssVar.ink]: '#fafafa',
  [eraCssVar.inkMuted]: 'rgba(250,250,250,0.6)',
  [eraCssVar.border]: 'rgba(250, 250, 250, 0.12)',
  [eraCssVar.beamFrom]: '#2dd4bf',
  [eraCssVar.beamTo]: '#c4b5fd',
  [eraCssVar.ladderFill]: '#fafafa',
  [eraCssVar.ladderTrack]: 'rgba(250, 250, 250, 0.12)',
};

/**
 * Easings — exported as cubic-bezier strings so CSS, framer-motion, and Web
 * Animations API consumers can share one curve set.
 */
export const eraEasing = {
  /** Calm, used for content reveals and ladder fills. */
  signal: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Snappy, used for inflection card hover and CTAs. */
  pulse: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Almost linear, used for slow particle/mesh drifts. */
  drift: 'cubic-bezier(0.45, 0, 0.55, 1)',
} as const;

export const eraDuration = {
  fast: 200,
  med: 450,
  slow: 900,
  drift: 6800,
} as const;

/** Map a channel id → accent key (kept here so tokens own the mapping). */
export const eraChannelAccentKey = {
  network: 'network',
  'irl-events': 'irlEvents',
  workshops: 'workshops',
  clinics: 'clinics',
  'open-lab': 'openLab',
  'public-corridor': 'publicCorridor',
  newsletter: 'newsletter',
} as const satisfies Record<string, EraAccentKey>;

export type EraChannelId = keyof typeof eraChannelAccentKey;

export function eraAccentForChannel(id: EraChannelId): string {
  return eraAccent[eraChannelAccentKey[id]];
}

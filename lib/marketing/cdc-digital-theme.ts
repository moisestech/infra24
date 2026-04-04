/**
 * CDC marketing “digital / Miami webcore” accents.
 * Mirrors CSS variables in app/(marketing)/cdc-marketing-theme.css — keep in sync.
 */
export const cdcDigitalTheme = {
  teal: 'rgb(0, 212, 170)',
  tealSoft: 'rgba(0, 212, 170, 0.18)',
  coral: 'rgb(255, 107, 53)',
  coralSoft: 'rgba(255, 107, 53, 0.14)',
  magenta: 'rgb(255, 0, 136)',
  magentaSoft: 'rgba(255, 0, 136, 0.1)',
  navy: '#0f172a',
  surface: '#fafafa',
  border: 'rgba(15, 23, 42, 0.12)',
} as const;

/** BorderBeam gradient for digital hero frame */
export const cdcDigitalBeam = {
  from: cdcDigitalTheme.teal,
  to: cdcDigitalTheme.magenta,
} as const;

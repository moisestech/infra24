/**
 * CDC marketing “digital / Miami webcore” accents.
 * Mirrors CSS variables in app/(marketing)/cdc-marketing-theme.css — keep in sync.
 */
export const cdcDigitalTheme = {
  teal: '#0d9488',
  tealSoft: 'rgba(13, 148, 136, 0.14)',
  coral: '#ea580c',
  coralSoft: 'rgba(234, 88, 12, 0.1)',
  magenta: '#db2777',
  magentaSoft: 'rgba(219, 39, 119, 0.08)',
  navy: '#0f172a',
  surface: '#fafafa',
  border: 'rgba(15, 23, 42, 0.12)',
} as const;

/** BorderBeam gradient for digital hero frame */
export const cdcDigitalBeam = {
  from: cdcDigitalTheme.teal,
  to: cdcDigitalTheme.magenta,
} as const;

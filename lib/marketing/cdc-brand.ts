/** DCC.miami wordmark (Cloudinary). Light = black on transparent; white = for dark UI bars. */

export const DCC_MIAMI_LOGO_URL_LIGHT =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776028503/dccmiami/dcc-miami-logo-small-black-text_jpqvd7.png' as const;

/** Solid black rectangle behind white type — use on dark headers/footers. */
export const DCC_MIAMI_LOGO_URL_WHITE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776028590/dccmiami/cdc-miami-logo-small-white-text_bmp2gy.png' as const;

export const DCC_MIAMI_LOGO_ALT = 'DCC.miami — Digital Culture Center Miami' as const;

/** Canonical logo for JSON-LD and Open Graph (transparent, works on light cards). */
export const DCC_MIAMI_LOGO_URL_SCHEMA = DCC_MIAMI_LOGO_URL_LIGHT;

/** @deprecated Use DCC_MIAMI_LOGO_URL_LIGHT or pick by theme in UI. */
export const DCC_MIAMI_LOGO_URL = DCC_MIAMI_LOGO_URL_LIGHT;

/** @deprecated Use DCC_MIAMI_LOGO_URL_LIGHT */
export const CDC_MIAMI_LOGO_URL = DCC_MIAMI_LOGO_URL_LIGHT;
/** @deprecated Use DCC_MIAMI_LOGO_ALT */
export const CDC_MIAMI_LOGO_ALT = DCC_MIAMI_LOGO_ALT;

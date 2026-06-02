/**
 * Smart-sign card image framing: full width in landscape while preserving asset aspect ratio.
 */

/** Card carousel image max-height scale (keeps intrinsic aspect ratio). */
export const CARD_IMAGE_MAX_HEIGHT_SCALE = 1.4;

/** CSS max-height values for card layout frames (+40% vs original caps). */
export const CARD_IMAGE_MAX_HEIGHT = {
  landscapeNatural: 'min(78.4vh, 1176px)',
  portrait: 'min(61.6vh, 756px)',
  poster: 'min(114.8vh, 1434px)',
} as const;

export function cardImageUsesNaturalLandscapeWidth(
  orientation: 'portrait' | 'landscape',
  posterPortrait: boolean
): boolean {
  return orientation === 'landscape' && !posterPortrait;
}

/** Tailwind classes for landscape card images (width-driven, intrinsic height). */
export const LANDSCAPE_CARD_IMAGE_CLASS =
  'h-auto w-full object-contain object-center';

/** Typical Oolite smart-sign landscape viewport (px). */
export const SMART_SIGN_LANDSCAPE_WIDTH_PX = 1080;

/** Content width target inside smart-sign horizontal padding. */
export const SMART_SIGN_CARD_CONTENT_MAX_WIDTH_PX = 1040;

/** Tight shell padding so card images use ~1040px on a 1080px display. */
export const SMART_SIGN_CARD_SHELL_PADDING_CLASS = 'px-4 py-6 md:px-6 md:py-8';

export const SMART_SIGN_CARD_CONTENT_CLASS = 'w-full max-w-[1040px] mx-auto';

/** Top inset for smart-sign grid segments (workshops, studio residents). */
export const SMART_SIGN_COMPACT_TOP_INSET_CLASS =
  'pt-[calc(0.5rem+48px)] md:pt-[calc(0.75rem+48px)]';

/** Section heading size paired with compact top inset. */
export const SMART_SIGN_COMPACT_SECTION_TITLE_CLASS = 'text-2xl md:text-4xl';

/** Max smart-sign viewport height (portrait kiosk). */
export const SMART_SIGN_VIEWPORT_MAX_HEIGHT_PX = 1920;

export function isSmartSignViewport(
  screenMetrics?: { width?: number } | null
): boolean {
  const w = screenMetrics?.width;
  return typeof w === 'number' && w > 0 && w <= 1280;
}

export function resolveLandscapeCardImageMaxHeight(
  screenMetrics?: {
    width?: number;
    height?: number;
    orientation?: 'portrait' | 'landscape';
  } | null
): string {
  const height = screenMetrics?.height;
  const width = screenMetrics?.width;

  if (typeof height !== 'number' || height <= 0) {
    return CARD_IMAGE_MAX_HEIGHT.landscapeNatural;
  }

  const orientation =
    screenMetrics?.orientation ??
    (width && height ? (width / height >= 1.37 ? 'landscape' : 'portrait') : 'landscape');

  if (orientation === 'portrait') {
    const capPx = Math.min(Math.round(height * 0.44), 880);
    return `min(44vh, ${capPx}px)`;
  }

  if (isSmartSignViewport(screenMetrics)) {
    const capPx = Math.min(Math.round(height * 0.52), 720);
    return `min(52vh, ${capPx}px)`;
  }

  return CARD_IMAGE_MAX_HEIGHT.landscapeNatural;
}

/** Full-width intrinsic-ratio card image (1080px kiosk, landscape, or clean view). */
export function cardImageUsesFullWidth(
  orientation: 'portrait' | 'landscape',
  posterPortrait: boolean,
  screenMetrics?: { width?: number } | null,
  minimal?: boolean
): boolean {
  if (posterPortrait) return false;
  if (minimal || isSmartSignViewport(screenMetrics)) return true;
  return cardImageUsesNaturalLandscapeWidth(orientation, posterPortrait);
}

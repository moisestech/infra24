/**
 * Studio-resident portrait assets (Cloudinary naming convention).
 * Used by smart-sign spotlight and artist grids.
 */

export const ARTIST_PORTRAIT_FRAMES = [
  'full_width_landscape',
  'full_width_vertical',
  'full_height_vertical',
] as const;

export type ArtistPortraitFrame = (typeof ARTIST_PORTRAIT_FRAMES)[number];

export type ArtistPortraitCollection = Record<ArtistPortraitFrame, string[]>;

export type ArtistSpotlightLayout = 'dual' | 'hero_vertical' | 'hero_landscape';

const EMPTY: ArtistPortraitCollection = {
  full_width_landscape: [],
  full_width_vertical: [],
  full_height_vertical: [],
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function inferPortraitFrameFromUrl(url: string): ArtistPortraitFrame | null {
  const lower = url.toLowerCase();
  if (lower.includes('portrait-full-height-vertical')) return 'full_height_vertical';
  if (lower.includes('portrait-full-width-vertical')) return 'full_width_vertical';
  if (lower.includes('portrait-full-width-landscape')) return 'full_width_landscape';
  return null;
}

/** Read `metadata.portraits` or legacy single `artwork_url`. */
export function resolveArtistPortraits(
  metadata: Record<string, unknown> | null | undefined
): ArtistPortraitCollection {
  const out: ArtistPortraitCollection = {
    full_width_landscape: [],
    full_width_vertical: [],
    full_height_vertical: [],
  };

  if (!metadata || typeof metadata !== 'object') return { ...EMPTY };

  const raw = metadata.portraits;
  if (raw && typeof raw === 'object') {
    const p = raw as Record<string, unknown>;
    for (const frame of ARTIST_PORTRAIT_FRAMES) {
      out[frame] = asStringArray(p[frame]);
    }
  }

  const legacy = metadata.artwork_url;
  if (typeof legacy === 'string' && legacy.trim()) {
    const url = legacy.trim();
    const frame = inferPortraitFrameFromUrl(url);
    if (frame && !out[frame].includes(url)) {
      out[frame] = [url, ...out[frame]];
    } else if (!frame && out.full_width_landscape.length === 0) {
      out.full_width_landscape = [url];
    }
  }

  return out;
}

export function primaryArtistPortraitUrl(
  portraits: ArtistPortraitCollection
): string | null {
  return (
    portraits.full_width_landscape[0] ??
    portraits.full_height_vertical[0] ??
    portraits.full_width_vertical[0] ??
    null
  );
}

/** Flat list for in-artist rotation (landscapes first, then verticals). */
export function artistPortraitRotationPool(
  portraits: ArtistPortraitCollection,
  orientation: 'portrait' | 'landscape' = 'portrait'
): { urls: string[]; frames: ArtistPortraitFrame[] } {
  if (orientation === 'landscape') {
    const urls = [
      ...portraits.full_width_landscape,
      ...portraits.full_width_vertical,
      ...portraits.full_height_vertical,
    ];
    const frames: ArtistPortraitFrame[] = [
      ...portraits.full_width_landscape.map(() => 'full_width_landscape' as const),
      ...portraits.full_width_vertical.map(() => 'full_width_vertical' as const),
      ...portraits.full_height_vertical.map(() => 'full_height_vertical' as const),
    ];
    return { urls, frames };
  }

  const urls = [
    ...portraits.full_height_vertical,
    ...portraits.full_width_vertical,
    ...portraits.full_width_landscape,
  ];
  const frames: ArtistPortraitFrame[] = [
    ...portraits.full_height_vertical.map(() => 'full_height_vertical' as const),
    ...portraits.full_width_vertical.map(() => 'full_width_vertical' as const),
    ...portraits.full_width_landscape.map(() => 'full_width_landscape' as const),
  ];
  return { urls, frames };
}

export function selectArtistPortraitAt(
  metadata: Record<string, unknown> | null | undefined,
  index: number,
  orientation: 'portrait' | 'landscape' = 'portrait'
): { url: string; frame: ArtistPortraitFrame } | null {
  const portraits = resolveArtistPortraits(metadata);
  const { urls, frames } = artistPortraitRotationPool(portraits, orientation);
  if (urls.length === 0) return null;
  const i = ((index % urls.length) + urls.length) % urls.length;
  return { url: urls[i]!, frame: frames[i]! };
}

export function selectArtistPortraitUrl(
  metadata: Record<string, unknown> | null | undefined,
  orientation: 'portrait' | 'landscape' = 'portrait'
): string | null {
  return selectArtistPortraitAt(metadata, 0, orientation)?.url ?? null;
}

export function spotlightLayoutForFrame(frame: ArtistPortraitFrame): ArtistSpotlightLayout {
  if (frame === 'full_height_vertical' || frame === 'full_width_vertical') {
    return 'hero_vertical';
  }
  return 'dual';
}

export function portraitImageFrameClass(frame: ArtistPortraitFrame): string {
  switch (frame) {
    case 'full_height_vertical':
      return 'relative aspect-[3/4] w-full max-h-[min(58vh,920px)] overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-200';
    case 'full_width_vertical':
      return 'relative aspect-[4/5] w-full max-h-[min(52vh,840px)] overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-200';
    case 'full_width_landscape':
    default:
      return 'relative aspect-[16/10] w-full max-h-[min(38vh,640px)] overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-200';
  }
}

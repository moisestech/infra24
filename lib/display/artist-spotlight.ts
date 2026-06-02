import type { ArtistGridItem } from '@/components/display/DisplayGrid';
import {
  type ArtistPortraitFrame,
  primaryArtistPortraitUrl,
  resolveArtistPortraits,
  selectArtistPortraitAt,
  selectArtistPortraitUrl,
  spotlightLayoutForFrame,
} from '@/lib/display/artist-portraits';

export type { ArtistPortraitFrame };
export {
  primaryArtistPortraitUrl,
  resolveArtistPortraits,
  selectArtistPortraitAt,
  selectArtistPortraitUrl,
  spotlightLayoutForFrame,
};

export type ArtistDisplayMode = 'grid' | 'spotlight';

export function parseStudioSortKey(studio: string | null | undefined): number {
  if (!studio) return 9999;
  const digits = String(studio).replace(/\D/g, '');
  return digits ? Number.parseInt(digits, 10) : 9999;
}

export function sortStudioResidents<T extends { studio_number?: string | null; name: string }>(
  artists: T[]
): T[] {
  return [...artists].sort((a, b) => {
    const sa = parseStudioSortKey(a.studio_number);
    const sb = parseStudioSortKey(b.studio_number);
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name);
  });
}

export function artistHeadshotUrl(item: ArtistGridItem): string | null {
  const meta = item.metadata;
  if (meta && typeof meta === 'object') {
    const headshot = meta.headshot_url;
    if (typeof headshot === 'string' && headshot.trim()) return headshot.trim();
  }
  return (item.avatar_url || item.profile_image || '').trim() || null;
}

export function artistArtworkUrl(
  item: ArtistGridItem,
  orientation: 'portrait' | 'landscape' = 'portrait'
): string | null {
  const meta = item.metadata;
  if (meta && typeof meta === 'object') {
    const selected = selectArtistPortraitUrl(meta, orientation);
    if (selected) return selected;
    const artwork = meta.artwork_url;
    if (typeof artwork === 'string' && artwork.trim()) return artwork.trim();
  }
  return null;
}

export function artistGridPortraitUrl(item: ArtistGridItem): string | null {
  const headshot = artistHeadshotUrl(item);
  const meta = item.metadata;
  if (meta && typeof meta === 'object') {
    const portraits = resolveArtistPortraits(meta);
    return (
      portraits.full_height_vertical[0] ??
      portraits.full_width_vertical[0] ??
      portraits.full_width_landscape[0] ??
      primaryArtistPortraitUrl(portraits) ??
      headshot
    );
  }
  return headshot;
}

export function spotlightDisplayBio(bio: string | null | undefined): string | null {
  const trimmed = (bio || '').trim();
  if (!trimmed) return null;
  if (/^Studio\s+[\w-]+\s*·\s*Oolite Arts studio residents?\.?\s*$/i.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export function spotlightDurationMs(artistCount: number, rotationMs: number): number {
  const per = Math.max(3000, rotationMs);
  const count = Math.max(1, artistCount);
  return Math.max(12_000, count * per);
}

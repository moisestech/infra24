import type { Announcement } from '@/types/announcement';

import {
  inferPortraitFrameFromUrl,
  resolveArtistPortraits,
} from '@/lib/display/artist-portraits';

export type ImageAspectShape = 'landscape' | 'portrait' | 'square';

/** Where the image will render — drives shape priority. */
export type AnnouncementImageContext = 'list' | 'card' | 'display' | 'thumbnail';

export type AnnouncementImageSet = {
  landscape?: string;
  portrait?: string;
  square?: string;
};

export type AnnouncementImageCandidate = {
  url: string;
  shape: ImageAspectShape;
  /** Lower = higher priority within the same shape bucket. */
  rank: number;
};

const LANDSCAPE_MIN_RATIO = 1.12;
const PORTRAIT_MAX_RATIO = 0.88;

function trimUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const url = raw.trim();
  return url.length ? url : null;
}

/** Infer landscape / portrait / square from URL hints (dimensions, naming). */
export function inferImageShapeFromUrl(url: string): ImageAspectShape {
  const lower = url.toLowerCase();

  const frame = inferPortraitFrameFromUrl(url);
  if (frame === 'full_width_landscape') return 'landscape';
  if (frame === 'full_height_vertical' || frame === 'full_width_vertical') return 'portrait';

  if (/headshot|705x705|square|_sq_|avatar/.test(lower)) return 'square';

  const dim = /[-_](\d{3,4})x(\d{3,4})/i.exec(url);
  if (dim) {
    const w = Number(dim[1]);
    const h = Number(dim[2]);
    if (w > 0 && h > 0) {
      const ratio = w / h;
      if (ratio >= LANDSCAPE_MIN_RATIO) return 'landscape';
      if (ratio <= PORTRAIT_MAX_RATIO) return 'portrait';
      return 'square';
    }
  }

  if (/1500x630|1920x1080|16x9|landscape|hero|banner|wide/.test(lower)) {
    return 'landscape';
  }
  if (/vertical|portrait|9x16|1080x1920/.test(lower)) {
    return 'portrait';
  }

  return 'landscape';
}

export function readAnnouncementImageSet(
  metadata: Announcement['metadata']
): AnnouncementImageSet {
  if (!metadata || typeof metadata !== 'object') return {};
  const raw = metadata.images;
  if (!raw || typeof raw !== 'object') return {};
  const images = raw as Record<string, unknown>;
  return {
    landscape: trimUrl(images.landscape) ?? undefined,
    portrait: trimUrl(images.portrait) ?? undefined,
    square: trimUrl(images.square) ?? undefined,
  };
}

function addCandidate(
  bucket: Map<string, AnnouncementImageCandidate>,
  url: unknown,
  shape: ImageAspectShape,
  rank: number
) {
  const trimmed = trimUrl(url);
  if (!trimmed) return;
  const existing = bucket.get(trimmed);
  if (!existing || rank < existing.rank) {
    bucket.set(trimmed, { url: trimmed, shape, rank });
  }
}

/** Gather every usable image URL on an announcement with inferred shape. */
export function collectAnnouncementImageCandidates(
  announcement: Pick<Announcement, 'image_url' | 'metadata' | 'media'>
): AnnouncementImageCandidate[] {
  const bucket = new Map<string, AnnouncementImageCandidate>();
  const meta = announcement.metadata;
  const explicit = readAnnouncementImageSet(meta);

  if (explicit.landscape) addCandidate(bucket, explicit.landscape, 'landscape', 0);
  if (explicit.portrait) addCandidate(bucket, explicit.portrait, 'portrait', 0);
  if (explicit.square) addCandidate(bucket, explicit.square, 'square', 0);

  const imageUrl = trimUrl(announcement.image_url);
  if (imageUrl) {
    addCandidate(bucket, imageUrl, inferImageShapeFromUrl(imageUrl), 10);
  }

  const portraits = resolveArtistPortraits(meta as Record<string, unknown> | undefined);
  for (const url of portraits.full_width_landscape) {
    addCandidate(bucket, url, 'landscape', 20);
  }
  for (const url of portraits.full_width_vertical) {
    addCandidate(bucket, url, 'portrait', 20);
  }
  for (const url of portraits.full_height_vertical) {
    addCandidate(bucket, url, 'portrait', 18);
  }

  const legacyArtwork = trimUrl(
    meta && typeof meta === 'object' ? (meta as Record<string, unknown>).artwork_url : null
  );
  if (legacyArtwork) {
    addCandidate(bucket, legacyArtwork, inferImageShapeFromUrl(legacyArtwork), 22);
  }

  const headshot = trimUrl(
    meta && typeof meta === 'object' ? (meta as Record<string, unknown>).headshot_url : null
  );
  if (headshot) {
    addCandidate(bucket, headshot, inferImageShapeFromUrl(headshot), 30);
  }

  const media = announcement.media;
  if (Array.isArray(media)) {
    for (const entry of media) {
      if (typeof entry === 'string') {
        addCandidate(bucket, entry, inferImageShapeFromUrl(entry), 40);
        continue;
      }
      if (entry && typeof entry === 'object') {
        const row = entry as Record<string, unknown>;
        const url = trimUrl(row.url ?? row.src ?? row.image_url);
        if (!url) continue;
        const shapeRaw = String(row.shape ?? row.orientation ?? row.aspect ?? '').toLowerCase();
        const shape: ImageAspectShape =
          shapeRaw === 'landscape' || shapeRaw === 'portrait' || shapeRaw === 'square'
            ? shapeRaw
            : inferImageShapeFromUrl(url);
        addCandidate(bucket, url, shape, 35);
      }
    }
  }

  return [...bucket.values()].sort((a, b) => a.rank - b.rank || a.url.localeCompare(b.url));
}

function pickByShapeOrder(
  candidates: AnnouncementImageCandidate[],
  order: ImageAspectShape[]
): AnnouncementImageCandidate | null {
  for (const shape of order) {
    const match = candidates.find((c) => c.shape === shape);
    if (match) return match;
  }
  return candidates[0] ?? null;
}

const CONTEXT_SHAPE_ORDER: Record<AnnouncementImageContext, ImageAspectShape[]> = {
  list: ['landscape', 'square', 'portrait'],
  card: ['landscape', 'square', 'portrait'],
  thumbnail: ['landscape', 'square', 'portrait'],
  display: ['portrait', 'square', 'landscape'],
};

export function announcementImageForContext(
  announcement: Pick<Announcement, 'image_url' | 'metadata' | 'media'>,
  context: AnnouncementImageContext = 'card'
): { url: string | null; shape: ImageAspectShape | null } {
  const candidates = collectAnnouncementImageCandidates(announcement);
  if (candidates.length === 0) {
    return { url: null, shape: null };
  }

  const picked = pickByShapeOrder(candidates, CONTEXT_SHAPE_ORDER[context]);
  if (!picked) return { url: null, shape: null };
  return { url: picked.url, shape: picked.shape };
}

/** True when any context-appropriate image exists. */
export function announcementHasDisplayImage(
  announcement: Pick<Announcement, 'image_url' | 'metadata' | 'media'>
): boolean {
  return collectAnnouncementImageCandidates(announcement).length > 0;
}

/** Best landscape URL for CMS list/card (explicit helper). */
export function announcementLandscapeImageUrl(
  announcement: Pick<Announcement, 'image_url' | 'metadata' | 'media'>
): string | null {
  return announcementImageForContext(announcement, 'list').url;
}

/** Best portrait URL for smart-sign / kiosk display. */
export function announcementPortraitImageUrl(
  announcement: Pick<Announcement, 'image_url' | 'metadata' | 'media'>
): string | null {
  return announcementImageForContext(announcement, 'display').url;
}

/** Tailwind aspect class for card hero by shape. */
export function cardImageAspectClass(shape: ImageAspectShape | null): string {
  switch (shape) {
    case 'portrait':
      return 'aspect-[3/4]';
    case 'square':
      return 'aspect-square';
    default:
      return 'aspect-[16/10]';
  }
}

/** object-fit preference for thumbnails. */
export function listThumbObjectClass(shape: ImageAspectShape | null): string {
  return shape === 'landscape' ? 'object-cover object-center' : 'object-cover object-top';
}

import type { Announcement, AnnouncementDisplayMetadata, TakeoverOverlayConfig } from '@/types/announcement';
import { announcementImageForContext } from '@/lib/display/announcement-images';

export type TakeoverMediaKind = 'image' | 'video';
export type TakeoverMode = 'asset' | 'overlay';
export type TakeoverQrMode = 'app' | 'embedded' | 'none';

export interface ResolvedTakeoverMedia {
  kind: TakeoverMediaKind;
  url: string;
}

export interface ResolvedTakeoverDisplayCopy {
  title: string;
  body: string;
  location: string;
}

export interface ResolvedTakeoverOverlayConfig {
  show_date: boolean;
  show_title: boolean;
  show_body: boolean;
  show_location: boolean;
  show_people: boolean;
  show_type_badge: boolean;
  show_qr: boolean;
  scrim: NonNullable<TakeoverOverlayConfig['scrim']>;
}

const VIDEO_URL_RE = /\.(mp4|webm|ogg|mov)(\?|$)/i;

export function isVideoMediaUrl(url: string): boolean {
  const trimmed = url.trim();
  return VIDEO_URL_RE.test(trimmed) || trimmed.includes('/video/');
}

export function parseAnnouncementDisplayMetadata(
  metadata: Announcement['metadata']
): AnnouncementDisplayMetadata {
  if (!metadata || typeof metadata !== 'object') return {};
  return metadata as AnnouncementDisplayMetadata;
}

/** Full-bleed smart-sign layout (image or video) instead of the standard template. */
export function hasDisplayTakeover(metadata: Announcement['metadata']): boolean {
  const meta = parseAnnouncementDisplayMetadata(metadata);
  return meta.display_takeover === true || meta.image_only === true;
}

/**
 * Takeover content mode: pre-designed asset vs app text overlay.
 * Legacy: takeover_minimal false → overlay; image_only / default → asset.
 */
export function getTakeoverMode(metadata: Announcement['metadata']): TakeoverMode {
  const meta = parseAnnouncementDisplayMetadata(metadata);
  if (meta.takeover_mode === 'overlay' || meta.takeover_mode === 'asset') {
    return meta.takeover_mode;
  }
  if (meta.takeover_minimal === false) return 'overlay';
  return 'asset';
}

/** @deprecated Use getTakeoverMode(metadata) === 'asset' */
export function isTakeoverMinimal(metadata: Announcement['metadata']): boolean {
  return getTakeoverMode(metadata) === 'asset';
}

/** Resolved QR mode for takeover slides (asset + overlay). */
export function resolveTakeoverQrMode(metadata: Announcement['metadata']): TakeoverQrMode {
  const mode = getTakeoverMode(metadata);
  if (mode === 'overlay') {
    return resolveTakeoverOverlayConfig(metadata).show_qr ? 'app' : 'none';
  }
  const explicit = parseAnnouncementDisplayMetadata(metadata).takeover_qr;
  if (explicit === 'app' || explicit === 'embedded' || explicit === 'none') return explicit;
  return 'app';
}

/** Whether the smart sign should render its own QR on a takeover slide. */
export function shouldShowTakeoverAppQr(
  metadata: Announcement['metadata'],
  options?: { carouselQrEnabled?: boolean; hasScannableDestination?: boolean }
): boolean {
  const qrMode = resolveTakeoverQrMode(metadata);
  if (qrMode !== 'app') return false;
  if (options?.carouselQrEnabled === false) return false;
  if (options?.hasScannableDestination === false) return false;
  return true;
}

/** Asset-mode "View details" pill — hidden when QR is embedded in the asset by default. */
export function shouldShowTakeoverViewDetails(metadata: Announcement['metadata']): boolean {
  if (getTakeoverMode(metadata) !== 'asset') return false;
  const meta = parseAnnouncementDisplayMetadata(metadata);
  if (meta.show_view_details === true) return true;
  if (meta.show_view_details === false) return false;
  return resolveTakeoverQrMode(metadata) === 'app';
}

export function resolveTakeoverDisplayCopy(announcement: Announcement): ResolvedTakeoverDisplayCopy {
  const meta = parseAnnouncementDisplayMetadata(announcement.metadata);
  const pick = (override: string | undefined, fallback: string | undefined) => {
    const o = override?.trim();
    if (o) return o;
    return (fallback || '').trim();
  };
  return {
    title: pick(meta.display_title, announcement.title),
    body: pick(meta.display_body, announcement.body),
    location: pick(meta.display_location, announcement.location),
  };
}

/** Announcement proxy with metadata copy overrides applied for overlay rendering. */
export function buildTakeoverAnnouncementProxy(announcement: Announcement): Announcement {
  const copy = resolveTakeoverDisplayCopy(announcement);
  return {
    ...announcement,
    title: copy.title,
    body: copy.body || undefined,
    location: copy.location || undefined,
  };
}

export function resolveTakeoverOverlayConfig(
  metadata: Announcement['metadata']
): ResolvedTakeoverOverlayConfig {
  const overlay = parseAnnouncementDisplayMetadata(metadata).takeover_overlay ?? {};
  const bool = (key: keyof TakeoverOverlayConfig, defaultValue = true) => {
    const v = overlay[key];
    return typeof v === 'boolean' ? v : defaultValue;
  };
  const scrim = overlay.scrim;
  const validScrim =
    scrim === 'dark' || scrim === 'light' || scrim === 'none' || scrim === 'gradient'
      ? scrim
      : 'gradient';
  return {
    show_date: bool('show_date'),
    show_title: bool('show_title'),
    show_body: bool('show_body'),
    show_location: bool('show_location'),
    show_people: bool('show_people'),
    show_type_badge: bool('show_type_badge'),
    show_qr: bool('show_qr'),
    scrim: validScrim,
  };
}

function findVideoInMedia(media: unknown): string | null {
  if (!Array.isArray(media)) return null;
  for (const item of media) {
    if (typeof item === 'string' && item.trim() && isVideoMediaUrl(item)) {
      return item.trim();
    }
    if (item && typeof item === 'object') {
      const row = item as { url?: string; src?: string; type?: string };
      const url = (row.url || row.src || '').trim();
      if (!url) continue;
      if (row.type?.startsWith('video/') || isVideoMediaUrl(url)) return url;
    }
  }
  return null;
}

/**
 * Resolve full-bleed media for a takeover announcement.
 * Returns null when takeover is not enabled or no usable media URL exists.
 */
export function resolveTakeoverMedia(announcement: Announcement): ResolvedTakeoverMedia | null {
  if (!hasDisplayTakeover(announcement.metadata)) return null;

  const meta = parseAnnouncementDisplayMetadata(announcement.metadata);
  const videoUrl = (meta.video_url?.trim() || findVideoInMedia(announcement.media) || '').trim();
  const displayImage = announcementImageForContext(announcement, 'display').url;
  const imageUrl = (displayImage || announcement.image_url || '').trim();

  if (meta.media_type === 'video') {
    if (videoUrl) return { kind: 'video', url: videoUrl };
    if (imageUrl) return { kind: 'image', url: imageUrl };
    return null;
  }

  if (meta.media_type === 'image') {
    if (imageUrl) return { kind: 'image', url: imageUrl };
    if (videoUrl) return { kind: 'video', url: videoUrl };
    return null;
  }

  if (videoUrl) return { kind: 'video', url: videoUrl };
  if (imageUrl) return { kind: 'image', url: imageUrl };
  return null;
}

export function announcementUsesDisplayTakeover(announcement: Announcement): boolean {
  return resolveTakeoverMedia(announcement) != null;
}

/** Reserved for the timed `grid_cinematic` program segment — not the announcement carousel. */
export function isCinematicSegmentAnnouncement(metadata: Announcement['metadata']): boolean {
  return parseAnnouncementDisplayMetadata(metadata).cinematic_segment === true;
}

export function excludeFromSmartSignCarousel(announcement: Announcement): boolean {
  return isCinematicSegmentAnnouncement(announcement.metadata);
}

/** Featured full-bleed takeover for the cinematic program moment (prefers video). */
export function resolveCinematicSegmentTakeover(
  announcements: Announcement[]
): Announcement | null {
  const candidates = announcements.filter(
    (a) =>
      isCinematicSegmentAnnouncement(a.metadata) && announcementUsesDisplayTakeover(a)
  );
  if (!candidates.length) return null;

  const ranked = candidates
    .map((ann) => ({ ann, media: resolveTakeoverMedia(ann) }))
    .filter((row): row is { ann: Announcement; media: ResolvedTakeoverMedia } => row.media != null);

  ranked.sort((a, b) => {
    const aVideo = a.media.kind === 'video' ? 0 : 1;
    const bVideo = b.media.kind === 'video' ? 0 : 1;
    if (aVideo !== bVideo) return aVideo - bVideo;
    const aPin = getDisplayPinOrder(a.ann.metadata) ?? 999;
    const bPin = getDisplayPinOrder(b.ann.metadata) ?? 999;
    return aPin - bPin;
  });

  return ranked[0]?.ann ?? null;
}

function smartSignPriorityRank(priority: Announcement['priority']): number {
  if (typeof priority === 'number' && Number.isFinite(priority)) return priority;
  if (typeof priority === 'string') {
    const map: Record<string, number> = { urgent: 3, high: 2, normal: 1, low: 0 };
    return map[priority.toLowerCase()] ?? 0;
  }
  return 0;
}

/** Explicit carousel pin among takeover slides; lower = first. */
export function getDisplayPinOrder(metadata: Announcement['metadata']): number | null {
  const meta = parseAnnouncementDisplayMetadata(metadata);
  if (typeof meta.pin_order === 'number' && Number.isFinite(meta.pin_order)) {
    return meta.pin_order;
  }
  return null;
}

/**
 * Smart-sign carousel order: takeover slides first (by pin_order, then priority, then API order),
 * then standard announcements in original order.
 */
export function sortAnnouncementsForSmartSignCarousel(announcements: Announcement[]): Announcement[] {
  const pinned: { ann: Announcement; idx: number }[] = [];
  const regular: { ann: Announcement; idx: number }[] = [];

  announcements.forEach((ann, idx) => {
    if (announcementUsesDisplayTakeover(ann)) {
      pinned.push({ ann, idx });
    } else {
      regular.push({ ann, idx });
    }
  });

  pinned.sort((a, b) => {
    const aPin = getDisplayPinOrder(a.ann.metadata);
    const bPin = getDisplayPinOrder(b.ann.metadata);
    if (aPin !== null && bPin !== null && aPin !== bPin) return aPin - bPin;
    if (aPin !== null && bPin === null) return -1;
    if (aPin === null && bPin !== null) return 1;
    const aPri = smartSignPriorityRank(a.ann.priority);
    const bPri = smartSignPriorityRank(b.ann.priority);
    if (aPri !== bPri) return bPri - aPri;
    return a.idx - b.idx;
  });

  return [...pinned.map((p) => p.ann), ...regular.map((r) => r.ann)];
}

export function takeoverScrimClassName(
  scrim: ResolvedTakeoverOverlayConfig['scrim']
): string | null {
  switch (scrim) {
    case 'gradient':
      return 'absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none';
    case 'dark':
      return 'absolute inset-0 z-10 bg-black/50 pointer-events-none';
    case 'light':
      return 'absolute inset-0 z-10 bg-white/25 pointer-events-none';
    case 'none':
      return null;
    default:
      return 'absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none';
  }
}

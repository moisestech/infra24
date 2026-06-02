/**
 * Smart-sign display program: timed segments (carousel, grids, fullscreen).
 * V1: localStorage + optional ?program= URL (base64url JSON).
 */

export const DISPLAY_PROGRAM_STORAGE_PREFIX = 'display-program:v1:';

/** Legacy month lock used before on-or-after floors; stripped from saved programs on load. */
export const SMART_SIGN_DEFAULT_DISPLAY_MONTH = '2026-04';

/** @deprecated Legacy fixed floor; prefer `displayFilterMode: 'on_view_or_upcoming'`. */
export const SMART_SIGN_ANNOUNCEMENTS_ON_OR_AFTER = '2026-05-20';

export type DisplayAnnouncementFilterMode = 'on_view_or_upcoming' | 'on_or_after';

export type DisplaySegmentKind =
  | 'announcement_carousel'
  | 'announcement_fullscreen'
  | 'grid_workshops'
  | 'grid_artists'
  | 'grid_cinematic';

export type ArtistGridFilter = 'all' | 'studio_residents';

export interface DisplaySegmentParams {
  /**
   * YYYY-MM: announcement carousel, fullscreen resolution, and cinematic grid only use rows
   * anchored in that month (see `announcementDisplayMonthKey`). Workshop and artist grids ignore this.
   */
  displayCalendarMonth?: string;
  /** Carousel: when `displayCalendarMonth` is unset, limit by recency on created_at / starts_at / scheduled_at */
  useRecentWindowDays?: number;
  maxItems?: number;
  columns?: 3 | 2 | 1;
  /** Fullscreen: target announcement */
  announcementId?: string;
  /** Fullscreen: match announcement title (substring, case-insensitive) */
  title?: string;
  /** Fullscreen / carousel: hide date UI */
  hideDates?: boolean;
  /** Artists grid */
  filter?: ArtistGridFilter;
  /** Artists: grid (default) or one-at-a-time spotlight rotation */
  artistDisplayMode?: 'grid' | 'spotlight';
  /** Spotlight: pair portrait with artwork when metadata.artwork_url is set */
  showArtwork?: boolean;
  /** Spotlight: milliseconds per resident (default 7000) */
  artistRotationMs?: number;
  /** Workshops grid: items per paginated grid slide (default 9) */
  workshopPageSize?: number;
  /** Workshops grid: number of featured upcoming spotlight slides (default 5) */
  workshopFeaturedCount?: number;
  /** Workshops grid: milliseconds per featured spotlight slide (default 10000) */
  workshopFeaturedRotationMs?: number;
  /** Workshops grid: milliseconds per paginated grid slide (default 10000) */
  workshopGridPageRotationMs?: number;
}

export interface DisplaySegment {
  id: string;
  kind: DisplaySegmentKind;
  durationMs: number;
  params?: DisplaySegmentParams;
}

export interface DisplayProgram {
  version: 1;
  /**
   * How announcement-backed segments filter the pool.
   * Default: on_view_or_upcoming (end >= today OR start >= today).
   */
  displayFilterMode?: DisplayAnnouncementFilterMode;
  /** Used only when displayFilterMode is `on_or_after` (YYYY-MM-DD). */
  displayOnOrAfter?: string;
  segments: DisplaySegment[];
}

/** Valid `view=` query values for single-segment smart-sign preview (no rotation). */
export const DISPLAY_VIEW_SEGMENT_KINDS: DisplaySegmentKind[] = [
  'announcement_carousel',
  'announcement_fullscreen',
  'grid_workshops',
  'grid_artists',
  'grid_cinematic',
];

/**
 * If `program` is present in the query string, kiosk JSON wins and preview `view` is ignored.
 * Otherwise returns the segment kind from `view=`, or null.
 */
export function parseDisplayViewParam(search: string): DisplaySegmentKind | null {
  try {
    const q = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    if (q.get('program')?.trim()) return null;
    const raw = q.get('view')?.trim();
    if (!raw) return null;
    return DISPLAY_VIEW_SEGMENT_KINDS.includes(raw as DisplaySegmentKind)
      ? (raw as DisplaySegmentKind)
      : null;
  } catch {
    return null;
  }
}

export const DEFAULT_DISPLAY_PROGRAM: DisplayProgram = {
  version: 1,
  displayFilterMode: 'on_view_or_upcoming',
  segments: [
    {
      id: 'announcements',
      kind: 'announcement_carousel',
      durationMs: 90_000,
      params: {},
    },
    {
      // durationMs is a fallback; the orchestrator overrides it at runtime with
      // computeWorkshopSegmentDurationMs() so every featured + grid slide gets full time.
      id: 'workshops',
      kind: 'grid_workshops',
      durationMs: 35_000,
      params: { maxItems: 200, columns: 3 },
    },
    {
      id: 'artists',
      kind: 'grid_artists',
      durationMs: 91_000,
      params: {
        maxItems: 13,
        columns: 3,
        hideDates: true,
        filter: 'studio_residents',
        artistDisplayMode: 'spotlight',
        showArtwork: true,
        artistRotationMs: 7000,
      },
    },
    {
      id: 'cinematic',
      kind: 'grid_cinematic',
      durationMs: 35_000,
      params: {
        maxItems: 12,
        columns: 3,
      },
    },
  ],
};

/** Drop legacy April month locks and ensure the current on-or-after floor is set. */
export function migrateDisplayProgram(program: DisplayProgram): DisplayProgram {
  const legacyMonth = SMART_SIGN_DEFAULT_DISPLAY_MONTH;
  const segments = program.segments.map((segment) => {
    const params = segment.params;
    if (!params?.displayCalendarMonth || params.displayCalendarMonth !== legacyMonth) {
      return segment;
    }
    const { displayCalendarMonth: _removed, ...rest } = params;
    return {
      ...segment,
      params: Object.keys(rest).length > 0 ? rest : undefined,
    };
  });
  const { displayOnOrAfter: _legacyFloor, ...rest } = program;
  return {
    ...rest,
    displayFilterMode: program.displayFilterMode ?? 'on_view_or_upcoming',
    segments,
  };
}

function cloneSegmentParams(p?: DisplaySegmentParams): DisplaySegmentParams | undefined {
  return p ? { ...p } : undefined;
}

function defaultPreviewParamsForKind(_kind: DisplaySegmentKind): DisplaySegmentParams {
  return {};
}

/** One-segment program for preview URLs; orchestrator does not advance when length is 1. */
export function buildSingleSegmentPreviewProgram(
  kind: DisplaySegmentKind,
  options?: { announcementId?: string }
): DisplayProgram {
  const template = DEFAULT_DISPLAY_PROGRAM.segments.find((s) => s.kind === kind);
  const durationMs = template?.durationMs ?? 60_000;
  const id = template?.id ?? `preview_${kind}`;
  let params: DisplaySegmentParams = {
    ...defaultPreviewParamsForKind(kind),
    ...cloneSegmentParams(template?.params),
  };
  if (kind === 'announcement_fullscreen' && options?.announcementId?.trim()) {
    params = { ...params, announcementId: options.announcementId.trim() };
  }
  return {
    version: 1,
    displayFilterMode: 'on_view_or_upcoming',
    segments: [{ id, kind, durationMs, params }],
  };
}

export function previewLabelForViewKind(kind: DisplaySegmentKind): string {
  switch (kind) {
    case 'announcement_carousel':
      return 'Announcement carousel';
    case 'announcement_fullscreen':
      return 'Fullscreen announcement';
    case 'grid_workshops':
      return 'Workshops grid';
    case 'grid_artists':
      return 'Artists grid';
    case 'grid_cinematic':
      return 'Cinematic grid';
    default:
      return 'Preview';
  }
}

function isDisplayProgram(x: unknown): x is DisplayProgram {
  if (!x || typeof x !== 'object') return false;
  const o = x as DisplayProgram;
  if (o.version !== 1) return false;
  if (!Array.isArray(o.segments) || o.segments.length === 0) return false;
  return o.segments.every(
    (s) =>
      typeof s.id === 'string' &&
      typeof s.kind === 'string' &&
      typeof s.durationMs === 'number' &&
      s.durationMs >= 3000
  );
}

/** Parse and validate JSON text from the settings editor */
export function tryParseDisplayProgramJson(raw: string): DisplayProgram | null {
  try {
    const parsed = JSON.parse(raw);
    return isDisplayProgram(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function parseProgramFromUrl(search: string): DisplayProgram | null {
  try {
    const q = new URLSearchParams(search);
    const raw = q.get('program');
    if (!raw?.trim()) return null;
    const json = typeof atob !== 'undefined' ? atob(raw.replace(/-/g, '+').replace(/_/g, '/')) : '';
    const parsed = JSON.parse(json);
    return isDisplayProgram(parsed) ? migrateDisplayProgram(parsed) : null;
  } catch {
    return null;
  }
}

export function loadDisplayProgram(orgSlug: string): DisplayProgram {
  if (typeof window === 'undefined') return DEFAULT_DISPLAY_PROGRAM;
  try {
    const urlProg = parseProgramFromUrl(window.location.search);
    if (urlProg) return urlProg;

    const raw = localStorage.getItem(`${DISPLAY_PROGRAM_STORAGE_PREFIX}${orgSlug}`);
    if (!raw) return DEFAULT_DISPLAY_PROGRAM;
    const parsed = JSON.parse(raw);
    return isDisplayProgram(parsed) ? migrateDisplayProgram(parsed) : DEFAULT_DISPLAY_PROGRAM;
  } catch {
    return DEFAULT_DISPLAY_PROGRAM;
  }
}

export function saveDisplayProgram(orgSlug: string, program: DisplayProgram): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    `${DISPLAY_PROGRAM_STORAGE_PREFIX}${orgSlug}`,
    JSON.stringify(program, null, 2)
  );
}

/** Base64url (no padding) for `?program=` kiosk setup */
export function encodeDisplayProgramForUrl(program: DisplayProgram): string {
  const json = JSON.stringify(program);
  if (typeof btoa === 'undefined') return '';
  const b64 = btoa(json);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function filterAnnouncementsByRecentWindow(
  announcements: { created_at?: string; starts_at?: string; scheduled_at?: string }[],
  days: number
): typeof announcements {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return announcements.filter((a) => {
    const raw = a.created_at || a.starts_at || a.scheduled_at;
    if (!raw) return false;
    const d = new Date(raw);
    return !Number.isNaN(d.getTime()) && d >= cutoff;
  });
}

export function filterCinematicAnnouncements<T extends { type?: string | null; tags?: string[] | null }>(
  announcements: T[]
): T[] {
  return announcements.filter((a) => {
    const t = String(a.type || '').toLowerCase();
    if (t === 'cinematic') return true;
    const tags = (a.tags || []).map((x) => String(x).toLowerCase());
    return tags.some((tag) => tag.includes('film') || tag.includes('cinematic') || tag.includes('poster'));
  });
}

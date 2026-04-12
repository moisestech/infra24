/**
 * Smart-sign display program: timed segments (carousel, grids, fullscreen).
 * V1: localStorage + optional ?program= URL (base64url JSON).
 */

export const DISPLAY_PROGRAM_STORAGE_PREFIX = 'display-program:v1:';

/** Default calendar month for announcement carousel, fullscreen pool, and cinematic grid (YYYY-MM). Edit segment JSON or change this constant between programming cycles. */
export const SMART_SIGN_DEFAULT_DISPLAY_MONTH = '2026-04';

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
}

export interface DisplaySegment {
  id: string;
  kind: DisplaySegmentKind;
  durationMs: number;
  params?: DisplaySegmentParams;
}

export interface DisplayProgram {
  version: 1;
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
  segments: [
    {
      id: 'announcements',
      kind: 'announcement_carousel',
      durationMs: 90_000,
      params: {
        displayCalendarMonth: SMART_SIGN_DEFAULT_DISPLAY_MONTH,
        useRecentWindowDays: 30,
      },
    },
    {
      id: 'workshops',
      kind: 'grid_workshops',
      durationMs: 35_000,
      params: { maxItems: 200, columns: 3 },
    },
    {
      id: 'artists',
      kind: 'grid_artists',
      durationMs: 35_000,
      params: {
        maxItems: 12,
        columns: 3,
        hideDates: true,
        /** All public artists on the smart sign; use `studio_residents` in custom JSON if needed */
        filter: 'all',
      },
    },
    {
      id: 'cinematic',
      kind: 'grid_cinematic',
      durationMs: 35_000,
      params: {
        maxItems: 12,
        columns: 3,
        displayCalendarMonth: SMART_SIGN_DEFAULT_DISPLAY_MONTH,
      },
    },
  ],
};

function cloneSegmentParams(p?: DisplaySegmentParams): DisplaySegmentParams | undefined {
  return p ? { ...p } : undefined;
}

function defaultPreviewParamsForKind(kind: DisplaySegmentKind): DisplaySegmentParams {
  switch (kind) {
    case 'announcement_carousel':
    case 'grid_cinematic':
    case 'announcement_fullscreen':
      return { displayCalendarMonth: SMART_SIGN_DEFAULT_DISPLAY_MONTH };
    default:
      return {};
  }
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
    return isDisplayProgram(parsed) ? parsed : null;
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
    return isDisplayProgram(parsed) ? parsed : DEFAULT_DISPLAY_PROGRAM;
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

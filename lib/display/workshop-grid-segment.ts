import type { DisplaySegmentParams } from '@/lib/display/display-program';
import type { WorkshopGridItem } from '@/components/display/DisplayGrid';

export const WORKSHOP_GRID_PAGE_SIZE = 9;
export const WORKSHOP_FEATURED_COUNT = 5;
export const WORKSHOP_FEATURED_ROTATION_MS = 10_000;
export const WORKSHOP_GRID_PAGE_ROTATION_MS = 10_000;

export type WorkshopSegmentSlide =
  | { kind: 'featured'; item: WorkshopGridItem; featuredIndex: number; featuredTotal: number }
  | { kind: 'grid'; items: WorkshopGridItem[]; pageIndex: number; pageTotal: number };

export function parseWorkshopEventMs(raw?: string | null): number | null {
  if (!raw) return null;
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(raw).trim());
  if (ymd) {
    const d = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

export function sortWorkshopsByUpcoming(items: WorkshopGridItem[]): WorkshopGridItem[] {
  return [...items].sort((a, b) => {
    const aMs = a.event_sort_ms ?? Number.MAX_SAFE_INTEGER;
    const bMs = b.event_sort_ms ?? Number.MAX_SAFE_INTEGER;
    if (aMs !== bMs) return aMs - bMs;
    return a.title.localeCompare(b.title);
  });
}

export function isWorkshopStillRelevant(item: WorkshopGridItem, nowMs = Date.now()): boolean {
  const endMs = item.event_end_ms;
  if (typeof endMs === 'number' && endMs > 0) {
    const today = new Date(nowMs);
    today.setHours(0, 0, 0, 0);
    return endMs >= today.getTime();
  }
  const startMs = item.event_sort_ms;
  if (typeof startMs === 'number' && startMs > 0) {
    const today = new Date(nowMs);
    today.setHours(0, 0, 0, 0);
    return startMs >= today.getTime();
  }
  return true;
}

export function pickFeaturedUpcomingWorkshops(
  items: WorkshopGridItem[],
  count = WORKSHOP_FEATURED_COUNT
): WorkshopGridItem[] {
  const sorted = sortWorkshopsByUpcoming(items).filter((item) => isWorkshopStillRelevant(item));
  const withDates = sorted.filter((item) => typeof item.event_sort_ms === 'number' && item.event_sort_ms > 0);
  const withoutDates = sorted.filter((item) => !item.event_sort_ms);
  return [...withDates, ...withoutDates].slice(0, count);
}

export function chunkWorkshopPages(
  items: WorkshopGridItem[],
  pageSize = WORKSHOP_GRID_PAGE_SIZE
): WorkshopGridItem[][] {
  if (items.length === 0) return [];
  const pages: WorkshopGridItem[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  return pages;
}

export function buildWorkshopSegmentSlides(
  items: WorkshopGridItem[],
  params?: DisplaySegmentParams
): WorkshopSegmentSlide[] {
  const pageSize = params?.workshopPageSize ?? WORKSHOP_GRID_PAGE_SIZE;
  const featuredCount = params?.workshopFeaturedCount ?? WORKSHOP_FEATURED_COUNT;
  const relevant = sortWorkshopsByUpcoming(items).filter((item) => isWorkshopStillRelevant(item));
  const featured = pickFeaturedUpcomingWorkshops(relevant, featuredCount);
  const pages = chunkWorkshopPages(relevant, pageSize);

  const slides: WorkshopSegmentSlide[] = featured.map((item, featuredIndex) => ({
    kind: 'featured',
    item,
    featuredIndex,
    featuredTotal: featured.length,
  }));

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    slides.push({
      kind: 'grid',
      items: pages[pageIndex],
      pageIndex,
      pageTotal: pages.length,
    });
  }

  return slides;
}

export function workshopSlideDurationMs(
  slide: WorkshopSegmentSlide,
  params?: DisplaySegmentParams
): number {
  if (slide.kind === 'featured') {
    return Math.max(3000, params?.workshopFeaturedRotationMs ?? WORKSHOP_FEATURED_ROTATION_MS);
  }
  return Math.max(3000, params?.workshopGridPageRotationMs ?? WORKSHOP_GRID_PAGE_ROTATION_MS);
}

export function computeWorkshopSegmentDurationMs(
  items: WorkshopGridItem[],
  params?: DisplaySegmentParams
): number {
  const slides = buildWorkshopSegmentSlides(items, params);
  if (slides.length === 0) return 30_000;
  const total = slides.reduce((sum, slide) => sum + workshopSlideDurationMs(slide, params), 0);
  return Math.max(30_000, total);
}

export function featuredWorkshopIds(items: WorkshopGridItem[], params?: DisplaySegmentParams): Set<string> {
  const featuredCount = params?.workshopFeaturedCount ?? WORKSHOP_FEATURED_COUNT;
  return new Set(pickFeaturedUpcomingWorkshops(items, featuredCount).map((item) => item.id));
}

import type { WorkshopGridItem } from '@/components/display/DisplayGrid';
import {
  buildWorkshopSegmentSlides,
  chunkWorkshopPages,
  computeWorkshopSegmentDurationMs,
  isWorkshopStillRelevant,
  parseWorkshopEventMs,
  pickFeaturedUpcomingWorkshops,
  sortWorkshopsByUpcoming,
  workshopSlideDurationMs,
  WORKSHOP_FEATURED_ROTATION_MS,
  WORKSHOP_GRID_PAGE_ROTATION_MS,
} from '@/lib/display/workshop-grid-segment';

const DAY = 86_400_000;

function item(id: string, offsetDays: number | null): WorkshopGridItem {
  const ms = offsetDays == null ? null : Date.now() + offsetDays * DAY;
  return {
    id,
    title: id,
    event_sort_ms: ms,
    event_end_ms: ms,
    is_online_class: offsetDays == null,
  };
}

describe('workshop-grid-segment', () => {
  it('defaults featured + grid rotation to 10s', () => {
    expect(WORKSHOP_FEATURED_ROTATION_MS).toBe(10_000);
    expect(WORKSHOP_GRID_PAGE_ROTATION_MS).toBe(10_000);
  });

  it('parses YYYY-MM-DD into local epoch ms', () => {
    const ms = parseWorkshopEventMs('2026-06-15');
    expect(ms).toBe(new Date(2026, 5, 15).getTime());
    expect(parseWorkshopEventMs(null)).toBeNull();
    expect(parseWorkshopEventMs('not-a-date')).toBeNull();
  });

  it('sorts soonest first and pushes undated to the end', () => {
    const sorted = sortWorkshopsByUpcoming([
      item('c', 30),
      item('undated', null),
      item('a', 2),
      item('b', 10),
    ]);
    expect(sorted.map((s) => s.id)).toEqual(['a', 'b', 'c', 'undated']);
  });

  it('treats past as not relevant, today/future/undated as relevant', () => {
    expect(isWorkshopStillRelevant(item('past', -5))).toBe(false);
    expect(isWorkshopStillRelevant(item('future', 5))).toBe(true);
    expect(isWorkshopStillRelevant(item('undated', null))).toBe(true);
  });

  it('picks 5 soonest upcoming, fills with undated, excludes past', () => {
    const featured = pickFeaturedUpcomingWorkshops([
      item('past', -3),
      item('f1', 1),
      item('f2', 4),
      item('f3', 9),
      item('u1', null),
      item('u2', null),
    ]);
    expect(featured).toHaveLength(5);
    expect(featured.map((f) => f.id)).toEqual(['f1', 'f2', 'f3', 'u1', 'u2']);
    expect(featured.find((f) => f.id === 'past')).toBeUndefined();
  });

  it('chunks pages of 9', () => {
    const items = Array.from({ length: 20 }, (_, i) => item(`w${i}`, i + 1));
    const pages = chunkWorkshopPages(items);
    expect(pages).toHaveLength(3);
    expect(pages[0]).toHaveLength(9);
    expect(pages[2]).toHaveLength(2);
  });

  it('builds featured slides first, then grid pages (past excluded)', () => {
    const items = [
      item('past', -2),
      ...Array.from({ length: 12 }, (_, i) => item(`w${i}`, i + 1)),
    ];
    const slides = buildWorkshopSegmentSlides(items);
    const featured = slides.filter((s) => s.kind === 'featured');
    const grid = slides.filter((s) => s.kind === 'grid');
    expect(featured).toHaveLength(5);
    expect(grid).toHaveLength(2); // 12 relevant items / 9 per page
    // featured slides come before grid slides
    expect(slides.slice(0, 5).every((s) => s.kind === 'featured')).toBe(true);
    // past item is excluded from grid pages
    const gridIds = grid.flatMap((s) => (s.kind === 'grid' ? s.items.map((i) => i.id) : []));
    expect(gridIds).not.toContain('past');
  });

  it('honors configurable page size and featured count', () => {
    const items = Array.from({ length: 10 }, (_, i) => item(`w${i}`, i + 1));
    const slides = buildWorkshopSegmentSlides(items, {
      workshopPageSize: 4,
      workshopFeaturedCount: 2,
    });
    expect(slides.filter((s) => s.kind === 'featured')).toHaveLength(2);
    expect(slides.filter((s) => s.kind === 'grid')).toHaveLength(3); // 10 / 4
  });

  it('uses 10s slide durations by default and respects overrides', () => {
    const featured = { kind: 'featured' as const, item: item('a', 1), featuredIndex: 0, featuredTotal: 1 };
    const grid = { kind: 'grid' as const, items: [item('a', 1)], pageIndex: 0, pageTotal: 1 };
    expect(workshopSlideDurationMs(featured)).toBe(10_000);
    expect(workshopSlideDurationMs(grid)).toBe(10_000);
    expect(workshopSlideDurationMs(featured, { workshopFeaturedRotationMs: 12_000 })).toBe(12_000);
    expect(workshopSlideDurationMs(grid, { workshopGridPageRotationMs: 15_000 })).toBe(15_000);
  });

  it('computes total segment duration with a 30s floor', () => {
    expect(computeWorkshopSegmentDurationMs([])).toBe(30_000);
    const items = Array.from({ length: 12 }, (_, i) => item(`w${i}`, i + 1));
    // 5 featured + 2 grid pages = 7 slides * 10s = 70s
    expect(computeWorkshopSegmentDurationMs(items)).toBe(70_000);
  });
});

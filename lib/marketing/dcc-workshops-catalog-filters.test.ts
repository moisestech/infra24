import type { WorkshopRow } from '@/components/workshops/marketing/types'
import {
  buildTagCounts,
  durationMinutesToBucket,
  emptyDccCatalogFilterState,
  matchesDccCatalogFilters,
  sortDccCatalogWorkshops,
} from './dcc-workshops-catalog-filters'

function row(p: Partial<WorkshopRow> & Pick<WorkshopRow, 'id' | 'title'>): WorkshopRow {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? '',
    level: p.level ?? 'beginner',
    duration_minutes: p.duration_minutes ?? 120,
    price: p.price ?? 0,
    status: p.status ?? 'published',
    metadata: p.metadata ?? null,
    featured: p.featured ?? false,
    total_bookings: p.total_bookings,
    confirmed_bookings: p.confirmed_bookings,
    average_rating: p.average_rating,
    total_feedback: p.total_feedback,
    updated_at: p.updated_at,
  }
}

describe('durationMinutesToBucket', () => {
  it('maps under 20 hours', () => {
    expect(durationMinutesToBucket(60)).toBe('lt20')
    expect(durationMinutesToBucket(19 * 60)).toBe('lt20')
  })
  it('maps 20–60 hours inclusive', () => {
    expect(durationMinutesToBucket(20 * 60)).toBe('20to60')
    expect(durationMinutesToBucket(45 * 60)).toBe('20to60')
    expect(durationMinutesToBucket(60 * 60)).toBe('20to60')
  })
  it('maps over 60 hours', () => {
    expect(durationMinutesToBucket(61 * 60)).toBe('gt60')
  })
  it('returns null for empty', () => {
    expect(durationMinutesToBucket(0)).toBe(null)
    expect(durationMinutesToBucket(null)).toBe(null)
  })
})

describe('matchesDccCatalogFilters', () => {
  const base = row({
    id: '1',
    title: 'Test',
    metadata: {
      slug: 'test',
      format: 'online',
      track: 'ai_literacy',
      tags: ['figma', 'web'],
    },
    level: 'intermediate',
    price: 25,
    duration_minutes: 10 * 60,
  })

  it('passes when no filters active', () => {
    expect(matchesDccCatalogFilters(base, emptyDccCatalogFilterState())).toBe(true)
  })

  it('filters by track', () => {
    const st = emptyDccCatalogFilterState()
    st.tracks = ['presence']
    expect(matchesDccCatalogFilters(base, st)).toBe(false)
    st.tracks = ['ai_literacy']
    expect(matchesDccCatalogFilters(base, st)).toBe(true)
  })

  it('filters by format', () => {
    const st = emptyDccCatalogFilterState()
    st.formats = ['in_person']
    expect(matchesDccCatalogFilters(base, st)).toBe(false)
    st.formats = ['online']
    expect(matchesDccCatalogFilters(base, st)).toBe(true)
  })

  it('filters by tag OR within section', () => {
    const st = emptyDccCatalogFilterState()
    st.tags = ['photoshop']
    expect(matchesDccCatalogFilters(base, st)).toBe(false)
    st.tags = ['figma']
    expect(matchesDccCatalogFilters(base, st)).toBe(true)
  })

  it('filters by level', () => {
    const st = emptyDccCatalogFilterState()
    st.levels = ['beginner']
    expect(matchesDccCatalogFilters(base, st)).toBe(false)
    st.levels = ['intermediate']
    expect(matchesDccCatalogFilters(base, st)).toBe(true)
  })

  it('filters by price band', () => {
    const st = emptyDccCatalogFilterState()
    st.prices = ['free']
    expect(matchesDccCatalogFilters(base, st)).toBe(false)
    st.prices = ['paid']
    expect(matchesDccCatalogFilters(base, st)).toBe(true)
  })

  it('filters by duration bucket', () => {
    const st = emptyDccCatalogFilterState()
    st.durations = ['gt60']
    expect(matchesDccCatalogFilters(base, st)).toBe(false)
    st.durations = ['lt20']
    expect(matchesDccCatalogFilters(base, st)).toBe(true)
  })
})

describe('sortDccCatalogWorkshops', () => {
  const a = row({
    id: 'a',
    title: 'A',
    total_bookings: 1,
    average_rating: 4,
    updated_at: '2020-01-01T00:00:00.000Z',
    featured: false,
  })
  const b = row({
    id: 'b',
    title: 'B',
    total_bookings: 10,
    average_rating: 5,
    updated_at: '2024-01-01T00:00:00.000Z',
    featured: true,
  })

  it('sorts by popular (bookings)', () => {
    const s = sortDccCatalogWorkshops([a, b], 'popular')
    expect(s[0].id).toBe('b')
  })

  it('sorts by rating', () => {
    const s = sortDccCatalogWorkshops([a, b], 'rated')
    expect(s[0].id).toBe('b')
  })

  it('sorts by updated_at', () => {
    const s = sortDccCatalogWorkshops([a, b], 'recent')
    expect(s[0].id).toBe('b')
  })

  it('sorts featured first', () => {
    const s = sortDccCatalogWorkshops([a, b], 'featured')
    expect(s[0].id).toBe('b')
  })
})

describe('buildTagCounts', () => {
  it('aggregates lowercase tags', () => {
    const list = [
      row({ id: '1', title: 'x', metadata: { slug: 'x', tags: ['AI', 'web'] } }),
      row({ id: '2', title: 'y', metadata: { slug: 'y', tags: ['web'] } }),
    ]
    const counts = buildTagCounts(list)
    expect(counts.find((c) => c.tag === 'web')?.count).toBe(2)
    expect(counts.find((c) => c.tag === 'ai')?.count).toBe(1)
  })
})

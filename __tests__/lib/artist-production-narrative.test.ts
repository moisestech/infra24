import { FABRICATION_SERVICE_LANES } from '@/lib/dcc/fabrication'
import {
  ARTIST_PRODUCTION_ADVANTAGE,
  ARTIST_PRODUCTION_CTA,
  ARTIST_PRODUCTION_DIFFERENTIATORS,
  ARTIST_PRODUCTION_ENGINES,
  ARTIST_PRODUCTION_LANE_CTA,
  ARTIST_PRODUCTION_MADE_STEPS,
  ARTIST_PRODUCTION_MADE_TAGLINE,
  ARTIST_PRODUCTION_PROMISE,
  ARTIST_PRODUCTION_SLOGAN,
  ARTIST_PRODUCTION_SPOKEN,
  ARTIST_PRODUCTION_VALUE_PROP,
} from '@/lib/marketing/artist-production-narrative'
import { marketingHeaderSloganLines } from '@/lib/marketing/marketing-header-slogans'
import { marketingNavSheetGroups, navItems } from '@/lib/marketing/content'

function serializeNarrative() {
  return JSON.stringify({
    spoken: ARTIST_PRODUCTION_SPOKEN,
    promise: ARTIST_PRODUCTION_PROMISE,
    value: ARTIST_PRODUCTION_VALUE_PROP,
    advantage: ARTIST_PRODUCTION_ADVANTAGE,
    made: ARTIST_PRODUCTION_MADE_STEPS,
    engines: ARTIST_PRODUCTION_ENGINES,
    ctas: ARTIST_PRODUCTION_CTA,
    differentiators: ARTIST_PRODUCTION_DIFFERENTIATORS,
  })
}

describe('Artist production narrative', () => {
  it('locks the spoken promise and does not use mission as the sales headline', () => {
    expect(ARTIST_PRODUCTION_SPOKEN).toBe('You bring the idea. We help you make it.')
    expect(ARTIST_PRODUCTION_PROMISE).toMatch(/figure out how to make it/i)
    expect(ARTIST_PRODUCTION_VALUE_PROP).toMatch(/print-ready file/)
  })

  it('maps two sales CTAs onto existing fabricate quote lanes', () => {
    expect(ARTIST_PRODUCTION_CTA.startProject.href).toBe(
      '/fabricate/quote?lane=make-it-with-me'
    )
    expect(ARTIST_PRODUCTION_CTA.printMyFile.href).toBe(
      '/fabricate/quote?lane=print-my-file'
    )
    expect(ARTIST_PRODUCTION_LANE_CTA['make-it-with-me']).toBe('Start a project')
    expect(ARTIST_PRODUCTION_LANE_CTA['print-my-file']).toBe('Print my file')
    expect(FABRICATION_SERVICE_LANES.map((lane) => lane.id)).toEqual([
      'print-my-file',
      'prepare-fabricate',
      'make-it-with-me',
    ])
  })

  it('names MADE as four job stages', () => {
    expect(ARTIST_PRODUCTION_MADE_TAGLINE).toBe('From idea to MADE.')
    expect(ARTIST_PRODUCTION_MADE_STEPS.map((step) => step.letter).join('')).toBe('MADE')
  })

  it('keeps MAKE LEARN SHOW as engines, not extra nav items', () => {
    expect(ARTIST_PRODUCTION_ENGINES.map((engine) => engine.id)).toEqual([
      'make',
      'learn',
      'show',
    ])
    expect(navItems.map((item) => item.href)).not.toEqual(
      expect.arrayContaining(['/start-a-project', '/upload-a-file'])
    )
    const group = marketingNavSheetGroups.find((g) => g.title === 'For institutions')
    expect(group?.hrefs).toEqual(['/institutions', '/artist-infrastructure'])
  })

  it('adds the production slogan without dropping cultural-center lines', () => {
    expect(marketingHeaderSloganLines).toContain(ARTIST_PRODUCTION_SLOGAN)
    expect(marketingHeaderSloganLines).toContain('For artists working with screens.')
    expect(marketingHeaderSloganLines).toContain(
      'For institutions that need digital infrastructure.'
    )
  })

  it('does not pitch personal channels, public-seat prices, or an unfulfillable GC promise', () => {
    const blob = serializeNarrative()
    expect(blob).not.toMatch(/m@moises\.tech/)
    expect(blob).not.toMatch(/calendly\.com\/moisestech/)
    expect(blob).not.toMatch(/\$45/)
    expect(blob).not.toMatch(/we handle everything/i)
    expect(blob).not.toMatch(/innovative|world-class|community-driven|cutting-edge/i)
  })

  it('states operational differentiators that shops cannot copy for free', () => {
    expect(ARTIST_PRODUCTION_DIFFERENTIATORS.join(' ')).toMatch(/No membership/)
    expect(ARTIST_PRODUCTION_DIFFERENTIATORS.join(' ')).toMatch(/No residency/)
    expect(ARTIST_PRODUCTION_DIFFERENTIATORS.join(' ')).toMatch(/No print-ready file/)
  })
})

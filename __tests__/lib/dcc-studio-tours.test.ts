import {
  DCC_STUDIO_TOURS,
  STUDIO_TOUR_IFRAME_ALLOW,
  assertStudioTourSlugsValid,
  getStudioTourByArtistSlug,
  listPublishedStudioTours,
} from '@/lib/dcc/studios'
import { getPublishedArtistBySlug } from '@/lib/dcc/culture'
import { knightFounderMomentoEmbeds } from '@/lib/marketing/knight-people'

describe('dcc studio tours', () => {
  it('publishes Moises Studio 43 and Fabiola with unique artist slugs', () => {
    expect(assertStudioTourSlugsValid()).toEqual([])
    expect(listPublishedStudioTours().map((tour) => tour.artistSlug)).toEqual([
      'moises-sanabria',
      'fabiola-larios',
    ])
    expect(DCC_STUDIO_TOURS.some((tour) => tour.artistSlug.startsWith('angelo'))).toBe(
      false
    )
  })

  it('keeps the Studio 43 Momento360 embed, share link, and XR permissions', () => {
    const moises = getStudioTourByArtistSlug('moises-sanabria')
    expect(moises?.embedSrc).toBe(
      'https://momento360.com/e/u/a338f042352a4550b3e12a6ccc29f98b?utm_campaign=embed&utm_source=other&heading=128.94&pitch=-17.74&field-of-view=75&size=medium&display-plan=true'
    )
    expect(moises?.shareUrl).toBe(
      'https://momento360.com/e/u/a338f042352a4550b3e12a6ccc29f98b'
    )
    expect(moises?.title).toBe('Moises Sanabria — Studio 43, Bakehouse Art Complex')
    expect(moises?.enterLabel).toBe('Enter Studio 43')
    expect(moises?.sourceHref).toContain('born-into-the-machine#studio')
    expect(STUDIO_TOUR_IFRAME_ALLOW).toBe(
      'xr-spatial-tracking; gyroscope; accelerometer'
    )
  })

  it('embeds founder 360s on matching published culture artists and does not invent Angelo', () => {
    expect(getPublishedArtistBySlug('moises-sanabria')?.slug).toBe('moises-sanabria')
    expect(getPublishedArtistBySlug('fabiola-larios')?.slug).toBe('fabiola-larios')
    expect(getPublishedArtistBySlug('angelo-caruso')?.slug).toBe('angelo-caruso')
    expect(getStudioTourByArtistSlug('moises-sanabria')?.artistSlug).toBe(
      'moises-sanabria'
    )
    expect(getStudioTourByArtistSlug('fabiola-larios')?.artistSlug).toBe(
      'fabiola-larios'
    )
    expect(getStudioTourByArtistSlug('angelo-caruso')).toBeUndefined()
    expect(getStudioTourByArtistSlug('fixture-artist-a')).toBeUndefined()
  })

  it('feeds the Knight studios band from the same registry', () => {
    expect(knightFounderMomentoEmbeds.map((tour) => tour.id)).toEqual(
      DCC_STUDIO_TOURS.map((tour) => tour.id)
    )
    expect(knightFounderMomentoEmbeds[0]?.embedSrc).toContain('a338f042352a4550b3e12a6ccc29f98b')
  })
})

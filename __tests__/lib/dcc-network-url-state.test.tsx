import { act, renderHook } from '@testing-library/react'
import {
  ARTWORK_DEFAULT, readArtworkUrl, writeArtworkUrl, readAtlasUrl, writeAtlasUrl, shareUrl,
} from '../../lib/dcc/network/url-state'
import { useUrlState } from '../../lib/dcc/network/use-url-state'

it('round-trips independent living and frozen artwork states, view and node', () => {
  const state = {
    state: { interests: [] as [], contribution: 'need' as const, relation: 'proposed' as const },
    frozen: { interests: ['culture' as const], contribution: 'offer' as const, relation: 'mutual' as const },
    view: 'edition' as const, selected: 'bridge',
  }
  expect(readArtworkUrl(writeArtworkUrl(state))).toEqual(state)
})
it('keeps old artwork links, empty interests and invalid input safe', () => {
  expect(readArtworkUrl(new URLSearchParams('i=&s=need&r=proposed')).state).toEqual({ interests: [], contribution: 'need', relation: 'proposed' })
  expect(readArtworkUrl(new URLSearchParams('view=edition&node=private-person&s=bad&r=bad'))).toEqual(ARTWORK_DEFAULT)
  expect(readArtworkUrl(new URLSearchParams('i=culture,culture,unknown')).state.interests).toEqual(['culture'])
})
it('round-trips Atlas filters, encoded search, profile, motion and Passport entry', () => {
  const params = new URLSearchParams('interests=making,culture&q=art+%26+sound&profile=fabiola-larios&motion=paused&panel=passport')
  const state = readAtlasUrl(params)
  expect(readAtlasUrl(writeAtlasUrl(state))).toEqual(state)
  expect(state.query).toBe('art & sound')
  expect(state.showPassport).toBe(true)
})
it('never forwards unrelated params or Passport answers into a share link', () => {
  const raw = new URLSearchParams('name=Private&email=secret&visibility=public&profile=rec_private&panel=passport&interests=unknown,culture,culture')
  const url = shareUrl('https://dcc.miami/network/community?token=secret#private', writeAtlasUrl(readAtlasUrl(raw)))
  expect(url).toBe('https://dcc.miami/network/community?interests=culture&panel=passport')
  expect(readAtlasUrl(new URLSearchParams('q=' + 'x'.repeat(500))).query).toHaveLength(120)
})
it('honors reduced motion when restoring a shared Atlas view', () => {
  expect(readAtlasUrl(new URLSearchParams('motion=playing'), true).paused).toBe(true)
})
it('hydrates, updates the address, restores navigation and preserves history metadata', () => {
  window.history.replaceState({ next: 'preserve' }, '', '/network/artwork?i=&s=need&r=proposed')
  const { result, unmount } = renderHook(() => useUrlState(ARTWORK_DEFAULT, readArtworkUrl, writeArtworkUrl))
  expect(result.current[0].state.contribution).toBe('need')
  act(() => result.current[1]({ selected: 'bridge' }))
  expect(new URLSearchParams(window.location.search).get('node')).toBe('bridge')
  expect(window.history.state).toEqual({ next: 'preserve' })
  act(() => {
    window.history.replaceState({ next: 'restored' }, '', '/network/artwork?i=culture&s=offer&r=mutual')
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  expect(result.current[0].state.contribution).toBe('offer')
  expect(result.current[0].selected).toBe('guest')
  unmount()
})
it('replaces search typing without creating one history entry per keystroke', () => {
  window.history.replaceState(null, '', '/network/community')
  const initial = readAtlasUrl(new URLSearchParams())
  const read = (params: URLSearchParams) => readAtlasUrl(params)
  const { result } = renderHook(() => useUrlState(initial, read, writeAtlasUrl))
  const before = window.history.length
  act(() => result.current[1]({ query: 'sculpture' }, 'replace'))
  expect(window.history.length).toBe(before)
  expect(new URLSearchParams(window.location.search).get('q')).toBe('sculpture')
})

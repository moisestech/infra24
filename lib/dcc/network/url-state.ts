import { INTERESTS, type InterestId } from '../community/atlas'

export type AtlasUrlState = {
  interests: InterestId[]; query: string; selected: string | null
  paused: boolean; showPassport: boolean
}
export type Contribution = 'show' | 'need' | 'offer'
export type Relation = 'none' | 'proposed' | 'mutual'
export type ArtworkState = { interests: InterestId[]; contribution: Contribution; relation: Relation }
export type ArtworkUrlState = {
  state: ArtworkState; frozen: ArtworkState | null
  view: 'living' | 'edition'; selected: string
}
export const ARTWORK_START: ArtworkState = { interests: ['making', 'code-ai'], contribution: 'show', relation: 'none' }
export const ARTWORK_DEFAULT: ArtworkUrlState = { state: ARTWORK_START, frozen: null, view: 'living', selected: 'guest' }
export const ARTWORK_NODES = ['guest', 'material', 'signal', 'bridge', 'device', 'process'] as const

function interests(value: string | null, fallback: InterestId[] = []): InterestId[] {
  if (value === null) return [...fallback]
  const ids = new Set(value.slice(0, 200).split(','))
  return INTERESTS.filter((i) => ids.has(i.id)).map((i) => i.id)
}
function slug(value: string | null) {
  return value && value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : null
}
export function readAtlasUrl(params: URLSearchParams, reducedMotion = false): AtlasUrlState {
  return {
    interests: interests(params.get('interests')),
    query: (params.get('q') ?? '').slice(0, 120),
    selected: slug(params.get('profile')),
    paused: params.get('motion') === 'paused' || reducedMotion,
    showPassport: params.get('panel') === 'passport',
  }
}
/** Build from scratch so unrelated parameters, draft answers and identifiers never leak. */
export function writeAtlasUrl(state: AtlasUrlState) {
  const params = new URLSearchParams()
  const ids = interests(state.interests.join(','))
  if (ids.length) params.set('interests', ids.join(','))
  if (state.query) params.set('q', state.query.slice(0, 120))
  if (slug(state.selected)) params.set('profile', state.selected!)
  if (state.paused) params.set('motion', 'paused')
  if (state.showPassport) params.set('panel', 'passport')
  return params
}
function readStudy(params: URLSearchParams, prefix = ''): ArtworkState {
  const contribution = params.get(prefix + 's')
  const relation = params.get(prefix + 'r')
  return {
    interests: interests(params.get(prefix + 'i'), ARTWORK_START.interests),
    contribution: contribution === 'need' || contribution === 'offer' ? contribution : 'show',
    relation: relation === 'proposed' || relation === 'mutual' ? relation : 'none',
  }
}
export function readArtworkUrl(params: URLSearchParams): ArtworkUrlState {
  const frozen = params.has('fi') ? readStudy(params, 'f') : null
  const selected = params.get('node') ?? ''
  return {
    state: readStudy(params), frozen,
    view: params.get('view') === 'edition' && frozen ? 'edition' : 'living',
    selected: (ARTWORK_NODES as readonly string[]).includes(selected) ? selected : 'guest',
  }
}
export function writeArtworkUrl(value: ArtworkUrlState) {
  const params = new URLSearchParams()
  function writeStudy(state: ArtworkState, prefix = '') {
    params.set(prefix + 'i', interests(state.interests.join(',')).join(','))
    params.set(prefix + 's', state.contribution)
    params.set(prefix + 'r', state.relation)
  }
  writeStudy(value.state)
  if (value.frozen) writeStudy(value.frozen, 'f')
  if (value.view === 'edition' && value.frozen) params.set('view', 'edition')
  if ((ARTWORK_NODES as readonly string[]).includes(value.selected) && value.selected !== 'guest') params.set('node', value.selected)
  return params
}
export function shareUrl(href: string, params: URLSearchParams) {
  const url = new URL(href)
  url.search = params.toString()
  url.hash = ''
  return url.toString()
}

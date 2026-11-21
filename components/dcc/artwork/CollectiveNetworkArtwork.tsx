'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { ArtworkPerson, ArtworkRelationship } from './ArtworkForceField'

const ForceField = dynamic(() => import('./ArtworkForceField'), {
  ssr: false,
  loading: () => <div className="flex h-full min-h-[430px] items-center justify-center text-sm text-white/60">Opening the 3D artwork…</div>,
})
import { useEffect, useMemo, useState } from 'react'
import { INTERESTS, isInterestId, type InterestId } from '@/lib/dcc/community/atlas'

type Contribution = 'show' | 'need' | 'offer'
type Relation = 'none' | 'proposed' | 'mutual'
type ArtworkState = { interests: InterestId[]; contribution: Contribution; relation: Relation }
type Point = { x: number; y: number }
type Participant = Point & { id: string; label: string; practice: string; interests: InterestId[]; guest?: boolean }
type GraphEdge = { from: string; to: string; kind: 'declared' | 'proposal' | 'mutual'; color: string; guest?: boolean }

const START: ArtworkState = { interests: ['making', 'code-ai'], contribution: 'show', relation: 'none' }
const HUBS: Record<InterestId, Point> = {
  making: { x: 276, y: 160 },
  'image-sound': { x: 128, y: 420 },
  interactive: { x: 862, y: 215 },
  'code-ai': { x: 739, y: 132 },
  culture: { x: 666, y: 525 },
  exploring: { x: 394, y: 539 },
}

// These are fictional artistic positions, not DCC members, CRM records, or a roster.
const FICTIONAL_PARTICIPANTS: Participant[] = [
  { id: 'material', label: 'MATERIAL', practice: 'Experiments with matter', x: 340, y: 274, interests: ['making', 'culture'] },
  { id: 'signal', label: 'SIGNAL', practice: 'Images and sound', x: 272, y: 461, interests: ['image-sound', 'code-ai'] },
  { id: 'bridge', label: 'BRIDGE', practice: 'Facilitates exchanges', x: 610, y: 327, interests: ['culture', 'exploring'] },
  { id: 'device', label: 'DEVICE', practice: 'Builds interactive systems', x: 821, y: 362, interests: ['interactive', 'code-ai'] },
  { id: 'process', label: 'PROCESS', practice: 'Teaches fabrication', x: 510, y: 192, interests: ['making', 'interactive'] },
]

function makeScene(state: ArtworkState) {
  const count = state.interests.length
  const guestPosition: Point = count
    ? {
        x: state.interests.reduce((sum, id) => sum + HUBS[id].x, 0) / count,
        y: state.interests.reduce((sum, id) => sum + HUBS[id].y, 0) / count + (state.contribution === 'need' ? 92 : state.contribution === 'offer' ? -76 : 26),
      }
    : { x: 500, y: 350 }
  const guest: Participant = {
    id: 'guest', label: 'YOUR NODE', practice: state.contribution.toUpperCase() + ' / IN THIS STUDY',
    x: Math.max(170, Math.min(850, guestPosition.x)), y: Math.max(150, Math.min(535, guestPosition.y)),
    interests: state.interests, guest: true,
  }
  const participants = [...FICTIONAL_PARTICIPANTS, guest]
  const points = new Map<string, Point>()
  for (const interest of INTERESTS) points.set('hub:' + interest.id, HUBS[interest.id])
  for (const participant of participants) points.set(participant.id, participant)
  const edges: GraphEdge[] = []
  for (const participant of participants) {
    for (const interest of participant.interests) {
      edges.push({ from: participant.id, to: 'hub:' + interest, kind: 'declared', color: INTERESTS.find((v) => v.id === interest)?.color ?? '#8fa5a6', guest: participant.guest })
    }
  }
  if (state.relation !== 'none') {
    edges.push({ from: 'guest', to: 'bridge', kind: state.relation === 'mutual' ? 'mutual' : 'proposal', color: '#f2c680', guest: true })
  }
  return { participants, points, edges }
}

function fixtureSvg(state: ArtworkState) {
  const scene = makeScene(state)
  const lines = scene.edges.map((edge) => {
    const a = scene.points.get(edge.from)!
    const b = scene.points.get(edge.to)!
    const dash = edge.kind === 'proposal' ? ' stroke-dasharray="8 8"' : edge.kind === 'declared' ? ' stroke-dasharray="2 7"' : ''
    const width = edge.kind === 'mutual' ? 2.3 : edge.guest ? 1.7 : 0.75
    return '<line x1="' + a.x.toFixed(2) + '" y1="' + a.y.toFixed(2) + '" x2="' + b.x.toFixed(2) + '" y2="' + b.y.toFixed(2) + '" stroke="#151515" stroke-width="' + width + '"' + dash + '/>'
  })
  const hubs = INTERESTS.map((interest) => {
    const p = HUBS[interest.id]
    return '<circle cx="' + p.x + '" cy="' + p.y + '" r="7" fill="none" stroke="#151515" stroke-width="1.5"/><text x="' + (p.x + 12) + '" y="' + (p.y + 3) + '" font-size="11" font-family="monospace" fill="#151515">' + interest.short.toUpperCase().replace(/&/g, '&amp;') + '</text>'
  })
  const nodes = scene.participants.map((p) => '<circle cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '" r="' + (p.guest ? 17 : 10) + '" fill="none" stroke="#151515" stroke-width="' + (p.guest ? 3 : 1.5) + '"/><text x="' + (p.x + 20).toFixed(2) + '" y="' + (p.y + 5).toFixed(2) + '" font-size="12" font-family="monospace" fill="#151515">' + p.label + '</text>')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="300mm" height="195mm" viewBox="0 0 1000 650">',
    '<title>DCC / THE NETWORK MAKES ITSELF — FICTIONAL STUDY 001</title>',
    '<desc>Deterministic vector study. Fictional participants only. Not a cut-ready fabrication file; review all material tolerances, line widths, text conversion, and joins with a fabricator.</desc>',
    '<rect width="1000" height="650" fill="#ffffff"/>',
    '<text x="32" y="34" font-family="monospace" font-size="15">THE NETWORK MAKES ITSELF / STUDY 001</text>',
    '<text x="32" y="618" font-family="monospace" font-size="10">FICTIONAL DEMONSTRATION / SHARED-INTEREST EDGES ARE NOT REAL RELATIONSHIPS</text>',
    ...lines, ...hubs, ...nodes,
    '</svg>',
  ].join('\n')
}

function validContribution(value: string | null): value is Contribution {
  return value === 'show' || value === 'need' || value === 'offer'
}
function validRelation(value: string | null): value is Relation {
  return value === 'none' || value === 'proposed' || value === 'mutual'
}

export function CollectiveNetworkArtwork() {
  const [state, setState] = useState<ArtworkState>(START)
  const [frozen, setFrozen] = useState<ArtworkState | null>(null)
  const [view, setView] = useState<'living' | 'edition'>('living')
  const [selected, setSelected] = useState('guest')
  const [notice, setNotice] = useState('')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('i')
    const interests = requested === null ? START.interests : requested.split(',').filter(isInterestId)
    const contribution = params.get('s')
    const relation = params.get('r')
    setState({
      interests: Array.from(new Set(interests)),
      contribution: validContribution(contribution) ? contribution : START.contribution,
      relation: validRelation(relation) ? relation : START.relation,
    })
  }, [])
  const visible = view === 'edition' && frozen ? frozen : state
  const scene = useMemo(() => makeScene(visible), [visible])
  const forcePeople = useMemo<ArtworkPerson[]>(() => scene.participants.map((p) => ({
    id: p.id, label: p.label, interests: p.interests, guest: p.guest,
  })), [scene])
  const forceRelationships = useMemo<ArtworkRelationship[]>(() =>
    scene.edges.filter((edge) => edge.kind !== 'declared').map((edge) => ({
      from: edge.from, to: edge.to, kind: edge.kind, color: edge.color,
    })), [scene])
  const active = scene.participants.find((p) => p.id === selected) ?? scene.participants[scene.participants.length - 1]
  const contributionInfo: Record<Contribution, string> = {
    show: 'Here is something I am making.',
    need: 'Here is a question I cannot solve alone.',
    offer: 'Here is something I can share.',
  }

  function change(next: ArtworkState) {
    setState(next)
    setView('living')
    setNotice('Composition changed. No member data was stored.')
  }
  function toggleInterest(id: InterestId) {
    change({ ...state, interests: state.interests.includes(id) ? state.interests.filter((item) => item !== id) : [...state.interests, id] })
  }
  function freeze() {
    setFrozen({ ...state, interests: [...state.interests] })
    setView('edition')
    setNotice('Edition 001 topology frozen in this tab. The 2D vector export records the same authored connections, not exact 3D positions. Nothing was saved to DCC.')
  }
  function download() {
    if (!frozen) return
    const blob = new Blob([fixtureSvg(frozen)], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'dcc-network-study-001.svg'
    anchor.click()
    URL.revokeObjectURL(url)
    setNotice('SVG study downloaded. It requires fabrication review before cutting or printing.')
  }
  async function copyLink() {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('i', state.interests.join(','))
    url.searchParams.set('s', state.contribution)
    url.searchParams.set('r', state.relation)
    try {
      await navigator.clipboard.writeText(url.toString())
      setNotice('Study link copied. It reproduces the fictional settings, not private member information.')
    } catch {
      setNotice('Copy this study URL: ' + url.toString())
    }
  }

  return (
    <main className="min-h-screen bg-[#080d0f] text-[#f4f2e8]">
      <div className="mx-auto max-w-[1580px] px-4 pb-24 pt-7 sm:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5 text-[11px] uppercase tracking-[0.22em] text-white/65">
          <div className="flex flex-wrap items-center gap-4"><Link href="/network/community" className="transition hover:text-white">DCC MIAMI / COMMUNITY ATLAS</Link><Link href="/network/artwork/proposal" className="text-[#c7dec9] underline underline-offset-4 transition hover:text-white">READ THE FULL PROPOSAL ↗</Link></div>
          <span>ARTWORK PROTOTYPE — 2026 / STUDY 001</span>
        </nav>
        <header className="grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:py-16">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#a9d4bd]">A collectively authored network / Born Into the Machine</p>
            <h1 className="max-w-[960px] text-[clamp(3.1rem,7.3vw,8.2rem)] font-light leading-[0.88] tracking-[-0.075em]">
              The network<br /><span className="italic text-[#b4c7b5]">makes itself.</span>
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-5 border-l border-white/20 pl-5">
            <p className="text-lg font-light leading-snug text-white/80">What if the nodes were the authors—and updating the network changed the artwork?</p>
            <p className="text-sm leading-relaxed text-white/45">An interactive study in collective agency, machine-readable identities, and the translation of a living network into a physical edition.</p>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d1b475]/45 px-3 py-2 text-[11px] uppercase tracking-widest text-[#ddcba4]"><span className="h-2 w-2 rounded-full bg-[#ddcba4]"/> Fictional study / no live members</div>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#101c1e]" aria-label="Collective artwork network field">
            <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: 'radial-gradient(ellipse at 51% 47%, rgba(82,133,109,.16), transparent 57%)' }}/>
            <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/65 sm:left-6 sm:top-6">
              <span className="rounded-full border border-white/20 bg-black/25 px-3 py-2">01 / The field</span>
              <span className="rounded-full border border-white/20 bg-black/25 px-3 py-2">{view === 'edition' ? 'Frozen edition' : 'Living study'}</span>
            </div>
            <div className="absolute right-4 top-4 z-10 flex gap-2 sm:right-6 sm:top-6">
              <button type="button" onClick={() => setView('living')} aria-pressed={view === 'living'} className={'rounded-full px-3 py-2 text-xs transition ' + (view === 'living' ? 'bg-[#e8eedf] text-[#14201b]' : 'border border-white/20 text-white/65 hover:text-white')}>Live</button>
              <button type="button" onClick={() => frozen && setView('edition')} disabled={!frozen} aria-pressed={view === 'edition'} className={'rounded-full px-3 py-2 text-xs transition disabled:opacity-30 ' + (view === 'edition' ? 'bg-[#e8eedf] text-[#14201b]' : 'border border-white/20 text-white/65 hover:text-white')}>Edition</button>
            </div>
            <div className="h-[min(65vh,680px)] min-h-[430px] w-full">
              <ForceField
                people={forcePeople}
                relationships={forceRelationships}
                guestSignal={visible.contribution}
                selected={selected}
                paused={view === 'edition'}
                onSelect={(id) => setSelected(id)}
              />
            </div>
            <div className="relative z-10 border-t border-white/10 px-5 py-3 text-xs leading-relaxed text-[#b9c8b8] sm:px-7">
              Orbit and drag the Three.js force-directed field. Interest hubs and signal types are categories, not people.
              Physical SVG editions use a reproducible flat projection of this same authored topology—not a screenshot or an exact capture of the moving 3D coordinates.
            </div>
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-4 text-xs text-white/55 sm:px-7">
              <span>{scene.participants.length} fictional positions · {scene.edges.length} interest/proposed connections</span>
              <span><span className="mr-2 text-[#b6ccb9]">┄┄</span> Interest or signal category <span className="ml-5 mr-2 text-[#f2c680]">━━━━</span> Hypothetical mutual connection</span>
            </div>
          </section>

          <aside className="rounded-2xl border border-white/15 bg-[#e8eae0] p-5 text-[#122321] sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#54706a]">02 / Author the node</p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-[-0.05em]">You change the structure.</h2>
            <p className="mb-6 mt-3 text-sm leading-relaxed text-[#536661]">Change the fictional guest node. The visible composition responds. These edits stay in your browser and do not write to Airtable.</p>
            <div className="border-t border-[#a7b4aa] pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider">Your signal</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['show', 'need', 'offer'] as Contribution[]).map((item) => <button key={item} type="button" aria-pressed={state.contribution === item} onClick={() => change({ ...state, contribution: item })} className={'rounded-md px-3 py-3 text-xs font-medium uppercase tracking-wider transition ' + (state.contribution === item ? 'bg-[#173c33] text-white' : 'border border-[#b2bfb4] text-[#4b6057] hover:bg-[#d2ddd1]')}>{item}</button>)}
              </div>
              <p className="mt-3 min-h-8 text-xs text-[#536661]">{contributionInfo[state.contribution]}</p>
            </div>
            <div className="mt-4 border-t border-[#a7b4aa] pt-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider">Declared interests</p>
              <p className="mb-4 text-xs text-[#536661]">Choose what links this node to the field.</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => <button key={interest.id} type="button" onClick={() => toggleInterest(interest.id)} aria-pressed={state.interests.includes(interest.id)} className={'rounded-full border px-3 py-2 text-xs transition ' + (state.interests.includes(interest.id) ? 'border-[#264a3c] bg-[#d0dfcf] text-[#173c33]' : 'border-[#b5c2b8] text-[#65746b] hover:bg-[#d9e0d5]')}>{state.interests.includes(interest.id) ? '● ' : '+ '}{interest.short}</button>)}
              </div>
            </div>
            <div className="mt-6 border-t border-[#a7b4aa] pt-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider">A possible relationship</p>
              <p className="mb-4 text-xs text-[#536661]">This models a connection to the fictional BRIDGE node. Real participant-to-participant edges require both parties' consent.</p>
              <div className="flex flex-col gap-2">
                {([
                  { value: 'none', label: 'No relationship shown' },
                  { value: 'proposed', label: 'Proposal — not approved' },
                  { value: 'mutual', label: 'Mutual approval — simulation only' },
                ] as { value: Relation; label: string }[]).map((item) => <button key={item.value} type="button" aria-pressed={state.relation === item.value} onClick={() => change({ ...state, relation: item.value })} className={'rounded-md border px-3 py-2.5 text-left text-xs transition ' + (state.relation === item.value ? 'border-[#30564b] bg-[#d0dfcf] font-semibold' : 'border-[#b8c2b9] hover:bg-[#d9e0d5]')}>{state.relation === item.value ? '◉ ' : '○ '}{item.label}</button>)}
              </div>
            </div>
            <div className="mt-7 border-t border-[#a7b4aa] pt-5">
              <p className="mb-2 text-[11px] uppercase tracking-wider text-[#536661]">Selected position</p>
              <p className="text-xl font-medium tracking-tight">{active.label}</p>
              <p className="mt-1 text-sm text-[#536661]">{active.practice}</p>
              <button type="button" onClick={() => { change(START); setFrozen(null); setSelected('guest') }} className="mt-5 text-xs underline underline-offset-4 hover:text-[#478064]">Reset fictional study</button>
            </div>
          </aside>
        </div>

        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="rounded-2xl border border-white/15 p-6 sm:p-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-[#a9d4bd]">03 / Materialize the network</p>
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl">Freeze a moment. Make it physical.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60">An edition records one deliberately chosen topology of the living 3D graph. The SVG is a reproducible flattened drawing of that topology for fabrication experiments, not an exact 3D coordinate export. This is a visual/vector study, <strong className="font-medium text-white/80">not a cut-ready laser or 3D-printing file</strong>.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={freeze} className="rounded-full bg-[#cfdfc9] px-5 py-3 text-sm font-semibold text-[#112a23] transition hover:bg-white">Freeze edition 001</button>
              <button type="button" onClick={download} disabled={!frozen} className="rounded-full border border-white/40 px-5 py-3 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35">Download edition SVG</button>
              <button type="button" onClick={() => void copyLink()} className="rounded-full border border-white/40 px-5 py-3 text-sm transition hover:bg-white/10">Copy interactive study URL</button>
            </div>
            <p aria-live="polite" className="mt-4 break-words text-xs text-[#b9c8b8]">{notice || 'The interactive URL stores only this fictional study’s selected categories and demonstration state.'}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-[#152326] p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#a9d4bd]">04 / What comes next</p>
            <h2 className="mt-3 text-2xl font-light tracking-tight">From fiction to a real commons.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">A future opt-in edition can be authored by verified members, with mutual confirmation for public relationships, version history, withdrawal handling, and fabrication permissions.</p>
            <p className="mt-5 text-xs leading-relaxed text-white/45">This prototype intentionally has no private CRM reads, authentication, saved member edits, or claims about real collaborations.</p>
            <Link href="/network/community" className="mt-6 inline-block text-sm text-[#b7dec8] underline underline-offset-4">Explore the existing DCC Atlas →</Link>
          </div>
        </section>
      </div>
    </main>
  )
}

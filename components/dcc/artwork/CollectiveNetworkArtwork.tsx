'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { PATTERN_GROUPS, type PatternLens } from '@/lib/dcc/artwork/network-patterns'
import { makeIllustrativePeopleGraph, studyPosition } from '@/lib/dcc/artwork/people-graph'
import { makeMembershipPresenceGraph, presenceSpherePosition } from '@/lib/dcc/artwork/member-presence'
import type { LocalNode } from './PeopleNetworkField'

const Field = dynamic(() => import('./PeopleNetworkField'), {
  ssr: false,
  loading: () => <div className="flex h-full min-h-[400px] items-center justify-center text-xs uppercase tracking-widest text-white/35">Drawing the network…</div>,
})

type Signal = LocalNode['signal']
const SIGNALS: Signal[] = ['show', 'need', 'offer']
type NetworkMode = 'presence' | 'study'
function isMode(value: string | null): value is NetworkMode { return value === 'presence' || value === 'study' }
function isLens(value: string | null): value is PatternLens {
  return value === 'practices' || value === 'activity'
}
function isSignal(value: string | null): value is Signal {
  return value === 'show' || value === 'need' || value === 'offer'
}
/**
 * A deterministic 2D index of the *same categories and connections* in the
 * force field. This is a visual study, not a 3D capture or a cut-ready toolpath.
 */
/**
 * The same illustrated people-and-connection topology projected onto a
 * reproducible 2D paper study. Not a 3D capture or laser-cut file.
 */
function editionSvg(lens: PatternLens, local: LocalNode | null) {
  const graph = makeIllustrativePeopleGraph(local)
  const lines = graph.connections.map((edge) => {
    const from = studyPosition(edge.source)
    const to = edge.target === 'visitor-local'
      ? { x: 500, y: 500 }
      : studyPosition(edge.target)
    const color = edge.kind === 'local' ? '#ae9364' : '#849d8b'
    return '<line x1="' + from.x.toFixed(1) + '" y1="' + from.y.toFixed(1) +
      '" x2="' + to.x.toFixed(1) + '" y2="' + to.y.toFixed(1) +
      '" stroke="' + color + '" stroke-width="' + (edge.kind === 'local' ? 2 : 0.9) + '"/>'
  }).join('')
  const dots = graph.people.map((person) => {
    const position = studyPosition(person.id)
    const color = person.id === 'visitor-local' ? '#f1cd89' : '#324f41'
    return '<circle cx="' + position.x.toFixed(1) +
      '" cy="' + position.y.toFixed(1) +
      '" r="' + (person.id === 'visitor-local' ? 12 : 7) +
      '" fill="' + color + '"/>'
  }).join('')
  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="300mm" height="300mm" viewBox="0 0 1000 1000">' +
    '<title>DCC / The Network Makes Itself — illustrative people and connections</title>' +
    '<desc>Fictional person-position nodes and hypothetical person-to-person lines. Neither is a DCC CRM record or an actual relationship. Not a fabrication-ready file.</desc>' +
    '<rect width="1000" height="1000" fill="#f3f4eb"/>' +
    '<text x="55" y="65" font-family="monospace" font-size="18" fill="#153329">THE NETWORK MAKES ITSELF</text>' +
    '<text x="55" y="92" font-family="monospace" font-size="11" fill="#677e70">PERSON → CONNECTION / ' + lens.toUpperCase() + '</text>' +
    lines + dots +
    '<text x="55" y="956" font-family="monospace" font-size="11" fill="#6d8172">ILLUSTRATIVE HUMAN TOPOLOGY — NOT ACTUAL MEMBERS, NOT CUT-READY</text>' +
    '</svg>'
}

/** Real reported minimum as marks; their positions are arbitrary. No private edges. */
function presenceSvg() {
  const graph = makeMembershipPresenceGraph()
  const dots = graph.marks.map((mark, index) => {
    const xyz = presenceSpherePosition(index, graph.marks.length, 340)
    return '<circle cx="' + (500 + xyz.x).toFixed(2) + '" cy="' + (500 + xyz.y).toFixed(2) +
      '" r="6" fill="#2f6654"/>'
  }).join('')
  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="300mm" height="300mm" viewBox="0 0 1000 1000">' +
    '<title>DCC / A membership presence edition — reported 100+</title>' +
    '<desc>At least 101 founder-reported WhatsApp group members represented as anonymous marks. The exact count is not yet roster-verified. Marker locations do not identify individuals. No personal relationship edges are shown. Conceptual vector sketch only.</desc>' +
    '<rect width="1000" height="1000" fill="#f3f4eb"/>' +
    '<text x="55" y="65" font-family="monospace" font-size="21" fill="#153329">THE NETWORK MAKES ITSELF / PRESENCE</text>' +
    '<text x="55" y="98" font-family="monospace" font-size="14" fill="#687e70">100+ REPORTED MEMBERS · MINIMUM COUNT REPRESENTATION</text>' +
    dots +
    '<text x="55" y="958" font-family="monospace" font-size="11" fill="#687e70">NO PRIVATE IDENTITIES OR EDGES · NOT FABRICATION READY</text>' +
    '</svg>'
}

export function CollectiveNetworkArtwork() {
  const [lens, setLens] = useState<PatternLens>('practices')
  const [mode, setMode] = useState<NetworkMode>('presence')
  const [selected, setSelected] = useState('member-mark-001')
  const [studio, setStudio] = useState(false)
  const [group, setGroup] = useState('code')
  const [signal, setSignal] = useState<Signal>('show')
  const [local, setLocal] = useState<LocalNode | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextLens = params.get('view')
    if (isLens(nextLens)) setLens(nextLens)
    const nextMode = params.get('mode')
    if (isMode(nextMode)) { setMode(nextMode); setSelected(nextMode === 'presence' ? 'member-mark-001' : 'position-01') }
    const nextGroup = params.get('group')
    const nextSignal = params.get('signal')
    if (nextGroup && PATTERN_GROUPS.practices.some((p) => p.id === nextGroup) && isSignal(nextSignal)) {
      setGroup(nextGroup)
      setSignal(nextSignal)
      setLocal({ group: nextGroup, signal: nextSignal })
    }
  }, [])

  const study = useMemo(() => makeIllustrativePeopleGraph(local), [local])
  const presence = useMemo(() => makeMembershipPresenceGraph(), [])
  const people = mode === 'presence' ? presence.marks : study.people
  const active = people.find((person) => person.id === selected) ?? people[0]
  const connections = mode === 'presence' ? [] : study.connections.filter((edge) => edge.source === active.id || edge.target === active.id)

  function changeLens(next: PatternLens) {
    setLens(next)
    setNotice('')
  }
  function changeMode(next: NetworkMode) {
    setMode(next)
    setSelected(next === 'presence' ? 'member-mark-001' : 'position-01')
    setStudio(false)
    setNotice('')
  }
  function preview() {
    setLocal({ group, signal })
    setMode('study')
    setSelected('visitor-local')
    setStudio(false)
    setNotice('Added to this browser only.')
  }
  async function share() {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('view', lens)
    url.searchParams.set('mode', mode)
    if (local) {
      url.searchParams.set('group', local.group)
      url.searchParams.set('signal', local.signal)
    }
    try {
      await navigator.clipboard.writeText(url.toString())
      setNotice('View link copied. It contains only category choices.')
    } catch {
      setNotice('Copy this address: ' + url.toString())
    }
  }
  function exportStudy() {
    const svg = mode === 'presence' ? presenceSvg() : editionSvg(lens, local)
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = mode === 'presence' ? 'dcc-member-presence-study.svg' : 'dcc-connection-study.svg'
    link.click()
    URL.revokeObjectURL(url)
    setNotice('Conceptual vector study exported. No private member data included.')
  }

  return (
    <main className="min-h-screen bg-[#091313] text-[#eaf1e9]">
      <div className="mx-auto flex max-w-[1800px] flex-col px-3 pb-9 pt-3 sm:px-6 sm:pt-5">
        <nav aria-label="Network artwork navigation" className="flex items-center justify-between gap-4 px-2 py-3 text-[11px] uppercase tracking-[0.19em] text-white/55">
          <Link href="/" className="transition hover:text-white">DCC <span className="hidden sm:inline">MIAMI</span></Link>
          <div className="flex gap-5">
            <Link href="/network/community" className="transition hover:text-white">Atlas</Link>
            <Link href="/network/artwork/proposal" className="transition hover:text-white">About ↗</Link>
          </div>
        </nav>

        <section aria-label="The Network Makes Itself" className="relative isolate mt-2 overflow-hidden rounded-xl border border-white/[.08] bg-[#0b1818]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(58,101,82,.14),transparent_61%)]" aria-hidden />
          <div className="pointer-events-none absolute left-5 right-5 top-6 z-10 sm:left-10 sm:top-9">
            <p className="font-mono text-[10px] uppercase tracking-[.23em] text-[#a0bfae]">DCC / 100+ reported members</p>
            <h1 className="mt-3 text-[clamp(2.5rem,5.8vw,6.2rem)] font-light leading-[.91] tracking-[-.075em] text-white">
              The network<br /><em className="text-[#b8d2be]">makes itself.</em>
            </h1>
          </div>

          <div className="h-[70svh] min-h-[520px] max-h-[900px] w-full">
            <Field mode={mode} lens={lens} selected={selected} onSelect={setSelected} local={mode === "study" ? local : null} />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3 sm:bottom-7 sm:left-8 sm:right-8">
            <div role="group" aria-label="Choose network representation" className="flex rounded-full border border-[#c3dac9]/20 bg-[#081414]/90 p-1 shadow-xl backdrop-blur-md">
              {([['presence', 'Members'], ['study', 'Connections study']] as const).map(([key, title]) => (
                <button key={key} type="button" onClick={() => changeMode(key)} aria-pressed={mode === key}
                  className={'rounded-full px-4 py-2.5 text-xs font-medium transition ' +
                    (mode === key ? 'bg-[#d6e8d7] text-[#173a29]' : 'text-white/65 hover:text-white')}
                >{title}</button>
              ))}
            </div>
            {mode === 'study' ? (
              <div role="group" aria-label="Recolor illustrative positions" className="flex rounded-full border border-[#c3dac9]/20 bg-[#081414]/90 p-1">
                {(['practices', 'activity'] as PatternLens[]).map((value) => (
                  <button key={value} onClick={() => changeLens(value)} aria-pressed={lens === value}
                    className={'rounded-full px-3 py-2 text-[11px] capitalize ' + (lens === value ? 'bg-[#d6e8d7] text-[#173a29]' : 'text-white/60')}
                  >{value}</button>
                ))}
              </div>
            ) : null}
            <button type="button" onClick={() => { setMode('study'); setSelected('position-01'); setStudio((value) => !value) }} aria-expanded={studio}
              className="rounded-full border border-[#c3dac9]/30 bg-[#081414]/90 px-5 py-3 text-xs font-medium text-white/90 shadow-xl backdrop-blur-md transition hover:border-[#c3dac9]/70">
              {studio ? 'Close' : '+ Try a connection'}
            </button>
          </div>
        </section>

        <div className="mx-2 flex flex-col justify-between gap-5 border-b border-white/10 py-6 sm:flex-row sm:items-center sm:px-4">
          <div className="min-w-0">
            <label htmlFor="pattern-inspector" className="block font-mono text-[10px] uppercase tracking-[.2em] text-white/40">Inspect a position</label>
            <select id="pattern-inspector" value={active.id} onChange={(event) => setSelected(event.target.value)}
              className="mt-2 w-full max-w-[310px] rounded border border-white/15 bg-[#142522] px-3 py-2 text-sm text-[#eaf1e9] sm:w-[280px]">
              {people.map((person) => <option key={person.id} value={person.id}>{person.label}</option>)}
            </select>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/55">
              {mode === 'presence'
                ? 'Anonymous membership mark, not mapped to a specific person. No public relationship attached.'
                : active.id === 'visitor-local'
                  ? 'Your unsaved sketch · one imaginary connection. No submission.'
                  : active.label + ' · ' + connections.length + ' hypothetical connections.'}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-5 text-xs">
            <button type="button" onClick={() => void share()} className="text-[#d4e8d6] underline underline-offset-4 transition hover:text-white">Share view ↗</button>
            <button type="button" onClick={exportStudy} className="text-[#d4e8d6] underline underline-offset-4 transition hover:text-white">Export SVG ↗</button>
            <Link href="/network/community" className="text-white/60 underline underline-offset-4 transition hover:text-white">Community Atlas ↗</Link>
          </div>
        </div>

        {studio ? (
          <section aria-label="Add a local node" className="mx-2 grid gap-6 border-b border-white/10 px-1 py-7 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:px-4">
            <div>
              <label htmlFor="my-practice" className="block font-mono text-[10px] uppercase tracking-[.2em] text-white/55">Your creative practice</label>
              <select id="my-practice" value={group} onChange={(event) => setGroup(event.target.value)}
                className="mt-3 w-full rounded-lg border border-white/20 bg-[#142622] px-4 py-3 text-sm">
                {PATTERN_GROUPS.practices.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[.2em] text-white/55">What would you bring?</span>
              <div className="mt-3 flex gap-2" role="group" aria-label="Your activity type">
                {SIGNALS.map((value) => (
                  <button key={value} aria-pressed={signal === value} type="button" onClick={() => setSignal(value)}
                    className={'rounded-full border px-4 py-3 text-xs capitalize transition ' +
                      (signal === value ? 'border-[#d6e8d7] bg-[#d6e8d7] text-[#152f23]' : 'border-white/20 text-white/70 hover:border-white/50')}>{value}</button>
                ))}
              </div>
            </div>
            <button type="button" onClick={preview} className="rounded-full bg-[#d6e8d7] px-6 py-3 text-sm font-semibold text-[#143127] transition hover:bg-white">
              Add your position ↗
            </button>
            <p className="text-xs leading-relaxed text-white/45 sm:col-span-3">A private sketch, not a real introduction. No identity, account, or Airtable write.</p>
          </section>
        ) : null}

        <div className="mx-2 flex flex-wrap items-center justify-between gap-4 px-1 pt-6 text-[11px] text-white/45 sm:px-4">
          <details className="max-w-3xl">
            <summary className="cursor-pointer text-white/65 hover:text-white">How to read this ↗</summary>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed">
              Members mode shows one anonymous mark for each of at least 101 founder-reported WhatsApp members. The exact current roster has not yet been independently reconciled. No mark maps to a specific account and no private ties are drawn.
              Connections study is fictional: it helps explore the visual language without making claims about real people. A real social graph needs opt-in nodes and separately mutually approved public edges.
            </p>
          </details>
          <span>{mode === 'presence' ? '100+ founder-reported · exact count pending' : 'Hypothetical connections · not a CRM graph'}</span>
        </div>
        <p aria-live="polite" role="status" className="mx-3 mt-4 break-all text-xs text-[#c0d3bb]">{notice}</p>
      </div>
    </main>
  )
}

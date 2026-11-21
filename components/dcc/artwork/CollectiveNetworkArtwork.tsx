'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import {
  PATTERN_GROUPS,
  PATTERN_SNAPSHOT,
  REVIEWED_OVERLAPS,
  type PatternLens,
} from '@/lib/dcc/artwork/network-patterns'
import type { LocalNode } from './AggregateNetworkField'

const Field = dynamic(() => import('./AggregateNetworkField'), {
  ssr: false,
  loading: () => <div className="flex h-full min-h-[400px] items-center justify-center text-xs uppercase tracking-widest text-white/35">Drawing the network…</div>,
})

type Signal = LocalNode['signal']
const SIGNALS: Signal[] = ['show', 'need', 'offer']
const STRENGTH: Record<number, string> = {
  1: 'Emerging presence',
  2: 'Visible presence',
  3: 'Strong presence',
}
function isLens(value: string | null): value is PatternLens {
  return value === 'practices' || value === 'activity'
}
function isSignal(value: string | null): value is Signal {
  return value === 'show' || value === 'need' || value === 'offer'
}
function xml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * A deterministic 2D index of the *same categories and connections* in the
 * force field. This is a visual study, not a 3D capture or a cut-ready toolpath.
 */
function editionSvg(lens: PatternLens, local: LocalNode | null) {
  const groups = PATTERN_GROUPS[lens]
  const points = groups.map((g, i) => ({
    ...g,
    x: 500 + 315 * Math.cos(-Math.PI / 2 + i * Math.PI * 2 / groups.length),
    y: 500 + 315 * Math.sin(-Math.PI / 2 + i * Math.PI * 2 / groups.length),
  }))
  const a = points.find((p) => p.id === 'code')
  const b = points.find((p) => p.id === 'image')
  const overlap = lens === 'practices' && a && b && REVIEWED_OVERLAPS.some((r) => r.from === a.id && r.to === b.id)
    ? '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="#92b69e" stroke-width="3"/>'
    : ''
  const lines = points.map((p) => '<line x1="500" y1="500" x2="' + p.x + '" y2="' + p.y + '" stroke="#aebcb1" stroke-width="1.5"/>').join('')
  const circles = points.map((p) =>
    '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (15 + p.tier * 7) + '" fill="none" stroke="#1e3229" stroke-width="2"/>' +
    '<text x="' + p.x + '" y="' + (p.y + 54) + '" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#1e3229">' + xml(p.label) + '</text>'
  ).join('')
  const target = local ? points.find((p) => p.id === (
    lens === 'practices' ? local.group : local.signal === 'offer' ? 'exchange' : local.signal
  )) : undefined
  const guest = target
    ? '<line x1="' + (target.x + 65) + '" y1="' + (target.y - 55) + '" x2="' + target.x + '" y2="' + target.y + '" stroke="#a98751" stroke-width="2" stroke-dasharray="4 6"/><circle cx="' + (target.x + 65) + '" cy="' + (target.y - 55) + '" r="11" fill="#c8b784"/>'
    : ''
  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="300mm" height="300mm" viewBox="0 0 1000 1000">' +
    '<title>DCC — The Network Makes Itself / aggregated ' + lens + ' study</title>' +
    '<desc>Anonymous category index from reviewed internal aggregates, ' + PATTERN_SNAPSHOT.date + '. No individual identities, no personal edges. Visual study only; not fabrication-ready.</desc>' +
    '<rect width="1000" height="1000" fill="#f3f4eb"/>' +
    '<text x="55" y="65" font-family="monospace" font-size="20" fill="#1e3229">THE NETWORK MAKES ITSELF</text>' +
    '<text x="55" y="93" font-family="monospace" font-size="12" fill="#69766a">' + lens.toUpperCase() + ' / AGGREGATE STUDY / ' + PATTERN_SNAPSHOT.date + '</text>' +
    lines + overlap + circles + guest +
    '<circle cx="500" cy="500" r="43" fill="#173c30"/>' +
    '<text x="500" y="507" text-anchor="middle" font-family="monospace" font-size="18" fill="#fff">DCC</text>' +
    '<text x="55" y="952" font-family="monospace" font-size="11" fill="#69766a">CATEGORY EDGES ARE NOT PERSON-TO-PERSON RELATIONSHIPS / NOT CUT-READY</text>' +
    '</svg>'
}

export function CollectiveNetworkArtwork() {
  const [lens, setLens] = useState<PatternLens>('practices')
  const [selected, setSelected] = useState('commons')
  const [studio, setStudio] = useState(false)
  const [group, setGroup] = useState('code')
  const [signal, setSignal] = useState<Signal>('show')
  const [local, setLocal] = useState<LocalNode | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextLens = params.get('view')
    if (isLens(nextLens)) setLens(nextLens)
    const nextGroup = params.get('group')
    const nextSignal = params.get('signal')
    if (nextGroup && PATTERN_GROUPS.practices.some((p) => p.id === nextGroup) && isSignal(nextSignal)) {
      setGroup(nextGroup)
      setSignal(nextSignal)
      setLocal({ group: nextGroup, signal: nextSignal })
    }
  }, [])

  const categories = PATTERN_GROUPS[lens]
  const active = useMemo(() => categories.find((item) => item.id === selected), [categories, selected])
  const activeIsLocal = selected === 'local' && local !== null

  function changeLens(next: PatternLens) {
    setLens(next)
    setSelected('commons')
    setNotice('')
  }
  function preview() {
    setLocal({ group, signal })
    setSelected('local')
    setStudio(false)
    setNotice('Added to this browser only.')
  }
  async function share() {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('view', lens)
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
    const svg = editionSvg(lens, local)
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dcc-network-' + lens + '-study.svg'
    link.click()
    URL.revokeObjectURL(url)
    setNotice('Vector study exported. Not a fabrication-ready file.')
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
            <p className="font-mono text-[10px] uppercase tracking-[.23em] text-[#a0bfae]">DCC / A living study</p>
            <h1 className="mt-3 text-[clamp(2.5rem,5.8vw,6.2rem)] font-light leading-[.91] tracking-[-.075em] text-white">
              The network<br /><em className="text-[#b8d2be]">makes itself.</em>
            </h1>
          </div>

          <div className="h-[70svh] min-h-[520px] max-h-[900px] w-full">
            <Field lens={lens} selected={selected} onSelect={setSelected} local={local} />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3 sm:bottom-7 sm:left-8 sm:right-8">
            <div role="group" aria-label="Choose network view" className="flex rounded-full border border-[#c3dac9]/20 bg-[#081414]/90 p-1 shadow-xl backdrop-blur-md">
              {(['practices', 'activity'] as PatternLens[]).map((value) => (
                <button key={value} type="button" aria-pressed={lens === value} onClick={() => changeLens(value)}
                  className={'rounded-full px-4 py-2.5 text-xs font-medium capitalize transition sm:px-5 ' +
                    (lens === value ? 'bg-[#d6e8d7] text-[#173a29]' : 'text-white/65 hover:text-white')}
                >{value}</button>
              ))}
            </div>
            <button type="button" onClick={() => setStudio((x) => !x)} aria-expanded={studio}
              className="rounded-full border border-[#c3dac9]/30 bg-[#081414]/90 px-5 py-3 text-xs font-medium text-white/90 shadow-xl backdrop-blur-md transition hover:border-[#c3dac9]/70">
              {studio ? 'Close' : '+ Try a node'}
            </button>
          </div>
        </section>

        <div className="mx-2 flex flex-col justify-between gap-5 border-b border-white/10 py-6 sm:flex-row sm:items-center sm:px-4">
          <div className="min-w-0">
            <label htmlFor="pattern-inspector" className="block font-mono text-[10px] uppercase tracking-[.2em] text-white/40">Inspect a category</label>
            <select id="pattern-inspector" value={selected === 'local' && local ? 'local' : active?.id ?? 'commons'} onChange={(event) => setSelected(event.target.value)}
              className="mt-2 w-full max-w-[310px] rounded border border-white/15 bg-[#142522] px-3 py-2 text-sm text-[#eaf1e9] sm:w-[280px]">
              <option value="commons">DCC / network commons</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              {local ? <option value="local">Your local node</option> : null}
            </select>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/55">
              {active
                ? STRENGTH[active.tier] + ' · ' + active.description
                : activeIsLocal
                  ? 'An unsaved experiment. Your selections never enter the DCC member database.'
                  : 'The hub connects broad categories. Its spokes are an index, not personal relationships.'}
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
              <label htmlFor="my-practice" className="block font-mono text-[10px] uppercase tracking-[.2em] text-white/55">What do you explore?</label>
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
              Add locally ↗
            </button>
            <p className="text-xs leading-relaxed text-white/45 sm:col-span-3">No account, personal information, or submission. This adds a temporary mark to your browser, not an actual DCC member.</p>
          </section>
        ) : null}

        <div className="mx-2 flex flex-wrap items-center justify-between gap-4 px-1 pt-6 text-[11px] text-white/45 sm:px-4">
          <details className="max-w-3xl">
            <summary className="cursor-pointer text-white/65 hover:text-white">How to read this ↗</summary>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed">
              {PATTERN_SNAPSHOT.source}. {PATTERN_SNAPSHOT.limitation} Node sizes show broad relative strength, not individual counts.
              The lines from DCC are category-index connections; the thicker Practices line denotes a reviewed aggregate overlap.
              No person-to-person relationships appear. Source snapshot: {PATTERN_SNAPSHOT.date}.
            </p>
          </details>
          <span>Reviewed aggregate / {PATTERN_SNAPSHOT.date}</span>
        </div>
        <p aria-live="polite" role="status" className="mx-3 mt-4 break-all text-xs text-[#c0d3bb]">{notice}</p>
      </div>
    </main>
  )
}

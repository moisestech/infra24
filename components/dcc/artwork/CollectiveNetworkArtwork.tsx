'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { DCC_DISCOVERY_POLL, discoveryChoice, isDiscoveryChoice, type DiscoveryPollChoiceId } from '@/lib/dcc/artwork/discovery-poll'
import { makeMembershipPresenceGraph, presenceSpherePosition, MEMBER_PRESENCE_SOURCE } from '@/lib/dcc/artwork/member-presence'

const Field = dynamic(() => import('./PeopleNetworkField'), {
  ssr: false,
  loading: () => <div className="flex h-full min-h-[380px] items-center justify-center text-xs text-white/40">Opening the network…</div>,
})

type FocusId = 'moises-sanabria' | 'fabiola-larios' | null
function isFounder(id: string | null): id is Exclude<FocusId, null> {
  return id === 'moises-sanabria' || id === 'fabiola-larios'
}

/**
 * The geometry is a public lower-bound membership portrait. This vector
 * exports exactly the same two named public founders + anonymous count marks,
 * and exactly one public cofounding edge (not a fabricated friendship map).
 * The positions themselves are artistic, not evidence of social distance.
 */
function exportMembershipSvg() {
  const graph = makeMembershipPresenceGraph()
  const nodes = graph.marks.map((mark, index) => {
    const position = mark.kind === 'public-cofounder'
      ? { x: mark.id === 'moises-sanabria' ? -32 : 32, y: 0 }
      : presenceSpherePosition(index - 2, graph.marks.length - 2, 155)
    const x = (500 + position.x * 2).toFixed(1)
    const y = (510 + position.y * 2).toFixed(1)
    const founder = mark.kind === 'public-cofounder'
    const circle = '<circle cx="' + x + '" cy="' + y +
      '" r="' + (founder ? 14 : 4.2) + '" fill="' + (founder ? '#c7e0bd' : '#6c9d84') + '" />'
    const label = founder
      ? '<text x="' + x + '" y="' + (Number(y) + (mark.id === 'moises-sanabria' ? -24 : 38)) +
        '" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#1b4634">' +
        (mark.id === 'moises-sanabria' ? 'MOISES SANABRIA' : 'FABIOLA LARIOS') + '</text>'
      : ''
    return circle + label
  }).join('')
  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="300mm" height="300mm" viewBox="0 0 1000 1000">' +
    '<title>The Network Makes Itself — DCC member presence</title>' +
    '<desc>Minimum 101 founder-reported Commons membership positions, including public cofounders Moises Sanabria and Fabiola Larios, connected only by documented DCC cofounding. Other marks are anonymous; exact roster unverified; poll choices not assigned. Vector sketch, not cut-ready geometry.</desc>' +
    '<rect width="1000" height="1000" fill="#edf1e8"/>' +
    '<text x="45" y="56" font-family="monospace" font-size="21" fill="#204734">THE NETWORK MAKES ITSELF</text>' +
    '<text x="45" y="82" font-family="monospace" font-size="12" fill="#688b79">100+ REPORTED MEMBERS / MINIMUM 101 POSITIONS</text>' +
    '<line x1="436" y1="510" x2="564" y2="510" stroke="#4d8864" stroke-width="3" />' +
    nodes +
    '<text x="45" y="940" font-family="monospace" font-size="11" fill="#688b79">ONLY DOCUMENTED PERSON-TO-PERSON EDGE: DCC COFOUNDING</text>' +
    '<text x="45" y="960" font-family="monospace" font-size="11" fill="#688b79">AGGREGATE VOTE TOTALS ARE NOT INDIVIDUAL NODE ATTRIBUTES</text>' +
    '</svg>'
}

export function CollectiveNetworkArtwork() {
  const [focus, setFocus] = useState<FocusId>(null)
  const [interest, setInterest] = useState<DiscoveryPollChoiceId>('art')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const next = search.get('interest')
    if (isDiscoveryChoice(next)) setInterest(next)
    const person = search.get('person')
    if (isFounder(person)) setFocus(person)
  }, [])

  const active = discoveryChoice(interest)
  function selectInterest(value: DiscoveryPollChoiceId) {
    setInterest(value)
    const url = new URL(window.location.href)
    url.searchParams.set('interest', value)
    url.searchParams.delete('mode')
    url.searchParams.delete('view')
    url.searchParams.delete('group')
    url.searchParams.delete('signal')
    window.history.replaceState(null, '', url.toString())
  }
  function selectFounder(value: FocusId) {
    setFocus(value)
    const url = new URL(window.location.href)
    if (value) url.searchParams.set('person', value)
    else url.searchParams.delete('person')
    window.history.replaceState(null, '', url.toString())
  }

  async function share() {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('interest', interest)
    if (focus) url.searchParams.set('person', focus)
    try {
      await navigator.clipboard.writeText(url.toString())
      setNotice('Shareable view link copied.')
    } catch {
      setNotice('Copy: ' + url.toString())
    }
  }

  function exportSvg() {
    const svg = exportMembershipSvg()
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dcc-the-network-makes-itself-member-presence.svg'
    link.click()
    URL.revokeObjectURL(url)
    setNotice('SVG study exported; physical fabrication requires further design.')
  }

  return (
    <main className="min-h-screen bg-[#091313] text-[#eef4ec]">
      <div className="mx-auto max-w-[1800px] px-3 pb-10 pt-3 sm:px-6 sm:pt-5">
        <nav aria-label="Network artwork navigation" className="flex items-center justify-between gap-3 px-2 py-3 text-[11px] uppercase tracking-[.17em] text-white/55">
          <Link href="/" className="transition hover:text-white">DCC <span className="hidden sm:inline">MIAMI</span></Link>
          <div className="flex gap-5">
            <Link href="/network/community" className="transition hover:text-white">Atlas</Link>
            <Link href="/network/artwork/proposal" className="transition hover:text-white">About ↗</Link>
          </div>
        </nav>

        <section aria-label="The Network Makes Itself" className="relative isolate mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0b1818]">
          <div className="pointer-events-none absolute inset-0 z-[1]" style={{
            background: 'radial-gradient(ellipse at 52% 58%, ' + active.tint + '19 0%, transparent 54%)',
          }} aria-hidden="true" />
          <header className="pointer-events-none absolute left-5 right-5 top-6 z-10 flex flex-wrap justify-between gap-4 sm:left-10 sm:right-10 sm:top-9">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.21em] text-[#9ebfaa]">DCC / Collective network</p>
              <h1 className="mt-3 text-[clamp(2.45rem,5.8vw,6.2rem)] font-light leading-[.91] tracking-[-.075em] text-white">
                The network<br /><em className="text-[#b9d4bf]">makes itself.</em>
              </h1>
            </div>
            <div className="hidden text-right font-mono text-[11px] uppercase tracking-[.17em] text-white/50 sm:block">
              <div>{MEMBER_PRESENCE_SOURCE.reportedLabel} members reported</div>
              <div className="mt-2">01 documented public connection</div>
            </div>
          </header>

          <div className="h-[70svh] min-h-[490px] max-h-[880px] w-full">
            <Field selected={focus} onSelect={selectFounder} />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 sm:bottom-7 sm:left-8 sm:right-8">
            <div role="group" aria-label="Focus on public nodes" className="flex rounded-full border border-white/20 bg-[#091313]/90 p-1 shadow-xl backdrop-blur-md">
              {([
                { id: null, label: 'All' },
                { id: 'moises-sanabria', label: 'Moises' },
                { id: 'fabiola-larios', label: 'Fabiola' },
              ] as {id:FocusId;label:string}[]).map((item) => (
                <button type="button" key={item.label} aria-pressed={focus === item.id}
                  onClick={() => selectFounder(item.id)}
                  className={'rounded-full px-3 py-2.5 text-xs transition sm:px-5 ' +
                    (focus === item.id ? 'bg-[#d7e8d7] font-semibold text-[#183b2e]' : 'text-white/65 hover:text-white')}
                >{item.label}</button>
              ))}
            </div>
            <span className="rounded-full border border-white/15 bg-[#091313]/85 px-3 py-2 font-mono text-[10px] tracking-wider text-[#c5d9c8]">
              {focus ? 'Public cofounder / DCC' : 'Membership presence / reported minimum'}
            </span>
          </div>
        </section>

        <section aria-labelledby="poll-title" className="mx-2 border-b border-white/10 px-1 pb-7 pt-9 sm:px-4 sm:pt-11">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#a7c7af]">Community pulse / WhatsApp poll</p>
              <h2 id="poll-title" className="mt-2 max-w-2xl text-2xl font-light tracking-[-.045em] text-white sm:text-3xl">
                What would you most like to discover?
              </h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-light tabular-nums text-white">{DCC_DISCOVERY_POLL.totalSelections}</span>
              <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-white/45">selections</span>
            </div>
          </div>

          <div role="group" aria-label="Explore poll choice totals" className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {DCC_DISCOVERY_POLL.choices.map((choice) => (
              <button type="button" key={choice.id} onClick={() => selectInterest(choice.id)}
                aria-pressed={interest === choice.id}
                className={'group flex min-w-0 items-center gap-4 rounded-xl border p-4 text-left transition ' +
                  (interest === choice.id ? 'border-[#9bc6a8]/65 bg-white/[.09]' : 'border-white/[.08] bg-white/[.025] hover:border-white/20')}>
                <span className="text-xl" aria-hidden="true">{choice.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-tight text-white/85">{choice.short}</span>
                  <span className="mt-2 block h-[3px] overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full rounded-full" style={{ backgroundColor: choice.tint, width: (choice.count / 21 * 100) + '%' }} />
                  </span>
                </span>
                <span className="font-mono text-lg tabular-nums text-white/85">{choice.count}</span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-white/40">
            {active.count} selections for {active.label.toLowerCase()}. Poll allowed multiple choices.
            Respondent count and each person’s answers are unknown; no poll selections are assigned to graph nodes.
          </p>
        </section>

        <footer className="mx-2 flex flex-wrap items-center justify-between gap-4 px-1 pt-6 text-xs sm:px-4">
          <details className="max-w-xl text-white/50">
            <summary className="cursor-pointer text-white/65 hover:text-white">How this is mapped</summary>
            <p className="mt-3 leading-relaxed">
              The founder reports more than 100 WhatsApp members, represented by a lower-bound field of 101 marks. Two are named public cofounders; the other 99 are anonymous count-based positions, not a roster.
              The sole social edge records DCC cofounding. Poll totals come from a screenshot shared November 21, 2026, not an individual voter dataset.
              No other identities or relationships are inferred.
            </p>
          </details>
          <div className="flex flex-wrap items-center gap-5">
            <button type="button" onClick={() => void share()} className="text-[#d7e8d7] underline underline-offset-4 hover:text-white">Share view ↗</button>
            <button type="button" onClick={exportSvg} className="text-[#d7e8d7] underline underline-offset-4 hover:text-white">Export SVG ↗</button>
          </div>
        </footer>
        <p className="mx-3 mt-4 break-all text-xs text-[#abc9b2]" role="status" aria-live="polite">{notice}</p>
      </div>
    </main>
  )
}

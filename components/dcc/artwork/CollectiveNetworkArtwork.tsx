'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PollPulse } from '@/components/dcc/community/PollPulse'
import { NetworkGraphBoundary } from './NetworkGraphBoundary'
import { MEMBER_PRESENCE_SOURCE } from '@/lib/dcc/artwork/member-presence'
import { PILOT_PREVIEWS, type AtlasProfile } from '@/lib/dcc/community/atlas'
import { isDiscoveryChoice, type DiscoveryPollChoiceId } from '@/lib/dcc/artwork/discovery-poll'

const Field = dynamic(() => import('./PeopleNetworkField'), {
  ssr: false,
  loading: () => <div className="flex h-full min-h-[350px] items-center justify-center text-xs text-[color:var(--dn-graph-muted)]">Opening the network…</div>,
})

type GraphSelection = string | null
export function CollectiveNetworkArtwork() {
  const [focus, setFocus] = useState<GraphSelection>(null)
  const [profiles,setProfiles] = useState<AtlasProfile[]>(PILOT_PREVIEWS)
  const [websiteMarks,setWebsiteMarks] = useState(0)
  const [snapshotWeek,setSnapshotWeek] = useState<string | null>(null)
  const [sourceState,setSourceState] = useState<'preview'|'live'>('preview')
  const isPublicPerson = (value:string|null) => Boolean(value &&
    profiles.some(p=>p.slug===value))

  useEffect(()=>{
    const controller=new AbortController()
    async function refresh(){
      try {
        const response=await fetch('/api/dcc/sculpture/public',{cache:'no-store',signal:controller.signal})
        if (!response.ok) return
        const data=await response.json()
        if (controller.signal.aborted || !Array.isArray(data.profiles)) return
        // Match the Atlas: previously curated editorial features remain clearly labeled.
        const approved=data.profiles as AtlasProfile[]
        // A live approved feed is authoritative. Never reinsert withdrawn editorial
        // fixtures into the sculpture after a publication change.
        setProfiles(data.mode==='live' ? approved : PILOT_PREVIEWS)
        setWebsiteMarks(data.websitePresence?.status==='coarsened' ? data.websitePresence.markCount : 0)
        setSnapshotWeek(typeof data.websitePresence?.snapshotWeek==='string'?data.websitePresence.snapshotWeek:null)
        setSourceState(data.mode==='live'?'live':'preview')
      } catch { /* Existing editorial visualization stays available; no private fallback. */ }
    }
    void refresh()
    const interval=window.setInterval(()=>{if(!document.hidden)void refresh()},60000)
    return ()=>{controller.abort();window.clearInterval(interval)}
  },[])

  useEffect(() => {
    const search = new URL(window.location.href).searchParams
    const person = search.get('person')
    const practice = search.get('practice')
    if (person && isPublicPerson(person)) setFocus(person)
    else if (isDiscoveryChoice(practice)) setFocus('practice-' + practice)
  }, [])

  function chooseNode(next: GraphSelection) {
    setFocus(next)
    const url = new URL(window.location.href)
    url.searchParams.delete('person')
    url.searchParams.delete('practice')
    if (next && isPublicPerson(next)) url.searchParams.set('person', next)
    else if (next?.startsWith('practice-')) {
      const practice = next.slice('practice-'.length)
      if (isDiscoveryChoice(practice)) url.searchParams.set('practice', practice)
    }
    for (const old of ['mode', 'view', 'group', 'signal']) url.searchParams.delete(old)
    window.history.replaceState(null, '', url)
  }

  const selectedChoice: DiscoveryPollChoiceId | null =
    focus?.startsWith('practice-') && isDiscoveryChoice(focus.slice(9))
      ? focus.slice(9) as DiscoveryPollChoiceId : null

  return (
    <main className="dcc-network-theme min-h-screen bg-[var(--dn-bg)] text-[color:var(--dn-ink)]">
      <div className="mx-auto max-w-[1550px] px-4 pb-16 pt-7 sm:px-8 sm:pt-12">
        {/* A single editorial title. The global site header already handles DCC branding. */}
        <header className="max-w-4xl pb-6 sm:pb-9">
          <p className="font-mono text-[10px] uppercase tracking-[.17em] text-[color:var(--dn-subtle)]">
            People, practices, connections
          </p>
          <h1 className="mt-3 text-[clamp(2.75rem,8vw,6rem)] font-light leading-[.98] tracking-[-.065em] text-[color:var(--dn-ink)]">
            The network <em className="text-[color:var(--dn-title-accent)]">makes itself.</em>
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-xl text-sm leading-relaxed text-[color:var(--dn-muted)] sm:text-[15px]">
              Featured or reviewed public people connect to self-declared practices. Historic WhatsApp
              presence, aggregate website-member marks and poll selections are separate layers.
            </p>
            <div className="flex items-center gap-5 text-xs text-[color:var(--dn-link)]">
              <Link href="/network/community" className="hover:underline">Find people <ArrowUpRight size={13} className="inline" /></Link>
              <Link href="/network/artwork/proposal" className="hover:underline">About <ArrowUpRight size={13} className="inline" /></Link>
            </div>
          </div>
        </header>

        {/* 2D/3D occupy a dedicated bounded region with no absolute text overlays. */}
        <section aria-label="Interactive people and practices network"
          className="dn-network-field min-w-0 overflow-hidden rounded-2xl border border-[color:var(--dn-line)] bg-[var(--dn-graph-bg)]">
          <div className="h-[440px] w-full sm:h-[590px] lg:h-[670px]">
            <NetworkGraphBoundary>
              <Field selected={focus} onSelect={chooseNode} profiles={profiles} websitePresenceMarks={websiteMarks} />
            </NetworkGraphBoundary>
          </div>
        </section>

        {/* Controls always follow the graphic in document flow on mobile. */}
        <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-3">
          <div className="dn-mobile-scroller flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[color:var(--dn-line)] bg-[var(--dn-panel)] p-1"
            role="group" aria-label="Focus public artist">
            {([
              { label: 'All', id: null },
              { label: 'Moises', id: 'moises-sanabria' },
              { label: 'Fabiola', id: 'fabiola-larios' },
              { label: 'Angelo', id: 'angelo-caruso' },
            ] as { label: string; id: GraphSelection }[]).map((item) => (
              <button key={item.label} type="button" aria-pressed={focus === item.id}
                onClick={() => chooseNode(item.id)}
                className={'min-h-10 shrink-0 rounded-full px-4 py-2 text-xs transition ' +
                  (focus === item.id
                    ? 'bg-[var(--dn-accent)] font-semibold text-[color:var(--dn-accent-ink)]'
                    : 'text-[color:var(--dn-muted)] hover:text-[color:var(--dn-ink)]')}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-right font-mono text-[11px] tracking-wider text-[color:var(--dn-subtle)]">
            <span>{MEMBER_PRESENCE_SOURCE.reportedLabel} WhatsApp positions reported</span>
            <span>{websiteMarks ? websiteMarks+' delayed website-cohort marks · '+snapshotWeek : 'Website-member snapshot not published'}</span>
          </div>
        </div>

        <div className="mt-10 border-b border-[color:var(--dn-line)] pb-10 sm:mt-14">
          <PollPulse selectedChoice={selectedChoice}
            onSelectChoice={(choice) => chooseNode(choice ? 'practice-' + choice : null)} />
        </div>

        <footer className="mt-6 flex flex-wrap items-start justify-between gap-4 text-xs leading-relaxed text-[color:var(--dn-subtle)]">
          <p className="max-w-xl">72 poll selections, not 72 identifiable voters. Public practices require consent and review. Website marks appear only in delayed anonymous snapshots, never at the moment of signup. {sourceState==='preview'?'Featured artist cards are editorial previews.':''}</p>
          <Link href={focus && isPublicPerson(focus) ? '/network/community?profile=' + focus : '/network/community'}
            className="inline-flex items-center gap-1 text-[color:var(--dn-link)] hover:underline">
            Explore the Atlas <ArrowUpRight size={14} />
          </Link>
        </footer>
      </div>
    </main>
  )
}

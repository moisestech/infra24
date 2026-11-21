'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PollPulse } from '@/components/dcc/community/PollPulse'
import { MEMBER_PRESENCE_SOURCE } from '@/lib/dcc/artwork/member-presence'

const Field = dynamic(() => import('./PeopleNetworkField'), {
  ssr: false,
  loading: () => <div className="flex h-full min-h-[350px] items-center justify-center text-xs text-[color:var(--dn-graph-muted)]">Opening the network…</div>,
})

type PersonId = 'moises-sanabria' | 'fabiola-larios' | null
function publicPerson(value: string | null): value is Exclude<PersonId, null> {
  return value === 'moises-sanabria' || value === 'fabiola-larios'
}

export function CollectiveNetworkArtwork() {
  const [focus, setFocus] = useState<PersonId>(null)

  useEffect(() => {
    const person = new URL(window.location.href).searchParams.get('person')
    if (publicPerson(person)) setFocus(person)
  }, [])

  function choosePerson(next: PersonId) {
    setFocus(next)
    const url = new URL(window.location.href)
    // Only serialize a named, publicly identified cofounder.
    if (next) url.searchParams.set('person', next)
    else url.searchParams.delete('person')
    for (const old of ['mode', 'view', 'group', 'signal']) url.searchParams.delete(old)
    window.history.replaceState(null, '', url)
  }

  return (
    <main className="dcc-network-theme min-h-screen bg-[var(--dn-bg)] text-[color:var(--dn-ink)]">
      <div className="mx-auto max-w-[1700px] px-3 pb-16 pt-2 sm:px-6 sm:pt-4">
        <nav aria-label="Artwork navigation" className="flex items-center justify-between gap-4 px-2 py-3 text-xs text-[color:var(--dn-muted)]">
          <Link href="/" className="font-mono font-medium tracking-[.15em] transition hover:text-[color:var(--dn-ink)]">DCC</Link>
          <div className="flex items-center gap-5">
            <Link href="/network/community" className="transition hover:text-[color:var(--dn-ink)]">Atlas</Link>
            <Link href="/network/artwork/proposal" className="inline-flex items-center gap-1 transition hover:text-[color:var(--dn-ink)]">About <ArrowUpRight size={14} /></Link>
          </div>
        </nav>

        <section className="dn-network-field relative mt-2 overflow-hidden rounded-2xl border border-[color:var(--dn-line)] bg-[var(--dn-graph-bg)]" aria-label="Member network">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,var(--dn-glow),transparent_62%)]" aria-hidden />
          <header className="pointer-events-none absolute left-5 right-5 top-6 z-10 sm:left-9 sm:top-9">
            <p className="font-mono text-[10px] uppercase tracking-[.17em] text-[color:var(--dn-graph-muted)]">A network made of people</p>
            <h1 className="mt-3 text-[clamp(2.65rem,5.8vw,6rem)] font-light leading-[.91] tracking-[-.075em] text-[color:var(--dn-on-graph)]">
              The network<br /><em className="text-[color:var(--dn-graph-muted)]">makes itself.</em>
            </h1>
          </header>

          <div className="h-[63svh] min-h-[440px] max-h-[830px] w-full sm:h-[73svh]">
            <Field selected={focus} onSelect={choosePerson} />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 sm:bottom-7 sm:left-8 sm:right-8">
            <div className="dn-graph-overlay flex items-center rounded-full border border-[color:var(--dn-line)] bg-[var(--dn-graph-chip)] p-1 shadow-lg backdrop-blur-md" role="group" aria-label="Focus public cofounder">
              {([
                { label: 'All', id: null },
                { label: 'Moises', id: 'moises-sanabria' },
                { label: 'Fabiola', id: 'fabiola-larios' },
              ] as { label: string; id: PersonId }[]).map((item) => (
                <button key={item.label} type="button" aria-pressed={focus === item.id} onClick={() => choosePerson(item.id)}
                  className={'rounded-full px-3.5 py-2.5 text-xs transition sm:px-5 ' +
                    (focus === item.id ? 'bg-[var(--dn-accent)] font-semibold text-[color:var(--dn-accent-ink)]' : 'text-[color:var(--dn-muted)] hover:text-[color:var(--dn-ink)]')}>
                  {item.label}
                </button>
              ))}
            </div>
            <span className="dn-graph-overlay rounded-full border border-[color:var(--dn-line)] bg-[var(--dn-graph-chip)] px-3 py-2 font-mono text-[10px] tracking-wider text-[color:var(--dn-graph-muted)]">
              {MEMBER_PRESENCE_SOURCE.reportedLabel} reported
            </span>
          </div>
        </section>

        <div className="mx-1 mt-8 border-b border-[color:var(--dn-line)] pb-10 sm:mx-4 sm:mt-12">
          <PollPulse />
        </div>

        <div className="mx-1 mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--dn-subtle)] sm:mx-4">
          <p>Public cofounders and a documented founding connection. Other marks represent reported membership.</p>
          <Link href="/network/community" className="inline-flex items-center gap-1 text-[color:var(--dn-link)] transition hover:text-[color:var(--dn-ink)]">
            Find people through their practice <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  )
}

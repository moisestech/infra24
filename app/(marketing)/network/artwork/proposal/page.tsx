import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NETWORK_ARTWORK_PROPOSAL as proposal } from '@/lib/dcc/artwork/proposal'

export const metadata: Metadata = {
  title: 'The Network Makes Itself — Project Proposal | DCC Miami',
  description: 'A collectively authored web artwork that materializes an evolving, network-native cultural institution as sculpture.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'The Network Makes Itself — A cultural institution built from code and relationships',
    description: 'A full project proposal, interactive study, and proposed physical edition.',
    type: 'website',
  },
}

const kicker = 'font-mono text-[11px] uppercase tracking-[.22em] text-[#638b70]'
const heading = 'text-[clamp(2.3rem,5vw,5.2rem)] font-light leading-[1.04] tracking-[-.06em]'

export default function NetworkArtworkProposalPage() {
  return (
    <main className="min-h-screen bg-[#ecede7] text-[#152a23]">
      <header className="relative overflow-hidden bg-[#0b1717] text-[#f0f3eb]">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 78% 42%, rgba(99,164,132,.18), transparent 45%)' }} />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-10">
          <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 py-5 text-[11px] uppercase tracking-[.15em]">
            <Link href="/network/community" className="text-white/70 hover:text-white">DCC MIAMI / ART RESEARCH</Link>
            <div className="flex items-center gap-5">
              <span className="hidden text-white/50 sm:inline">PROPOSAL / CO-OP</span>
              <Link href="/network/artwork" className="rounded-full border border-[#97b9a1] px-4 py-2 text-[#ddede2] hover:bg-white/10">OPEN THE LIVE STUDY ↗</Link>
            </div>
          </nav>
          <div className="grid gap-10 pb-16 pt-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14 lg:pb-24 lg:pt-28">
            <div>
              <p className="mb-6 font-mono text-xs uppercase tracking-[.25em] text-[#a2cdb1]">{proposal.eyebrow}</p>
              <h1 className="text-[clamp(3.7rem,9.8vw,9.5rem)] font-light leading-[.84] tracking-[-.085em]">
                The network<br/><em className="text-[#b9d5bb]">makes itself.</em>
              </h1>
              <p className="mt-10 max-w-3xl text-xl leading-snug text-white/78 sm:text-2xl">{proposal.subtitle}</p>
            </div>
            <aside className="flex flex-col justify-end gap-4 border-l border-[#8cb399]/55 pl-5">
              <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#9bc8a8]">CODE / PEOPLE / STRUCTURE</p>
              <p className="text-[15px] leading-relaxed text-white/70">{proposal.source}</p>
              <p className="text-xs uppercase tracking-[.15em] text-white/45">Interactive artwork · collective authorship · fabrication</p>
            </aside>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-10">
        <div className="overflow-hidden rounded-lg bg-[#d4ddd3]">
          <Image src="/images/dcc/the-network-makes-itself-study.svg" width={1600} height={900} unoptimized priority className="h-auto w-full" alt="Speculative diagram showing a fictional participant-editable network on a dark digital field and its proposed translation into a translucent sculptural network."/>
        </div>
        <div className="mt-3 flex flex-wrap justify-between gap-2 font-mono text-[11px] uppercase tracking-[.12em] text-[#577462]">
          <span>FIG. 01 / THE LIVING NETWORK ↔ MATERIAL EDITION</span>
          <span>Concept sketch — no finished artwork implied</span>
        </div>
      </div>

      <section className="mx-auto grid max-w-[1400px] gap-8 border-t border-[#b8c9bc] px-5 py-16 sm:px-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-20 lg:py-24">
        <p className={kicker}>01 / THE PROPOSITION</p>
        <div>
          <h2 className={heading}>An institution need not begin with a building.</h2>
          <div className="mt-8 grid gap-6 text-[17px] leading-relaxed text-[#4d6556] md:grid-cols-2">
            {proposal.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <blockquote className="mt-12 border-l-2 border-[#749d81] pl-6 text-[clamp(1.5rem,3vw,3rem)] font-light leading-tight tracking-[-.05em]">{proposal.projectQuestion}</blockquote>
        </div>
      </section>

      <section className="bg-[#162823] py-16 text-[#ecf0e8] sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-[.22em] text-[#9dc6a7]">02 / INSTITUTIONAL ARCHITECTURE</p>
          <h2 className={'mt-7 max-w-5xl ' + heading}>From a building with software to a network made through software.</h2>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {[proposal.tension.left, proposal.tension.right].map((v, index) => (
              <div key={v.label} className={'min-h-[290px] rounded-lg border p-8 sm:p-10 ' + (index === 0 ? 'border-white/15 bg-white/[.035]' : 'border-[#8daf96]/50 bg-[#244336]')}>
                <div className="flex justify-between font-mono text-xs uppercase tracking-[.18em] text-[#a8c8ae]"><span>{v.label}</span><span className="text-xl">{index === 0 ? '□' : '✳'}</span></div>
                <h3 className="mt-12 text-3xl font-light leading-tight tracking-[-.05em]">{v.title}</h3>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">{v.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-sm leading-relaxed text-white/60">This is not an argument that museums, studios, or universities are obsolete. DCC depends on physical spaces, skilled labor, and situated human trust. The artwork experiments with another kind of collectively governed architecture built alongside them.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-10 sm:py-24">
        <p className={kicker}>03 / PARTICIPATORY SCORE</p>
        <h2 className={'mt-7 max-w-5xl ' + heading}>The nodes are not subjects.<br/>They are coauthors.</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-[#c3cec4] bg-[#c3cec4] md:grid-cols-2">
          {proposal.phases.map((v) => (
            <div key={v.number} className="min-h-[315px] bg-[#f5f5ee] p-8 sm:p-10">
              <div className="flex justify-between font-mono text-xs tracking-[.16em] text-[#5a8065]"><span>{v.number} / 04</span><span>{v.verb}</span></div>
              <h3 className="mt-14 text-3xl font-light tracking-[-.05em] sm:text-4xl">{v.title}</h3>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#536b5b]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#dce6da] py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-10 lg:grid-cols-[minmax(0,1fr)_410px] lg:gap-20">
          <div>
            <p className={kicker}>04 / THE CURRENT CODE</p>
            <h2 className={'mt-7 ' + heading}>The interface is the artwork.</h2>
            <p className="mt-8 max-w-3xl text-[17px] leading-relaxed text-[#496557]">{proposal.proposition}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/network/artwork" className="rounded-full bg-[#163829] px-6 py-4 text-sm font-semibold text-white hover:bg-[#2b5d42]">TRY THE INTERACTIVE STUDY ↗</Link>
              <Link href="/network/community" className="rounded-full border border-[#7f9e83] px-6 py-4 text-sm font-medium text-[#163829] hover:bg-[#c2d7c5]">EXISTING DCC ATLAS ↗</Link>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#617868]">The study uses fictional nodes. It demonstrates how state changes the picture, and it can freeze a deterministic SVG. Real participant authorship and physical editions remain proposed.</p>
          </div>
          <aside className="rounded-lg border border-[#b8c8bb] bg-[#f3f5ec] p-8">
            <h3 className="text-2xl font-light tracking-[-.04em]">Prototype vs. proposed work</h3>
            <p className="mb-4 mt-8 font-mono text-[11px] uppercase tracking-[.17em] text-[#5c8665]">Already present in code</p>
            <ul className="space-y-3 text-sm leading-relaxed text-[#516957]">
              {proposal.status.implemented.map((text) => <li key={text} className="flex gap-3"><span className="text-[#417e55]">✓</span><span>{text}</span></li>)}
            </ul>
            <p className="mb-4 mt-8 border-t border-[#b7c7b6] pt-6 font-mono text-[11px] uppercase tracking-[.17em] text-[#5c8665]">Still to be made</p>
            <ul className="space-y-3 text-sm leading-relaxed text-[#516957]">
              {proposal.status.proposed.map((text) => <li key={text} className="flex gap-3"><span className="text-[#978d5c]">○</span><span>{text}</span></li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20 lg:py-24">
        <div>
          <p className={kicker}>05 / MICROGRANT / $1,500</p>
          <h2 className={'mt-7 ' + heading}>{proposal.grant.heading}</h2>
          <p className="mt-8 text-[17px] leading-relaxed text-[#4b6655]">{proposal.grant.summary}</p>
          <p className="mt-9 font-mono text-xs uppercase tracking-[.17em] text-[#5c8665]">Planned deliverables</p>
          <ol className="mt-5 space-y-3 text-[15px] leading-relaxed text-[#435e4d]">
            {proposal.grant.outcomes.map((text, i) => <li key={text} className="flex gap-4"><span className="font-mono text-xs text-[#789e80]">{String(i + 1).padStart(2,'0')}</span><span>{text}</span></li>)}
          </ol>
        </div>
        <aside className="h-fit rounded-lg border border-[#b8c9b9] bg-[#f4f5ed] p-8">
          <p className="font-mono text-xs uppercase tracking-[.15em] text-[#5f8064]">Proposed award allocation</p>
          <p className="mt-4 text-6xl font-light tracking-[-.065em]">{proposal.grant.award}</p>
          <div className="mt-8 border-t border-[#bfcebe]">
            {proposal.grant.budget.map((v) => (
              <div key={v.name} className="grid grid-cols-[minmax(0,1fr)_70px] gap-3 border-b border-[#cdd6cb] py-5">
                <div><p className="text-sm font-semibold">{v.name}</p><p className="mt-1 text-xs leading-relaxed text-[#67806c]">{v.detail}</p></div>
                <p className="text-right font-mono text-sm">{'$' + v.amount.toLocaleString('en-US')}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-[#6b7f6e]">Scope, collaborators and materials remain subject to grant support and consent.</p>
        </aside>
      </section>

      <section className="bg-[#0e211a] py-16 text-[#eaf0e7] sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-[#94c09d]">06 / ETHICS ARE PART OF THE FORM</p>
          <h2 className={'mt-7 ' + heading}>Not every connection should be drawn.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {proposal.ethics.map((v, i) => (
              <article key={v.title} className="border-t border-[#799c81]/65 pt-6">
                <span className="font-mono text-xs text-[#91b69a]">{String(i + 1).padStart(2,'0')}</span>
                <h3 className="mt-6 text-xl font-light leading-snug tracking-[-.03em]">{v.title}</h3>
                <p className="mt-5 text-sm leading-relaxed text-white/60">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-5 py-16 sm:px-10 md:flex-row md:items-end">
        <div>
          <p className={kicker}>ARTIST / RESEARCH / CODE</p>
          <h2 className="mt-4 text-3xl font-light tracking-[-.05em]">{proposal.attribution.lead}</h2>
          <p className="mt-2 max-w-xl text-sm text-[#586e5d]">{proposal.attribution.studio} / {proposal.attribution.research}</p>
          <div className="mt-7 flex flex-wrap gap-5 text-sm underline underline-offset-4">
            <a href="https://www.moises.tech" target="_blank" rel="noopener noreferrer">Artist portfolio ↗</a>
            <a href="https://dcc.miami" target="_blank" rel="noopener noreferrer">DCC Miami ↗</a>
            <a href="https://github.com/moisestech/infra24/pull/54" target="_blank" rel="noopener noreferrer">GitHub proposal code ↗</a>
          </div>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-[#647765]">{proposal.attribution.note}</p>
      </footer>
    </main>
  )
}

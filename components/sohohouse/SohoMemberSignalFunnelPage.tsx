'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  QrCode,
  Route,
  Shield,
  Smartphone,
  Sparkles,
  Tv,
  Waves,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SohoFunnelMockupFrame } from '@/components/sohohouse/SohoFunnelMockupFrame'
import { SohoFunnelThemeToggle } from '@/components/sohohouse/SohoFunnelThemeToggle'
import { SohoHouseLogo } from '@/components/sohohouse/SohoHouseLogo'
import { useTheme } from '@/contexts/ThemeContext'
import {
  SOHO_FUNNEL_MOCKUPS,
  SOHO_PITCH_EMAIL,
  SOHO_WALKTHROUGH_MAILTO,
  sohoMockupSrc,
} from '@/lib/sohohouse/pitch-constants'
import { cn } from '@/lib/utils'

const DEMO_HREF = '/o/sohohouse/memory-agent'
const HERO_QUESTION = 'What should members experience this week?'
const GOVERNANCE_HREF = '/o/sohohouse/memory-agent/about'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'interaction', label: 'Interaction' },
  { id: 'smart-sign', label: 'Smart Sign' },
  { id: 'demo', label: 'Try Demo' },
  { id: 'proof', label: 'Proof' },
  { id: 'pilot', label: 'Pilot' },
  { id: 'contact', label: 'Contact' },
] as const

const OUTPUT_CHIPS = [
  { label: 'Member route', icon: Route },
  { label: 'Bookable experiences', icon: Sparkles },
  { label: 'Smart sign copy', icon: Tv },
  { label: 'Mobile handoff', icon: Smartphone },
] as const

const PILOT_ITEMS = [
  'House knowledge audit',
  'Voice / chat interface',
  'Member experience cards',
  'Staff brief',
  'Leadership insight',
  'Smart sign draft',
  'Approved QR / mobile handoff',
  'Governance setup',
] as const

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--soho-accent-muted)]">
      {children}
    </p>
  )
}

function AudioWaveBars({ count = 14, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn('flex h-10 items-end justify-center gap-[3px]', className)}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="soho-funnel-wave-bar w-[3px] rounded-full bg-[var(--soho-accent)]"
          style={{
            height: `${28 + ((i * 7) % 5) * 14}%`,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.95 + (i % 4) * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

function VoiceOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'soho-funnel-voice-orb relative flex h-28 w-28 items-center justify-center rounded-full md:h-32 md:w-32',
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(232,220,200,0.35),rgba(200,168,120,0.08)_55%,transparent_70%)] soho-funnel-orb" />
      <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(232,220,200,0.18),transparent_65%)] blur-sm" />
      <Mic className="soho-funnel-icon-live relative z-10 h-9 w-9 text-[var(--soho-accent)] md:h-10 md:w-10" />
    </div>
  )
}

function FunnelNav({
  activeId,
  onNavigate,
}: {
  activeId: string
  onNavigate: (id: string) => void
}) {
  return (
    <nav
      className="flex max-w-full gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Page sections"
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate(id)}
          data-active={activeId === id}
          className={cn(
            'soho-funnel-nav-link shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide',
            'text-[var(--soho-text-muted)]'
          )}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}

function StoryStep({
  step,
  title,
  body,
  icon: Icon,
  delay,
}: {
  step: string
  title: string
  body: string
  icon: ComponentType<{ className?: string }>
  delay: number
}) {
  return (
    <li
      className="soho-funnel-card soho-funnel-section-enter group rounded-2xl border border-[var(--soho-border)] bg-[var(--soho-surface)] p-5 md:p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--soho-border-strong)] bg-[var(--soho-surface-elevated)] text-xs font-semibold text-[var(--soho-accent)] transition group-hover:border-[rgba(232,220,200,0.35)] group-hover:shadow-[0_0_20px_-4px_rgba(200,168,120,0.35)]">
          {step}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-[var(--soho-accent)]">
            <Icon className="soho-funnel-icon-live h-4 w-4 shrink-0 transition group-hover:scale-110" aria-hidden />
            <h3 className="text-sm font-medium tracking-wide text-[var(--soho-text)]">{title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-[var(--soho-text-muted)]">{body}</p>
        </div>
      </div>
    </li>
  )
}

export function SohoMemberSignalFunnelPage() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id)
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'
  const logoColor = isLight ? '#1c1917' : '#f5efe6'

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveId(id)
  }, [])

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.4] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="soho-funnel-root min-h-screen bg-[var(--soho-bg)] text-[var(--soho-text)] transition-colors duration-500"
      data-soho-theme={resolvedTheme}
    >
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="soho-funnel-gradient-mesh absolute inset-0 opacity-80" />
        <div className="soho-funnel-orb absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--soho-glow)] blur-3xl" />
        <div className="soho-funnel-orb-alt absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[rgba(120,90,60,0.14)] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[rgba(232,220,200,0.04)] blur-3xl" />
      </div>

      {/* Sticky header + section nav */}
      <header className="sticky top-0 z-50 border-b border-[var(--soho-border)] bg-[var(--soho-header-bg)] backdrop-blur-xl transition-colors duration-500">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <SohoHouseLogo variant="horizontal" size="sm" color={logoColor} href={DEMO_HREF} />
          <div className="flex shrink-0 items-center gap-2">
            <SohoFunnelThemeToggle />
            <Link
              href={GOVERNANCE_HREF}
              className="hidden text-xs text-[var(--soho-accent-muted)] transition hover:text-[var(--soho-text)] sm:block"
            >
              Governance
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-3 md:px-8">
          <FunnelNav activeId={activeId} onNavigate={scrollToSection} />
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 pb-24 md:px-8">
        {/* Hero */}
        <section id="overview" className="scroll-mt-24 pt-10 md:pt-16">
          <div className="soho-funnel-section-enter grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <SectionLabel>Member relations · pitch demo</SectionLabel>
              <h1 className="mt-4 max-w-3xl font-serif text-3xl font-light leading-tight tracking-tight md:text-5xl md:leading-[1.1]">
                Soho House AI Assistant for Member Relations
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--soho-text-muted)] md:text-lg">
                A Member Signal Agent that turns House programming, spaces, and cultural knowledge
                into approved member-facing experiences.
              </p>
              <p className="mt-6 max-w-xl border-l-2 border-[var(--soho-border-strong)] pl-4 text-sm italic leading-relaxed text-[var(--soho-accent)] md:text-base">
                The agent drafts. Staff approves. Members only see approved handoffs.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="soho-funnel-btn-primary h-11 rounded-full border-0 px-6 text-sm font-medium"
                >
                  <Link href={DEMO_HREF}>
                    Try the Member Signal Agent
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="soho-funnel-btn-ghost h-11 rounded-full border-[var(--soho-border-strong)] bg-transparent px-6 text-sm text-[var(--soho-text)]"
                >
                  <a href={SOHO_WALKTHROUGH_MAILTO}>Schedule a walkthrough</a>
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-5 lg:items-end">
              <SohoFunnelMockupFrame
                {...SOHO_FUNNEL_MOCKUPS.hero}
                src={sohoMockupSrc('hero')}
                priority
                className="w-full max-w-[240px]"
              />
              <div className="flex w-full max-w-[240px] flex-col items-center gap-3">
                <VoiceOrb />
                <AudioWaveBars count={16} className="opacity-80" />
                <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--soho-accent-muted)]">
                  <Waves className="h-3.5 w-3.5" aria-hidden />
                  Voice · chat · signal
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Member interaction */}
        <section id="interaction" className="soho-funnel-section-enter mt-20 scroll-mt-24 md:mt-28" style={{ animationDelay: '80ms' }}>
          <SectionLabel>The member interaction</SectionLabel>
          <h2 className="mt-3 font-serif text-2xl font-light md:text-3xl">
            One question. A full experience loop.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--soho-text-muted)] md:text-base">
            A member asks from phone or lobby. The agent returns curated routes and bookable
            programming — never invented availability, never private member data.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-start">
            <div className="soho-funnel-card group relative overflow-hidden rounded-3xl border border-[var(--soho-border)] bg-[var(--soho-bg-soft)] p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden>
              <div className="soho-funnel-gradient-mesh h-full w-full opacity-40" />
            </div>
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--soho-accent-muted)]">
                Member asks
              </p>
              <p className="mt-3 font-serif text-xl font-light italic text-[var(--soho-text)] md:text-2xl">
                &ldquo;What should I experience this week?&rdquo;
              </p>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--soho-border)]" />
                <Mic className="soho-funnel-icon-live h-4 w-4 text-[var(--soho-accent)]" aria-hidden />
                <div className="h-px flex-1 bg-[var(--soho-border)]" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--soho-accent-muted)]">
                Agent returns
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {OUTPUT_CHIPS.map(({ label, icon: Icon }, i) => (
                  <li
                    key={label}
                    className="soho-funnel-chip soho-funnel-section-enter flex items-center gap-2 rounded-full border border-[var(--soho-border-strong)] px-3 py-2 text-xs text-[var(--soho-accent)]"
                    style={{ animationDelay: `${120 + i * 60}ms` }}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            </div>
            <SohoFunnelMockupFrame
              {...SOHO_FUNNEL_MOCKUPS.interaction}
              src={sohoMockupSrc('interaction')}
            />
          </div>
        </section>

        {/* Smart sign */}
        <section id="smart-sign" className="mt-20 scroll-mt-24 md:mt-28">
          <SectionLabel>Smart sign moment</SectionLabel>
          <h2 className="mt-3 font-serif text-2xl font-light md:text-3xl">
            From draft to approved signal
          </h2>
          <SohoFunnelMockupFrame
            {...SOHO_FUNNEL_MOCKUPS.smartSign}
            src={sohoMockupSrc('smartSign')}
            className="mt-8"
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            <StoryStep
              step="01"
              icon={Sparkles}
              title="Staff reviews the draft"
              body="Public-safe copy, staff brief, and leadership insight from the same grounded retrieval — nothing auto-published."
              delay={0}
            />
            <StoryStep
              step="02"
              icon={Tv}
              title="Smart sign goes live"
              body="Lobby or terrace screens show approved House programming — concise, elegant, and tied to source records."
              delay={80}
            />
            <StoryStep
              step="03"
              icon={QrCode}
              title="Member scans QR"
              body="Approved handoff only after explicit staff approval. Internal briefs never appear on the public route."
              delay={160}
            />
            <StoryStep
              step="04"
              icon={Smartphone}
              title="Mobile route opens"
              body="The member receives a curated journey — routes, bookable moments, and follow-up questions in public mode."
              delay={240}
            />
          </ol>
        </section>

        {/* Try demo */}
        <section id="demo" className="mt-20 scroll-mt-24 md:mt-28">
          <SectionLabel>Try the demo</SectionLabel>
          <h2 className="mt-3 font-serif text-2xl font-light md:text-3xl">
            Experience the Member Signal Agent
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--soho-text-muted)] md:text-base">
            The Soho version is a concept demo using sample House-style records. This is what it
            could feel like for members — routes, bookable moments, smart sign copy, and mobile
            handoff.
          </p>
          <div className="soho-funnel-card soho-funnel-section-enter mt-8 grid gap-8 rounded-3xl border border-[var(--soho-border-strong)] bg-[var(--soho-surface-elevated)] p-6 md:grid-cols-[1fr_auto] md:p-8 lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--soho-accent-muted)]">
                Suggested first question
              </p>
              <p className="mt-3 font-serif text-lg font-light text-[var(--soho-text)] md:text-xl">
                &ldquo;{HERO_QUESTION}&rdquo;
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--soho-text-muted)]">
                Demo programming for Soho Beach House Miami — routes, screenings, wellness, and
                dining. Editorial stories and spaces are never presented as bookable unless
                grounded.
              </p>
              <AudioWaveBars count={10} className="mt-5 opacity-70" />
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="soho-funnel-btn-primary h-11 rounded-full border-0 px-6 text-sm font-medium"
                >
                  <Link href={DEMO_HREF}>Open interactive demo</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="soho-funnel-btn-ghost h-11 rounded-full border-[var(--soho-border-strong)] bg-transparent px-6 text-sm text-[var(--soho-text)]"
                >
                  <Link href={GOVERNANCE_HREF}>About the demo</Link>
                </Button>
              </div>
            </div>
            <SohoFunnelMockupFrame
              {...SOHO_FUNNEL_MOCKUPS.mobileHandoff}
              src={sohoMockupSrc('mobileHandoff')}
              className="mx-auto md:mx-0"
            />
          </div>
        </section>

        {/* Working proof */}
        <section id="proof" className="mt-20 scroll-mt-24 md:mt-28">
          <SectionLabel>Working proof</SectionLabel>
          <h2 className="mt-3 font-serif text-2xl font-light md:text-3xl">
            The engine works on live data
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--soho-text-muted)] md:text-base">
            The engine is already working on live institutional data. Soho House is the
            member-relations translation.
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-[var(--soho-text-muted)]">
            The Soho demo uses sample records. The Oolite walkthrough below shows the same engine
            on live cultural institution data — event cards, staff actions, signage, and approved
            public handoffs.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:items-start">
            <div className="soho-funnel-card group overflow-hidden rounded-3xl border border-[var(--soho-border)] bg-[var(--soho-surface)]">
            <div className="soho-funnel-proof-panel relative flex aspect-video flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="soho-funnel-gradient-mesh absolute inset-0 opacity-30 transition-opacity group-hover:opacity-50" />
              <Mic className="soho-funnel-icon-live relative z-10 h-10 w-10 text-[var(--soho-accent-muted)]" aria-hidden />
              <AudioWaveBars count={20} className="relative z-10 opacity-60" />
              <p className="relative z-10 text-sm font-medium text-[var(--soho-text)]">
                Oolite proof — Public Signal Agent
              </p>
              <p className="relative z-10 max-w-md text-xs leading-relaxed text-[var(--soho-text-muted)]">
                60–90 second walkthrough: live programming memory, event cards, staff actions,
                signage draft, Approve Public QR, and mobile handoff.
              </p>
              <p className="relative z-10 text-[10px] uppercase tracking-[0.24em] text-[var(--soho-accent-muted)]">
                Embed Oolite recording here
              </p>
            </div>
            <div className="border-t border-[var(--soho-border)] px-6 py-4 text-xs text-[var(--soho-text-muted)]">
              Live engine:{' '}
              <Link
                href="/o/oolite/memory-agent"
                className="text-[var(--soho-accent)] underline-offset-4 transition hover:underline"
              >
                Oolite institutional memory
              </Link>
              {' · '}
              Concept translation:{' '}
              <Link
                href={DEMO_HREF}
                className="text-[var(--soho-accent)] underline-offset-4 transition hover:underline"
              >
                Soho Member Signal demo
              </Link>
            </div>
            </div>
            <SohoFunnelMockupFrame
              {...SOHO_FUNNEL_MOCKUPS.staffGovernance}
              src={sohoMockupSrc('staffGovernance')}
            />
          </div>
        </section>

        {/* Pilot offer */}
        <section id="pilot" className="mt-20 scroll-mt-24 md:mt-28">
          <SectionLabel>Pilot offer</SectionLabel>
          <h2 className="mt-3 font-serif text-3xl font-light md:text-4xl">
            One House. One question. 4–6 weeks.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--soho-text-muted)]">
            A time-boxed pilot to connect one slice of House knowledge to a governed member-facing
            loop — voice or chat, experience cards, staff approval, and QR handoff.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PILOT_ITEMS.map((item, i) => (
              <li
                key={item}
                className="soho-funnel-card soho-funnel-section-enter flex items-start gap-3 rounded-xl border border-transparent bg-[var(--soho-surface)]/40 px-3 py-2.5"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <CheckCircle2
                  className="soho-funnel-icon-live mt-0.5 h-4 w-4 shrink-0 text-[var(--soho-accent)]"
                  style={{ animationDelay: `${i * 0.2}s` }}
                  aria-hidden
                />
                <span className="text-sm text-[var(--soho-text-muted)]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section
          id="contact"
          className="soho-funnel-card mt-20 scroll-mt-24 rounded-3xl border border-[var(--soho-border)] bg-[var(--soho-bg-soft)] p-8 md:mt-28 md:p-10"
        >
          <SectionLabel>Next step</SectionLabel>
          <h2 className="mt-3 font-serif text-2xl font-light md:text-3xl">
            Schedule a 15-minute walkthrough
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--soho-text-muted)]">
            Walk through the five-minute demo path with{' '}
            <span className="text-[var(--soho-text)]">Moises Sanabria</span> and{' '}
            <span className="text-[var(--soho-text)]">Fabiola Larios</span>, Senior AI Consultants.
            Reach us at{' '}
            <a
              href={SOHO_WALKTHROUGH_MAILTO}
              className="text-[var(--soho-accent)] underline-offset-4 hover:underline"
            >
              {SOHO_PITCH_EMAIL}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="soho-funnel-btn-primary h-11 rounded-full border-0 px-6 text-sm font-medium"
            >
              <a href={SOHO_WALKTHROUGH_MAILTO}>Schedule walkthrough</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className={cn(
                'soho-funnel-btn-ghost h-11 rounded-full border-[var(--soho-border-strong)] bg-transparent px-6 text-sm',
                'text-[var(--soho-text)]'
              )}
            >
              <Link href={GOVERNANCE_HREF}>
                <Shield className="mr-2 h-4 w-4" aria-hidden />
                View governance approach
              </Link>
            </Button>
          </div>
        </section>

        <footer className="mt-16 border-t border-[var(--soho-border)] pt-8 text-xs text-[var(--soho-text-muted)]">
          <p>
            Concept demo for member-relations conversations. Not affiliated with or endorsed by
            Soho House.
          </p>
          <p className="mt-2">
            Built by{' '}
            <Link
              href="/"
              className="text-[var(--soho-accent-muted)] underline-offset-4 transition hover:underline"
            >
              Infra24
            </Link>
            {' · '}
            <Link href={DEMO_HREF} className="underline-offset-4 transition hover:underline">
              Demo
            </Link>
          </p>
        </footer>
      </main>
    </div>
  )
}

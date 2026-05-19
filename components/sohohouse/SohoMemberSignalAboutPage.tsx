import Link from 'next/link'
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  QrCode,
  Route,
  Sparkles,
  Tv,
  UserCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SohoHouseLogo } from '@/components/sohohouse/SohoHouseLogo'
import { SOHO_PITCH_EMAIL, SOHO_WALKTHROUGH_MAILTO } from '@/lib/sohohouse/pitch-constants'
import { cn } from '@/lib/utils'

const DEMO_HREF = '/o/sohohouse/memory-agent'
const FUNNEL_HREF = '/soho-house-ai-assistant'

const SOHO_THEME_STYLE = {
  '--soho-bg': '#0c0a09',
  '--soho-bg-soft': '#141110',
  '--soho-surface': '#171412',
  '--soho-surface-elevated': '#1f1b18',
  '--soho-border': 'rgba(245, 235, 220, 0.08)',
  '--soho-border-strong': 'rgba(245, 235, 220, 0.16)',
  '--soho-text': '#f5efe6',
  '--soho-text-muted': 'rgba(245, 239, 230, 0.68)',
  '--soho-accent': '#e8dcc8',
  '--soho-accent-muted': 'rgba(232, 220, 200, 0.72)',
  '--soho-glow': 'rgba(200, 168, 120, 0.22)',
} as CSSProperties

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--soho-accent-muted)]">
      {children}
    </p>
  )
}

function OutputCard({
  title,
  body,
  icon: Icon,
}: {
  title: string
  body: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <li className="rounded-2xl border border-[var(--soho-border)] bg-[var(--soho-surface)] p-5 md:p-6">
      <Icon className="mb-3 h-5 w-5 text-[var(--soho-accent)]" aria-hidden />
      <h3 className="font-serif text-lg font-light text-[var(--soho-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--soho-text-muted)]">{body}</p>
    </li>
  )
}

function FlowStep({ step, label }: { step: string; label: string }) {
  return (
    <li className="flex flex-col items-center text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--soho-border-strong)] bg-[var(--soho-surface-elevated)] text-xs font-semibold text-[var(--soho-accent)]">
        {step}
      </span>
      <p className="mt-2 max-w-[8rem] text-xs leading-snug text-[var(--soho-text-muted)]">{label}</p>
    </li>
  )
}

export function SohoMemberSignalAboutPage() {
  return (
    <div
      className="min-h-screen bg-[var(--soho-bg)] text-[var(--soho-text)]"
      style={SOHO_THEME_STYLE}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--soho-glow)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[rgba(120,90,60,0.12)] blur-3xl" />
      </div>

      <header className="relative mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5 md:px-8">
        <SohoHouseLogo variant="horizontal" size="sm" color="#f5efe6" href={DEMO_HREF} />
        <nav className="flex flex-wrap items-center justify-end gap-3 text-xs">
          <Link
            href={DEMO_HREF}
            className="text-[var(--soho-accent-muted)] transition hover:text-[var(--soho-text)]"
          >
            Try demo
          </Link>
          <Link
            href={FUNNEL_HREF}
            className="text-[var(--soho-accent-muted)] transition hover:text-[var(--soho-text)]"
          >
            Full pitch
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-24 md:px-8">
        {/* Hero */}
        <section className="pt-4 md:pt-10">
          <SectionLabel>Member relations · concept demo</SectionLabel>
          <h1 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight md:text-5xl">
            Soho House AI Assistant
          </h1>
          <p className="mt-2 font-serif text-xl font-light italic text-[var(--soho-accent)] md:text-2xl">
            for Member Relations
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--soho-text-muted)] md:text-base">
            A concept demo for a governed Member Signal Agent that turns House-style programming,
            spaces, and cultural knowledge into approved member-facing experiences.
          </p>
          <p className="mt-4 rounded-xl border border-[var(--soho-border)] bg-[var(--soho-bg-soft)] px-4 py-3 text-xs leading-relaxed text-[var(--soho-text-muted)]">
            Concept demo using sample House-style programming records. Not connected to Soho House
            internal systems and does not use private member data.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-11 rounded-full border-0 bg-[var(--soho-accent)] px-6 text-sm font-medium text-[#1a1512] hover:bg-[#f5efe6]"
            >
              <Link href={DEMO_HREF}>
                Try the Demo
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-[var(--soho-border-strong)] bg-transparent px-6 text-sm text-[var(--soho-text)] hover:bg-[var(--soho-surface)]"
            >
              <Link href={FUNNEL_HREF}>View Full Pitch</Link>
            </Button>
          </div>
        </section>

        {/* One House. One Question. */}
        <section className="mt-16 md:mt-24">
          <SectionLabel>One House. One Question.</SectionLabel>
          <p className="mt-4 font-serif text-2xl font-light italic text-[var(--soho-text)] md:text-3xl">
            &ldquo;What should members experience this week?&rdquo;
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            <OutputCard
              icon={Route}
              title="Member Recommendation"
              body="A relevant route that feels effortless."
            />
            <OutputCard
              icon={ClipboardList}
              title="Staff Brief"
              body="Context, preferences, and plans at a glance."
            />
            <OutputCard
              icon={BarChart3}
              title="Leadership Insight"
              body="Signals around engagement and what is resonating."
            />
          </ul>
        </section>

        {/* From Question to Experience */}
        <section className="mt-16 md:mt-24">
          <SectionLabel>From question to experience</SectionLabel>
          <h2 className="mt-3 font-serif text-2xl font-light md:text-3xl">
            Ask once. Approve before anything goes live.
          </h2>
          <div className="mt-8 rounded-3xl border border-[var(--soho-border)] bg-[var(--soho-bg-soft)] p-6 md:p-8">
            <ol className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
              <FlowStep step="1" label="Ask the House" />
              <FlowStep step="2" label="Agent drafts" />
              <FlowStep step="3" label="Staff approves" />
              <FlowStep step="4" label="Smart sign goes live" />
              <FlowStep step="5" label="Member scans" />
            </ol>
            <p className="mt-6 text-center text-xs text-[var(--soho-text-muted)]">
              Engagement can be measured and refined — without auto-publishing drafts.
            </p>
          </div>
        </section>

        {/* Smart Sign Experience */}
        <section className="mt-16 md:mt-24">
          <SectionLabel>Smart sign experience</SectionLabel>
          <h2 className="mt-3 font-serif text-2xl font-light md:text-3xl">
            The House becomes a public signal.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--soho-text-muted)] md:text-base">
            The smart sign is the public face of the agent. A staff-approved signal appears in the
            House. Members scan, receive a mobile route, and continue the experience on their own
            device.
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { step: '01', icon: UserCheck, title: 'Staff approves', body: 'Nothing goes live without explicit review.' },
              { step: '02', icon: Tv, title: 'Sign goes live', body: 'Lobby or terrace screens show approved programming.' },
              { step: '03', icon: QrCode, title: 'Member scans', body: 'Mobile route opens — curated, public-safe handoff.' },
            ].map(({ step, icon: Icon, title, body }) => (
              <li
                key={step}
                className="rounded-2xl border border-[var(--soho-border)] bg-[var(--soho-surface)] p-5"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--soho-accent-muted)]">
                  {step}
                </span>
                <Icon className="mt-3 h-5 w-5 text-[var(--soho-accent)]" aria-hidden />
                <h3 className="mt-2 text-sm font-medium text-[var(--soho-text)]">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--soho-text-muted)]">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Governance */}
        <section className="mt-16 md:mt-24">
          <div className="rounded-3xl border border-[var(--soho-border-strong)] bg-[var(--soho-surface-elevated)] px-6 py-10 text-center md:px-10">
            <Sparkles className="mx-auto h-6 w-6 text-[var(--soho-accent)]" aria-hidden />
            <p className="mt-4 font-serif text-xl font-light leading-relaxed text-[var(--soho-accent)] md:text-2xl">
              The agent drafts. Staff approves. Members only see approved handoffs.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-16 md:mt-24">
          <SectionLabel>Consultants</SectionLabel>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {[
              { name: 'Moises Sanabria', role: 'Senior AI Consultant' },
              { name: 'Fabiola Larios', role: 'Senior AI Consultant' },
            ].map(({ name, role }) => (
              <div
                key={name}
                className="rounded-2xl border border-[var(--soho-border)] bg-[var(--soho-surface)] p-5"
              >
                <p className="font-serif text-lg font-light text-[var(--soho-text)]">{name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--soho-accent-muted)]">
                  {role}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-11 rounded-full border-0 bg-[var(--soho-accent)] px-6 text-sm font-medium text-[#1a1512] hover:bg-[#f5efe6]"
            >
              <a href={SOHO_WALKTHROUGH_MAILTO}>Schedule a walkthrough</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className={cn(
                'h-11 rounded-full border-[var(--soho-border-strong)] bg-transparent px-6 text-sm',
                'text-[var(--soho-text)] hover:bg-[var(--soho-surface)]'
              )}
            >
              <Link href={DEMO_HREF}>Try the Demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-[var(--soho-text-muted)]">
            Or email{' '}
            <a href={SOHO_WALKTHROUGH_MAILTO} className="text-[var(--soho-accent)] hover:underline">
              {SOHO_PITCH_EMAIL}
            </a>
          </p>
        </section>

        <footer className="mt-16 border-t border-[var(--soho-border)] pt-8 text-xs text-[var(--soho-text-muted)]">
          <p>
            Concept demo for member-relations conversations. Not affiliated with or endorsed by
            Soho House.
          </p>
          <p className="mt-2">
            <Link href={FUNNEL_HREF} className="text-[var(--soho-accent-muted)] underline-offset-4 hover:underline">
              Full pitch page
            </Link>
            {' · '}
            <Link href={DEMO_HREF} className="underline-offset-4 hover:underline">
              Interactive demo
            </Link>
          </p>
        </footer>
      </main>
    </div>
  )
}

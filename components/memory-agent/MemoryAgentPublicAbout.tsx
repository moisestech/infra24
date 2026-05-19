import Link from 'next/link'

import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'
import { SOHO_BRAND_LABELS } from '@/lib/sohohouse/knowledge-domain'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

type MemoryAgentPublicAboutProps = {
  orgSlug: string
  orgName: string
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className={cn('rounded-xl p-5 shadow-sm', ma.card)}>
      <h2 className="text-base font-semibold text-[var(--ma-text)]">{title}</h2>
      <div className={cn('mt-3 space-y-3 text-sm leading-relaxed', ma.bodyMuted)}>
        {children}
      </div>
    </section>
  )
}

function SohoHouseAbout({ branding }: { branding: ReturnType<typeof getMemoryAgentBranding> }) {
  const brands = Object.values(SOHO_BRAND_LABELS).join(', ')

  return (
    <>
      <Section title="What this is">
        <p>
          <strong className="text-[var(--ma-text)]">{branding.productTitle}</strong> is a
          conversational guide to Soho House &amp; Co — powered by{' '}
          <strong className="text-[var(--ma-text)]">{branding.agentName}</strong>, a voice-first
          host that answers from curated institutional records, not the open web.
        </p>
        <p>
          This pilot connects member stories, programming, and place knowledge so guests and staff
          can ask naturally — by voice or text — and get answers grounded in what we actually
          know.
        </p>
      </Section>

      <Section title="How it works">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className="text-[var(--ma-text)]">Ask.</strong> Tap Ask by voice and speak,
            or type a question. Your words are transcribed automatically — there is no manual
            send step in the public kiosk.
          </li>
          <li>
            <strong className="text-[var(--ma-text)]">Search.</strong> The agent searches
            connected records (today: alumni-style artist profiles for the pilot) and pulls the
            most relevant entries.
          </li>
          <li>
            <strong className="text-[var(--ma-text)]">Answer.</strong> You get a concise reply,
            optional artist cards, and follow-up ideas. When voice playback is enabled, you can
            listen to the answer.
          </li>
        </ol>
        <p className="text-xs">
          {branding.agentName} only states what the records support. If something is missing, you
          will see that called out rather than invented detail.
        </p>
      </Section>

      <Section title="What you can ask about">
        <p>
          The long-term vision spans Houses and neighbourhoods, bookable events, editorial
          stories, and membership lines across our family of brands: {brands}.
        </p>
        <p>
          In this pilot, questions focus on people and creative practices in the connected
          catalogue — for example photographers, filmmakers, hosts for a panel, or members
          linked to a city or theme.
        </p>
      </Section>

      <Section title="Privacy &amp; prototype notice">
        <p>
          This is a demonstration environment. Questions may be logged for product improvement.
          Do not share passwords, payment details, or other sensitive personal data in the kiosk.
        </p>
        <p>
          Production would add member authentication, retention policies, and editorial approval
          before anything is shown on signage or in the member app.
        </p>
      </Section>
    </>
  )
}

function GenericAbout({ branding }: { branding: ReturnType<typeof getMemoryAgentBranding> }) {
  return (
    <>
      <Section title="What this is">
        <p>
          <strong className="text-[var(--ma-text)]">{branding.productTitle}</strong> turns{' '}
          {branding.orgName}&apos;s institutional records into a conversational assistant guided
          by <strong className="text-[var(--ma-text)]">{branding.agentName}</strong>.
        </p>
        <p>{branding.tagline}</p>
      </Section>

      <Section title="How it works">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Ask by voice or type a question.</li>
          <li>The agent searches connected Airtable records.</li>
          <li>You receive a source-grounded answer, artist cards when relevant, and follow-ups.</li>
        </ol>
      </Section>

      <Section title="Prototype notice">
        <p>
          This kiosk is a pilot. Answers are limited to configured data sources and may be logged
          for improvement. API keys and governance workflows are still being wired for production.
        </p>
      </Section>
    </>
  )
}

/** Public-facing story page (partners, staff, visitors) — separate from dev roadmap. */
export function MemoryAgentPublicAbout({ orgSlug, orgName }: MemoryAgentPublicAboutProps) {
  const slug = orgSlug.trim().toLowerCase()
  const branding = getMemoryAgentBranding(slug)
  const isSoho = slug === 'sohohouse'

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--ma-text-muted)]">
          {branding.productTitle}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ma-text)]">
          About this experience
        </h1>
        <p className={cn('mt-3 max-w-xl', ma.bodyMuted)}>
          How {branding.agentName} works at {orgName} — what to expect when you ask by voice or
          text.
        </p>
      </header>

      {isSoho ? <SohoHouseAbout branding={branding} /> : <GenericAbout branding={branding} />}

      <p className="text-center text-sm">
        <Link
          href={`/o/${slug}/memory-agent`}
          className="font-medium text-[color:var(--ma-primary,#0891b2)] hover:underline"
        >
          ← Try {branding.agentName}
        </Link>
        {' · '}
        <Link
          href={`/o/${slug}/alumni`}
          className="font-medium text-[color:var(--ma-primary,#0891b2)] hover:underline"
        >
          Browse catalogue
        </Link>
      </p>
    </div>
  )
}

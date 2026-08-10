import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, Section } from '@/components/marketing/cdc'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import { cdcPageMetadata } from '@/lib/cdc/metadata'

const path = '/applied-ai'

const baseMeta = cdcPageMetadata(path)
export const metadata: Metadata = {
  ...baseMeta,
  title: 'Applied AI engineering demos — Infra24 / DCC pilot',
  description:
    'Governed institutional Memory Agent (hybrid retrieval + citations) and approval-gated Network Readiness Agent — live pilot demos for Applied AI / FDE interviews.',
  robots: { index: false, follow: false },
  alternates: { canonical: path },
}

const demos = [
  {
    title: 'Memory Agent — governed retrieval',
    description:
      'Hybrid keyword + optional embedding boost, citation IDs, staff/public/leadership outputs, golden eval harness. Voice and text at DCC. Canonical path: /memory-agent.',
    href: '/memory-agent',
    secondaryHref: '/memory-agent/about',
    secondaryLabel: 'How it works',
  },
  {
    title: 'Network Readiness Agent',
    description:
      'Rule-based readiness scoring → optional LLM draft polish → Airtable approval rows (human-in-the-loop, no auto-send). Requires admin env.',
    href: '/network/agent',
    note: 'Set DCC_NETWORK_ADMIN_ENABLED=true',
  },
  {
    title: 'Network graph (context)',
    description: 'Consent, readiness metadata, and relationship graph for DCC network pilot.',
    href: '/network/admin',
    note: 'Admin env required',
  },
] as const

const docs = [
  { label: 'Evidence pack (architecture + interview script)', href: 'https://github.com/moisestech/infra24/blob/main/docs/APPLIED_AI_ENGINEER_EVIDENCE.md' },
  { label: 'Gap map & build plan', href: 'https://github.com/moisestech/infra24/blob/main/docs/APPLIED_AI_GAP_MAP.md' },
  { label: '8-min interview demo script', href: 'https://github.com/moisestech/infra24/blob/main/docs/DCC_UNIFIED_DEMO_SCRIPT.md' },
  { label: 'Vercel env checklist', href: 'https://github.com/moisestech/infra24/blob/main/docs/VERCEL_DEMO_ENV_CHECKLIST.md' },
] as const

export default function AppliedAiEngineeringPage() {
  return (
    <>
      <PageHero
        eyebrow="Applied AI · Pilot"
        title="Infra24 applied AI engineering demos"
        description="Governed Memory Agent retrieval and approval-gated agent actions on DCC Miami infrastructure — for technical interviews and partner conversations. Career CV and role dossiers live on moises.tech."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-white dark:bg-neutral-950">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          This page is{' '}
          <span className="font-medium text-neutral-800 dark:text-neutral-200">unlisted in search</span>{' '}
          — share the URL directly with recruiters or interviewers. Not affiliated with employer
          applications unless noted on moises.tech opportunity pages.
        </p>
        <p className="mt-4 text-sm">
          <Link
            href="https://www.moises.tech/career-packet"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            moises.tech/career-packet
          </Link>
          {' · '}
          <Link
            href="https://www.moises.tech/ai-engineering"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            AI Engineering hub
          </Link>
        </p>
      </Section>

      <Section className="bg-[#fafafa] dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Live demos</h2>
        <ul className="mt-6 space-y-4">
          {demos.map((demo) => (
            <li
              key={demo.title}
              className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{demo.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {demo.description}
              </p>
              {'note' in demo && demo.note ? (
                <p className="mt-2 text-xs text-neutral-500">{demo.note}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link
                  href={demo.href}
                  className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
                >
                  Open demo
                </Link>
                {'secondaryHref' in demo && demo.secondaryHref ? (
                  <Link
                    href={demo.secondaryHref}
                    className="text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-400"
                  >
                    {demo.secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-white dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Documentation
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
          {docs.map((doc) => (
            <li key={doc.href}>
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
              >
                {doc.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-[#fafafa] pb-16 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Eval commands (local / CI)
        </h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100">
{`npm run sync:memory-agent-embeddings -- --org=dcc
npm run eval:memory-agent -- --org=dcc --report=reports/memory-agent-eval.json`}
        </pre>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Requires <code className="text-xs">OPENAI_API_KEY</code> and Supabase migration{' '}
          <code className="text-xs">20260711120000_memory_agent_embeddings_pgvector.sql</code>.
        </p>
      </Section>
    </>
  )
}

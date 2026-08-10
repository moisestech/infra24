'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/marketing/cdc/Breadcrumbs'
import { EraPill } from '@/components/era/EraPill'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import type { ProposedRelationshipAction } from '@/lib/network-builder/types'

const path = '/network/agent'

type RunSummary = {
  runId: string
  runAt: string
  source: string
  totalContacts: number
  networkReadyCount: number
  highPriorityCount: number
  proposedActions: ProposedRelationshipAction[]
  airtableWrite?: {
    written: number
    skipped: number
    errors: string[]
  }
}

export default function NetworkAgentPageClient() {
  const [busy, setBusy] = useState(false)
  const [writeApprovals, setWriteApprovals] = useState(false)
  const [summary, setSummary] = useState<RunSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runAgent = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/network-builder/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug: 'dcc', limit: 10, writeApprovals }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Run failed')
      setSummary(data.summary as RunSummary)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }, [writeApprovals])

  const crumbs = getCdcBreadcrumbs(path)

  return (
    <div className="bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <EraPill tone="onDark" className="mb-4" />
        {crumbs.length > 0 ? <Breadcrumbs items={crumbs} className="mb-6 text-neutral-400" /> : null}

        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Internal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Network Readiness Agent</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Score DCC CRM contacts, propose relationship actions, and optionally write to the Airtable Agent
            Approvals queue. Nothing sends automatically in the pilot.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            <Link href="/network/admin" className="text-[var(--cdc-teal)] underline-offset-4 hover:underline">
              Network graph
            </Link>
            {' · '}
            <span className="text-neutral-500">Setup: docs/network-builder/DCC_AGENT_APPROVALS_AIRTABLE_SETUP.md</span>
          </p>
        </header>

        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={writeApprovals}
              onChange={(e) => setWriteApprovals(e.target.checked)}
              className="rounded border-neutral-600"
            />
            Write to Airtable Agent Approvals (live CRM required)
          </label>
          <Button disabled={busy} onClick={runAgent}>
            {busy ? 'Running…' : 'Run network readiness'}
          </Button>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>
        ) : null}

        {summary ? (
          <div className="mt-8 space-y-6">
            <div className="grid gap-3 text-sm sm:grid-cols-4">
              <Stat label="Contacts" value={summary.totalContacts} />
              <Stat label="Network ready" value={summary.networkReadyCount} />
              <Stat label="High priority" value={summary.highPriorityCount} />
              <Stat label="Proposed" value={summary.proposedActions.length} />
            </div>
            <p className="text-xs text-neutral-500">
              Run {summary.runId} · {summary.source} · {new Date(summary.runAt).toLocaleString()}
              {summary.airtableWrite
                ? ` · Airtable: ${summary.airtableWrite.written} written, ${summary.airtableWrite.skipped} skipped`
                : null}
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-800">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-neutral-800 bg-neutral-900/80 text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-3 py-2">Contact</th>
                    <th className="px-3 py-2">Action</th>
                    <th className="px-3 py-2">Readiness</th>
                    <th className="px-3 py-2">Risk</th>
                    <th className="px-3 py-2">Draft preview</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.proposedActions.map((action) => (
                    <tr key={action.id} className="border-b border-neutral-800/80 align-top">
                      <td className="px-3 py-2 font-medium text-white">{action.contactName}</td>
                      <td className="px-3 py-2 text-neutral-300">{action.actionType.replace(/_/g, ' ')}</td>
                      <td className="px-3 py-2 text-neutral-400">{action.readinessPercent}%</td>
                      <td className="px-3 py-2 text-neutral-400">{action.riskLevel}</td>
                      <td className="max-w-md px-3 py-2 text-xs text-neutral-500 whitespace-pre-wrap">
                        {action.proposedMessage.slice(0, 280)}
                        {action.proposedMessage.length > 280 ? '…' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-neutral-400">
              Approve or reject in Airtable → Agent Approvals table. See{' '}
              <code className="text-xs">docs/network-builder/DCC_AGENT_APPROVALS_AIRTABLE_SETUP.md</code>.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

import { NextResponse } from 'next/server'

import { runNetworkReadinessAgent } from '@/lib/network-builder/run-network-readiness'
import { isNetworkBuilderConfigured } from '@/lib/network-builder/org-config'

export const dynamic = 'force-dynamic'

type RunBody = {
  orgSlug?: string
  limit?: number
  writeApprovals?: boolean
}

export async function POST(request: Request) {
  if (process.env.DCC_NETWORK_ADMIN_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Network agent admin is disabled' }, { status: 404 })
  }

  let body: RunBody = {}
  try {
    body = (await request.json()) as RunBody
  } catch {
    body = {}
  }

  const orgSlug = (body.orgSlug ?? 'dcc').trim().toLowerCase()
  const limit = typeof body.limit === 'number' ? body.limit : 10
  const writeApprovals = body.writeApprovals === true

  if (!isNetworkBuilderConfigured(orgSlug)) {
    return NextResponse.json(
      {
        error: `Network Builder not configured for "${orgSlug}". See docs/network-builder/DCC_AGENT_APPROVALS_AIRTABLE_SETUP.md`,
      },
      { status: 503 }
    )
  }

  try {
    const summary = await runNetworkReadinessAgent({
      orgSlug,
      limit,
      writeApprovals,
      persistToSupabase: writeApprovals,
      includeFixture: !writeApprovals,
    })

    return NextResponse.json({
      ok: true,
      summary: {
        runId: summary.runId,
        runAt: summary.runAt,
        source: summary.source,
        totalContacts: summary.totalContacts,
        networkReadyCount: summary.networkReadyCount,
        highPriorityCount: summary.highPriorityCount,
        proposedActions: summary.proposedActions,
        airtableWrite: summary.airtableWrite,
        reportMarkdown: summary.reportMarkdown,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  const orgSlug = 'dcc'
  return NextResponse.json({
    configured: isNetworkBuilderConfigured(orgSlug),
    adminEnabled: process.env.DCC_NETWORK_ADMIN_ENABLED === 'true',
    orgSlug,
  })
}

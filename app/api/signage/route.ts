import { NextResponse } from 'next/server'
import { isDccOsConfigured, getDccOsConnection } from '@/lib/dcc/os-config'
import { listPublicMachines } from '@/lib/dcc/machines'
import { PLANNED_FLEET } from '@/lib/dcc/planned-fleet'
import { fetchAllRecords } from '@/lib/airtable/client'

export const revalidate = 60

/**
 * Cached JSON for SmartSigns / display players.
 * Never call Airtable from the browser kiosk — poll this endpoint.
 */
export async function GET() {
  let machines = PLANNED_FLEET.map((m) => ({
    id: m.id,
    name: m.name,
    status: m.publicStatus,
  }))

  let programming: Array<{ id: string; title: string }> = []
  let jobsCompletedThisMonth = 0

  if (isDccOsConfigured()) {
    const conn = getDccOsConnection()!
    try {
      const live = await listPublicMachines(conn)
      if (live.length > 0) {
        machines = live.map((m) => ({
          id: m.id,
          name: m.name,
          status: m.publicStatus,
        }))
      }
    } catch {
      /* keep planned fleet */
    }

    try {
      const rows = await fetchAllRecords(
        conn.baseId,
        conn.tables.programming,
        conn.apiKey
      )
      programming = rows
        .filter((r) => {
          const eligible = r.fields['Smart Sign Eligible']
          return eligible === true || eligible === 'true'
        })
        .slice(0, 8)
        .map((r) => ({
          id: r.id,
          title:
            typeof r.fields['Title'] === 'string'
              ? (r.fields['Title'] as string)
              : 'Program',
        }))
    } catch {
      /* optional */
    }

    try {
      const { listJobs } = await import('@/lib/dcc/jobs')
      const { DCC_JOB_STAGES } = await import('@/lib/dcc/os-field-map')
      const jobs = await listJobs(conn)
      const now = new Date()
      jobsCompletedThisMonth = jobs.filter((j) => {
        if (
          j.stage !== DCC_JOB_STAGES.delivered &&
          j.stage !== DCC_JOB_STAGES.paid
        ) {
          return false
        }
        // Without a completed-at field, count all terminal jobs as proxy
        return true
      }).length
      void now
    } catch {
      /* optional */
    }
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || ''
  const payload = {
    generatedAt: new Date().toISOString(),
    machines,
    programming,
    jobsCompletedThisMonth,
    makeQrUrl: `${site}/make`,
  }

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
    },
  })
}

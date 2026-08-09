import { isDccOsConfigured } from '@/lib/dcc/os-config'
import { listJobs } from '@/lib/dcc/jobs'
import { listTransactions, monthlyRevenue, sumCashAvailable } from '@/lib/dcc/transactions'
import { impactMultiplier, listCredits } from '@/lib/dcc/credits'
import { listMbos } from '@/lib/dcc/mbos'
import { DCC_JOB_STAGES } from '@/lib/dcc/os-field-map'

export type CeoScorecardData = {
  configured: boolean
  error?: string
  cashAvailable: number
  monthlyRevenue: number
  priorMonthRevenue: number
  revenueGrowthPct: number | null
  pipelineByStage: Array<{ stage: string; count: number; value: number }>
  impactMultiplier: number | null
  mbos: Array<{ name: string; progress: number; target: number; pct: number }>
  artistsServedHint: string
}

export async function loadCeoScorecard(): Promise<CeoScorecardData> {
  if (!isDccOsConfigured()) {
    return {
      configured: false,
      cashAvailable: 0,
      monthlyRevenue: 0,
      priorMonthRevenue: 0,
      revenueGrowthPct: null,
      pipelineByStage: [],
      impactMultiplier: null,
      mbos: [],
      artistsServedHint: 'Configure DCC OS to load KPIs.',
    }
  }

  try {
    const [txs, jobs, credits, mbos] = await Promise.all([
      listTransactions(),
      listJobs(),
      listCredits(),
      listMbos(),
    ])

    const now = new Date()
    const y = now.getUTCFullYear()
    const m = now.getUTCMonth() + 1
    const priorM = m === 1 ? 12 : m - 1
    const priorY = m === 1 ? y - 1 : y
    const monthRev = monthlyRevenue(txs, y, m)
    const priorRev = monthlyRevenue(txs, priorY, priorM)
    const growth =
      priorRev > 0 ? ((monthRev - priorRev) / priorRev) * 100 : monthRev > 0 ? 100 : null

    const stageOrder = Object.values(DCC_JOB_STAGES)
    const byStage = new Map<string, { count: number; value: number }>()
    for (const stage of stageOrder) byStage.set(stage, { count: 0, value: 0 })
    for (const job of jobs) {
      const bucket = byStage.get(job.stage) ?? { count: 0, value: 0 }
      bucket.count += 1
      bucket.value += job.quoteAmount ?? 0
      byStage.set(job.stage, bucket)
    }

    return {
      configured: true,
      cashAvailable: sumCashAvailable(txs),
      monthlyRevenue: monthRev,
      priorMonthRevenue: priorRev,
      revenueGrowthPct: growth,
      pipelineByStage: [...byStage.entries()].map(([stage, v]) => ({
        stage,
        count: v.count,
        value: v.value,
      })),
      impactMultiplier: impactMultiplier(credits),
      mbos: mbos.map((mbo) => ({
        name: mbo.name,
        progress: mbo.progress,
        target: mbo.target,
        pct: mbo.target > 0 ? Math.min(100, (mbo.progress / mbo.target) * 100) : 0,
      })),
      artistsServedHint:
        'Distinct People with Delivered/Paid jobs — refine when People joins are wired.',
    }
  } catch (e) {
    return {
      configured: true,
      error: e instanceof Error ? e.message : 'Failed to load scorecard',
      cashAvailable: 0,
      monthlyRevenue: 0,
      priorMonthRevenue: 0,
      revenueGrowthPct: null,
      pipelineByStage: [],
      impactMultiplier: null,
      mbos: [],
      artistsServedHint: '',
    }
  }
}

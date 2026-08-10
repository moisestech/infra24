import { createClient } from '@/lib/supabase/server'
import { insertGeneratedAsset } from '@/lib/memory-agent/memory-agent-generated-assets-repo'
import type { NetworkReadinessRunSummary } from '@/lib/network-builder/types'

export async function persistNetworkReportAsset(
  summary: NetworkReadinessRunSummary
): Promise<{ assetId?: string; error?: string }> {
  if (!summary.reportMarkdown?.trim()) {
    return { error: 'No report markdown' }
  }

  const supabase = createClient()
  const slug = summary.orgSlug.trim().toLowerCase()

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (!org?.id) {
    return { error: `Organization not found for slug "${slug}"`}
  }

  const weekOf = new Date(summary.runAt).toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
  })

  const { data, error } = await insertGeneratedAsset(supabase, {
    organizationId: org.id,
    organizationSlug: slug,
    type: 'staff_brief',
    channel: 'report',
    status: 'draft',
    visibility: 'internal',
    title: `DCC Network Readiness — week of ${weekOf}`,
    summary: `${summary.networkReadyCount}/${summary.totalContacts} network-ready · ${summary.proposedActions.length} proposed actions`,
    body: summary.reportMarkdown,
    sourceQuestion: `Network readiness run ${summary.runId ?? summary.runAt}`,
    metadata: {
      runId: summary.runId,
      goal: summary.goal,
      source: summary.source,
    },
  })

  if (error) return { error: error.message }
  return { assetId: data?.id }
}

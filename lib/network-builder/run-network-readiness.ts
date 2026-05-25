import { randomBytes } from 'crypto'
import { writeFileSync } from 'fs'
import { generateRelationshipActions } from '@/lib/network-builder/actions'
import { DCC_NETWORK_GOAL_DEFAULTS } from '@/lib/network-builder/field-map'
import { generateDccNetworkReport } from '@/lib/network-builder/generate-report'
import { getNetworkBuilderConnection } from '@/lib/network-builder/org-config'
import {
  getFixtureNetworkContacts,
  readNetworkContacts,
} from '@/lib/network-builder/read-contacts'
import {
  detectMissingFields,
  detectStaleRelationships,
  rankPriorityContacts,
  scoreAllContacts,
  summarizeReadiness,
} from '@/lib/network-builder/readiness'
import { persistNetworkRun } from '@/lib/network-builder/supabase-repo'
import type { NetworkReadinessRunOptions, NetworkReadinessRunSummary } from '@/lib/network-builder/types'
import { writeActionsToAirtable } from '@/lib/network-builder/write-approvals'

function generateRunId(): string {
  return `run_${randomBytes(8).toString('hex')}`
}

/** Run the Network Readiness Agent (read → score → rank → propose → optional write). */
export async function runNetworkReadinessAgent(
  options: NetworkReadinessRunOptions
): Promise<NetworkReadinessRunSummary> {
  const {
    orgSlug,
    limit = 25,
    staleDays = DCC_NETWORK_GOAL_DEFAULTS.defaultStaleDays,
    readinessThreshold = DCC_NETWORK_GOAL_DEFAULTS.readinessThreshold,
    includeFixture = true,
    writeApprovals = false,
    persistToSupabase = writeApprovals,
    reportOutPath,
  } = options

  const conn = getNetworkBuilderConnection(orgSlug)
  let contacts
  let source: 'airtable' | 'fixture' = 'airtable'

  if (conn) {
    const result = await readNetworkContacts(conn)
    contacts = result.contacts
  } else if (includeFixture) {
    contacts = getFixtureNetworkContacts()
    source = 'fixture'
  } else {
    throw new Error(
      `Network Builder not configured for org "${orgSlug}". Set AIRTABLE_DCC_CRM_* env vars.`
    )
  }

  if (writeApprovals && source === 'fixture') {
    throw new Error(
      'Cannot write approvals using fixture data. Configure AIRTABLE_DCC_CRM_* for live INFRA24 Airtable.'
    )
  }

  const scores = scoreAllContacts(contacts, { staleDays, readinessThreshold })
  const summaryStats = summarizeReadiness(scores)
  const ranked = rankPriorityContacts(scores, limit * 2)
  const contactsById = new Map(contacts.map((c) => [c.recordId, c]))
  const proposedActions = generateRelationshipActions(ranked, contactsById, limit)
  const missingFieldCounts = Object.fromEntries(detectMissingFields(scores))

  const topIncomplete = [...scores]
    .filter((s) => !s.networkReady)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 10)

  const runId = generateRunId()

  const result: NetworkReadinessRunSummary = {
    orgSlug,
    goal: 'network_readiness',
    runAt: new Date().toISOString(),
    source,
    totalContacts: summaryStats.totalContacts,
    networkReadyCount: summaryStats.networkReadyCount,
    incompleteCount: summaryStats.incompleteCount,
    staleCount: summaryStats.staleCount,
    highPriorityCount: summaryStats.highPriorityCount,
    artistSegmentCount: summaryStats.artistSegmentCount,
    networkReadyArtistCount: summaryStats.networkReadyArtistCount,
    proposedActions,
    topIncomplete,
    runId,
  }

  result.reportMarkdown = generateDccNetworkReport({
    summary: result,
    missingFieldCounts,
    readinessThreshold,
  })

  if (reportOutPath) {
    writeFileSync(reportOutPath, result.reportMarkdown, 'utf8')
  }

  if (writeApprovals && conn) {
    const airtableWrite = await writeActionsToAirtable({
      conn,
      actions: proposedActions,
      runId,
    })
    result.airtableWrite = {
      written: airtableWrite.written,
      skipped: airtableWrite.skipped,
      errors: airtableWrite.errors,
    }

    if (persistToSupabase) {
      try {
        const persisted = await persistNetworkRun({
          orgSlug,
          goalLoop: 'network_readiness',
          source,
          summary: {
            ...summaryStats,
            missingFieldCounts,
            staleRelationships: detectStaleRelationships(scores).length,
            readinessThreshold,
            staleDays,
            goalId: DCC_NETWORK_GOAL_DEFAULTS.goalId,
          },
          actions: proposedActions,
          airtableWrite,
        })
        result.supabasePersisted = Boolean(persisted)
        if (persisted) result.runId = persisted.runId
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        result.airtableWrite.errors.push(`Supabase persist: ${msg}`)
      }
    }
  }

  return result
}

/** Short text summary for CLI (full markdown via generateDccNetworkReport). */
export function formatNetworkReadinessReport(summary: NetworkReadinessRunSummary): string {
  if (summary.reportMarkdown) {
    return summary.reportMarkdown
  }
  return generateDccNetworkReport({ summary })
}

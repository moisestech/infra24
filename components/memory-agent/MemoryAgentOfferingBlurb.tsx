'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

/**
 * Short product narrative for leadership / partners (reusable across orgs).
 */
export function MemoryAgentOfferingBlurb({ orgName }: { orgName: string }) {
  return (
    <Card className={ma.card}>
      <CardContent className={cn('space-y-2 p-4', ma.bodyMuted)}>
        <p className={cn('font-medium', ma.body)}>Agentic institutional memory</p>
        <p>
          This prototype turns {orgName}&apos;s Airtable alumni records into a conversational,
          source-backed assistant: retrieval, reasoning, artist cards, and optional voice
          readout. Airtable remains the source of truth; production would add sync jobs,
          auth, and governance workflows.
        </p>
      </CardContent>
    </Card>
  )
}

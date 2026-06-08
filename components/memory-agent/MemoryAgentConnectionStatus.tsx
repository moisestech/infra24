'use client'

import { Badge } from '@/components/ui/badge'
import type { MemoryAgentStatusPayload } from '@/types/memory-agent'

export function MemoryAgentConnectionStatus({ status }: { status: MemoryAgentStatusPayload }) {
  const g = status.governance?.fields

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant={status.dataConfigured ? 'default' : 'secondary'}>Airtable</Badge>
        <Badge variant={status.openaiConfigured ? 'default' : 'secondary'}>OpenAI</Badge>
        <Badge variant={status.elevenLabsConfigured ? 'default' : 'secondary'}>Voice (TTS)</Badge>
        {status.airtableProgrammingConfigured ? (
          <Badge variant="outline">Programming (Airtable)</Badge>
        ) : null}
        {status.questionLoggingConfigured ? (
          <Badge variant="outline">Question logs</Badge>
        ) : null}
      </div>
      {typeof status.airtableProgrammingRecords === 'number' ? (
        <p className="text-xs text-muted-foreground">
          Programming records found: {status.airtableProgrammingRecords}
          {!status.airtableProgrammingConfigured ? (
            <span className="text-amber-700 dark:text-amber-400">
              {' '}
              (env not set — count may be 0)
            </span>
          ) : null}
        </p>
      ) : null}
      {status.governance?.publicModeRule ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{status.governance.publicModeRule}</p>
      ) : null}
      {g && (g.doNotUseInAi || g.approvedForPublicAi || g.visibilityLevel || g.publicBio) ? (
        <p className="text-[10px] text-muted-foreground">
          Mapped columns:{' '}
          {[
            g.doNotUseInAi && 'do-not-use',
            g.approvedForPublicAi && 'approved-for-public',
            g.visibilityLevel && 'visibility',
            g.publicBio && 'public bio',
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      ) : null}
    </div>
  )
}

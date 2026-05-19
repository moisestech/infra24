import type { ProspectConfig } from '@/lib/ask-the-place/types'
import { PublicOutputCard } from './PublicOutputCard'
import { StaffBriefCard } from './StaffBriefCard'
import { LeadershipInsightCard } from './LeadershipInsightCard'

type OutputPanelProps = {
  config: ProspectConfig
  publicBody: string
  staffBody: string
  leadershipBody: string
}

export function OutputPanel({ config, publicBody, staffBody, leadershipBody }: OutputPanelProps) {
  return (
    <div className="space-y-3">
      <PublicOutputCard title={config.outputs.publicLabel} body={publicBody} />
      <StaffBriefCard title={config.outputs.staffLabel} body={staffBody} />
      <LeadershipInsightCard title={config.outputs.leadershipLabel} body={leadershipBody} />
    </div>
  )
}

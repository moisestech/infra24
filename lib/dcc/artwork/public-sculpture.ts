import type { AtlasProfile } from '@/lib/dcc/community/atlas'

/** Public allowlist only. A private membership row is NEVER a graph profile. */
export type PublicSculptureData = {
  mode: 'preview' | 'live'
  profiles: AtlasProfile[]
  intakeEnabled?: boolean
  websitePresence: {
    status: 'not_published' | 'suppressed' | 'coarsened'
    markCount: number
    snapshotWeek: string | null
  }
  reportedWhatsAppMembershipIsSeparate: true
  pollSelectionsAreSeparate: true
}

/** A reviewed weekly count-only artifact; dots are NOT stable member IDs. */
export function safeWebsitePresenceSnapshot(row: unknown): PublicSculptureData['websitePresence'] {
  if (!row || typeof row !== 'object') return { status:'not_published',markCount:0,snapshotWeek:null }
  const obj=row as Record<string,unknown>
  if (typeof obj.snapshot_week!=='string'|| !/^\d{4}-W\d{2}$/.test(obj.snapshot_week)) {
    return { status:'not_published',markCount:0,snapshotWeek:null }
  }
  if (obj.cohort_state==='suppressed' && obj.website_presence_marks===null) {
    return { status:'suppressed',markCount:0,snapshotWeek:obj.snapshot_week }
  }
  const count=obj.website_presence_marks
  if (obj.cohort_state==='coarsened' && typeof count==='number' &&
    Number.isSafeInteger(count) && count>=5 && count<=1024 && count%5===0) {
    return {status:'coarsened',markCount:count,snapshotWeek:obj.snapshot_week}
  }
  return {status:'not_published',markCount:0,snapshotWeek:null}
}

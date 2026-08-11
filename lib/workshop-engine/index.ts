export type {
  SafetyLevel,
  PaceMode,
  SessionStatus,
  TvScreen,
  ReadinessResult,
  Activity,
  KnowledgeCheck,
  BookletReference,
  ModuleBanner,
  ModuleTutorialVideo,
  WorkshopModule,
  WorkshopResource,
  Workshop,
  VenueConfig,
  WorkshopLiveSession,
  ParticipantProgress,
} from '@/lib/workshop-engine/types'

export { generateJoinCode, normalizeJoinCode } from '@/lib/workshop-engine/join-code'

export {
  createLiveSession,
  getLiveSessionByCode,
  patchLiveSession,
} from '@/lib/workshop-engine/session-store'

export { TEACHING_SECTION_ROLES } from '@/lib/workshop-engine/section-roles'
export type { TeachingSectionRole } from '@/lib/workshop-engine/section-roles'

export * from '@/lib/workshop-engine/resin-printing'

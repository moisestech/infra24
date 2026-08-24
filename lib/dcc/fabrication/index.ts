export {
  FABRICATION_RATE_CARDS,
  FABRICATION_RUSH_DEFAULT,
  RESIN_QUOTE_FORMULA_NOTE,
  getFabricationRateCard,
} from '@/lib/dcc/fabrication/rates'
export type {
  FabricationRateCard,
  FabricationRateTierId,
} from '@/lib/dcc/fabrication/rates'

export {
  estimateQuote,
  formatUsd,
  PLANNING_ESTIMATE_SEED,
  buildPlanningEstimateNote,
  buildQuoteHandoffHref,
} from '@/lib/dcc/fabrication/estimate'
export type {
  EstimateBreakdown,
  EstimateQuoteInput,
} from '@/lib/dcc/fabrication/estimate'

export { FABRICATION_QUOTE_EXAMPLES } from '@/lib/dcc/fabrication/examples'
export type { QuoteExample, QuoteExampleLine } from '@/lib/dcc/fabrication/examples'

export {
  FABRICATION_FINISH_LEVELS,
  getFinishLevel,
} from '@/lib/dcc/fabrication/finishes'
export type {
  FabricationFinishLevel,
  FinishLevelId,
} from '@/lib/dcc/fabrication/finishes'

export { FABRICATION_SERVICE_LANES } from '@/lib/dcc/fabrication/lanes'
export type {
  FabricationServiceLane,
  ServiceLaneId,
} from '@/lib/dcc/fabrication/lanes'

export {
  FABRICATION_QUEUE_TIERS,
  rushPercentageForQueue,
  getFabricationQueueTier,
} from '@/lib/dcc/fabrication/queue'
export type {
  FabricationQueueTier,
  QueueTierId,
} from '@/lib/dcc/fabrication/queue'

export {
  FABRICATION_POLICIES,
  FABRICATION_PROMISE,
  FABRICATION_CRAFTCLOUD_NOTE,
  FABRICATION_WORKSHOP_BOUNDARY,
} from '@/lib/dcc/fabrication/policies'
export type { FabricationPolicy } from '@/lib/dcc/fabrication/policies'

export {
  FABRICATION_COLOR_TOKENS,
  getFabricationColor,
} from '@/lib/dcc/fabrication/theme'
export type {
  FabricationColorClasses,
  FabricationColorTokenId,
} from '@/lib/dcc/fabrication/theme'

export {
  FABRICATION_SECTION_MEDIA,
  FABRICATION_FINISHES_STANDIN_SRC,
  FABRICATION_PLANNING_STANDIN_SRC,
  FABRICATION_MEDIA_DROP_PATH,
  FABRICATION_CONCEPTUAL_CAPTION,
  getFabricationSectionMedia,
  resolveFabricationSectionMedia,
} from '@/lib/dcc/fabrication/section-media'
export type {
  FabricationSectionMedia,
  FabricationSectionMediaId,
  FabricationMediaKind,
} from '@/lib/dcc/fabrication/section-media'

export { isFabricationRecordPublic } from '@/lib/dcc/fabrication/privacy'
export type {
  FabricationPublicBoundary,
  FabricationSourceType,
} from '@/lib/dcc/fabrication/privacy'

export {
  CAPABILITY_STAGE_META,
  FABRICATION_CAPABILITIES,
  getCapabilityStageMeta,
  getPublicCapability,
  listPublicCapabilities,
} from '@/lib/dcc/fabrication/capabilities'
export type {
  CapabilityStage,
  FabricationCapability,
} from '@/lib/dcc/fabrication/capabilities'

export {
  FABRICATION_FIELD_TESTS,
  getPublicFieldTest,
  listPublicFieldTests,
  listPublicFieldTestsForCapability,
} from '@/lib/dcc/fabrication/field-tests'
export type {
  FieldTest,
  FieldTestStatus,
  PublicFieldTest,
} from '@/lib/dcc/fabrication/field-tests'

export {
  FABRICATION_PROJECTS,
  getPublicProject,
  listPublicProjects,
  projectEconomics,
} from '@/lib/dcc/fabrication/projects'
export type {
  FabricationProject,
  FabricationProjectKind,
} from '@/lib/dcc/fabrication/projects'

export {
  FABRICATION_CAPITAL_GATES,
  FABRICATION_NINETY_DAY_MBO,
  FABRICATION_SCALEUP_THESIS,
  FABRICATION_WHAT_EXISTS,
  FABRICATION_WHAT_WE_TEST,
  getFabricationPublicMetrics,
} from '@/lib/dcc/fabrication/metrics'

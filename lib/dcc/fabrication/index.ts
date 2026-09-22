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

export {
  STUDIO_SERVICES,
  PROJECT_STAGES,
  getStudioService,
  getStudioServiceBySlug,
  suggestStudioService,
  projectStageFromLaneParam,
} from '@/lib/dcc/fabrication/studio-services'
export type {
  StudioService,
  StudioServiceId,
  ProjectStageId,
} from '@/lib/dcc/fabrication/studio-services'

export {
  FABRICATION_JOB_STATUSES,
  FABRICATION_JOB_STATUS_LABELS,
  clientFacingJobStatus,
} from '@/lib/dcc/fabrication/job-status'
export type { FabricationJobStatus } from '@/lib/dcc/fabrication/job-status'

export {
  DEFAULT_DOCUMENTATION_RIGHTS,
  DEFAULT_CLIENT_OWNERSHIP,
  PRICE_REFERENCE_DISCLAIMER,
} from '@/lib/dcc/fabrication/schema'
export type {
  Material,
  Machine,
  Operator,
  FabricationJob,
  ClientProposal,
  CostLineItem,
  DocumentationRights,
  PrototypeFindings,
  ProposalMediaSlot,
  ProposalPricing,
  QuoteEconomics,
  QuoteLineItem,
} from '@/lib/dcc/fabrication/schema'

export {
  MACHINE_HOURLY_USD,
  OPERATOR_HOURLY_USD,
  FOUNDER_MARGIN_WARNING_USD,
} from '@/lib/dcc/fabrication/economics-defaults'

export {
  calculateQuoteEconomics,
  estimatePaymentFee,
  sumCostLineItems,
  sumQuoteLineAmounts,
} from '@/lib/dcc/fabrication/quote-economics'

export {
  clientPricingViewLeaksInternal,
  getClientVisibleQuoteLines,
  serializeClientPricingView,
} from '@/lib/dcc/fabrication/client-quote-view'

export {
  FABRICATION_MATERIALS,
  getMaterial,
  materialPriceLabel,
} from '@/lib/dcc/fabrication/materials'

export {
  FABRICATION_MACHINES,
  getMachineCatalogEntry,
  machineAccessLabel,
} from '@/lib/dcc/fabrication/machines-catalog'

export {
  FABRICATION_OPERATORS,
  getOperator,
  publicOperatorName,
} from '@/lib/dcc/fabrication/operators'

export {
  CLIENT_PROPOSALS,
  getClientProposal,
  listProposalSlugs,
  proposalGreetingName,
  HEATHER_PROPOSAL,
  HEATHER_BASELINE_SLICE,
  HEATHER_LIGHTING_HARDWARE,
  HEATHER_CLIENT_MATERIAL_OUTLAY_USD,
  HEATHER_COST_LINE_ITEMS,
  HEATHER_DEFAULT_COST_INPUTS,
  HEATHER_DEFAULT_FOUNDER_HOURS,
  HEATHER_QUOTE_LINE_ITEMS,
  HEATHER_QUOTE_TOTAL_USD,
  buildHeatherCostLineItems,
  CAROL_PROPOSAL,
} from '@/lib/dcc/fabrication/proposals'

export {
  fabricateStartRequestSchema,
  FABRICATE_START_NOTES_PREFIX,
} from '@/lib/dcc/fabrication/start-schema'
export type { FabricateStartRequest, ObjectIntent } from '@/lib/dcc/fabrication/start-schema'

/**
 * Fabrication OS domain types.
 * Independent of Airtable field ids. Schema: docs/dcc/FABRICATION-OS-SCHEMA.md.
 */

export const DCC_ROLES = [
  'Client',
  'Student',
  'Fabricator',
  'Instructor',
  'Estimator',
  'Operator',
  'Collaborator',
  'Institutional Contact',
] as const

export type DccRole = (typeof DCC_ROLES)[number]

export const PUBLIC_PROFILE_CONSENTS = [
  'Public Listing OK',
  'Ask Before Publishing',
  'Do Not Publish',
] as const

export type PublicProfileConsent = (typeof PUBLIC_PROFILE_CONSENTS)[number]

export type PersonRef = {
  id: string
  fullName: string
  email?: string
  phone?: string
  city?: string
  neighborhood?: string
  roles: readonly DccRole[]
  clerkUserId?: string
  publicProfileConsent?: PublicProfileConsent
  /** CRM notes. Never place on a public or client DTO. */
  crmNotes?: string
}

/** Optional login. Most People have none. */
export type AuthLink = {
  personId: string
  clerkUserId?: string
}

export const COURSE_STATUSES = [
  'Pilot',
  'Coming',
  'In Development',
  'Retired',
] as const

export type CourseStatus = (typeof COURSE_STATUSES)[number]

export type CourseRef = {
  slug: string
  title: string
  gitPath?: string
  status: CourseStatus
  summary?: string
}

export const SESSION_VISIBILITIES = [
  'Public',
  'Private',
  'Institutional',
  'Internal',
] as const

export type SessionVisibility = (typeof SESSION_VISIBILITIES)[number]

export const REGISTRATION_STATUSES = [
  'Draft',
  'Open',
  'Closed',
  'Cancelled',
] as const

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number]

export const PAYMENT_POLICIES = [
  'Prepaid Checkout',
  'Invoice',
  'Free',
  'Waived',
  'Custom',
] as const

export type PaymentPolicy = (typeof PAYMENT_POLICIES)[number]

export const SESSION_KINDS = [
  'Public Class',
  'Private Class',
  'Partner Workshop',
  'Institutional',
  'Operator Onboarding',
  'Certification',
  'Internal Training',
] as const

export type SessionKind = (typeof SESSION_KINDS)[number]

export type ClassSession = {
  id: string
  courseSlug: string
  start: string
  end: string
  timezone: string
  instructorIds: readonly string[]
  venueId?: string
  partnerInstitutionId?: string
  capacity?: number
  visibility: SessionVisibility
  registrationStatus: RegistrationStatus
  price?: number
  paymentPolicy: PaymentPolicy
  prerequisiteSlugs: readonly string[]
  equipmentNotes?: string
  machineIds: readonly string[]
  sessionKind: SessionKind
  notes?: string
}

export const ENROLLMENT_STATUSES = [
  'Interested',
  'Registered',
  'Payment Pending',
  'Confirmed',
  'Attended',
  'Completed',
  'No Show',
  'Cancelled',
  'Refunded',
] as const

export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number]

export const ATTENDANCE_MARKS = ['Absent', 'Partial', 'Present'] as const

export type AttendanceMark = (typeof ATTENDANCE_MARKS)[number]

export type Enrollment = {
  id: string
  personId: string
  sessionId: string
  registeredAt?: string
  status: EnrollmentStatus
  amountExpected?: number
  amountPaid?: number
  scholarship: boolean
  waiver: boolean
  source?: string
  attendance?: AttendanceMark
  completion: boolean
  verifiedById?: string
  notes?: string
  paymentReferenceIds: readonly string[]
}

export const COMPETENCY_KINDS = ['Skill', 'Process', 'Machine'] as const

export type CompetencyKind = (typeof COMPETENCY_KINDS)[number]

export type CompetencyDefinition = {
  id: string
  name: string
  kind: CompetencyKind
  courseSlug?: string
  machineId?: string
  description?: string
  active: boolean
}

export const COMPETENCY_LEVELS = [
  'Learner',
  'Assisted',
  'Verified',
  'Active Fabricator',
] as const

export type CompetencyLevel = (typeof COMPETENCY_LEVELS)[number]

export const COMPETENCY_STATUSES = [
  'Active',
  'Inactive',
  'Needs Reverification',
] as const

export type CompetencyStatus = (typeof COMPETENCY_STATUSES)[number]

export type PersonCompetency = {
  id: string
  personId: string
  competencyId: string
  level: CompetencyLevel
  status: CompetencyStatus
  sourceSessionId?: string
  evidence?: string
  verifiedById?: string
  verifiedAt?: string
  reviewDue?: string
  notes?: string
}

export const FABRICATOR_AVAILABILITY = [
  'Available',
  'Limited',
  'Unavailable',
  'Hidden',
] as const

export type FabricatorAvailability = (typeof FABRICATOR_AVAILABILITY)[number]

export const FABRICATOR_PROFILE_STATUSES = [
  'Draft',
  'Opted In',
  'Approved',
  'Unpublished',
] as const

export type FabricatorProfileStatus =
  (typeof FABRICATOR_PROFILE_STATUSES)[number]

export type FabricatorProfile = {
  id: string
  personId: string
  publicName: string
  slug: string
  portraitUrl?: string
  shortBio?: string
  areaId?: string
  neighborhood?: string
  processes: readonly string[]
  software: readonly string[]
  availability: FabricatorAvailability
  profileStatus: FabricatorProfileStatus
  optedInAt?: string
  approvedById?: string
  approvedAt?: string
}

export const PORTFOLIO_VISIBILITIES = [
  'Private',
  'Client Approved',
  'Public',
] as const

export type PortfolioVisibility = (typeof PORTFOLIO_VISIBILITIES)[number]

export type PortfolioItem = {
  id: string
  personId: string
  title: string
  jobId?: string
  runIds: readonly string[]
  imageUrls: readonly string[]
  process?: string
  material?: string
  machineId?: string
  description?: string
  collaboratorIds: readonly string[]
  completedOn?: string
  visibility: PortfolioVisibility
  rightsNote?: string
  clientApproved: boolean
  featured: boolean
}

export const OPERATING_STAGES = [
  'New Inquiry',
  'Scoped',
  'Quoted',
  'Accepted',
  'Payment Pending',
  'Production Authorized',
  'Open for Fabrication',
  'Assigned / Claimed',
  'In Production',
  'Review / QC',
  'Ready',
  'Delivered',
  'Documented',
  'Closed',
] as const

export type MainOperatingStage = (typeof OPERATING_STAGES)[number]

export const OPERATING_STAGE_EXCEPTIONS = [
  'Declined',
  'Cancelled',
  'On Hold',
] as const

export type OperatingStageException = (typeof OPERATING_STAGE_EXCEPTIONS)[number]

export type OperatingStage = MainOperatingStage | OperatingStageException

export const CLIENT_JOB_PHASES = [
  'Quote / Approval',
  'Payment',
  'Production Queue',
  'Fabrication',
  'Quality Review',
  'Ready / Delivered',
] as const

export type ClientJobPhase = (typeof CLIENT_JOB_PHASES)[number]

export const PAYMENT_STATES = [
  'Not Required',
  'Pending',
  'Invoiced',
  'Partially Paid',
  'Paid',
  'Failed',
  'Refunded',
  'Waived',
  'Needs Reconciliation',
] as const

export type PaymentState = (typeof PAYMENT_STATES)[number]

export const QUOTE_LINE_CATEGORIES = [
  'preflight',
  'fabrication',
  'postprocess',
  'qa',
  'handoff',
  'other',
] as const

export type QuoteLineCategory = (typeof QUOTE_LINE_CATEGORIES)[number]

export type QuoteLine = {
  id: string
  jobId: string
  label: string
  description?: string
  category: QuoteLineCategory
  quantity: number
  unitAmount: number
  amount: number
  sort: number
}

export const COST_LINE_CATEGORIES = [
  'Materials',
  'Consumables',
  'Machine Allocation',
  'Fabrication Labor',
  'Finishing',
  'Shipping',
  'External Vendor',
  'Fabricator Compensation',
  'Other',
] as const

export type CostLineCategory = (typeof COST_LINE_CATEGORIES)[number]

export type CostLine = {
  id: string
  jobId: string
  label: string
  category: CostLineCategory
  quantity: number
  unitAmount: number
  amount: number
  notes?: string
}

export type FabricationJob = {
  id: string
  jobCode: string
  jobName: string
  projectTitle: string
  customerId: string
  institutionId?: string
  estimatorId?: string
  operatingStage: OperatingStage
  /** Stage restored when leaving On Hold. */
  heldStage?: MainOperatingStage
  tier?: 'Associate' | 'Public' | 'Commercial'
  serviceIds: readonly string[]
  /** Intended equipment. The queue reads Runs. */
  intendedMachineIds: readonly string[]
  scope?: string
  internalNotes?: string
  clientNotes?: string
  quantity?: number
  requestedDeadline?: string
  internalDeadline?: string
  materialSummary?: string
  processSummary?: string
  quoteAmount?: number
  paymentState: PaymentState
  documentationPermission: boolean
  portfolioPermission: boolean
  gitProposalSlug?: string
  fileReceived: boolean
  technicalReview: boolean
  materialConfirmation: boolean
  prototypeScoping: boolean
}

export const RUN_STATUSES = [
  'Ready',
  'Assigned',
  'Queued',
  'Printing',
  'Cooling / Curing',
  'Post Processing',
  'QC',
  'Complete',
  'Paused',
  'Failed',
  'Cancelled',
  'Reprint Required',
] as const

export type RunStatus = (typeof RUN_STATUSES)[number]

export const QC_STATES = ['Pending', 'Passed', 'Failed'] as const

export type QcState = (typeof QC_STATES)[number]

export type FabricationRun = {
  id: string
  jobId: string
  runNumber: number
  machineId?: string
  locationId?: string
  operatorId?: string
  bookingId?: string
  fileVersion?: string
  material?: string
  color?: string
  quantity?: number
  settingsRef?: string
  estimatedMinutes?: number
  startedAt?: string
  expectedCompletion?: string
  completedAt?: string
  status: RunStatus
  /** Active status restored when leaving Paused. */
  heldStatus?: RunStatus
  failureReason?: string
  reprintOfId?: string
  materialUsed?: string
  laborMinutes?: number
  qcState?: QcState
  notes?: string
  outputNote?: string
}

export const LOCATION_KINDS = ['Area', 'Machine Site', 'Class Venue'] as const

export type LocationKind = (typeof LOCATION_KINDS)[number]

export const LOCATION_VISIBILITIES = [
  'Internal',
  'Fabricator',
  'Public Label Only',
] as const

export type LocationVisibility = (typeof LOCATION_VISIBILITIES)[number]

export type Location = {
  id: string
  name: string
  kind: LocationKind
  publicLabel?: string
  address?: string
  neighborhood?: string
  city?: string
  visibility: LocationVisibility
  notes?: string
}

export const OWNER_KINDS = [
  'DCC-owned',
  'Partner-owned',
  'Fabricator-owned',
  'Other',
] as const

export type OwnerKind = (typeof OWNER_KINDS)[number]

export type Machine = {
  id: string
  name: string
  status: string
  buildVolume?: string
  materials?: string
  locationId?: string
  ownerId?: string
  ownerKind?: OwnerKind
  manufacturer?: string
  model?: string
  process?: string
  active: boolean
}

export const PAYMENT_PROVIDERS = [
  'QuickBooks',
  'Stripe',
  'Cash',
  'Zelle',
  'Venmo',
  'Partner Paid',
  'Waived',
  'Manual',
  'Other',
] as const

export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number]

export const RECONCILIATION_STATES = [
  'Unlinked',
  'Synced',
  'Needs Reconciliation',
  'Sync Error',
] as const

export type ReconciliationState = (typeof RECONCILIATION_STATES)[number]

export type PaymentReference = {
  id: string
  personId: string
  enrollmentId?: string
  jobId?: string
  provider: PaymentProvider
  providerExternalId?: string
  quickBooksCustomerId?: string
  quickBooksEstimateId?: string
  quickBooksInvoiceId?: string
  quickBooksSalesReceiptId?: string
  documentNumber?: string
  expectedAmount?: number
  paidAmount?: number
  balance?: number
  currency: 'USD'
  paymentState: PaymentState
  paidAt?: string
  refundAmount?: number
  reconciliation: ReconciliationState
  lastSyncedAt?: string
  syncError?: string
  notes?: string
}

export const COMPENSATION_MODELS = [
  'Flat Task',
  'Hourly Labor',
  'Fixed Project',
  'Revenue Share',
] as const

export type CompensationModel = (typeof COMPENSATION_MODELS)[number]

export const DEFAULT_COMPENSATION_MODEL: CompensationModel = 'Flat Task'

export const PAYOUT_STATES = [
  'Not Applicable',
  'Estimated',
  'Awaiting Approval',
  'Approved',
  'Payable',
  'Paid',
  'On Hold',
] as const

export type PayoutState = (typeof PAYOUT_STATES)[number]

export type Payout = {
  id: string
  personId: string
  jobId?: string
  runIds: readonly string[]
  model: CompensationModel
  rate?: number
  hoursOrQuantity?: number
  expectedAmount?: number
  approvedAmount?: number
  approvedById?: string
  state: PayoutState
  /** Stage restored when leaving On Hold. */
  heldState?: PayoutState
  quickBooksVendorId?: string
  quickBooksBillId?: string
  paidAt?: string
  notes?: string
}

export type ClientQuoteLineView = {
  label: string
  description?: string
  category: QuoteLineCategory
  quantity: number
  unitAmount: number
  amount: number
}

export type ClientJobView = {
  jobCode: string
  projectTitle: string
  phase: ClientJobPhase
  scope?: string
  clientNotes?: string
  materialSummary?: string
  processSummary?: string
  quantity?: number
  requestedDeadline?: string
  paymentState: PaymentState
  quoteLines: readonly ClientQuoteLineView[]
}

export type PublicFabricatorProfile = {
  publicName: string
  slug: string
  portraitUrl?: string
  shortBio?: string
  areaLabel?: string
  processes: readonly string[]
  software: readonly string[]
  verifiedCompetencies: readonly string[]
  availability?: Exclude<FabricatorAvailability, 'Hidden'>
}

export type TransitionResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string }

export function transitionOk<T>(value: T): TransitionResult<T> {
  return { ok: true, value }
}

export function transitionFail<T>(reason: string): TransitionResult<T> {
  return { ok: false, reason }
}

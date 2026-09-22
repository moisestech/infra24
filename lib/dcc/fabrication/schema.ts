import type { FabricationJobStatus } from '@/lib/dcc/fabrication/job-status'
import type { StudioServiceId } from '@/lib/dcc/fabrication/studio-services'

export type MaterialSupplyMode = 'client_supplied' | 'dcc_supplied' | 'pending'

export type MachineAccessStatus =
  | 'unconfirmed'
  | 'partner_access'
  | 'dcc_owned'
  | 'operator_owned'

export type PaymentStatus =
  | 'not_quoted'
  | 'unpaid'
  | 'deposit_due'
  | 'deposit_paid'
  | 'paid'

export type DocumentationRights = {
  internalProcessDocumentation: boolean
  publicClientName: boolean
  publicCADImages: boolean
  publicProcessImages: boolean
  publicFinishedObject: boolean
  publicProjectEconomics: boolean
  publicCaseStudy: boolean
}

/** Public-facing consents default off. Internal process notes stay on the job record. */
export const DEFAULT_DOCUMENTATION_RIGHTS: DocumentationRights = {
  internalProcessDocumentation: true,
  publicClientName: false,
  publicCADImages: false,
  publicProcessImages: false,
  publicFinishedObject: false,
  publicProjectEconomics: false,
  publicCaseStudy: false,
}

export type Material = {
  id: string
  manufacturer: string
  productName: string
  materialType: string
  color?: string
  translucency?: string
  bottleSize?: string
  currentPrice?: number
  currency: 'USD'
  supplierName?: string
  supplierUrl?: string
  productUrl?: string
  priceCheckedAt?: string
  printerCompatibility: string[]
  wavelength?: string
  baselineExposure?: string
  baselineLayerHeight?: string
  washNotes?: string
  cureNotes?: string
  finishingNotes?: string
  /** Operator-only. Never render on client proposal pages. */
  operatorNotes?: string
  supplyModeDefault: MaterialSupplyMode
  pendingConfirmation: boolean
  active: boolean
}

export type Machine = {
  id: string
  name: string
  manufacturer: string
  model: string
  process: string
  location?: string
  buildVolume?: string
  owner?: string
  accessStatus: MachineAccessStatus
  /** Internal only. Never render on client pages. */
  internalHourlyRate?: number
  operatorRequirements?: string[]
  compatibleMaterials: string[]
  active: boolean
}

export type Operator = {
  id: string
  name: string
  role: 'project_lead' | 'operator' | 'both'
  capabilities: string[]
  machinesAuthorized: string[]
  /** Internal only. Never render on client pages. */
  hourlyRateInternal?: number
  verifiedAt?: string
  active: boolean
}

export type OwnershipSplit = {
  clientOwns: string[]
  dccRetains: string[]
  publicUseRequiresPermission: boolean
}

export type PrototypeFindings = {
  fileVersion?: string
  materialId?: string
  printerId?: string
  operatorId?: string
  layerHeight?: string
  exposure?: string
  printDuration?: string
  estimatedMaterial?: string
  actualMaterial?: string
  washProcess?: string
  cureProcess?: string
  supportStrategy?: string
  finishPerformed?: string
  lightingHardware?: string
  fitResult?: string
  translucencyResult?: string
  defects?: string
  warping?: string
  supportScars?: string
  dimensionalNotes?: string
  recommendations?: string
  prototype2Recommended?: boolean
}

/**
 * Canonical job record. Phase 1 stores this in git for the two pilot
 * proposals. Airtable intake still uses the coarser DCC OS Job stages.
 */
export type FabricationJob = {
  id: string
  jobNumber: string
  slug: string
  clientName: string
  clientOrganization?: string
  projectTitle: string
  serviceType: StudioServiceId
  status: FabricationJobStatus
  inquiryDate?: string
  targetDate?: string
  /** Private references only — never public asset paths. */
  sourceFiles?: string[]
  sourceFileVersion?: string
  dimensions?: string
  quantity?: number
  intendedUse?: string
  prototypeGoal?: string
  prototypeDesignation?: string
  prototypeVersion?: string
  criticalSurfaces?: string
  criticalDimensions?: string
  materialId?: string
  clientSuppliedMaterial: boolean
  machineId?: string
  operatorId?: string
  projectLeadId?: string
  fabricationLocation?: string
  estimatedResinMl?: number
  actualResinMl?: number
  estimatedMachineMinutes?: number
  actualMachineMinutes?: number
  estimatedOperatorMinutes?: number
  actualOperatorMinutes?: number
  founderMinutes?: number
  quoteAmount?: number
  depositAmount?: number
  balanceAmount?: number
  paymentStatus: PaymentStatus
  reprintPolicy?: string
  finishLevel?: string
  finishingMinutes?: number
  qaStatus?: string
  documentationRights: DocumentationRights
  findings?: PrototypeFindings
  ownership: OwnershipSplit
  createdAt: string
  updatedAt: string
}

export type ProposalMediaSlot = {
  id: string
  filename: string
  alt: string
  caption?: string
  aspect: '16/9' | '21/9' | '4/5' | '1/1'
}

export type ProposalPricing = {
  serviceLabel: string
  amountUsd?: number
  amountStatus: 'quoted' | 'pending'
  materialNote: string
  terms: string
  includedAttempts: string
  reprintNote: string
}

export type QuoteLineCategory =
  | 'preflight'
  | 'fabrication'
  | 'postprocess'
  | 'qa'
  | 'handoff'
  | 'other'

/** Client-facing quote packaging. Amounts may differ from internal cost allocation. */
export type QuoteLineItem = {
  id: string
  label: string
  shortLabel: string
  description: string
  clientReceives: string[]
  prevents?: string
  category: QuoteLineCategory
  clientVisible: boolean
  quantity?: number
  unit?: string
  rate?: number
  amount: number
  source?: string
}

export type CostLineCategory =
  | 'machine'
  | 'operator'
  | 'consumables'
  | 'payment_fee'
  | 'materials'
  | 'partner'
  | 'other'

/** Staff-only direct costs. Never render on client proposal pages. */
export type CostLineItem = {
  id: string
  category: CostLineCategory
  label?: string
  quantity?: number
  unit?: string
  /** Internal only. Never render on client pages. */
  internalRate?: number
  cost: number
  vendor?: string
  operatorId?: string
  notes?: string
}

export type QuoteEconomics = {
  quoteTotal: number
  directCost: number
  paymentFeeEstimate: number
  contribution: number
  founderHours: number
  founderMarginPerHour: number
  belowFounderThreshold: boolean
}

export type ClientProposal = {
  slug: string
  job: FabricationJob
  heroKicker: string
  heroTitle: string
  heroDek: string
  media: ProposalMediaSlot[]
  pricing?: ProposalPricing
  /** Client-visible line items when quoted. Filter with clientVisible. */
  quoteLineItems?: QuoteLineItem[]
  /** Staff-only. Never render on client proposal pages. */
  costLineItems?: CostLineItem[]
  /** Default founder hours for internal economics on this job. */
  defaultFounderHours?: number
  /** Reference resin / material outlay shown on client page (not in service fee). */
  clientMaterialOutlayUsd?: number
  materialIds: string[]
  processSteps: string[]
  scopeIncluded: string[]
  scopeExcluded: string[]
  requiredInputs: string[]
  approvalNextStep: string
  /** Documented composition; pages assemble modules by hand. */
  modules: string[]
}

export const PRICE_REFERENCE_DISCLAIMER =
  'Prices are current references and should be verified before purchase.'

export const DEFAULT_CLIENT_OWNERSHIP: OwnershipSplit = {
  clientOwns: [
    'design',
    'CAD / source geometry',
    'project IP',
    'physical prototype',
  ],
  dccRetains: [
    'fabrication SOP',
    'general process knowledge',
    'calculator methodology',
    'non-client-specific operational improvements',
    'internal job record',
  ],
  publicUseRequiresPermission: true,
}

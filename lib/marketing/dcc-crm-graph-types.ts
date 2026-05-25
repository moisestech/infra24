/**
 * Normalized DCC CRM graph model for Cytoscape and the public JSON API.
 * Field names on Airtable rows are mapped in crm-graph-field-map.ts.
 */

export type DccGraphNodeKind = 'person' | 'seedCandidate' | 'institution' | 'opportunity' | 'campaign'

export type DccGraphEdgeKind =
  | 'affiliated_with'
  | 'involved_in'
  | 'related_to'
  | 'interacted_with'
  | 'campaign_link'
  | 'co_appeared'
  | 'research_context'

export type DccGraphMode = 'active' | 'research' | 'combined' | 'admin'

export type DccGraphVisibility = 'public' | 'internal'

/** Cytoscape-compatible node `data` */
export type DccGraphNodeData = {
  id: string
  kind: DccGraphNodeKind
  label: string
  displayLabel: string
  provenance: 'people' | 'seedCandidate'
  slug?: string
  /** Raw CRM fields for tooltips / side panel */
  contactCategory?: string
  warmth?: string
  miami?: boolean
  city?: string
  relationshipStrength?: string
  opportunityStatus?: string
  deadline?: string
  campaignName?: string
  /** Demo presentation */
  publicNodeSummary?: string
  demoReadiness?: string
  imageUrl?: string
  constituentLabel?: string
  miamiConnectionType?: string
  nodePriority?: string
  practiceTags?: string[]
  interestTags?: string[]
  contextLinks?: string[]
  website?: string
  sourceUrl?: string
  graphLayer?: string
  reviewStatus?: string
  recommendedBucket?: string
  dccSignupStatus?: string
  publicProfileConsent?: string
  consentStatus?: string
  institutionSource?: string
  seedFitScore?: number
  confidence?: string
  addToPeople?: boolean
  anonymized?: boolean
  nodeScale?: number
  /** Derived */
  interactionCount?: number
  homeScore?: number
}

/** Cytoscape-compatible edge `data` */
export type DccGraphEdgeData = {
  id: string
  source: string
  target: string
  kind: DccGraphEdgeKind
  weight?: number
  recencyScore?: number
  interactionCount?: number
  lastInteractionAt?: string
}

export type DccGraphElement =
  | { data: DccGraphNodeData }
  | { data: DccGraphEdgeData }

export type DccNetworkGraphSurface = 'home' | 'explorer'

export type DccNetworkGraphMeta = {
  source: 'fixture' | 'airtable'
  surface: DccNetworkGraphSurface
  mode: DccGraphMode
  visibility: DccGraphVisibility
  generatedAt: string
  nodeCount: number
  edgeCount: number
}

export type DccNetworkGraphPayload = {
  elements: DccGraphElement[]
  meta: DccNetworkGraphMeta
}

export type BuildCrmGraphOptions = {
  surface: DccNetworkGraphSurface
  mode?: DccGraphMode
  visibility?: DccGraphVisibility
  nowMs?: number
}

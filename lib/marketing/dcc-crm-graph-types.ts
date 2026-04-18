/**
 * Normalized DCC CRM graph model for Cytoscape and the public JSON API.
 * Field names on Airtable rows are mapped in crm-graph-field-map.ts.
 */

export type DccGraphNodeKind = 'person' | 'institution' | 'opportunity' | 'campaign'

export type DccGraphEdgeKind =
  | 'affiliated_with'
  | 'involved_in'
  | 'related_to'
  | 'interacted_with'
  | 'campaign_link'
  | 'co_appeared'

/** Cytoscape-compatible node `data` */
export type DccGraphNodeData = {
  id: string
  kind: DccGraphNodeKind
  label: string
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
  generatedAt: string
  nodeCount: number
  edgeCount: number
}

export type DccNetworkGraphPayload = {
  elements: DccGraphElement[]
  meta: DccNetworkGraphMeta
}

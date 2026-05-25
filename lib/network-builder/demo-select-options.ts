/** Locked select options for demo graph presentation (People + Seed Candidates). */

export const DEMO_READINESS_OPTIONS = {
  demoReady: 'Demo Ready',
  needsImageLink: 'Needs Image / Link',
  needsReview: 'Needs Review',
  internalOnly: 'Internal Only',
  doNotShow: 'Do Not Show',
} as const

export const GRAPH_LAYER_DEMO_OPTIONS = {
  networkNode: 'Network Node',
  researchNode: 'Research Node',
  both: 'Both',
  hiddenArchive: 'Hidden / Archive',
  internalOnly: 'Internal Only',
} as const

export const NODE_PRIORITY_OPTIONS = [
  'Anchor Node',
  'Large Node',
  'Medium Node',
  'Small Node',
  'Research Node',
] as const

export const MIAMI_CONNECTION_TYPE_OPTIONS = [
  'Miami-based',
  'South Florida-based',
  'Did project in Miami',
  'Exhibited in Miami',
  'Miami institution connection',
  'Miami-born / alumni',
  'Remote but relevant',
] as const

export const CONSTITUENT_LABEL_OPTIONS = [
  'Digital Artist',
  'Media Artist',
  'Creative Technologist',
  'Workshop Lead / Educator',
  'Partner Connector',
  'Cultural Infrastructure Builder',
  'Research / Archive Candidate',
] as const

export const REVIEW_STATUS_OPTIONS = [
  'To Review',
  'Approved for First 30',
  'Workshop Lead',
  'Partner / Connector',
  'Maybe Later',
  'Needs More Research',
  'Added to People',
] as const

export const RECOMMENDED_BUCKET_OPTIONS = [
  'First 30',
  'Partner / Connector',
  'Workshop Lead',
  'Research More',
  'Maybe Later',
  'Needs More Research',
] as const

export const RESEARCH_PARTICIPATION_STATUS_OPTIONS = [
  'Not Asked',
  'Interested in Research View',
  'Research Contributor',
  'Research Collaborator',
  'Internal Only',
  'Do Not Include in Research',
] as const

export const RESEARCH_ACCESS_LEVEL_OPTIONS = [
  'None',
  'Public Research View',
  'Contributor View',
  'Collaborator View',
  'Admin / Staff',
] as const

export const CONFIDENCE_OPTIONS = ['Low', 'Medium', 'High'] as const

export function isDemoReadinessExcluded(demoReadiness: string | undefined): boolean {
  return (demoReadiness ?? '').trim() === DEMO_READINESS_OPTIONS.doNotShow
}

export function isHiddenGraphLayer(graphLayer: string | undefined): boolean {
  const layer = (graphLayer ?? '').trim()
  return layer === GRAPH_LAYER_DEMO_OPTIONS.hiddenArchive || layer === GRAPH_LAYER_DEMO_OPTIONS.internalOnly
}

export function isActiveNetworkLayer(graphLayer: string | undefined): boolean {
  const layer = (graphLayer ?? '').trim()
  if (!layer) return true
  return layer === GRAPH_LAYER_DEMO_OPTIONS.networkNode || layer === GRAPH_LAYER_DEMO_OPTIONS.both
}

export function isResearchGraphLayer(graphLayer: string | undefined): boolean {
  const layer = (graphLayer ?? '').trim()
  return layer === GRAPH_LAYER_DEMO_OPTIONS.researchNode || layer === GRAPH_LAYER_DEMO_OPTIONS.both
}

/** Cytoscape / 3D node size multiplier by Node Priority. */
export function nodePriorityScale(priority: string | undefined): number {
  switch ((priority ?? '').trim()) {
    case 'Anchor Node':
      return 1.6
    case 'Large Node':
      return 1.35
    case 'Medium Node':
      return 1.0
    case 'Small Node':
      return 0.75
    case 'Research Node':
      return 0.85
    default:
      return 1.0
  }
}

export function normalizeGraphName(name: string | undefined): string {
  return (name ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

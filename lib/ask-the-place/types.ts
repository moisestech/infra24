/**
 * Ask the Place — Cultural Intelligence Concierge (Phase 3 pilot UI types).
 * Mock-first; structured for later Supabase / Airtable / CMS wiring.
 */

export type VerticalType =
  | 'hotel'
  | 'club'
  | 'residence'
  | 'district'
  | 'institution'
  | 'collection'

export type AtpMode = 'public' | 'staff' | 'leadership'

export type GraphNodeCategory =
  | 'place'
  | 'people'
  | 'events'
  | 'spaces'
  | 'art'
  | 'amenities'
  | 'partners'
  | 'outputs'
  | 'insights'

export type GraphNode = {
  id: string
  label: string
  category: GraphNodeCategory
  /** 0–100 percentage within canvas */
  x: number
  y: number
}

export type GraphLink = {
  id: string
  source: string
  target: string
}

export type ItineraryStop = {
  id: string
  time: string
  label: string
  detail?: string
}

export type SignageDraft = {
  screenTitle: string
  headline: string
  body: string
  cta: string
}

export type OutputBundle = {
  scenarioId: string
  answerSummary: string
  highlightNodeIds: string[]
  publicRecommendation: string
  staffBrief: string
  leadershipInsight: string
  signage: SignageDraft
  itinerary: ItineraryStop[]
  nextActions: string[]
}

export type ScenarioQuestion = {
  id: string
  label: string
  /** Short chip text */
  chip: string
}

export type DataCategory = {
  id: string
  label: string
  count: number
}

export type ProspectConfig = {
  prospectName: string
  vertical: VerticalType
  verticalLabel: string
  productName: string
  routeSlug: string
  tagline: string
  primaryQuestion: string
  city: string
  description: string
  accentToken: 'champagne' | 'teal' | 'violet' | 'gold'
  modes: AtpMode[]
  nodeTypes: string[]
  sampleQuestions: ScenarioQuestion[]
  outputs: {
    publicLabel: string
    staffLabel: string
    leadershipLabel: string
  }
  pilotName: string
  /** scenario id -> bundle */
  scenarios: Record<string, OutputBundle>
  dataCategories: DataCategory[]
}

export type Place = {
  id: string
  name: string
  vertical: VerticalType
  city: string
  description: string
  heroImage?: string
  brandAccent: string
  dataCategories: DataCategory[]
}

export type PilotScope = {
  title: string
  bullets: string[]
  timeline: string
  dataNeeded: string[]
  delivered: string[]
}

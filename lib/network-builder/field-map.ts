import { CRM_GRAPH_FIELD_MAP } from '@/lib/airtable/crm-graph-field-map'
import type { ReadinessFieldKey } from '@/lib/network-builder/types'

/** Airtable column names for INFRA24 CRM People table + future DCC fields. */
export type NetworkPeopleFieldMap = {
  name: string
  email: string
  titleRole: string
  roleType: string
  contactCategory: string
  institution: string
  city: string
  linkedin: string
  warmth: string
  relationshipStrength: string
  relationshipType: string
  lastContactDate: string
  lastMeaningfulTouch: string
  nextFollowUpDate: string
  followUpStatus: string
  canHelpWith: string
  nextBestAsk: string
  source: string
  recordType: string
  miami: string
  campaigns: string
  interactions: string
  strategicValue: string
  practiceTags: string
  interestTags: string
  website: string
  instagram: string
  consentStatus: string
  dccSignupStatus: string
  digitalOrientationStatement: string
  networkReadinessScore: string
  networkReadinessStatus: string
  followUpCadence: string
  agentNotes: string
  agentLastScoredAt: string
  signupPathway: string
  publicProfileConsent: string
  signupSubmittedAt: string
  graphLayer: string
  publicNodeSummary: string
  demoReadiness: string
  imagePortraitUrl: string
  researchParticipationStatus: string
  researchAccessLevel: string
}

export const DEFAULT_DCC_PEOPLE_FIELD_MAP: NetworkPeopleFieldMap = {
  name: CRM_GRAPH_FIELD_MAP.people.name,
  email: 'Email',
  titleRole: 'Title / Role',
  roleType: CRM_GRAPH_FIELD_MAP.people.contactCategory,
  contactCategory: CRM_GRAPH_FIELD_MAP.people.contactCategory,
  institution: CRM_GRAPH_FIELD_MAP.people.institution,
  city: 'City',
  linkedin: 'LinkedIn',
  warmth: CRM_GRAPH_FIELD_MAP.people.warmth,
  relationshipStrength: 'Relationship Strength',
  relationshipType: 'Relationship Type',
  lastContactDate: 'Last Contact Date',
  lastMeaningfulTouch: 'Last Meaningful Touch',
  nextFollowUpDate: 'Next Follow-Up Date',
  followUpStatus: 'Follow-Up Status',
  canHelpWith: 'Can Help With',
  nextBestAsk: 'Next Best Ask',
  source: 'Source',
  recordType: 'Record Type',
  miami: CRM_GRAPH_FIELD_MAP.people.miami,
  campaigns: CRM_GRAPH_FIELD_MAP.people.campaigns,
  interactions: CRM_GRAPH_FIELD_MAP.people.interactions,
  strategicValue: 'Strategic Value',
  practiceTags: 'Practice Tags',
  interestTags: 'Interest Tags',
  website: 'Website',
  instagram: 'Instagram',
  consentStatus: 'Consent Status',
  dccSignupStatus: 'DCC Signup Status',
  digitalOrientationStatement: 'Digital Orientation Statement',
  networkReadinessScore: 'Network Readiness Score',
  networkReadinessStatus: 'Network Readiness Status',
  followUpCadence: 'Follow-Up Cadence',
  agentNotes: 'Agent Notes',
  agentLastScoredAt: 'Agent Last Scored At',
  signupPathway: 'Signup Pathway',
  publicProfileConsent: 'Public Profile Consent',
  signupSubmittedAt: 'Signup Submitted At',
  graphLayer: 'Graph Layer',
  publicNodeSummary: 'Public Node Summary',
  demoReadiness: 'Demo Readiness',
  imagePortraitUrl: 'Image / Portrait URL',
  researchParticipationStatus: 'Research Participation Status',
  researchAccessLevel: 'Research Access Level',
}

/** All People fields the Network Builder reads or writes (for schema gap reports). */
export const NETWORK_PEOPLE_FIELD_SPECS: Array<{
  key: keyof NetworkPeopleFieldMap
  label: string
  status: 'existing' | 'future'
  scoringImpact?: string
  mvp?: boolean
}> = [
  { key: 'name', label: 'Full Name', status: 'existing', scoringImpact: '10 pts' },
  { key: 'email', label: 'Email', status: 'existing', scoringImpact: '15 pts' },
  { key: 'titleRole', label: 'Title / Role', status: 'existing', scoringImpact: 'role fallback' },
  { key: 'contactCategory', label: 'Contact Category', status: 'existing', scoringImpact: '10 pts' },
  { key: 'institution', label: 'Institution', status: 'existing' },
  { key: 'city', label: 'City', status: 'existing' },
  { key: 'linkedin', label: 'LinkedIn', status: 'existing', scoringImpact: '10 pts social' },
  { key: 'warmth', label: 'Warmth', status: 'existing', scoringImpact: 'priority' },
  { key: 'relationshipStrength', label: 'Relationship Strength', status: 'existing', scoringImpact: 'priority' },
  { key: 'relationshipType', label: 'Relationship Type', status: 'existing', scoringImpact: 'priority' },
  { key: 'lastContactDate', label: 'Last Contact Date', status: 'existing', scoringImpact: '5 pts recency' },
  { key: 'lastMeaningfulTouch', label: 'Last Meaningful Touch', status: 'existing', scoringImpact: '5 pts recency' },
  { key: 'nextFollowUpDate', label: 'Next Follow-Up Date', status: 'existing', scoringImpact: 'custom cadence' },
  { key: 'followUpStatus', label: 'Follow-Up Status', status: 'existing' },
  { key: 'canHelpWith', label: 'Can Help With', status: 'existing', scoringImpact: 'priority' },
  { key: 'nextBestAsk', label: 'Next Best Ask', status: 'existing' },
  { key: 'source', label: 'Source', status: 'existing' },
  { key: 'recordType', label: 'Record Type', status: 'existing', scoringImpact: 'priority' },
  { key: 'miami', label: 'Miami Area?', status: 'existing' },
  { key: 'campaigns', label: 'Campaigns', status: 'existing' },
  { key: 'interactions', label: 'Interactions', status: 'existing', scoringImpact: 'recency derive' },
  { key: 'strategicValue', label: 'Strategic Value', status: 'existing', scoringImpact: 'priority' },
  { key: 'practiceTags', label: 'Practice Tags', status: 'future', scoringImpact: '15 pts', mvp: true },
  { key: 'interestTags', label: 'Interest Tags', status: 'future', scoringImpact: '10 pts', mvp: true },
  { key: 'website', label: 'Website', status: 'future', scoringImpact: '10 pts social', mvp: true },
  { key: 'instagram', label: 'Instagram', status: 'future', scoringImpact: '10 pts social', mvp: true },
  { key: 'consentStatus', label: 'Consent Status', status: 'future', scoringImpact: '10 pts', mvp: true },
  { key: 'dccSignupStatus', label: 'DCC Signup Status', status: 'future', scoringImpact: 'network-ready gate', mvp: true },
  { key: 'digitalOrientationStatement', label: 'Digital Orientation Statement', status: 'future', scoringImpact: '15 pts', mvp: true },
  { key: 'networkReadinessScore', label: 'Network Readiness Score', status: 'future', scoringImpact: 'agent write-back', mvp: true },
  { key: 'networkReadinessStatus', label: 'Network Readiness Status', status: 'future', scoringImpact: 'agent write-back', mvp: true },
  { key: 'followUpCadence', label: 'Follow-Up Cadence', status: 'future', scoringImpact: 'stale detection', mvp: true },
  { key: 'agentNotes', label: 'Agent Notes', status: 'future', mvp: true },
  { key: 'agentLastScoredAt', label: 'Agent Last Scored At', status: 'future', mvp: true },
  { key: 'signupPathway', label: 'Signup Pathway', status: 'future', mvp: true },
  { key: 'publicProfileConsent', label: 'Public Profile Consent', status: 'future', mvp: true },
  { key: 'signupSubmittedAt', label: 'Signup Submitted At', status: 'future', mvp: true },
  { key: 'graphLayer', label: 'Graph Layer', status: 'future', mvp: true },
  { key: 'publicNodeSummary', label: 'Public Node Summary', status: 'future', mvp: true },
  { key: 'demoReadiness', label: 'Demo Readiness', status: 'future', mvp: true },
  { key: 'imagePortraitUrl', label: 'Image / Portrait URL', status: 'future', mvp: true },
  { key: 'researchParticipationStatus', label: 'Research Participation Status', status: 'future', mvp: true },
  { key: 'researchAccessLevel', label: 'Research Access Level', status: 'future', mvp: true },
]

export type ReadinessFieldSpec = {
  key: ReadinessFieldKey
  label: string
  points: number
  optional?: boolean
}

/** DCC 100-point readiness model. */
export const READINESS_FIELD_SPECS: ReadinessFieldSpec[] = [
  { key: 'full_name', label: 'Full name', points: 10 },
  { key: 'email', label: 'Email', points: 15 },
  { key: 'role_type', label: 'Role / contact category', points: 10 },
  { key: 'practice_tags', label: 'Practice tags', points: 15, optional: true },
  { key: 'interest_tags', label: 'Interest tags', points: 10, optional: true },
  { key: 'digital_orientation', label: 'Digital orientation', points: 15, optional: true },
  { key: 'website_or_social', label: 'Website / Instagram / LinkedIn', points: 10 },
  { key: 'consent_status', label: 'Consent status', points: 10, optional: true },
  { key: 'last_contacted', label: 'Last meaningful touch or contact', points: 5 },
]

export const DCC_NETWORK_GOAL_DEFAULTS = {
  goalId: 'dcc_network_readiness_mvp',
  readinessThreshold: 70,
  artistTargetMvp: 100,
  totalContactsStretch12Mo: 1000,
  defaultStaleDays: 60,
} as const

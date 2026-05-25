/** Locked select options for INFRA24 CRM People table (DCC Network Builder). */

export const PRACTICE_TAG_OPTIONS = [
  'AI Art',
  'Creative Coding',
  'Video',
  'Film',
  'Sound',
  'Music',
  'Performance',
  'Installation',
  'Web',
  'Design',
  'Photography',
  'XR / VR / AR',
  'Gaming',
  'Writing',
  'Education',
  'Research',
  'Curating',
  'Fabrication',
  'Robotics',
  'Architecture',
  'Digital Preservation',
  'Social Practice',
  'Community Organizing',
  'Creative Technology',
  'Software',
  'Data / Visualization',
] as const

export const INTEREST_TAG_OPTIONS = [
  'DCC Index',
  'Workshops',
  'AI Tools',
  'Website Help',
  'Creative Tech',
  'Exhibitions',
  'Public Programs',
  'Residencies',
  'Grants',
  'Partner Projects',
  'Community Events',
  'Teaching',
  'Publishing',
  'Newsletter',
  'Digital Lab',
  'Open Studio',
  'Artist Support',
  'Professional Development',
  'Portfolio / Documentation',
  'Automation',
  'Digital Infrastructure',
] as const

export const CONSENT_STATUS_OPTIONS = [
  'Unknown',
  'Permission to Contact',
  'Subscribed',
  'Needs Confirmation',
  'Do Not Contact',
] as const

export const DCC_SIGNUP_STATUS_OPTIONS = [
  'Not Invited',
  'Invited',
  'Started',
  'Signed Up',
  'Onboarding',
  'Network Ready',
  'Dormant',
  'Do Not Contact',
] as const

export const NETWORK_READINESS_STATUS_OPTIONS = [
  'Not Ready',
  'Partial',
  'Ready',
  'High-Value',
  'Needs Review',
  'Do Not Contact',
] as const

export const FOLLOW_UP_CADENCE_OPTIONS = [
  '30 Days',
  '60 Days',
  '90 Days',
  'Custom',
  'Pause',
  'Do Not Contact',
] as const

export const CONTACT_CATEGORY_OPTIONS = [
  'Artist',
  'Creator',
  'Creative Technologist',
  'Designer',
  'Developer',
  'Researcher',
  'Educator',
  'Curator',
  'Producer',
  'Writer',
  'Musician / Sound Artist',
  'Filmmaker / Video Artist',
  'Performer',
  'Student',
  'Cultural Worker',
  'Organization / Institution',
  'Funder / Supporter',
  'Other',
] as const

export type ConsentStatusValue = (typeof CONSENT_STATUS_OPTIONS)[number]

export const SIGNUP_PATHWAY_OPTIONS = [
  'Join the DCC Index',
  'Teach / Propose a Workshop',
  'Partner with DCC',
  'Suggest a Reference',
] as const

export const PUBLIC_PROFILE_CONSENT_OPTIONS = {
  publicListingOk: 'Public Listing OK',
  askBeforePublishing: 'Ask Before Publishing',
  doNotPublish: 'Do Not Publish',
} as const

export const GRAPH_LAYER_OPTIONS = {
  networkNode: 'Network Node',
  both: 'Both',
  internalOnly: 'Internal Only',
} as const

/** Person is eligible for public network graph surfaces. */
export function isPublicGraphEligible(
  publicProfileConsent: string | undefined,
  graphLayer: string | undefined
): boolean {
  const consent = (publicProfileConsent ?? '').trim()
  const layer = (graphLayer ?? '').trim()
  if (consent !== PUBLIC_PROFILE_CONSENT_OPTIONS.publicListingOk) return false
  return layer === GRAPH_LAYER_OPTIONS.networkNode || layer === GRAPH_LAYER_OPTIONS.both
}

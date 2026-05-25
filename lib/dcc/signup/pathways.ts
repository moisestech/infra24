export type SignupPathwayId =
  | 'join_dcc_index'
  | 'help_build_research_view'
  | 'propose_workshop'
  | 'partner_with_dcc'

export type SignupPathwayMeta = {
  id: SignupPathwayId
  label: string
  description: string
  enabled: boolean
  signupPathwayValue: string
  hrefParam: string
}

export const SIGNUP_PATHWAYS: SignupPathwayMeta[] = [
  {
    id: 'join_dcc_index',
    label: "Join Miami's Digital Culture Map",
    description: 'Add your profile to Miami’s living directory of digital culture practitioners.',
    enabled: true,
    signupPathwayValue: 'Join the DCC Index',
    hrefParam: 'index',
  },
  {
    id: 'help_build_research_view',
    label: 'Help Build the Research View',
    description: 'Suggest artists, exhibitions, institutions, and references for the cultural memory map.',
    enabled: true,
    signupPathwayValue: 'Suggest a Reference',
    hrefParam: 'research',
  },
  {
    id: 'propose_workshop',
    label: 'Teach / Propose a Workshop',
    description: 'Coming soon — share a workshop idea with DCC.',
    enabled: false,
    signupPathwayValue: 'Teach / Propose a Workshop',
    hrefParam: 'workshop',
  },
  {
    id: 'partner_with_dcc',
    label: 'Partner with DCC',
    description: 'Coming soon — explore institutional or program partnerships.',
    enabled: false,
    signupPathwayValue: 'Partner with DCC',
    hrefParam: 'partner',
  },
]

export function getPathwayById(id: string | undefined): SignupPathwayMeta {
  const normalized =
    id === 'index' ? 'join_dcc_index' : id === 'research' ? 'help_build_research_view' : id
  return (
    SIGNUP_PATHWAYS.find((p) => p.id === normalized) ??
    SIGNUP_PATHWAYS.find((p) => p.id === 'join_dcc_index')!
  )
}

export function parsePathwayParam(param: string | undefined): SignupPathwayId {
  if (param === 'index') return 'join_dcc_index'
  if (param === 'research') return 'help_build_research_view'
  const found = SIGNUP_PATHWAYS.find((p) => (p.hrefParam === param || p.id === param) && p.enabled)
  return found?.id ?? 'join_dcc_index'
}

import type { AlumniFieldMap } from '@/lib/airtable/org-alumni-config'

export type MemoryAgentGovernanceFields = {
  doNotUseInAi: boolean
  approvedForPublicAi: boolean
  visibilityLevel: boolean
  publicBio: boolean
}

export function getMemoryAgentGovernanceFields(fieldMap: AlumniFieldMap): MemoryAgentGovernanceFields {
  return {
    doNotUseInAi: Boolean(fieldMap.doNotUseInAi?.trim()),
    approvedForPublicAi: Boolean(fieldMap.approvedForPublicAi?.trim()),
    visibilityLevel: Boolean(fieldMap.visibilityLevel?.trim()),
    publicBio: Boolean(fieldMap.publicBio?.trim()),
  }
}

/** Human-readable summary for status API + UI. */
export function describeMemoryAgentGovernance(fieldMap: AlumniFieldMap): {
  fields: MemoryAgentGovernanceFields
  publicModeRule: string
} {
  const fields = getMemoryAgentGovernanceFields(fieldMap)

  let publicModeRule =
    'Public mode: all rows except those marked do-not-use (when mapped); contact fields never sent to the model.'

  if (fields.doNotUseInAi) {
    publicModeRule = 'Public mode: excludes rows with do-not-use-in-AI checked.'
  }
  if (fields.approvedForPublicAi) {
    publicModeRule += ' Only rows approved for public AI.'
  } else if (fields.visibilityLevel) {
    publicModeRule += ' Excludes internal/restricted visibility.'
  }

  return { fields, publicModeRule }
}

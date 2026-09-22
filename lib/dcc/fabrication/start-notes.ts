import {
  PROJECT_STAGES,
  suggestStudioService,
} from '@/lib/dcc/fabrication/studio-services'
import { type FabricateStartRequest } from '@/lib/dcc/fabrication/start-schema'

export function formatFabricateStartNotes(input: FabricateStartRequest): string {
  const stage = PROJECT_STAGES.find((s) => s.id === input.projectStage)
  const suggested =
    input.suggestedServiceId ??
    suggestStudioService(input.projectStage)?.id ??
    'none — human review'
  const lines = [
    `Project title: ${input.projectTitle}`,
    `Organization: ${input.organization || '—'}`,
    `Stage: ${stage?.label ?? input.projectStage}`,
    `Suggested service (not assigned): ${suggested}`,
    `Object intent: ${input.objectIntent}`,
    input.quantity ? `Quantity: ${input.quantity}` : null,
    input.intendedUse ? `Intended use: ${input.intendedUse}` : null,
    input.materialPreference ? `Material preference: ${input.materialPreference}` : null,
    input.dimensions ? `Dimensions: ${input.dimensions}` : null,
    input.deadline ? `Deadline: ${input.deadline}` : null,
    input.fileLink ? `File link: ${input.fileLink}` : null,
    input.referenceLinks ? `References: ${input.referenceLinks}` : null,
    `Associate: ${input.isAssociate ? 'yes' : 'no'}`,
    `Consent to updates: ${input.consentUpdates ? 'yes' : 'no'}`,
    `Contact: ${input.email}`,
    input.planningEstimateNote ? input.planningEstimateNote : null,
    '',
    'Description:',
    input.description,
    '',
    'What do you need to learn from this prototype?',
    input.prototypeLearning,
  ]
  return lines.filter((line) => line !== null).join('\n')
}

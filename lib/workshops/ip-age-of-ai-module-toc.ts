import type { WorkshopModule } from '@/data/ipAgeOfAiWorkshop'

export type IpAgeOfAiModuleTocItem = { id: string; label: string }

/** Stable section ids for in-page navigation on IP + AI module readers */
export const IP_AI_SECTION = {
  video: 'ipai-section-video',
  transcript: 'ipai-section-transcript',
  triage: 'ipai-section-triage',
  aiAudit: 'ipai-section-ai-audit',
  contract: 'ipai-section-contract',
  riskLadder: 'ipai-section-risk-ladder',
  scenario: 'ipai-section-scenario',
  tips: 'ipai-section-tips',
  extraChecklists: 'ipai-section-extra-checklists',
  keyPoints: 'ipai-section-key-points',
  takeaways: 'ipai-section-takeaways',
  examples: 'ipai-section-examples',
  checklist: 'ipai-section-checklist',
  reflection: 'ipai-section-reflection',
  glossary: 'ipai-section-glossary',
  curatedLinks: 'ipai-section-curated-links',
  relatedWorksheets: 'ipai-section-related-worksheets',
  toolkit: 'ipai-section-toolkit',
  next: 'ipai-section-next',
} as const

export function buildIpAgeOfAiModuleToc(moduleData: WorkshopModule): IpAgeOfAiModuleTocItem[] {
  const items: IpAgeOfAiModuleTocItem[] = [
    { id: IP_AI_SECTION.video, label: 'Video lesson' },
    { id: IP_AI_SECTION.transcript, label: 'Transcript & lesson' },
  ]

  if (moduleData.legalPracticeTriage) {
    items.push({ id: IP_AI_SECTION.triage, label: 'Law vs. practice' })
  }

  if (moduleData.showAIUseSelfAudit) {
    items.push({ id: IP_AI_SECTION.aiAudit, label: 'AI use self-audit' })
  }
  if (moduleData.showContractClauseSelector) {
    items.push({ id: IP_AI_SECTION.contract, label: 'Contract clauses' })
  }
  if (moduleData.showRiskResponseLadder) {
    items.push({ id: IP_AI_SECTION.riskLadder, label: 'Risk response ladder' })
  }

  if (moduleData.scenarioLabMode && moduleData.scenarioLabMode !== 'none' && moduleData.id !== 'module-8') {
    items.push({ id: IP_AI_SECTION.scenario, label: 'Scenario lab' })
  }

  if (moduleData.artistPracticeTips?.length) {
    items.push({ id: IP_AI_SECTION.tips, label: 'Practice tips' })
  }
  if (moduleData.additionalChecklists?.length) {
    items.push({ id: IP_AI_SECTION.extraChecklists, label: 'Extra checklists' })
  }

  items.push(
    { id: IP_AI_SECTION.keyPoints, label: 'Key lesson points' },
    { id: IP_AI_SECTION.takeaways, label: 'Takeaways' },
    { id: IP_AI_SECTION.examples, label: 'Panel examples' },
    { id: IP_AI_SECTION.checklist, label: 'Artist checklist' },
    { id: IP_AI_SECTION.reflection, label: 'Reflection' },
    { id: IP_AI_SECTION.glossary, label: 'Glossary' }
  )

  if (moduleData.resourceLinkKeys?.length) {
    items.push({ id: IP_AI_SECTION.curatedLinks, label: 'Curated links' })
  }
  if (moduleData.resources.length) {
    items.push({ id: IP_AI_SECTION.relatedWorksheets, label: 'Worksheets & guides' })
  }

  if (moduleData.id === 'module-8' && moduleData.scenarioLabMode === 'full') {
    items.push({ id: IP_AI_SECTION.scenario, label: 'Scenario lab' })
  }
  if (moduleData.id === 'module-8') {
    items.push({ id: IP_AI_SECTION.toolkit, label: 'Toolkit & completion' })
  }

  items.push({ id: IP_AI_SECTION.next, label: 'Next module' })

  return items
}

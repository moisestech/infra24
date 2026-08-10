import { chatJsonCompletion, getOpenAIClient } from '@/lib/memory-agent/openai-client'
import type { NetworkContact, RelationshipActionType } from '@/lib/network-builder/types'

/** Optional LLM polish for template drafts (same facts, warmer tone). Off unless NETWORK_BUILDER_LLM_POLISH=true */
export async function personalizeDraftWithLLM(params: {
  contact: NetworkContact
  actionType: RelationshipActionType
  templateDraft: string
}): Promise<string> {
  if (process.env.NETWORK_BUILDER_LLM_POLISH !== 'true') {
    return params.templateDraft
  }

  const openai = getOpenAIClient()
  if (!openai) return params.templateDraft

  const system = `You rewrite outreach drafts for DCC Miami. Keep every factual claim from the template. Do not invent events, dates, or names. Return JSON: {"message": string}`

  const user = `Contact: ${params.contact.fullName}
Action: ${params.actionType}
Template:
${params.templateDraft}`

  try {
    const raw = await chatJsonCompletion(openai, system, user)
    const parsed = JSON.parse(raw) as { message?: string }
    return typeof parsed.message === 'string' && parsed.message.trim()
      ? parsed.message.trim()
      : params.templateDraft
  } catch {
    return params.templateDraft
  }
}

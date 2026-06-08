import { isAirtableProgrammingConfigured } from '@/lib/airtable/programming-config'
import { isAlumniAirtableConfigured } from '@/lib/airtable/alumni-service'
import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'
import { describeMemoryAgentGovernance } from '@/lib/memory-agent/governance-status'
import { resolveElevenLabsVoiceId } from '@/lib/memory-agent/voice'

import { isSohoDemoOrg } from '@/lib/sohohouse/demo-knowledge-records'

/**
 * Memory Agent needs Airtable alumni env for people questions on most orgs; Soho demo uses seed programming.
 */
export function isMemoryAgentDataConfigured(orgSlug: string): boolean {
  if (isSohoDemoOrg(orgSlug)) return true
  return isAlumniAirtableConfigured(orgSlug)
}

export function isProgrammingMemoryConfigured(orgSlug?: string): boolean {
  if (orgSlug && isSohoDemoOrg(orgSlug)) return true
  const supabaseReady = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  )
  const airtableReady = orgSlug ? isAirtableProgrammingConfigured(orgSlug) : false
  return supabaseReady || airtableReady
}

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}

export function isElevenLabsApiKeyConfigured(): boolean {
  return Boolean(process.env.ELEVENLABS_API_KEY?.trim())
}

export function isElevenLabsVoiceIdConfigured(orgSlug?: string): boolean {
  return Boolean(resolveElevenLabsVoiceId(orgSlug))
}

/** True when TTS can run for this org (API key + voice id, including per-org override). */
export function isElevenLabsConfigured(orgSlug?: string): boolean {
  return isElevenLabsApiKeyConfigured() && isElevenLabsVoiceIdConfigured(orgSlug)
}

export function isMemoryAgentQuestionLoggingConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  )
}

export function getMemoryAgentStatusExtras(orgSlug: string) {
  const conn = getAlumniConnectionForOrg(orgSlug)
  const governance = conn
    ? describeMemoryAgentGovernance(conn.fieldMap)
    : {
        fields: {
          doNotUseInAi: false,
          approvedForPublicAi: false,
          visibilityLevel: false,
          publicBio: false,
        },
        publicModeRule:
          'Configure Airtable alumni env to enable governance field mapping.',
      }

  return {
    governance,
    questionLoggingConfigured: isMemoryAgentQuestionLoggingConfigured(),
    elevenLabsApiKeyConfigured: isElevenLabsApiKeyConfigured(),
    elevenLabsVoiceIdConfigured: isElevenLabsVoiceIdConfigured(orgSlug),
  }
}

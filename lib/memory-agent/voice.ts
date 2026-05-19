import { orgSlugToEnvToken } from '@/lib/airtable/org-alumni-config'

export function resolveElevenLabsVoiceId(orgSlug?: string): string | null {
  const token = orgSlug ? orgSlugToEnvToken(orgSlug) : null
  if (token) {
    const perOrg = process.env[`ELEVENLABS_VOICE_ID_${token}`]?.trim()
    if (perOrg) return perOrg
  }
  return process.env.ELEVENLABS_VOICE_ID?.trim() || null
}

export async function synthesizeSpeechElevenLabs(params: {
  text: string
  orgSlug?: string
}): Promise<{ ok: true; buffer: Buffer } | { ok: false; message: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
  const voiceId = resolveElevenLabsVoiceId(params.orgSlug)
  if (!apiKey || !voiceId) {
    return { ok: false, message: 'ElevenLabs is not configured (ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID).' }
  }

  const text = params.text.trim().slice(0, 2500)
  if (!text) {
    return { ok: false, message: 'Empty text for speech synthesis.' }
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    return {
      ok: false,
      message: `ElevenLabs error ${res.status}: ${errText.slice(0, 200)}`,
    }
  }

  const arrayBuffer = await res.arrayBuffer()
  return { ok: true, buffer: Buffer.from(arrayBuffer) }
}

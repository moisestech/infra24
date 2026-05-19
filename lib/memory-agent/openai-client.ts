import OpenAI from 'openai'

const EMBED_MODEL = 'text-embedding-3-small'
const CHAT_MODEL = 'gpt-4o-mini'

export function getOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return null
  return new OpenAI({ apiKey: key })
}

export async function embedTexts(
  client: OpenAI,
  inputs: string[]
): Promise<number[][]> {
  if (inputs.length === 0) return []
  const resp = await client.embeddings.create({
    model: EMBED_MODEL,
    input: inputs,
  })
  return resp.data.map((d) => d.embedding as number[])
}

export async function chatJsonCompletion(
  client: OpenAI,
  system: string,
  user: string
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })
  const text = completion.choices[0]?.message?.content
  if (!text) throw new Error('Empty completion from OpenAI')
  return text
}

export { CHAT_MODEL, EMBED_MODEL }

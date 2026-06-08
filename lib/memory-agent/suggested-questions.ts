import { normalizeSuggestedQuestionKey } from '@/lib/memory-agent/suggested-question-handoff'

/** Ensure showcase / branding chips appear even when Airtable catalog is partial. */
export function mergeAppSuggestedQuestions(
  base: string[],
  ensurePresent: string[]
): string[] {
  const seen = new Set(base.map((q) => normalizeSuggestedQuestionKey(q)))
  const out = [...base]

  for (const question of ensurePresent) {
    const key = normalizeSuggestedQuestionKey(question)
    if (seen.has(key)) continue

    let insertAt = out.length
    for (let i = out.length - 1; i >= 0; i -= 1) {
      if (/^tell me about /i.test(out[i] ?? '')) {
        insertAt = i + 1
        break
      }
    }

    out.splice(insertAt, 0, question)
    seen.add(key)
  }

  return out
}

import type { ProspectConfig } from './types'

/** Map free-text or chip to a scenario id for deterministic demo responses. */
export function resolveScenarioId(config: ProspectConfig, text: string): string | null {
  const t = text.toLowerCase().trim()
  if (!t) return null
  for (const q of config.sampleQuestions) {
    if (t === q.id.toLowerCase()) return q.id
    if (q.label.toLowerCase().includes(t) || t.includes(q.label.toLowerCase().slice(0, 28))) return q.id
    if (t.includes(q.chip.toLowerCase())) return q.id
  }
  return null
}

/** Normalize question text for chip matching and handoff lookup. */
export function normalizeSuggestedQuestionKey(question: string): string {
  return question
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.…]+$/u, '')
}

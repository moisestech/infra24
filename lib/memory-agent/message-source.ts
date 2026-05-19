import type { MemoryAgentMessage, MemoryAgentUserMessage } from '@/types/memory-agent'

/** The most recent user question before this assistant message, if any. */
export function getSourceQuestionForAssistantMessage(
  messages: MemoryAgentMessage[],
  assistantMessageId: string
): string | undefined {
  const idx = messages.findIndex((m) => m.id === assistantMessageId)
  if (idx <= 0) return undefined
  for (let i = idx - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role === 'user') return (m as MemoryAgentUserMessage).content
  }
  return undefined
}

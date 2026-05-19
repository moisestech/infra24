import type { MemoryAgentMode } from '@/types/memory-agent'

/** API / stored metadata may still send legacy `internal_demo`. */
export function parseMemoryAgentMode(raw: unknown): MemoryAgentMode {
  if (raw === 'staff_operator' || raw === 'internal_demo') return 'staff_operator'
  return 'public'
}

export function isStaffOperatorMode(mode: MemoryAgentMode): boolean {
  return mode === 'staff_operator'
}

'use client'

import { MemoryAgentClient } from '@/components/memory-agent/MemoryAgentClient'

type MemoryAgentShellProps = {
  slug: string
  orgName: string
}

/**
 * Client-only shell (loaded via `dynamic(..., { ssr: false })` from the server page).
 */
export function MemoryAgentShell({ slug, orgName }: MemoryAgentShellProps) {
  return <MemoryAgentClient slug={slug} orgName={orgName} />
}

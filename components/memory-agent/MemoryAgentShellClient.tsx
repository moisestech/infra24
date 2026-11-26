'use client'
import nextDynamic from 'next/dynamic'
import { MemoryAgentPageSkeleton } from '@/components/memory-agent/MemoryAgentPageSkeleton'

export const MemoryAgentShell = nextDynamic(
  () =>
    import('@/components/memory-agent/MemoryAgentShell').then((m) => m.MemoryAgentShell),
  {
    ssr: false,
    loading: () => (
      <MemoryAgentPageSkeleton slug="…" orgName="Memory Agent" />
    ),
  }
)


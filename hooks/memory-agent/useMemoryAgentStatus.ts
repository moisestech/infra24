'use client'

import { useCallback, useEffect, useState } from 'react'

import type { MemoryAgentStatusPayload } from '@/types/memory-agent'

export function useMemoryAgentStatus(orgSlug: string) {
  const base = `/api/organizations/by-slug/${encodeURIComponent(orgSlug)}/memory-agent`

  const [status, setStatus] = useState<MemoryAgentStatusPayload | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setStatusError(null)
    try {
      const res = await fetch(`${base}/status`)
      if (!res.ok) {
        throw new Error(`Status ${res.status}`)
      }
      const data = (await res.json()) as MemoryAgentStatusPayload
      setStatus(data)
    } catch (e) {
      setStatusError(e instanceof Error ? e.message : 'Failed to load status')
    } finally {
      setIsLoading(false)
    }
  }, [base])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { status, statusError, isLoading, refresh }
}

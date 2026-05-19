'use client'

import { useAuth } from '@clerk/nextjs'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  loadGeneratedAssetsFromStorage,
  persistGeneratedAssetsToStorage,
} from '@/lib/memory-agent/generated-assets'
import type { MemoryAgentGeneratedAsset, MemoryAgentGeneratedAssetStatus } from '@/types/memory-agent'

export type MemoryAgentAssetsSource = 'server' | 'local'

function assetCreatePayload(asset: MemoryAgentGeneratedAsset) {
  return {
    type: asset.type,
    title: asset.title,
    body: asset.body,
    summary: asset.summary,
    bullets: asset.bullets,
    sourceQuestion: asset.sourceQuestion,
    sourceMessageId: asset.sourceMessageId,
    audience: asset.audience,
    locationHint: asset.locationHint,
    expiresAt: asset.expiresAt,
    metadata: asset.metadata,
  }
}

export function useMemoryAgentGeneratedAssets(orgSlug: string) {
  const { userId, isLoaded } = useAuth()
  const [hydrated, setHydrated] = useState(false)
  const [assets, setAssets] = useState<MemoryAgentGeneratedAsset[]>([])
  const [source, setSource] = useState<MemoryAgentAssetsSource>('local')

  const apiBase = useMemo(
    () => `/api/organizations/by-slug/${encodeURIComponent(orgSlug)}/memory-agent/generated-assets`,
    [orgSlug]
  )

  const refreshFromServer = useCallback(async () => {
    if (!userId) {
      setAssets(loadGeneratedAssetsFromStorage(orgSlug))
      setSource('local')
      setHydrated(true)
      return
    }
    const res = await fetch(apiBase, { credentials: 'include' })
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean
      assets?: MemoryAgentGeneratedAsset[]
    }
    if (!res.ok || !data.ok || !Array.isArray(data.assets)) {
      setAssets(loadGeneratedAssetsFromStorage(orgSlug))
      setSource('local')
      setHydrated(true)
      return
    }
    setAssets(data.assets)
    setSource('server')
    setHydrated(true)
  }, [apiBase, orgSlug, userId])

  useEffect(() => {
    if (!isLoaded) return
    void refreshFromServer()
  }, [isLoaded, refreshFromServer])

  useEffect(() => {
    if (!hydrated || source !== 'local') return
    persistGeneratedAssetsToStorage(orgSlug, assets)
  }, [orgSlug, assets, hydrated, source])

  const addAsset = useCallback(
    async (asset: MemoryAgentGeneratedAsset): Promise<MemoryAgentGeneratedAsset> => {
      if (!userId) {
        setAssets((prev) => [asset, ...prev])
        return asset
      }
      const res = await fetch(apiBase, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset: assetCreatePayload(asset) }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        asset?: MemoryAgentGeneratedAsset
        error?: string
      }
      if (!res.ok || !data.ok || !data.asset) {
        setAssets((prev) => [asset, ...prev])
        setSource('local')
        return asset
      }
      setAssets((prev) => [data.asset!, ...prev])
      setSource('server')
      return data.asset
    },
    [apiBase, userId]
  )

  const patchAssetOnServer = useCallback(
    async (assetId: string, body: Record<string, unknown>) => {
      if (!userId) return false
      const res = await fetch(`${apiBase}/${encodeURIComponent(assetId)}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        asset?: MemoryAgentGeneratedAsset
      }
      if (!res.ok || !data.ok || !data.asset) return false
      setAssets((prev) => prev.map((a) => (a.id === assetId ? data.asset! : a)))
      return true
    },
    [apiBase, userId]
  )

  const setAssetStatus = useCallback(
    async (id: string, status: MemoryAgentGeneratedAssetStatus) => {
      if (source === 'server' && userId) {
        const ok = await patchAssetOnServer(id, { status })
        if (ok) return
      }
      setAssets((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
        )
      )
    },
    [patchAssetOnServer, source, userId]
  )

  const makePublicHandoff = useCallback(
    async (id: string) => {
      if (source === 'server' && userId) {
        const ok = await patchAssetOnServer(id, { makePublicHandoff: true })
        if (ok) return
      }
      setAssets((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                visibility: 'public' as const,
                channel: 'qr_handoff' as const,
                status: 'approved',
                approvedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      )
    },
    [patchAssetOnServer, source, userId]
  )

  return {
    assets,
    addAsset,
    setAssetStatus,
    makePublicHandoff,
    hydrated,
    assetsSource: source,
    refreshAssets: refreshFromServer,
  }
}

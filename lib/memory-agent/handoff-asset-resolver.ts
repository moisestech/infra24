/**
 * Resolves generated assets for the public Memory Agent handoff route.
 *
 * **Swap-in point for persistence:** `resolveHandoffAssetFromStorage` reads org-scoped
 * browser storage. The handoff page also loads from the server API first, then falls
 * back here for legacy local-only assets.
 */
import { findGeneratedAssetById } from '@/lib/memory-agent/generated-assets'
import type { MemoryAgentGeneratedAsset } from '@/types/memory-agent'

export function resolveHandoffAssetFromStorage(
  orgSlug: string,
  assetId: string
): MemoryAgentGeneratedAsset | undefined {
  return findGeneratedAssetById(orgSlug, assetId)
}

/** Async shape reserved for server-backed lookups (same return type). */
export async function resolveHandoffAsset(
  orgSlug: string,
  assetId: string
): Promise<MemoryAgentGeneratedAsset | undefined> {
  return resolveHandoffAssetFromStorage(orgSlug, assetId)
}

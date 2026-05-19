'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'

import { MemoryAgentHandoffCard } from '@/components/memory-agent/MemoryAgentHandoffCard'
import { Button } from '@/components/ui/button'
import {
  getMemoryAgentHandoffAbsoluteUrl,
  isGeneratedAssetHandoffPublished,
  isPublicHandoffAssetType,
} from '@/lib/memory-agent/generated-assets'
import { resolveHandoffAssetFromStorage } from '@/lib/memory-agent/handoff-asset-resolver'
import { cn } from '@/lib/utils'
import type { MemoryAgentGeneratedAsset } from '@/types/memory-agent'

function HandoffFallback({
  slug,
  title,
  body,
}: {
  slug: string
  title: string
  body: string
}) {
  const memoryHref = `/o/${encodeURIComponent(slug)}/memory-agent`
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm">
      <h1 className="font-serif text-lg font-semibold text-zinc-900">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{body}</p>
      <Button className="mt-6" asChild>
        <Link href={memoryHref}>Back to Memory Agent</Link>
      </Button>
    </div>
  )
}

type HandoffFailReason =
  | 'not_found'
  | 'internal'
  | 'not_public'
  | 'not_approved'
  | 'wrong_channel'
  | 'archived'
  | 'expired'
  | 'load_failed'

export function MemoryAgentHandoffPage({
  slug,
  assetId,
  orgName,
  primaryColor,
}: {
  slug: string
  assetId: string
  orgName: string
  primaryColor: string
}) {
  const [asset, setAsset] = useState<MemoryAgentGeneratedAsset | null | undefined>(undefined)
  const [failReason, setFailReason] = useState<HandoffFailReason | null>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setAsset(undefined)
      setFailReason(null)
      const apiUrl = `/api/organizations/by-slug/${encodeURIComponent(slug)}/memory-agent/generated-assets/${encodeURIComponent(assetId)}`
      let reason: HandoffFailReason | null = null
      try {
        const res = await fetch(apiUrl)
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean
          asset?: MemoryAgentGeneratedAsset
          reason?: string
        }
        if (cancelled) return
        if (res.ok && data.ok && data.asset) {
          setAsset(data.asset)
          setFailReason(null)
          return
        }
        if (data.reason === 'internal') {
          setAsset(null)
          setFailReason('internal')
          return
        }
        if (data.reason === 'not_public') reason = 'not_public'
        else if (data.reason === 'not_approved') reason = 'not_approved'
        else if (data.reason === 'wrong_channel') reason = 'wrong_channel'
        else if (data.reason === 'archived') reason = 'archived'
        else if (data.reason === 'expired') reason = 'expired'
        else reason = 'not_found'
      } catch {
        if (cancelled) return
        reason = 'load_failed'
      }

      const local = resolveHandoffAssetFromStorage(slug, assetId)
      if (
        local &&
        isPublicHandoffAssetType(local.type) &&
        local.status !== 'archived' &&
        isGeneratedAssetHandoffPublished(local)
      ) {
        setAsset(local)
        setFailReason(null)
        return
      }

      if (cancelled) return
      setAsset(null)
      setFailReason(reason ?? 'not_found')
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug, assetId])

  useEffect(() => {
    setOrigin(typeof window !== 'undefined' ? window.location.origin : '')
  }, [])

  const handoffAbs = useMemo(() => {
    if (!origin) return ''
    return getMemoryAgentHandoffAbsoluteUrl(origin, slug, assetId)
  }, [origin, slug, assetId])

  const pageBg = useMemo(
    () =>
      `linear-gradient(180deg, color-mix(in srgb, ${primaryColor} 10%, white) 0%, rgb(250 250 249) 42%, rgb(244 244 245) 100%)`,
    [primaryColor]
  )

  const vars = useMemo(
    () =>
      ({
        '--ma-primary': primaryColor,
      }) as CSSProperties,
    [primaryColor]
  )

  const memoryHref = `/o/${encodeURIComponent(slug)}/memory-agent`

  if (asset === undefined) {
    return (
      <div className="min-h-screen px-4 py-16 text-center text-sm text-zinc-500" style={{ background: pageBg, ...vars }}>
        Loading…
      </div>
    )
  }

  if (asset === null && failReason === 'internal') {
    return (
      <div className="min-h-screen px-4 py-12" style={{ background: pageBg, ...vars }}>
        <HandoffFallback
          slug={slug}
          title="Internal only"
          body="This asset is internal and cannot be viewed as a public handoff."
        />
      </div>
    )
  }

  if (asset === null && failReason === 'not_approved') {
    return (
      <div className="min-h-screen px-4 py-12" style={{ background: pageBg, ...vars }}>
        <HandoffFallback
          slug={slug}
          title="Awaiting approval"
          body="This handoff is not live for visitors yet. In Generated assets, use Approve Public QR when you are signed in with staff access."
        />
      </div>
    )
  }

  if (asset === null && failReason === 'not_public') {
    return (
      <div className="min-h-screen px-4 py-12" style={{ background: pageBg, ...vars }}>
        <HandoffFallback
          slug={slug}
          title="Not published"
          body="This handoff is still internal-only. Use Approve Public QR in Generated assets when you are signed in with staff access."
        />
      </div>
    )
  }

  if (asset === null && failReason === 'wrong_channel') {
    return (
      <div className="min-h-screen px-4 py-12" style={{ background: pageBg, ...vars }}>
        <HandoffFallback
          slug={slug}
          title="Not approved for QR"
          body="Mobile handoff links only serve assets approved for the QR handoff channel. In Generated assets, use Approve Public QR when you are signed in with staff access."
        />
      </div>
    )
  }

  if (asset === null && (failReason === 'archived' || failReason === 'expired')) {
    return (
      <div className="min-h-screen px-4 py-12" style={{ background: pageBg, ...vars }}>
        <HandoffFallback
          slug={slug}
          title="Handoff no longer available"
          body={
            failReason === 'expired'
              ? 'This handoff has expired.'
              : 'This asset has been archived and is not shown as a public handoff.'
          }
        />
      </div>
    )
  }

  if (asset === null && failReason === 'load_failed') {
    return (
      <div className="min-h-screen px-4 py-12" style={{ background: pageBg, ...vars }}>
        <HandoffFallback
          slug={slug}
          title="Handoff"
          body="This handoff is not available on this device yet. Check your connection and try again."
        />
      </div>
    )
  }

  if (asset === null) {
    return (
      <div className="min-h-screen px-4 py-12" style={{ background: pageBg, ...vars }}>
        <HandoffFallback
          slug={slug}
          title="Handoff"
          body="This handoff is not available yet."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen text-zinc-900" style={{ background: pageBg, ...vars }}>
      <header className="border-b border-zinc-200/80 bg-white/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link
            href={memoryHref}
            className="text-xs font-medium text-[color:var(--ma-primary)] hover:underline"
          >
            ← Memory Agent
          </Link>
          <span className="text-xs text-zinc-500">Visitor handoff</span>
        </div>
      </header>

      <main className={cn('mx-auto max-w-lg px-4 py-8 md:py-12', 'md:flex md:justify-center')}>
        <div className="w-full md:max-w-sm md:rounded-[2rem] md:border md:border-zinc-200/90 md:bg-zinc-100/50 md:p-3 md:shadow-2xl">
          <MemoryAgentHandoffCard
            orgName={orgName}
            slug={slug}
            asset={asset}
            handoffAbsoluteUrl={handoffAbs}
            primaryColor={primaryColor}
          />
        </div>
      </main>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Archive, Check, CheckCircle2, CircleDot, Copy, Eye, ExternalLink, Link2, ScanLine } from 'lucide-react'

import type { MemoryAgentAssetsSource } from '@/hooks/memory-agent/useMemoryAgentGeneratedAssets'
import { Button } from '@/components/ui/button'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'
import {
  MEMORY_AGENT_ASSET_TYPE_LABELS,
  MEMORY_AGENT_CHANNEL_LABELS,
  getMemoryAgentHandoffAbsoluteUrl,
  getMemoryAgentHandoffPath,
  isGeneratedAssetHandoffPublished,
  isPublicHandoffAssetType,
} from '@/lib/memory-agent/generated-assets'
import type {
  MemoryAgentGeneratedAsset,
  MemoryAgentGeneratedAssetStatus,
  MemoryAgentMode,
} from '@/types/memory-agent'

type QueueFilter =
  | 'all'
  | 'public_output'
  | 'staff_brief'
  | 'leadership_insight'
  | 'signage'
  | 'drafts'
  | 'approved'

const FILTER_OPTIONS_FULL: { id: QueueFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'public_output', label: 'Public' },
  { id: 'staff_brief', label: 'Staff' },
  { id: 'leadership_insight', label: 'Leadership' },
  { id: 'signage', label: 'Signage' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'approved', label: 'Approved' },
]

const FILTER_OPTIONS_PUBLIC: { id: QueueFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'public_output', label: 'Public' },
  { id: 'signage', label: 'Signage' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'approved', label: 'Approved' },
]

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

function filterAssets(assets: MemoryAgentGeneratedAsset[], filter: QueueFilter): MemoryAgentGeneratedAsset[] {
  const visible = assets.filter((a) => a.status !== 'archived')
  switch (filter) {
    case 'all':
      return visible
    case 'public_output':
      return visible.filter((a) => a.type === 'public_output')
    case 'staff_brief':
      return visible.filter((a) => a.type === 'staff_brief')
    case 'leadership_insight':
      return visible.filter((a) => a.type === 'leadership_insight')
    case 'signage':
      return visible.filter((a) => a.type === 'signage_draft' || a.type === 'qr_handoff')
    case 'drafts':
      return visible.filter((a) => a.status === 'draft')
    case 'approved':
      return visible.filter((a) => a.status === 'approved')
    default:
      return visible
  }
}

function previewBody(body: string, max = 140): string {
  const t = body.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

function formatExpires(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

function formatCreated(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function statusStyle(status: MemoryAgentGeneratedAssetStatus): string {
  switch (status) {
    case 'draft':
      return 'border-zinc-200 bg-zinc-50 text-zinc-600'
    case 'review':
      return 'border-amber-200 bg-amber-50 text-amber-900'
    case 'approved':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900'
    case 'published':
      return 'border-sky-200 bg-sky-50 text-sky-900'
    case 'archived':
      return 'border-[var(--ma-border)] bg-zinc-100 text-[var(--ma-text-faint)]'
    default:
      return 'border-zinc-200 bg-zinc-50 text-zinc-600'
  }
}

export function MemoryAgentGeneratedAssetsQueue({
  assets,
  orgSlug,
  mode,
  assetsSource = 'local',
  onSetStatus,
  onMakePublicHandoff,
}: {
  assets: MemoryAgentGeneratedAsset[]
  orgSlug: string
  mode: MemoryAgentMode
  assetsSource?: MemoryAgentAssetsSource
  onSetStatus: (id: string, status: MemoryAgentGeneratedAssetStatus) => void | Promise<void>
  onMakePublicHandoff?: (id: string) => void | Promise<void>
}) {
  const [filter, setFilter] = useState<QueueFilter>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedHandoffId, setCopiedHandoffId] = useState<string | null>(null)

  const scopedAssets = useMemo(
    () =>
      mode === 'public'
        ? assets.filter((a) => isPublicHandoffAssetType(a.type))
        : assets,
    [assets, mode]
  )

  const filterOptions = mode === 'public' ? FILTER_OPTIONS_PUBLIC : FILTER_OPTIONS_FULL

  useEffect(() => {
    if (mode === 'public' && (filter === 'staff_brief' || filter === 'leadership_insight')) {
      setFilter('all')
    }
  }, [mode, filter])

  const filtered = useMemo(() => filterAssets(scopedAssets, filter), [scopedAssets, filter])

  const onCopy = useCallback(async (id: string, body: string) => {
    const ok = await copyToClipboard(body)
    if (ok) {
      setCopiedId(id)
      window.setTimeout(() => setCopiedId(null), 2000)
    }
  }, [])

  const onCopyHandoffLink = useCallback(async (orgSlug: string, id: string) => {
    if (typeof window === 'undefined') return
    const url = getMemoryAgentHandoffAbsoluteUrl(window.location.origin, orgSlug, id)
    const ok = await copyToClipboard(url)
    if (ok) {
      setCopiedHandoffId(id)
      window.setTimeout(() => setCopiedHandoffId(null), 2000)
    }
  }, [])

  const activeCount = scopedAssets.filter((a) => a.status !== 'archived').length

  return (
    <section
      className={cn('rounded-xl p-4 shadow-sm', ma.card)}
      aria-label="Generated assets queue"
    >
      <div className="mb-3 flex flex-col gap-2 border-b border-[var(--ma-border)] pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-[var(--ma-text)]">Generated assets</h2>
          <span className="text-xs text-[var(--ma-text-muted)]">{activeCount} saved</span>
        </div>
        <p className="text-xs leading-relaxed text-[var(--ma-text-muted)]">
          Saved outputs become reusable institutional assets for signage, reports, web copy, staff prep,
          and leadership briefs.
          {assetsSource === 'server'
            ? ' Synced to your organization when you are signed in with access. The agent drafts; use Approve Public QR before sharing a lobby link or QR so visitors only see approved, public handoffs.'
            : ' Stored on this device (localStorage) until you sign in with org access to sync to the server.'}
        </p>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {filterOptions.map((opt) => (
          <Button
            key={opt.id}
            type="button"
            size="sm"
            variant={filter === opt.id ? 'secondary' : 'ghost'}
            className={cn(
              'h-8 rounded-full px-3 text-xs',
              filter === opt.id &&
                'border border-[color:color-mix(in_srgb,var(--ma-primary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--ma-primary)_10%,var(--ma-surface))] text-[var(--ma-text)]'
            )}
            onClick={() => setFilter(opt.id)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={cn('rounded-lg border border-dashed border-[var(--ma-border)] px-3 py-6 text-center', ma.cardInset, ma.bodyMuted)}>
          {activeCount === 0
            ? mode === 'public'
              ? 'Save a public output, signage draft, or QR handoff from an answer above.'
              : 'Save a public output, staff brief, leadership insight, signage draft, or QR handoff from an answer above.'
            : 'Nothing matches this filter.'}
        </p>
      ) : (
        <ul className="max-h-[min(24rem,50vh)] space-y-3 overflow-y-auto pr-1">
          {filtered.map((asset) => (
            <li
              key={asset.id}
              className={cn('rounded-lg p-3 text-sm shadow-sm', ma.cardInset)}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-[var(--ma-border-strong)] bg-[var(--ma-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">
                      {MEMORY_AGENT_ASSET_TYPE_LABELS[asset.type]}
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize',
                        statusStyle(asset.status)
                      )}
                    >
                      {asset.status}
                    </span>
                    {asset.visibility === 'public' ? (
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-900">
                        Public handoff
                      </span>
                    ) : mode === 'staff_operator' ? (
                      <span className="rounded-full border border-[var(--ma-border)] bg-[var(--ma-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--ma-text-muted)]">
                        Internal
                      </span>
                    ) : null}
                  </div>
                  <p className="font-medium text-[var(--ma-text)]">{asset.title}</p>
                  <p className="text-xs text-[var(--ma-text-muted)]">{previewBody(asset.body)}</p>
                  <p className="text-[10px] text-[var(--ma-text-faint)]">
                    {`From: "${asset.sourceQuestion.length > 80 ? `${asset.sourceQuestion.slice(0, 80)}…` : asset.sourceQuestion}" · ${formatCreated(asset.createdAt)}`}
                  </p>
                  {asset.channel || asset.expiresAt ? (
                    <p className="text-[10px] text-[var(--ma-text-muted)]">
                      {asset.channel ? (
                        <span>
                          Channel: {MEMORY_AGENT_CHANNEL_LABELS[asset.channel] ?? asset.channel}
                        </span>
                      ) : null}
                      {asset.channel && asset.expiresAt ? <span> · </span> : null}
                      {asset.expiresAt ? <span>Expires {formatExpires(asset.expiresAt)}</span> : null}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs"
                    onClick={() => void onCopy(asset.id, asset.body)}
                  >
                    {copiedId === asset.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy
                  </Button>
                  {asset.status !== 'archived' &&
                  isPublicHandoffAssetType(asset.type) &&
                  isGeneratedAssetHandoffPublished(asset) ? (
                    <>
                      <Button type="button" size="sm" variant="outline" className="h-8 gap-1 text-xs" asChild>
                        <Link href={getMemoryAgentHandoffPath(orgSlug, asset.id)} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open Public Handoff
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-xs"
                        onClick={() => void onCopyHandoffLink(orgSlug, asset.id)}
                      >
                        {copiedHandoffId === asset.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Link2 className="h-3.5 w-3.5" />
                        )}
                        {copiedHandoffId === asset.id ? 'Copied public link' : 'Copy Public Handoff Link'}
                      </Button>
                    </>
                  ) : null}
                  {asset.status !== 'archived' &&
                  isPublicHandoffAssetType(asset.type) &&
                  !isGeneratedAssetHandoffPublished(asset) &&
                  onMakePublicHandoff ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-8 gap-1 text-xs font-medium"
                      onClick={() => void onMakePublicHandoff(asset.id)}
                    >
                      <ScanLine className="h-3.5 w-3.5" />
                      Approve Public QR
                    </Button>
                  ) : null}
                  {asset.status === 'draft' ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1 text-xs text-[var(--ma-text-muted)]"
                      onClick={() => void onSetStatus(asset.id, 'review')}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </Button>
                  ) : null}
                  {(asset.status === 'draft' || asset.status === 'review') &&
                  !isPublicHandoffAssetType(asset.type) ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1 text-xs text-emerald-800"
                      onClick={() => void onSetStatus(asset.id, 'approved')}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mark reviewed
                    </Button>
                  ) : null}
                  {asset.status !== 'archived' ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1 text-xs text-[var(--ma-text-muted)]"
                      onClick={() => void onSetStatus(asset.id, 'archived')}
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </Button>
                  ) : null}
                  {asset.status === 'review' ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1 text-xs text-[var(--ma-text-muted)]"
                      onClick={() => void onSetStatus(asset.id, 'draft')}
                    >
                      <CircleDot className="h-3.5 w-3.5" />
                      Unmark
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

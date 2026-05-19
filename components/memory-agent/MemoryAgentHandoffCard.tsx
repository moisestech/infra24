'use client'

import Link from 'next/link'
import { useCallback, useState, type CSSProperties } from 'react'
import { ArrowLeft, Check, Copy, Link2, MessageCircle, Share2 } from 'lucide-react'

import QRCodeCanvas from '@/components/ui/QRCode'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MemoryAgentGeneratedAsset } from '@/types/memory-agent'

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

function formatHandoffTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function MemoryAgentHandoffCard({
  orgName,
  slug,
  asset,
  handoffAbsoluteUrl,
  primaryColor,
}: {
  orgName: string
  slug: string
  asset: MemoryAgentGeneratedAsset
  handoffAbsoluteUrl: string
  primaryColor: string
}) {
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const memoryHref = `/o/${encodeURIComponent(slug)}/memory-agent`
  const followUpHref = `${memoryHref}?q=${encodeURIComponent(asset.sourceQuestion.slice(0, 600))}`

  const onCopy = useCallback(async () => {
    const text = `${asset.title}\n\n${asset.body}`
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }, [asset.body, asset.title])

  const onCopyLink = useCallback(async () => {
    if (!handoffAbsoluteUrl) return
    const ok = await copyToClipboard(handoffAbsoluteUrl)
    if (ok) {
      setCopiedLink(true)
      window.setTimeout(() => setCopiedLink(false), 2000)
    }
  }, [handoffAbsoluteUrl])

  const onShare = useCallback(async () => {
    if (!navigator.share) return
    try {
      await navigator.share({
        title: asset.title,
        text: asset.body.slice(0, 2000),
        url: handoffAbsoluteUrl,
      })
    } catch {
      // user cancelled
    }
  }, [asset.body, asset.title, handoffAbsoluteUrl])

  const typeLabel =
    asset.type === 'signage_draft'
      ? 'Signage'
      : asset.type === 'qr_handoff'
        ? 'QR handoff'
        : 'Public guide'

  const vars = { '--handoff-accent': primaryColor } as CSSProperties

  return (
    <article
      className={cn('overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xl')}
      style={vars}
    >
      <header
        className="border-b border-zinc-100 px-5 py-4"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 12%, white) 0%, white 55%)`,
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{orgName}</p>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Featured this week
        </p>
        <p className="mt-1 text-xs font-medium text-[color:var(--handoff-accent)]">{typeLabel}</p>
        <h1 className="mt-2 font-serif text-xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-2xl">
          {asset.title}
        </h1>
      </header>

      <div className="space-y-5 px-5 py-5 text-sm text-zinc-700">
        <div className="whitespace-pre-wrap leading-relaxed text-zinc-800">{asset.body}</div>

        {asset.bullets && asset.bullets.length > 0 ? (
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Related</p>
            <ul className="space-y-1.5 text-sm leading-relaxed text-zinc-700">
              {asset.bullets.map((b, i) => (
                <li key={`${i}-${b.slice(0, 20)}`} className="flex gap-2">
                  <span className="shrink-0 text-[color:var(--handoff-accent)]">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-xs text-zinc-600">
          <p className="font-medium text-zinc-700">Generated from</p>
          <p className="mt-1 font-serif italic leading-snug text-zinc-600">
            “{asset.sourceQuestion.length > 280 ? `${asset.sourceQuestion.slice(0, 280)}…` : asset.sourceQuestion}”
          </p>
        </div>

        <p className="text-[10px] text-zinc-400">
          <span className="font-medium text-zinc-500">Created </span>
          {formatHandoffTimestamp(asset.createdAt)}
          {asset.updatedAt ? (
            <>
              <span className="mx-1.5 text-zinc-300">·</span>
              <span className="font-medium text-zinc-500">Updated </span>
              {formatHandoffTimestamp(asset.updatedAt)}
            </>
          ) : null}
        </p>

        {handoffAbsoluteUrl ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50/90 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Scan to open this guide</p>
            <QRCodeCanvas value={handoffAbsoluteUrl} size={148} className="border border-white shadow-sm" />
            <p className="max-w-[14rem] break-all text-center text-[10px] text-zinc-400">{handoffAbsoluteUrl}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
          <Button
            type="button"
            size="sm"
            className="gap-1 border-0 text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: 'var(--handoff-accent)' }}
            asChild
          >
            <Link href={followUpHref}>
              <MessageCircle className="h-3.5 w-3.5" />
              Ask a follow-up
            </Link>
          </Button>
          <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => void onCopy()}>
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
            <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => void onShare()}>
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          ) : null}
          {handoffAbsoluteUrl ? (
            <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => void onCopyLink()}>
              {copiedLink ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Link2 className="h-3.5 w-3.5" />
              )}
              {copiedLink ? 'Link copied' : 'Copy link'}
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="ghost" className="gap-1 text-zinc-600" asChild>
            <Link href={memoryHref}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Memory Agent
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

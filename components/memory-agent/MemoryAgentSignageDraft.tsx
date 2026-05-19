'use client'

import { useCallback, useState } from 'react'
import { BookmarkPlus, Check, Copy } from 'lucide-react'

import QRCodeCanvas from '@/components/ui/QRCode'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MemoryAgentSignageDraft } from '@/types/memory-agent'

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

function formatSignageText(draft: MemoryAgentSignageDraft): string {
  let s = draft.title
  if (draft.subtitle) s += `\n${draft.subtitle}`
  s += `\n\n${draft.body}`
  const meta: string[] = []
  if (draft.audience) meta.push(`Audience: ${draft.audience}`)
  if (draft.locationHint) meta.push(`Location: ${draft.locationHint}`)
  if (draft.expiresAt) meta.push(`Expires: ${draft.expiresAt}`)
  if (meta.length) s += `\n\n${meta.join('\n')}`
  return s.trim()
}

function formatQrCta(draft: MemoryAgentSignageDraft): string {
  const label = draft.qrLabel?.trim() || 'Scan to explore'
  return `${label}\n${draft.cta}`.trim()
}

function formatAll(draft: MemoryAgentSignageDraft): string {
  return `${formatSignageText(draft)}\n\n---\n${formatQrCta(draft)}`
}

function SignageCopyButton({
  label,
  text,
  className,
}: {
  label: string
  text: string
  className?: string
}) {
  const [done, setDone] = useState(false)
  const onCopy = useCallback(async () => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setDone(true)
      window.setTimeout(() => setDone(false), 2000)
    }
  }, [text])

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className={cn(
        'gap-1 border-white/20 bg-white/5 text-zinc-100 hover:bg-white/10 hover:text-white',
        className
      )}
      onClick={() => void onCopy()}
    >
      {done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? 'Copied' : label}
    </Button>
  )
}

function SignageSaveButton({
  label,
  onSave,
}: {
  label: string
  onSave?: () => void | Promise<void>
}) {
  const [done, setDone] = useState(false)
  const handle = useCallback(() => {
    if (!onSave) return
    void (async () => {
      await onSave()
      setDone(true)
      window.setTimeout(() => setDone(false), 1600)
    })()
  }, [onSave])
  if (!onSave) return null
  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className="gap-1 border border-white/25 bg-white/15 text-white hover:bg-white/25"
      onClick={handle}
    >
      {done ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
      {done ? 'Saved' : label}
    </Button>
  )
}

export function MemoryAgentSignageDraft({
  draft,
  onSaveSignage,
  onSaveQrHandoff,
  handoffPreviewAbsoluteUrl,
}: {
  draft: MemoryAgentSignageDraft
  onSaveSignage?: () => void | Promise<void>
  onSaveQrHandoff?: () => void | Promise<void>
  /** After saving signage or QR handoff, encodes the live visitor handoff URL (this browser / origin). */
  handoffPreviewAbsoluteUrl?: string
}) {
  const qrCaption = draft.qrLabel?.trim() || 'Scan to explore'
  const saveSignage = onSaveSignage
  const saveQr = onSaveQrHandoff

  return (
    <section
      className="rounded-xl border border-[color:color-mix(in_srgb,var(--ma-primary)_28%,rgb(39_39_42))] bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-4 text-zinc-50 shadow-lg ring-1 ring-white/10"
      aria-label="Signage draft preview"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Signage draft</p>
        {draft.sourceOutput === 'public' ? (
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-300">
            From public output
          </span>
        ) : null}
      </div>

      <div className="rounded-lg border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
        <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight text-white md:text-xl">
          {draft.title}
        </h3>
        {draft.subtitle ? (
          <p className="mt-1 text-sm font-medium text-[color:color-mix(in_srgb,var(--ma-accent)_75%,white)]">
            {draft.subtitle}
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-zinc-200">{draft.body}</p>

        <div className="mt-5 flex flex-col items-center gap-2 border-t border-white/10 pt-4">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-zinc-400">
            {qrCaption}
          </p>
          {handoffPreviewAbsoluteUrl ? (
            <div className="flex flex-col items-center gap-2">
              <QRCodeCanvas
                value={handoffPreviewAbsoluteUrl}
                size={112}
                className="rounded-lg border border-white/20 bg-white shadow-md"
              />
              <p className="max-w-[12rem] break-all text-center text-[9px] leading-snug text-zinc-500">
                {handoffPreviewAbsoluteUrl}
              </p>
            </div>
          ) : (
            <div
              className="flex aspect-square w-28 flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/25 bg-zinc-950/80 text-zinc-500"
              aria-hidden
            >
              <span className="text-center text-[10px] font-medium uppercase tracking-wider">
                Save asset for QR
              </span>
            </div>
          )}
          <p className="text-center text-sm font-semibold text-white">{draft.cta}</p>
        </div>

        {draft.audience || draft.locationHint || draft.expiresAt ? (
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/5 pt-3 text-[10px] text-zinc-500">
            {draft.audience ? <span>Audience: {draft.audience}</span> : null}
            {draft.locationHint ? <span>{draft.locationHint}</span> : null}
            {draft.expiresAt ? <span>Until {draft.expiresAt}</span> : null}
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-zinc-500">
        {handoffPreviewAbsoluteUrl
          ? 'QR encodes the visitor handoff page for this saved asset (opens on devices that can load the asset — use Generated assets → Copy Handoff Link for sharing).'
          : 'Save signage or QR handoff to generate a real QR for the visitor handoff route, or use Generated assets → Open Handoff / Copy Handoff Link.'}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <SignageCopyButton label="Copy Signage Text" text={formatSignageText(draft)} />
        <SignageCopyButton label="Copy QR CTA" text={formatQrCta(draft)} />
        <SignageCopyButton label="Copy All" text={formatAll(draft)} />
        <SignageSaveButton label="Save Signage Draft" onSave={saveSignage} />
        <SignageSaveButton label="Save QR Handoff" onSave={saveQr} />
      </div>
    </section>
  )
}

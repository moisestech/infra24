'use client'

import { Check, Shield, X } from 'lucide-react'

import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'
import type { MemoryAgentContextInspector } from '@/types/memory-agent'

function BoolRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={cn('flex items-center gap-2 text-xs', ma.bodyMuted)}>
      {ok ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
      ) : (
        <X className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      )}
      <span>{label}</span>
    </div>
  )
}

export function MemoryAgentContextInspectorPanel({ data }: { data: MemoryAgentContextInspector }) {
  const v = data.validation
  const r = data.retrieval

  return (
    <details
      className={cn(
        'group rounded-lg border border-dashed border-[var(--ma-border-strong)] shadow-inner',
        ma.cardInset
      )}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-medium marker:hidden [&::-webkit-details-marker]:hidden',
          ma.bodyMuted
        )}
      >
        <Shield className="h-3.5 w-3.5 text-[color:var(--ma-primary)]" aria-hidden />
        <span>Memory context inspector</span>
        <span className="rounded-full bg-[var(--ma-surface-muted)] px-2 py-0.5 text-[10px] font-normal uppercase tracking-wide text-[var(--ma-text-muted)]">
          Internal
        </span>
        <span className="ml-auto text-[10px] font-normal text-[var(--ma-text-faint)] group-open:hidden">
          Open
        </span>
        <span className="ml-auto hidden text-[10px] font-normal text-[var(--ma-text-faint)] group-open:inline">
          Close
        </span>
      </summary>
      <div className="space-y-4 border-t border-[var(--ma-border)] px-3 py-3">
        <div className="space-y-1 text-xs">
          <p>
            <span className="font-semibold text-[var(--ma-text-muted)]">Question</span>
            <span className={cn('mt-0.5 block whitespace-pre-wrap', ma.body)}>{data.question}</span>
          </p>
          <p className={ma.caption}>
            <span className="font-semibold">Tenant</span> {data.organizationSlug}{' '}
            <span className="mx-1 text-[var(--ma-border)]">·</span>
            <span className="font-semibold">Mode</span> {data.mode}
          </p>
        </div>

        {r ? (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">
              Retrieval
            </p>
            <p className={ma.caption}>
              {r.selectedCount} in context window
              {typeof r.totalCandidateCount === 'number'
                ? ` · ${r.totalCandidateCount} eligible after governance`
                : null}
              {typeof r.baseTotalCount === 'number' ? ` · ${r.baseTotalCount} rows in base` : null}
            </p>
            <ul
              className={cn(
                'max-h-40 space-y-1 overflow-y-auto rounded border border-[var(--ma-border)] p-2 text-[11px] leading-snug',
                'bg-[var(--ma-surface)]'
              )}
            >
              {r.selectedRecords.map((rec, i) => (
                <li
                  key={rec.id}
                  className="flex flex-wrap gap-x-2 border-b border-[var(--ma-border)] pb-1 last:border-0"
                >
                  <span className="font-mono text-[var(--ma-text-muted)]">{i + 1}.</span>
                  <span className="font-mono text-[var(--ma-text-muted)]">{rec.id}</span>
                  {rec.name ? <span className={ma.body}>{rec.name}</span> : null}
                  {typeof rec.score === 'number' ? (
                    <span className={ma.caption}>score {rec.score.toFixed(3)}</span>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className={ma.caption}>
              <span className="font-semibold">Allowed artist IDs</span>{' '}
              <span className="font-mono break-all">{r.allowedArtistIds.join(', ') || '(none)'}</span>
            </p>
          </div>
        ) : null}

        {data.contextPreview ? (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">
              User message to model ({data.contextPreview.characterCount} chars)
            </p>
            <pre
              className={cn(
                'max-h-52 overflow-auto rounded border border-[var(--ma-border)] bg-zinc-950 p-2',
                'font-mono text-[10px] leading-relaxed text-zinc-100'
              )}
            >
              {data.contextPreview.text}
            </pre>
          </div>
        ) : null}

        {v ? (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">
              Validation
            </p>
            <div
              className={cn(
                'grid gap-1 rounded border border-[var(--ma-border)] p-2 sm:grid-cols-2',
                'bg-[var(--ma-surface)]'
              )}
            >
              <BoolRow label="JSON parsed" ok={v.jsonParsed} />
              <BoolRow label="All artist card IDs in context window" ok={!v.artistsFiltered} />
              <BoolRow label="Triple outputs accepted" ok={v.outputsAccepted} />
              <BoolRow label="Signage draft accepted" ok={v.signageAccepted} />
            </div>
            {v.droppedFields?.length ? (
              <div className={cn('rounded border p-2 text-[11px]', ma.alertAmber)}>
                <span className="font-semibold">Dropped / trimmed: </span>
                {v.droppedFields.join(' · ')}
              </div>
            ) : null}
            {v.warnings?.length ? (
              <ul className={cn('list-disc space-y-0.5 pl-4 text-[11px]', ma.bodyMuted)}>
                {v.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <p className={cn('leading-relaxed', ma.finePrint)}>
          Trust panel: same bounded evidence the model saw (plus the full user prompt). Not shown in public
          preview.
        </p>
      </div>
    </details>
  )
}

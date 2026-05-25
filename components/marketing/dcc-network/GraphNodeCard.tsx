import Link from 'next/link'
import type { DccGraphMode, DccGraphNodeData } from '@/lib/marketing/dcc-crm-graph-types'
import { cn } from '@/lib/utils'

function NodeAvatar({ node }: { node: DccGraphNodeData }) {
  const title = node.displayLabel || node.label
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  if (node.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={node.imageUrl}
        alt=""
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />
    )
  }

  const bg =
    node.kind === 'seedCandidate'
      ? 'bg-violet-200 text-violet-900 dark:bg-violet-900/50 dark:text-violet-100'
      : node.kind === 'institution'
        ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
        : 'bg-teal-200 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100'

  return (
    <div className={cn('flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-sm font-semibold', bg)}>
      {initials || '?'}
    </div>
  )
}

function Badge({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        muted
          ? 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
          : 'bg-[var(--cdc-teal)]/15 text-teal-900 dark:text-teal-200'
      )}
    >
      {children}
    </span>
  )
}

export type GraphNodeCardProps = {
  node: DccGraphNodeData
  mode?: DccGraphMode
  onClose?: () => void
  compact?: boolean
  className?: string
}

export function GraphNodeCard({ node, mode = 'active', onClose, compact, className }: GraphNodeCardProps) {
  const title = node.displayLabel || node.label
  const role = node.constituentLabel || node.contactCategory

  return (
    <div className={cn('space-y-4', className)}>
      {onClose ? (
        <button
          type="button"
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          onClick={onClose}
        >
          Close
        </button>
      ) : null}

      <div className="flex gap-3">
        {!compact ? <NodeAvatar node={node} /> : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-tight text-neutral-900 dark:text-neutral-100">{title}</h3>
          {node.anonymized ? (
            <p className="mt-1 text-xs text-neutral-500">Research node — name hidden on public view</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {role ? <Badge>{role}</Badge> : null}
            {node.nodePriority ? <Badge muted>{node.nodePriority}</Badge> : null}
            {node.demoReadiness ? <Badge muted>{node.demoReadiness}</Badge> : null}
            {node.graphLayer === 'Both' ? <Badge>Bridge node</Badge> : null}
          </div>
        </div>
      </div>

      {node.publicNodeSummary ? (
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{node.publicNodeSummary}</p>
      ) : null}

      <dl className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
        {node.miamiConnectionType ? (
          <div>
            <dt className="text-xs text-neutral-400">Miami connection</dt>
            <dd>{node.miamiConnectionType}</dd>
          </div>
        ) : null}
        {node.city ? (
          <div>
            <dt className="text-xs text-neutral-400">City</dt>
            <dd>{node.city}</dd>
          </div>
        ) : null}
        {node.institutionSource ? (
          <div>
            <dt className="text-xs text-neutral-400">Institution / source</dt>
            <dd>{node.institutionSource}</dd>
          </div>
        ) : null}
        {node.warmth ? (
          <div>
            <dt className="text-xs text-neutral-400">Warmth</dt>
            <dd>{node.warmth}</dd>
          </div>
        ) : null}
        {node.reviewStatus ? (
          <div>
            <dt className="text-xs text-neutral-400">Review status</dt>
            <dd>{node.reviewStatus}</dd>
          </div>
        ) : null}
        {node.dccSignupStatus ? (
          <div>
            <dt className="text-xs text-neutral-400">DCC signup status</dt>
            <dd>{node.dccSignupStatus}</dd>
          </div>
        ) : null}
        {mode === 'admin' && node.publicProfileConsent ? (
          <div>
            <dt className="text-xs text-neutral-400">Public profile consent</dt>
            <dd>{node.publicProfileConsent}</dd>
          </div>
        ) : null}
        {mode === 'admin' && node.consentStatus ? (
          <div>
            <dt className="text-xs text-neutral-400">Consent status</dt>
            <dd>{node.consentStatus}</dd>
          </div>
        ) : null}
        {mode === 'admin' && node.seedFitScore != null ? (
          <div>
            <dt className="text-xs text-neutral-400">Seed fit score</dt>
            <dd>{node.seedFitScore}</dd>
          </div>
        ) : null}
      </dl>

      {node.practiceTags?.length ? (
        <div>
          <p className="text-xs text-neutral-400">Practice tags</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {node.practiceTags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 text-sm">
        {node.website ? (
          <a href={node.website} target="_blank" rel="noopener noreferrer" className="text-[var(--cdc-teal)] underline-offset-4 hover:underline">
            Website
          </a>
        ) : null}
        {node.sourceUrl ? (
          <a href={node.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--cdc-teal)] underline-offset-4 hover:underline">
            Source
          </a>
        ) : null}
        {node.contextLinks?.map((url) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="truncate text-[var(--cdc-teal)] underline-offset-4 hover:underline">
            {url}
          </a>
        ))}
      </div>

      {!compact ? (
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/network/signup?pathway=index"
            className="rounded-lg bg-neutral-900 px-3 py-2 text-center text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Join Miami&apos;s Digital Culture Map
          </Link>
        </div>
      ) : null}
    </div>
  )
}

export function GraphNodeTooltip({ node }: { node: DccGraphNodeData }) {
  const title = node.displayLabel || node.label
  return (
    <div className="space-y-1">
      <p className="font-semibold">{title}</p>
      {node.constituentLabel ? <p className="text-neutral-500">{node.constituentLabel}</p> : null}
      {node.publicNodeSummary ? <p className="line-clamp-2 text-neutral-600">{node.publicNodeSummary}</p> : null}
    </div>
  )
}

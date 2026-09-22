import { proposalMediaSrc } from '@/lib/dcc/fabrication/proposal-media'
import type { ProposalMediaSlot } from '@/lib/dcc/fabrication/schema'
import { cn } from '@/lib/utils'
import { proposalMediaExists } from '@/components/dcc/fabrication/proposal/ProposalChrome'

const ASPECT_CLASS: Record<ProposalMediaSlot['aspect'], string> = {
  '16/9': 'aspect-[16/9]',
  '21/9': 'aspect-[21/9]',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-[1/1]',
}

export function ProposalMediaFigure({
  slug,
  slot,
  className,
}: {
  slug: string
  slot: ProposalMediaSlot
  className?: string
}) {
  const exists = proposalMediaExists(slug, slot.filename)
  const src = proposalMediaSrc(slug, slot.filename)

  if (exists) {
    return (
      <figure
        className={cn(
          'overflow-hidden rounded-2xl border border-[var(--cdc-border)] bg-white dark:bg-neutral-950',
          className
        )}
      >
        <div className={cn('relative w-full min-w-0 bg-neutral-100', ASPECT_CLASS[slot.aspect])}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={slot.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        {slot.caption ? (
          <figcaption className="border-t border-[var(--cdc-border)] px-3 py-2 text-xs text-neutral-500">
            {slot.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return (
    <figure
      className={cn(
        'overflow-hidden rounded-2xl border border-dashed border-[var(--cdc-border)] bg-neutral-50 dark:bg-neutral-900/40',
        className
      )}
    >
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-1 bg-neutral-100 px-4 py-8 text-center dark:bg-neutral-900',
          ASPECT_CLASS[slot.aspect]
        )}
      >
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
          {slot.id}
        </p>
        <p className="font-mono text-[11px] text-neutral-500">{slot.filename}</p>
      </div>
      {slot.caption ? (
        <figcaption className="border-t border-[var(--cdc-border)] px-3 py-2 text-xs text-neutral-500">
          {slot.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

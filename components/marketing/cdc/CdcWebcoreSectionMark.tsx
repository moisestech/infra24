import { cn } from '@/lib/utils'

const MARK_COLORS = [
  'text-[var(--cdc-teal)]',
  'text-[var(--cdc-coral)]',
  'text-[var(--cdc-magenta)]',
] as const

type CdcWebcoreSectionMarkProps = {
  eyebrow: string
  brackets?: boolean
  className?: string
}

/** Shared mono eyebrow used on home-adjacent marketing bands. */
export function CdcWebcoreSectionMark({
  eyebrow,
  brackets = true,
  className,
}: CdcWebcoreSectionMarkProps) {
  return (
    <p
      className={cn(
        'cdc-font-mono-accent font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400',
        brackets && 'cdc-webcore-brackets inline-block px-4 py-2',
        className
      )}
    >
      {eyebrow}
    </p>
  )
}

type CdcWebcoreSystemLabelsProps = {
  labels: readonly string[]
  className?: string
}

/** Teal / coral / magenta bit-labels (SYLLABUS · LAB · HANDBOOK). */
export function CdcWebcoreSystemLabels({ labels, className }: CdcWebcoreSystemLabelsProps) {
  return (
    <p
      className={cn(
        'cdc-font-mono-accent flex flex-wrap items-center gap-x-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] sm:text-[11px]',
        className
      )}
    >
      {labels.map((label, i) => (
        <span key={`${label}-${i}`} className="inline-flex items-center">
          {i > 0 ? (
            <span className="mr-2 text-neutral-300 dark:text-neutral-600" aria-hidden>
              ·
            </span>
          ) : null}
          <span className={MARK_COLORS[i % MARK_COLORS.length]}>{label}</span>
        </span>
      ))}
    </p>
  )
}

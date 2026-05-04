import Link from 'next/link';
import { bornDigitalEra } from '@/lib/marketing/content';
import { cn } from '@/lib/utils';

type EraPillProps = {
  /** `default` for cream/white surfaces; `onDark` for dark hero blocks like `/network`. */
  tone?: 'default' | 'onDark';
  align?: 'left' | 'right';
  className?: string;
};

const surfaceByTone: Record<NonNullable<EraPillProps['tone']>, string> = {
  default:
    'border-[var(--cdc-border)] bg-white/70 text-neutral-700 hover:border-[var(--cdc-teal)] hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:text-neutral-100',
  onDark:
    'border-neutral-700 bg-neutral-900/40 text-neutral-200 hover:border-[var(--cdc-teal)] hover:text-white',
};

/**
 * Small inline link that advertises the Born-Digital Era umbrella from any
 * marketing hub page (programs, network, events, journal). Server-rendered;
 * no hydration cost. Pure additive surface — does not replace existing
 * eyebrows or hero copy.
 */
export function EraPill({ tone = 'default', align = 'left', className }: EraPillProps) {
  return (
    <div
      className={cn(
        'flex w-full',
        align === 'right' ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <Link
        href={bornDigitalEra.pillHref}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors',
          surfaceByTone[tone]
        )}
      >
        <span aria-hidden className="text-[var(--cdc-teal)]">
          ↳
        </span>
        <span>{bornDigitalEra.pillLabel}</span>
        <span aria-hidden className="text-[var(--cdc-teal)]">
          →
        </span>
      </Link>
    </div>
  );
}

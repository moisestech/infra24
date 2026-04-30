import Link from 'next/link';
import { cn } from '@/lib/utils';

type CtaBlockProps = {
  headline: string;
  body?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
};

export function CtaBlock({
  headline,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  className,
}: CtaBlockProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-8 sm:px-8 sm:py-10 dark:border-neutral-700 dark:bg-neutral-900/50',
        className
      )}
    >
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
        {headline}
      </h2>
      {body && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {body}
        </p>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={primaryHref}
          className="inline-flex justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:opacity-95"
        >
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="inline-flex justify-center text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

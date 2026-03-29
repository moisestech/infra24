import Link from 'next/link';
import { cn } from '@/lib/utils';

type CtaBandProps = {
  headline: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tertiaryLabel?: string;
  tertiaryHref?: string;
  className?: string;
};

export function CtaBand({
  headline,
  body,
  primaryLabel = 'Book a Communication Infrastructure Audit',
  primaryHref = '/audit',
  secondaryLabel = 'Explore pilot systems',
  secondaryHref = '/pilots',
  tertiaryLabel,
  tertiaryHref = '/contact',
  className,
}: CtaBandProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-10 sm:px-10',
        className
      )}
    >
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
        {headline}
      </h2>
      {body && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">{body}</p>
      )}
      <div className="mt-6 flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
        <Link
          href={primaryHref}
          className="inline-flex justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex justify-center text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
        >
          {secondaryLabel}
        </Link>
        {tertiaryLabel && (
          <Link
            href={tertiaryHref}
            className="inline-flex justify-center text-sm font-medium text-neutral-600 underline-offset-4 hover:underline"
          >
            {tertiaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

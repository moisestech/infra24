import Link from 'next/link';

import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients';
import { cn } from '@/lib/utils';

type CaseStudyCardProps = {
  slug: string;
  title: string;
  challenge: string;
  whatWeDid: string;
  outcome: string;
  coverGradient?: MarketingGradientId;
  coverAlt?: string;
};

export function CaseStudyCard({
  slug,
  title,
  challenge,
  whatWeDid,
  outcome,
  coverGradient,
  coverAlt,
}: CaseStudyCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {coverGradient && coverAlt ? (
        <div
          className={cn(
            'aspect-[16/9] w-full',
            marketingGradientSurfaceClass(coverGradient)
          )}
          role="img"
          aria-label={coverAlt}
        />
      ) : null}
      <div className="flex flex-col p-6">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-neutral-700">Challenge</dt>
            <dd className="mt-0.5 text-neutral-600">{challenge}</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-700">What we did</dt>
            <dd className="mt-0.5 text-neutral-600">{whatWeDid}</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-700">Outcome</dt>
            <dd className="mt-0.5 text-neutral-600">{outcome}</dd>
          </div>
        </dl>
        <Link
          href={`/projects/${slug}`}
          className="mt-4 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}

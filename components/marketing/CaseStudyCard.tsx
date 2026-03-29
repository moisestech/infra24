import Link from 'next/link';

type CaseStudyCardProps = {
  slug: string;
  title: string;
  challenge: string;
  whatWeDid: string;
  outcome: string;
};

export function CaseStudyCard({
  slug,
  title,
  challenge,
  whatWeDid,
  outcome,
}: CaseStudyCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-neutral-200 bg-white p-6">
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
        href={`/case-studies/${slug}`}
        className="mt-4 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
      >
        Read more
      </Link>
    </article>
  );
}

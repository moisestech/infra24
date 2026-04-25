import Link from 'next/link'
import type { Institution } from '@/lib/course/types'
import { ANCHOR_WORK_PLACEHOLDER_ALT, ANCHOR_WORK_PLACEHOLDER_IMAGE } from '@/lib/course/anchor-work-visual'

export type InstitutionCardProps = {
  institution: Institution
}

export function InstitutionCard({ institution }: InstitutionCardProps) {
  const imgSrc = institution.image?.src?.trim()
  const imgAlt = institution.image?.alt ?? ANCHOR_WORK_PLACEHOLDER_ALT

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <img
          src={imgSrc || ANCHOR_WORK_PLACEHOLDER_IMAGE}
          alt={imgAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-neutral-950 dark:text-neutral-50">{institution.name}</h3>
      <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{institution.description}</p>
      {institution.website ? (
        <div className="mt-4">
          <Link
            href={institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Visit site
          </Link>
        </div>
      ) : null}
    </article>
  )
}

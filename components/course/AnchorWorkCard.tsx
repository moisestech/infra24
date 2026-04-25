import type { Work } from '@/lib/course/types'
import { LessonExternalAnchor } from '@/components/course/LessonExternalAnchor'
import { ANCHOR_WORK_PLACEHOLDER_ALT, ANCHOR_WORK_PLACEHOLDER_IMAGE } from '@/lib/course/anchor-work-visual'

export type AnchorWorkCardProps = {
  work: Work
}

export function AnchorWorkCard({ work }: AnchorWorkCardProps) {
  const imgSrc = work.image?.src?.trim()
  const imgAlt = work.image?.alt ?? ANCHOR_WORK_PLACEHOLDER_ALT

  return (
    <article className="h-full overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={imgSrc || ANCHOR_WORK_PLACEHOLDER_IMAGE}
          alt={imgAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {work.artist}
          {work.year ? ` · ${work.year}` : ''}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-neutral-950 dark:text-neutral-50">{work.title}</h3>
        {work.institution ? (
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{work.institution}</p>
        ) : null}
        <p className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300">{work.description}</p>
        {work.links?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {work.links.map((link) => (
              <LessonExternalAnchor
                key={`${work.title}-${link.href}`}
                href={link.href}
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                {link.label}
              </LessonExternalAnchor>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

import Link from 'next/link'
import type { CuratorLens } from '@/lib/course/types'
import { LessonPersonAvatar } from '@/components/course/LessonPersonAvatar'
import { instagramProfileHref } from '@/lib/course/instagram-href'

export type CuratorLensCardProps = {
  lens: CuratorLens
}

export function CuratorLensCard({ lens }: CuratorLensCardProps) {
  const ig = lens.instagram?.trim()
  const igHref = ig ? instagramProfileHref(ig) : ''

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Curator / writer lens
      </p>
      <div className="mt-3 flex items-start gap-3">
        <LessonPersonAvatar name={lens.name} image={lens.image} size="md" className="shrink-0" />
        <h3 className="text-xl font-semibold leading-snug text-neutral-950 dark:text-neutral-50">{lens.name}</h3>
      </div>
      <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{lens.description}</p>
      {lens.quote ? (
        <blockquote className="mt-4 rounded-2xl border-l-4 border-neutral-300 pl-4 italic text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
          {lens.quote}
        </blockquote>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {lens.website ? (
          <Link
            href={lens.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Read more
          </Link>
        ) : null}
        {igHref ? (
          <Link
            href={igHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Instagram
          </Link>
        ) : null}
      </div>
    </article>
  )
}

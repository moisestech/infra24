import Link from 'next/link'
import type { Artist } from '@/lib/course/types'
import { LessonPersonAvatar } from '@/components/course/LessonPersonAvatar'
import { instagramProfileHref } from '@/lib/course/instagram-href'

export type ArtistSpotlightCardProps = {
  artist: Artist
}

export function ArtistSpotlightCard({ artist }: ArtistSpotlightCardProps) {
  const ig = artist.instagram?.trim()
  const igHref = ig ? instagramProfileHref(ig) : ''

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex gap-4">
        <LessonPersonAvatar name={artist.name} image={artist.image} size="md" className="shrink-0" />
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">{artist.name}</h3>
          <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{artist.description}</p>
        </div>
      </div>
      {artist.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {artist.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-600 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {artist.website ? (
          <Link
            href={artist.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Website
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

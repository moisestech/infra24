import type { VernacularMoodBoardTile, ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type VernacularMoodBoardProps = {
  title: string
  description: string
  tiles: VernacularMoodBoardTile[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

const tileSurfaces = [
  'border-pink-200/80 bg-pink-50/90 dark:border-pink-500/30 dark:bg-pink-950/35',
  'border-violet-200/80 bg-violet-50/90 dark:border-violet-500/30 dark:bg-violet-950/35',
  'border-teal-200/80 bg-teal-50/90 dark:border-teal-500/30 dark:bg-teal-950/35',
]

export function VernacularMoodBoard({
  title,
  description,
  tiles,
  sectionId = 'vernacular-moodboard',
  presentation,
}: VernacularMoodBoardProps) {
  const collage = presentation === 'remix-collage'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        collage
          ? 'border-rose-200/70 bg-gradient-to-br from-white via-rose-50/40 to-violet-50/30 dark:border-rose-900/40 dark:from-neutral-950 dark:via-rose-950/20 dark:to-violet-950/20'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        Visual reference board
      </p>
      <h2
        className={cn(
          'mt-3 font-semibold tracking-tight text-neutral-900 dark:text-neutral-50',
          collage ? 'text-3xl' : 'text-2xl',
        )}
      >
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>
      <div className={cn('mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3', collage && 'lg:gap-5')}>
        {tiles.map((tile, index) => (
          <article
            key={`${tile.title}-${index}`}
            className={cn(
              'rounded-3xl border p-3 shadow-sm transition-transform duration-200 hover:-translate-y-0.5',
              collage ? tileSurfaces[index % tileSurfaces.length] : 'border-neutral-200 dark:border-neutral-800',
            )}
          >
            <div
              className={cn(
                'aspect-[4/3] overflow-hidden rounded-2xl border bg-white/80 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/80',
                collage && 'ring-1 ring-black/5 dark:ring-white/10',
              )}
            >
              {tile.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tile.src} alt={tile.title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900" />
              )}
            </div>
            <h3 className={cn('mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100', collage && 'text-base')}>
              {tile.title}
            </h3>
            {tile.caption ? (
              <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">{tile.caption}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

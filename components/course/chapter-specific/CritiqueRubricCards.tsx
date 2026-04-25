import type { ChapterLessonSkin, CritiqueRubricItem } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type CritiqueRubricCardsProps = {
  title: string
  description: string
  cards: CritiqueRubricItem[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function CritiqueRubricCards({
  title,
  description,
  cards,
  sectionId = 'critique-rubric-cards',
  presentation,
}: CritiqueRubricCardsProps) {
  const cap = presentation === 'final-capstone'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        cap
          ? 'border-emerald-200/55 bg-white dark:border-emerald-900/35 dark:bg-neutral-950/95'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          cap ? 'text-emerald-800 dark:text-emerald-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Critique rubric
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className={cn(
              'rounded-3xl border p-5',
              cap
                ? 'border-neutral-200/80 bg-gradient-to-b from-white to-emerald-50/40 dark:border-neutral-800 dark:from-neutral-950 dark:to-emerald-950/25'
                : 'border-neutral-200 dark:border-neutral-800',
            )}
          >
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{card.question}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

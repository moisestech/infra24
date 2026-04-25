import type { Work } from '@/lib/course/types'
import { SectionLabel } from '@/components/course/SectionLabel'
import { AnchorWorkCard } from '@/components/course/AnchorWorkCard'

type Props = {
  works: Work[]
  /** Short line shown directly under the first anchor card (e.g. why the lead work matters). */
  leadCallout?: string
}

export function AnchorWorksPanel({ works, leadCallout }: Props) {
  if (!works.length) return null
  const [first, ...rest] = works
  return (
    <section className="space-y-6" id="anchor-works">
      <div className="max-w-3xl">
        <SectionLabel>Anchor works</SectionLabel>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          Key artworks for this chapter
        </h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <AnchorWorkCard work={first} />
          {leadCallout ? (
            <p className="rounded-2xl border border-violet-200/80 bg-violet-50/90 px-4 py-3 text-sm font-medium leading-relaxed text-violet-950 dark:border-violet-500/30 dark:bg-violet-950/40 dark:text-violet-100">
              {leadCallout}
            </p>
          ) : null}
        </div>
        {rest.map((w) => (
          <AnchorWorkCard key={w.title + w.artist} work={w} />
        ))}
      </div>
    </section>
  )
}

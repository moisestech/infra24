import type { ImageAsset } from '@/lib/course/types'
import { SectionLabel } from '@/components/course/SectionLabel'

type Props = {
  assets: ImageAsset[]
}

/** Curated figures from `Chapter.imageAssets` — workshop visuals, rights notes, swap-friendly. */
export function LessonImageAssetStrip({ assets }: Props) {
  if (!assets.length) return null
  return (
    <section id="chapter-media" className="scroll-mt-28 space-y-4">
      <SectionLabel>Media</SectionLabel>
      <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Chapter media</h2>
      <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        Placeholder frames for slides, screen captures, and rights-cleared documentation. Replace sources in the overlay when exports are ready.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {assets.map((a) => (
          <figure
            key={a.src}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-muted/20 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/40"
          >
            <div className="aspect-video w-full overflow-hidden bg-neutral-200/80 dark:bg-neutral-800/80">
              {/* eslint-disable-next-line @next/next/no-img-element -- workshop CMS URLs; not using Image optimizer */}
              <img src={a.src} alt={a.alt} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <figcaption className="space-y-1 border-t border-neutral-100 p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
              {a.caption ? <p className="leading-relaxed">{a.caption}</p> : null}
              {a.credit ? <p className="text-xs text-neutral-500">Credit: {a.credit}</p> : null}
              {a.rightsNote ? <p className="text-xs text-neutral-500">{a.rightsNote}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

import type { RemixStackLayer, ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type RemixStackProps = {
  title: string
  description: string
  layers: RemixStackLayer[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

const layerStyles: Record<RemixStackLayer['kind'], string> = {
  gradient: 'bg-gradient-to-br from-pink-200 via-violet-200 to-yellow-100 dark:from-pink-900/50 dark:via-violet-900/45 dark:to-yellow-900/35',
  image: 'bg-white dark:bg-neutral-900',
  caption: 'bg-teal-50 dark:bg-teal-950/45',
  ui: 'bg-violet-50 dark:bg-violet-950/50',
  text: 'bg-pink-50 dark:bg-pink-950/45',
}

export function RemixStack({
  title,
  description,
  layers,
  sectionId = 'remix-stack',
  presentation,
}: RemixStackProps) {
  const collage = presentation === 'remix-collage'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        collage
          ? 'border-rose-200/80 bg-gradient-to-br from-amber-50/30 via-white to-violet-50/40 dark:border-rose-900/35 dark:from-neutral-950 dark:via-rose-950/15 dark:to-violet-950/25'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        Chapter-specific demo
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
      <div
        className={cn(
          'relative mt-10 overflow-hidden rounded-[2rem] border border-neutral-200/90 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/40',
          collage ? 'min-h-[360px]' : 'min-h-[320px]',
        )}
      >
        {layers.map((layer, index) => (
          <div
            key={`${layer.kind}-${layer.label}-${index}`}
            className={cn(
              'absolute rounded-3xl border border-neutral-200/90 p-4 shadow-md dark:border-neutral-600',
              layerStyles[layer.kind],
              collage && 'shadow-lg ring-1 ring-black/5 dark:ring-white/10',
            )}
            style={{
              top: `${24 + index * 22}px`,
              left: `${24 + index * 30}px`,
              width: `${240 - index * 6}px`,
              transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)`,
            }}
          >
            <p
              className={cn(
                'uppercase tracking-wide text-neutral-500 dark:text-neutral-400',
                collage ? 'text-[10px]' : 'text-xs',
              )}
            >
              {layer.kind}
            </p>
            <p className="mt-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100">{layer.label}</p>
            {layer.kind === 'image' && layer.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={layer.src} alt="" className="mt-2 h-20 w-full rounded-lg object-cover" loading="lazy" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

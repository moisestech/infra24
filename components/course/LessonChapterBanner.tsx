import type { ImageAsset } from '@/lib/course/types'
import { DEFAULT_CHAPTER_BANNER } from '@/lib/course/chapter-banner-default'
import { cn } from '@/lib/utils'

type Props = {
  banner?: ImageAsset | null
  title: string
  subtitle?: string | null
  className?: string
}

export function LessonChapterBanner({ banner, title, subtitle, className }: Props) {
  const img = banner?.src?.trim() ? banner : DEFAULT_CHAPTER_BANNER
  const alt = banner?.src?.trim() ? (banner.alt || title) : DEFAULT_CHAPTER_BANNER.alt

  return (
    <section
      className={cn(
        'not-prose overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm dark:border-neutral-800 dark:bg-neutral-900',
        className,
      )}
      aria-label="Chapter banner"
    >
      <div className="relative aspect-[21/9] min-h-[140px] w-full sm:min-h-[180px]">
        <img src={img.src} alt={alt} className="h-full w-full object-cover object-center" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 max-w-4xl p-5 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Chapter</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">{subtitle}</p> : null}
          {img.caption ? <p className="mt-3 text-xs text-white/70">{img.caption}</p> : null}
        </div>
      </div>
    </section>
  )
}

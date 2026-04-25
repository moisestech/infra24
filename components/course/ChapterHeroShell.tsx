import type { ReactNode } from 'react'
import type { Chapter, ChapterDesignAccent, ModuleKey } from '@/lib/course/types'
import { cn } from '@/lib/utils'

type ChapterHeroShellProps = {
  chapter: Chapter
  children: ReactNode
}

const accentBorderMap: Record<ChapterDesignAccent, string> = {
  blue: 'border-blue-200 dark:border-blue-800/80',
  violet: 'border-violet-200 dark:border-violet-800/80',
  rose: 'border-rose-200 dark:border-rose-800/80',
  emerald: 'border-emerald-200 dark:border-emerald-800/80',
  gray: 'border-neutral-200 dark:border-neutral-700',
  pink: 'border-pink-200 dark:border-pink-800/80',
  yellow: 'border-yellow-200 dark:border-yellow-800/80',
  teal: 'border-teal-200 dark:border-teal-800/80',
  red: 'border-red-200 dark:border-red-800/80',
}

const accentGradientMap: Record<ChapterDesignAccent, string> = {
  blue: 'from-blue-50 via-white to-white dark:from-blue-950/50 dark:via-neutral-950 dark:to-neutral-950',
  violet: 'from-violet-50 via-white to-white dark:from-violet-950/45 dark:via-neutral-950 dark:to-neutral-950',
  rose: 'from-rose-50 via-white to-white dark:from-rose-950/40 dark:via-neutral-950 dark:to-neutral-950',
  emerald: 'from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-neutral-950 dark:to-neutral-950',
  gray: 'from-neutral-100 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950',
  pink: 'from-pink-50 via-white to-white dark:from-pink-950/35 dark:via-neutral-950 dark:to-neutral-950',
  yellow: 'from-yellow-50 via-white to-white dark:from-yellow-950/25 dark:via-neutral-950 dark:to-neutral-950',
  teal: 'from-teal-50 via-white to-white dark:from-teal-950/35 dark:via-neutral-950 dark:to-neutral-950',
  red: 'from-red-50 via-white to-white dark:from-red-950/30 dark:via-neutral-950 dark:to-neutral-950',
}

const FALLBACK_ACCENT_BY_MODULE: Record<ModuleKey, ChapterDesignAccent> = {
  orientation: 'blue',
  'browser-language': 'violet',
  'cultural-social-web': 'rose',
  'public-work-advanced': 'emerald',
}

export function ChapterHeroShell({ chapter, children }: ChapterHeroShellProps) {
  const accent = chapter.design?.moduleAccent ?? FALLBACK_ACCENT_BY_MODULE[chapter.module] ?? 'gray'
  const borderClass = accentBorderMap[accent] ?? accentBorderMap.gray
  const gradientClass = accentGradientMap[accent] ?? accentGradientMap.gray

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[2rem] border bg-gradient-to-br p-8 shadow-sm md:p-10',
        gradientClass,
        borderClass,
      )}
    >
      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.1]">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
      </div>
      <div className="relative">{children}</div>
    </section>
  )
}

import type { ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type WhatYouAreMakingBarProps = {
  items: string[]
  /** When set, chips and surface match benchmark chapter identity. */
  lessonSkin?: ChapterLessonSkin
}

export function WhatYouAreMakingBar({ items, lessonSkin }: WhatYouAreMakingBarProps) {
  if (!items.length) return null

  const isHypertext = lessonSkin === 'hypertext'
  const isRemix = lessonSkin === 'remix-collage'
  const isPublishing = lessonSkin === 'publishing'
  const isCanonEntry = lessonSkin === 'canon-entry'
  const isInteractionMotion = lessonSkin === 'interaction-motion'
  const isBrowserAsMedium = lessonSkin === 'browser-as-medium'
  const isInterfaceGlitch = lessonSkin === 'interface-glitch'
  const isIdentityNetworked = lessonSkin === 'identity-networked'
  const isSystemsCirculation = lessonSkin === 'systems-circulation'
  const isGettingStarted = lessonSkin === 'getting-started'
  const isAdvancedPathways = lessonSkin === 'advanced-pathways'
  const isFinalCapstone = lessonSkin === 'final-capstone'

  const identityChips = [
    'border-rose-200/90 bg-rose-50/90 text-rose-950 shadow-sm dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-100',
    'border-violet-200/90 bg-violet-50/90 text-violet-950 shadow-sm dark:border-violet-500/30 dark:bg-violet-950/40 dark:text-violet-100',
    'border-fuchsia-200/85 bg-fuchsia-50/80 text-fuchsia-950 shadow-sm dark:border-fuchsia-500/25 dark:bg-fuchsia-950/35 dark:text-fuchsia-100',
    'border-neutral-200/90 bg-white text-neutral-800 shadow-sm dark:border-neutral-600 dark:bg-neutral-900/70 dark:text-neutral-100',
  ]

  const onboardingChips = [
    'border-blue-200/90 bg-blue-50/90 text-blue-950 shadow-sm dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-100',
    'border-slate-200/90 bg-slate-50/90 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100',
    'border-sky-200/85 bg-sky-50/85 text-sky-950 shadow-sm dark:border-sky-500/28 dark:bg-sky-950/35 dark:text-sky-100',
    'border-indigo-200/85 bg-indigo-50/80 text-indigo-950 shadow-sm dark:border-indigo-500/28 dark:bg-indigo-950/35 dark:text-indigo-100',
  ]

  const motionChips = [
    'border-violet-300/80 bg-violet-50 text-violet-950 shadow-sm dark:border-violet-500/40 dark:bg-violet-950/50 dark:text-violet-100',
    'border-fuchsia-300/80 bg-fuchsia-50 text-fuchsia-950 shadow-sm dark:border-fuchsia-500/35 dark:bg-fuchsia-950/40 dark:text-fuchsia-100',
    'border-indigo-300/80 bg-indigo-50 text-indigo-950 shadow-sm dark:border-indigo-500/35 dark:bg-indigo-950/45 dark:text-indigo-100',
    'border-amber-300/80 bg-amber-50 text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-950/35 dark:text-amber-100',
  ]

  const glitchChips = [
    'border-violet-400/50 bg-violet-950/40 text-violet-100 shadow-sm dark:border-violet-500/40 dark:bg-violet-950/60 dark:text-violet-50',
    'border-rose-400/45 bg-rose-950/35 text-rose-50 shadow-sm dark:border-rose-500/35 dark:bg-rose-950/50 dark:text-rose-100',
    'border-fuchsia-400/45 bg-fuchsia-950/30 text-fuchsia-50 shadow-sm dark:border-fuchsia-500/35 dark:bg-fuchsia-950/45 dark:text-fuchsia-100',
    'border-neutral-600/50 bg-neutral-900/70 text-neutral-100 shadow-sm dark:border-neutral-500/40 dark:bg-neutral-950/80 dark:text-neutral-50',
  ]

  const chipPalettes = [
    'border-pink-200/90 bg-pink-50/90 text-pink-950 hover:border-pink-400/80 dark:border-pink-500/35 dark:bg-pink-950/40 dark:text-pink-100',
    'border-violet-200/90 bg-violet-50/90 text-violet-950 hover:border-violet-400/80 dark:border-violet-500/35 dark:bg-violet-950/40 dark:text-violet-100',
    'border-teal-200/90 bg-teal-50/90 text-teal-950 hover:border-teal-400/80 dark:border-teal-500/35 dark:bg-teal-950/40 dark:text-teal-100',
    'border-amber-200/90 bg-amber-50/90 text-amber-950 hover:border-amber-400/80 dark:border-amber-500/35 dark:bg-amber-950/35 dark:text-amber-100',
  ]

  return (
    <section
      id="what-you-are-making"
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-5 shadow-sm md:p-6',
        isHypertext &&
          'border-neutral-300/90 bg-neutral-100/80 dark:border-neutral-700 dark:bg-neutral-900/60',
        isRemix &&
          'border-rose-200/80 bg-gradient-to-br from-rose-50/90 via-white to-violet-50/50 shadow-md dark:border-rose-900/40 dark:from-rose-950/30 dark:via-neutral-950 dark:to-violet-950/25',
        (isPublishing || isAdvancedPathways || isFinalCapstone) &&
          'border-[#1F8A70]/25 bg-gradient-to-br from-[#F7FFFC] via-white to-[#C6F7E9]/30 shadow-sm dark:border-[#7CE3C6]/20 dark:from-[#071A16] dark:via-neutral-950 dark:to-[#071A16]/90',
        isCanonEntry &&
          'border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:border-slate-700 dark:from-slate-950 dark:via-neutral-950 dark:to-blue-950/20',
        (isInteractionMotion || isBrowserAsMedium) &&
          'border-violet-200/80 bg-gradient-to-br from-violet-50/90 via-white to-fuchsia-50/50 shadow-md dark:border-violet-800/40 dark:from-violet-950/30 dark:via-neutral-950 dark:to-fuchsia-950/25',
        (isIdentityNetworked || isSystemsCirculation) &&
          'border-rose-200/70 bg-gradient-to-br from-rose-50/80 via-white to-violet-50/35 shadow-sm dark:border-rose-900/35 dark:from-rose-950/25 dark:via-neutral-950 dark:to-violet-950/20',
        isGettingStarted &&
          'border-blue-200/75 bg-gradient-to-br from-blue-50/85 via-white to-slate-50/45 shadow-sm dark:border-blue-900/35 dark:from-blue-950/25 dark:via-neutral-950 dark:to-slate-950/20',
        !isHypertext &&
          !isRemix &&
          !isPublishing &&
          !isAdvancedPathways &&
          !isFinalCapstone &&
          !isCanonEntry &&
          !isInteractionMotion &&
          !isBrowserAsMedium &&
          !isInterfaceGlitch &&
          !isIdentityNetworked &&
          !isSystemsCirculation &&
          !isGettingStarted &&
          'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          isHypertext && 'text-neutral-600 dark:text-neutral-400',
          isRemix && 'text-rose-700 dark:text-rose-300/90',
          (isPublishing || isAdvancedPathways || isFinalCapstone) && 'text-[#1F8A70] dark:text-[#7CE3C6]',
          isCanonEntry && 'text-blue-900/80 dark:text-blue-200/90',
          (isInteractionMotion || isBrowserAsMedium) && 'text-violet-800 dark:text-violet-200/90',
          isInterfaceGlitch && 'text-violet-200 dark:text-violet-100/90',
          (isIdentityNetworked || isSystemsCirculation) && 'text-rose-800 dark:text-rose-200/90',
          isGettingStarted && 'text-blue-900/85 dark:text-blue-200/90',
          !isHypertext &&
            !isRemix &&
            !isPublishing &&
            !isAdvancedPathways &&
            !isFinalCapstone &&
            !isCanonEntry &&
            !isInteractionMotion &&
            !isBrowserAsMedium &&
            !isInterfaceGlitch &&
            !isIdentityNetworked &&
            !isSystemsCirculation &&
            !isGettingStarted &&
            'text-neutral-500 dark:text-neutral-400',
        )}
      >
        What you are making
      </p>
      <div
        className={cn(
          'mt-4 flex flex-wrap',
          isRemix ||
          isInteractionMotion ||
          isBrowserAsMedium ||
          isInterfaceGlitch ||
          isIdentityNetworked ||
          isSystemsCirculation ||
          isGettingStarted ||
          isAdvancedPathways ||
          isFinalCapstone
            ? 'gap-2.5'
            : 'gap-3',
        )}
      >
        {items.map((item, i) => (
          <span
            key={item}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              isHypertext &&
                'border-rose-900/15 bg-white text-neutral-800 hover:border-rose-800/40 dark:border-rose-400/20 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-rose-400/45',
              isRemix && chipPalettes[i % chipPalettes.length],
              (isPublishing || isAdvancedPathways || isFinalCapstone) &&
                'border-[#00A67E]/28 bg-white font-medium text-[#071A16] shadow-sm dark:border-[#7CE3C6]/35 dark:bg-[#071A16]/70 dark:text-[#C6F7E9]',
              isCanonEntry &&
                'border-blue-200/80 bg-white font-medium text-slate-900 shadow-sm dark:border-blue-500/30 dark:bg-slate-900/80 dark:text-slate-100',
              (isInteractionMotion || isBrowserAsMedium) && motionChips[i % motionChips.length],
              isInterfaceGlitch && glitchChips[i % glitchChips.length],
              (isIdentityNetworked || isSystemsCirculation) && identityChips[i % identityChips.length],
              isGettingStarted && onboardingChips[i % onboardingChips.length],
              !isHypertext &&
                !isRemix &&
                !isPublishing &&
                !isAdvancedPathways &&
                !isFinalCapstone &&
                !isCanonEntry &&
                !isInteractionMotion &&
                !isBrowserAsMedium &&
                !isInterfaceGlitch &&
                !isIdentityNetworked &&
                !isSystemsCirculation &&
                !isGettingStarted &&
                'border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200',
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}

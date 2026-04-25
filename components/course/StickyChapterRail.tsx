'use client'

import Link from 'next/link'
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  GraduationCap,
  ImageIcon,
  Library,
  ListTree,
  MessagesSquare,
  Package,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MODULE_DISPLAY } from '@/components/course/module-label'
import type { GlossaryReference, ModuleKey } from '@/lib/course/types'
import { vcnGlossaryTermHref } from '@/lib/course/vibe-net-art/glossary-link'
import { cn } from '@/lib/utils'

export type ChapterRailNavItem = { id: string; label: string }

export type ChapterRailNavGroup = {
  id: string
  label: string
  items: ChapterRailNavItem[]
}

type Props = {
  chapterNumber: number
  /** When set (e.g. "Primer"), replaces the large chapter label in the rail. */
  chapterSequenceLabel?: string
  module: ModuleKey
  chapterTitle: string
  sectionGroups: ChapterRailNavGroup[]
  glossaryTerms: GlossaryReference[]
  glossaryHref: string
  estimatedTimeLabel?: string | null
  difficultyLabel?: string | null
  prevHref: string | null
  prevLabel: string | null
  nextHref: string | null
  nextLabel: string | null
}

function sectionIcon(id: string) {
  if (id === 'reader-at-a-glance') return Sparkles
  if (id === 'anchor-works') return ImageIcon
  if (id === 'chapter-media') return Film
  if (id === 'full-reading') return BookOpen
  if (id === 'vocabulary') return Library
  if (id === 'context') return Users
  if (id === 'tool-bridge') return Wrench
  if (id === 'artifact') return Package
  if (id === 'reflect') return MessagesSquare
  if (id === 'resources') return Library
  if (id === 'chapter-overview') return Sparkles
  return Sparkles
}

export function StickyChapterRail({
  chapterNumber,
  chapterSequenceLabel,
  module,
  chapterTitle,
  sectionGroups,
  glossaryTerms,
  glossaryHref,
  estimatedTimeLabel,
  difficultyLabel,
  prevHref,
  prevLabel,
  nextHref,
  nextLabel,
}: Props) {
  const groups = sectionGroups.filter((g) => g.items.length > 0)

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-md ring-1 ring-black/[0.04] dark:border-neutral-800 dark:bg-neutral-950 dark:ring-white/[0.06]">
        <div
          className={cn(
            'rounded-xl border-2 border-primary/35 bg-gradient-to-br px-3 py-3.5',
            'from-primary/[0.14] via-primary/[0.08] to-transparent',
            'dark:border-primary/40 dark:from-primary/25 dark:via-primary/10 dark:to-transparent',
          )}
        >
          {chapterSequenceLabel ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Track</p>
              <p className="mt-1 text-2xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-neutral-50">
                {chapterSequenceLabel}
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Chapter</p>
              <p className="mt-0.5 text-4xl font-black tabular-nums leading-none tracking-tight text-neutral-900 dark:text-neutral-50">
                {chapterNumber}
              </p>
            </>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-medium">
            {MODULE_DISPLAY[module]}
          </Badge>
          {estimatedTimeLabel ? (
            <Badge variant="secondary" className="gap-1 font-normal">
              <Clock className="h-3.5 w-3.5 opacity-80" aria-hidden />
              {estimatedTimeLabel}
            </Badge>
          ) : null}
          {difficultyLabel ? (
            <Badge variant="secondary" className="gap-1 font-normal">
              <GraduationCap className="h-3.5 w-3.5 opacity-80" aria-hidden />
              {difficultyLabel}
            </Badge>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-4 text-[13px] font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
          {chapterTitle}
        </p>

        <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            Chapter navigation
          </p>
          {prevHref && prevLabel ? (
            <Button
              variant="outline"
              size="lg"
              className="h-auto w-full justify-start gap-2 border-primary/25 py-3 text-left shadow-sm hover:border-primary/45 hover:bg-primary/[0.07] dark:border-primary/30 dark:hover:bg-primary/10"
              asChild
            >
              <Link href={prevHref} aria-label={`Previous chapter: ${prevLabel}`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Back
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    {prevLabel}
                  </span>
                </span>
              </Link>
            </Button>
          ) : null}
          {nextHref && nextLabel ? (
            <Button
              variant="default"
              size="lg"
              className="h-auto w-full justify-start gap-2 py-3 text-left shadow-md"
              asChild
            >
              <Link href={nextHref} aria-label={`Next chapter: ${nextLabel}`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-primary-foreground/80">
                    Next
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold leading-snug">{nextLabel}</span>
                </span>
              </Link>
            </Button>
          ) : null}
        </div>

        <nav className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            <ListTree className="h-3.5 w-3.5" aria-hidden />
            On this page
          </p>
          <div className="space-y-1">
            {groups.map((group, idx) => (
              <details key={group.id} open={idx === 0} className="group rounded-lg">
                <summary
                  className={cn(
                    'flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-2 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500',
                    'hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900',
                    '[&::-webkit-details-marker]:hidden',
                  )}
                >
                  <span className="min-w-0 truncate">{group.label}</span>
                  <ChevronDown
                    className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="space-y-0.5 pb-1 pl-1 pt-0.5">
                  {group.items.map((s) => {
                    const Icon = sectionIcon(s.id)
                    return (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                        <span className="text-[13px] font-medium leading-snug">{s.label}</span>
                      </a>
                    )
                  })}
                </div>
              </details>
            ))}
          </div>
        </nav>

        <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            <Library className="h-3.5 w-3.5" aria-hidden />
            Glossary
          </p>
          {glossaryTerms.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {glossaryTerms.slice(0, 6).map((t) => (
                <Link
                  key={t.slug}
                  href={vcnGlossaryTermHref(glossaryHref, t.slug)}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  {t.term}
                </Link>
              ))}
            </div>
          ) : (
            <Link href={glossaryHref} className="text-xs font-semibold text-primary underline-offset-4 hover:underline">
              Open full glossary
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

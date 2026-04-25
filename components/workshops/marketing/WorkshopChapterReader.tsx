'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Clock, Target, CheckCircle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WorkshopChapterReaderShell = 'learn' | 'org'

type ChapterListItem = {
  slug: string
  title: string
  description: string
  order: number
  estimatedTime: number
}

type ChapterPayload = {
  content: string
  metadata: Record<string, unknown>
  toc: Array<{ id: string; text: string; level: number }>
  workshopTitle?: string
}

export function WorkshopChapterReader({
  workshopId,
  chapterSlug,
  shell,
  backHref,
  chapterHref,
}: {
  workshopId: string
  chapterSlug: string
  shell: WorkshopChapterReaderShell
  backHref: string
  chapterHref: (slug: string) => string
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const [chapter, setChapter] = useState<ChapterPayload | null>(null)
  const [chapters, setChapters] = useState<ChapterListItem[]>([])
  const [workshopTitle, setWorkshopTitle] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)

  const nav = useMemo(() => {
    const idx = chapters.findIndex((c) => c.slug === chapterSlug)
    if (idx < 0) return { prev: null as ChapterListItem | null, next: null as ChapterListItem | null }
    return {
      prev: idx > 0 ? chapters[idx - 1] : null,
      next: idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null,
    }
  }, [chapters, chapterSlug])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !workshopId || !chapterSlug) return

    const ac = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const [listRes, chRes] = await Promise.all([
          fetch(`/api/learn/workshops/${encodeURIComponent(workshopId)}/chapters`, {
            signal: ac.signal,
          }),
          fetch(
            `/api/learn/workshops/${encodeURIComponent(workshopId)}/chapters/${encodeURIComponent(chapterSlug)}`,
            { signal: ac.signal }
          ),
        ])

        if (!listRes.ok) throw new Error(`Failed to load chapter list: ${listRes.status}`)
        if (!chRes.ok) throw new Error(`Failed to load chapter: ${chRes.status}`)

        const listJson = (await listRes.json()) as {
          success?: boolean
          data?: { chapters?: ChapterListItem[]; workshopTitle?: string }
        }
        const chJson = (await chRes.json()) as {
          success?: boolean
          data?: ChapterPayload & { workshopTitle?: string }
        }

        if (!listJson.success || !listJson.data?.chapters) {
          throw new Error('Invalid chapter list response')
        }
        if (!chJson.success || !chJson.data) {
          throw new Error('Chapter not found')
        }

        const d = chJson.data
        setChapters(listJson.data.chapters)
        setWorkshopTitle(d.workshopTitle ?? listJson.data.workshopTitle ?? '')
        setChapter({
          content: d.content,
          metadata: d.metadata ?? {},
          toc: d.toc ?? [],
          workshopTitle: d.workshopTitle,
        })
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        console.error('Error fetching learn chapter:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch chapter')
        setChapter(null)
      } finally {
        setLoading(false)
      }
    })()

    return () => ac.abort()
  }, [isLoaded, isSignedIn, workshopId, chapterSlug])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleChapterComplete = () => {
    console.log('Chapter completed:', chapterSlug)
  }

  const meta = chapter?.metadata ?? {}
  const title =
    (typeof meta.title === 'string' && meta.title.trim()) ||
    chapters.find((c) => c.slug === chapterSlug)?.title ||
    chapterSlug
  const description =
    (typeof meta.description === 'string' && meta.description.trim()) ||
    chapters.find((c) => c.slug === chapterSlug)?.description ||
    ''
  const estimatedTime =
    (typeof meta.estimated_duration === 'number' && meta.estimated_duration) ||
    (typeof meta.estimatedTime === 'number' && meta.estimatedTime) ||
    chapters.find((c) => c.slug === chapterSlug)?.estimatedTime ||
    30
  const difficulty =
    (typeof meta.difficulty === 'string' && meta.difficulty) || 'beginner'

  const pageBg = 'min-h-screen bg-background text-foreground'
  const skeletonBg = shell === 'org' ? 'bg-muted' : 'bg-muted'
  const tenantPrimaryBtn =
    shell === 'org'
      ? cn(
          '!border-0 !bg-[var(--tenant-primary)] !text-white shadow-md',
          'hover:!brightness-110 hover:!shadow-lg',
          'active:!brightness-95'
        )
      : 'bg-primary text-primary-foreground hover:bg-primary/90'
  const tenantOutlineBtn =
    shell === 'org'
      ? cn(
          'border-[var(--tenant-primary)] text-[var(--tenant-primary)]',
          'hover:bg-[var(--tenant-primary)] hover:text-white'
        )
      : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'

  if (!isLoaded) {
    return (
      <div className={pageBg}>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className={cn('h-8 rounded', skeletonBg, 'w-1/3')} />
            <div className={cn('h-4 rounded', skeletonBg, 'w-1/2')} />
          </div>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className={pageBg}>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h1 className="mb-4 text-2xl font-bold text-foreground">Sign In Required</h1>
            <p className="mb-8 text-muted-foreground">Please sign in to access this chapter content.</p>
            <Button asChild className={tenantPrimaryBtn}>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={pageBg}>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className={cn('h-8 rounded', skeletonBg, 'w-1/3')} />
            <div className={cn('h-4 rounded', skeletonBg, 'w-1/2')} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={cn('h-4 rounded', skeletonBg)} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className={pageBg}>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-destructive">Error</h1>
            <p className="mb-8 text-muted-foreground">{error || 'Chapter not found'}</p>
            <Button asChild variant="outline">
              <Link href={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Workshop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={pageBg}>
      <div className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link href={backHref}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
                <p className="truncate text-sm text-muted-foreground">{workshopTitle}</p>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-4 text-sm text-muted-foreground sm:flex">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {estimatedTime} min
              </div>
              <Badge variant="secondary">{difficulty}</Badge>
            </div>
          </div>

          <Progress value={readingProgress} className="h-2 bg-muted" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">{title}</h1>

          {description ? (
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{description}</p>
          ) : null}

          <div className="mb-6 flex flex-wrap gap-4">
            <Badge variant="secondary" className="font-normal">
              <Clock className="mr-2 h-4 w-4" />
              {estimatedTime} min
            </Badge>
            <Badge variant="outline" className="font-normal">
              <Target className="mr-2 h-4 w-4" />
              {difficulty}
            </Badge>
          </div>
        </div>

        <div className="manuscript-prose mb-8 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-8">
          {nav.prev ? (
            <Button asChild variant="outline" className={tenantOutlineBtn}>
              <Link href={chapterHref(nav.prev.slug)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous: {nav.prev.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {nav.next ? (
            <Button asChild className={tenantPrimaryBtn}>
              <Link href={chapterHref(nav.next.slug)} onClick={handleChapterComplete}>
                Next: {nav.next.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button className={tenantPrimaryBtn} onClick={handleChapterComplete}>
              Complete Chapter
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

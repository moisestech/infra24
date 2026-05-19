'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaYoutube } from 'react-icons/fa6'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  Users,
  BookOpen,
  Play,
  GraduationCap,
  FlaskConical,
  Mic,
  FileText,
} from 'lucide-react'
import type { WorkshopRow } from './types'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import {
  isLearnAiWorkshopSlug,
  learnAiWorkshopPaths,
} from '@/lib/workshops/learn-ai-without-losing-yourself/constants'
import { learnAiCurriculumIntro } from '@/lib/workshops/learn-ai-without-losing-yourself/curriculum-chapters'
import { learnAiLabIntro } from '@/lib/workshops/learn-ai-without-losing-yourself/lab-content'
import {
  workshopDiskChapterFolderSlug,
  workshopSlugHasPublicMarkdownChapters,
} from '@/lib/workshops/public-chapter-slugs'
import { isIpAgeOfAiWorkshopSlug } from '@/lib/workshops/ip-age-of-ai-program'
import {
  buildIpAgeOfAiYoutubeEmbedSrc,
  buildIpAgeOfAiYoutubeWatchUrl,
  estimateMinutesFromDurationLabel,
  parseWallTimeToSeconds,
} from '@/lib/workshops/ip-age-of-ai-video'
import { ipAgeOfAiModules } from '@/data/ipAgeOfAiWorkshop'
import { ipAgeOfAiLawyerContractPdfTemplates } from '@/lib/workshops/ip-age-of-ai-pdf-templates'

type LearnChapterRow = {
  id: string
  title: string
  description: string
  estimatedTime: number
  difficulty: string
  locked: boolean
  slug: string
  youtubeHref?: string
  syllabusModuleHref?: string
  /** Segment embed for IP + AI syllabus (optional) */
  segmentEmbedSrc?: string
}

export function WorkshopLearnTab({
  workshop,
  orgSlug,
}: {
  workshop: WorkshopRow
  orgSlug: string
}) {
  const { isSignedIn } = useAuth()
  const [chapters, setChapters] = useState<LearnChapterRow[]>([])
  const [loading, setLoading] = useState(true)

  const marketing = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
    title: workshop.title,
    id: workshop.id,
  })
  const isLearnAi = useMemo(
    () => isLearnAiWorkshopSlug(marketing.slug),
    [marketing.slug]
  )
  const isIpAgeOfAi = useMemo(
    () => isIpAgeOfAiWorkshopSlug(marketing.slug),
    [marketing.slug]
  )
  const hasPublicMarkdownChapters = useMemo(
    () => workshopSlugHasPublicMarkdownChapters(marketing.slug),
    [marketing.slug]
  )
  const learnPaths = learnAiWorkshopPaths(orgSlug)

  useEffect(() => {
    if (isLearnAi) {
      setChapters([])
      setLoading(false)
      return
    }

    if (isIpAgeOfAi) {
      const rows: LearnChapterRow[] = ipAgeOfAiModules.map((mod) => {
        const startSec = parseWallTimeToSeconds(mod.video.startTime)
        const endSec = parseWallTimeToSeconds(mod.video.endTime)
        return {
          id: mod.id,
          title: `Module ${mod.moduleNumber}: ${mod.title}`,
          description: `${mod.summary} Recording segment ${mod.video.startTime}–${mod.video.endTime}.`,
          estimatedTime: estimateMinutesFromDurationLabel(mod.video.duration),
          difficulty: 'beginner',
          locked: false,
          slug: mod.id,
          youtubeHref: buildIpAgeOfAiYoutubeWatchUrl(startSec),
          syllabusModuleHref: `/workshops/ip-age-of-ai/${mod.id}`,
          segmentEmbedSrc: buildIpAgeOfAiYoutubeEmbedSrc(startSec, endSec),
        }
      })
      setChapters(rows)
      setLoading(false)
      return
    }

    if (hasPublicMarkdownChapters) {
      let cancelled = false
      ;(async () => {
        try {
          setLoading(true)
          const res = await fetch(
            `/api/marketing/workshops/${encodeURIComponent(workshopDiskChapterFolderSlug(marketing.slug))}/chapters`
          )
          if (!res.ok) throw new Error('chapters')
          const data = (await res.json()) as {
            chapters?: Array<{
              slug: string
              title: string
              description: string
              estimatedTime: number
            }>
          }
          const rows =
            data.chapters?.map((c) => ({
              id: c.slug,
              title: c.title,
              description: c.description,
              estimatedTime: c.estimatedTime,
              difficulty: 'beginner' as const,
              locked: false,
              slug: c.slug,
            })) ?? []
          if (!cancelled) setChapters(rows)
        } catch {
          if (!cancelled) setChapters([])
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()
      return () => {
        cancelled = true
      }
    }

    const fetchChapters = async () => {
      try {
        setLoading(true)
        const mockChapters = [
          {
            id: '1',
            title: 'Introduction to AI Filmmaking',
            description: 'Learn the fundamentals of AI-powered video production',
            estimatedTime: 30,
            difficulty: 'beginner',
            locked: false,
            slug: 'introduction-to-ai-filmmaking',
          },
          {
            id: '2',
            title: 'AI Tools for Filmmakers',
            description: 'Explore the latest AI tools and their applications',
            estimatedTime: 45,
            difficulty: 'intermediate',
            locked: true,
            slug: 'ai-tools-for-filmmakers',
          },
          {
            id: '3',
            title: 'Creating Your First AI Video',
            description: 'Hands-on tutorial for creating AI-generated content',
            estimatedTime: 60,
            difficulty: 'intermediate',
            locked: true,
            slug: 'creating-your-first-ai-video',
          },
        ]
        setChapters(mockChapters)
      } catch (error) {
        console.error('Error fetching chapters:', error)
      } finally {
        setLoading(false)
      }
    }

    if (workshop.has_learn_content) {
      void fetchChapters()
    } else {
      setLoading(false)
    }
  }, [
    workshop.has_learn_content,
    isLearnAi,
    isIpAgeOfAi,
    hasPublicMarkdownChapters,
    marketing.slug,
    isSignedIn,
  ])

  if (isLearnAi) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Learn AI — materials
            </CardTitle>
            <CardDescription>
              Chapters, facilitator lab, and presenter rehearsal live on dedicated routes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Card className="border-primary/20 bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4" />
                  Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{learnAiCurriculumIntro}</p>
                <Button asChild size="sm">
                  <Link href={learnPaths.curriculum}>Open curriculum</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FlaskConical className="h-4 w-4" />
                  Lab
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{learnAiLabIntro}</p>
                <Button asChild size="sm" variant="secondary">
                  <Link href={learnPaths.lab}>Open lab</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mic className="h-4 w-4" />
                  Rehearse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Cue beats, facilitator guide, and printable long-form script.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href={learnPaths.rehearse}>Open rehearse</Link>
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-1/4 rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const publicChapterGuide =
    hasPublicMarkdownChapters && chapters.length === 0 ? (
      <p className="mb-4 text-sm text-muted-foreground">
        Public chapter notes are not available for this slug yet. Check back soon or sign in for
        member-only materials when they ship.
      </p>
    ) : null

  return (
    <div className="space-y-6">
      {publicChapterGuide}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Learning progress
          </CardTitle>
          <CardDescription>
            {hasPublicMarkdownChapters
              ? 'Open each chapter to read the public outline and exercises. Sign in for booking and member tools.'
              : "Track your progress through this workshop\u2019s learning content"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall progress</span>
              <span className="text-sm text-muted-foreground">0% complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-0 rounded-full bg-primary" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Chapters</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {workshop.estimated_learn_time || 0}
                </div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chapters</CardTitle>
          <CardDescription>
            {isIpAgeOfAi
              ? `Work through each module for ${workshop.title}. Video is one full recording—each row jumps to the segment that matches the written lesson.`
              : `Work through each chapter for ${workshop.title}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`rounded-lg border p-4 transition-colors ${
                  chapter.locked
                    ? 'bg-muted/50'
                    : 'border-primary/30 bg-primary/5 hover:bg-primary/10'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                          chapter.locked
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={`font-semibold ${
                            chapter.locked ? 'text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{chapter.description}</p>
                      </div>
                    </div>
                    {chapter.segmentEmbedSrc ? (
                      <div className="ml-11 mt-4 overflow-hidden rounded-lg border border-border bg-muted/30 aspect-video">
                        <iframe
                          src={chapter.segmentEmbedSrc}
                          title={`${chapter.title} — segment`}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : null}
                    <div className="ml-11 mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        ~{chapter.estimatedTime} min
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          chapter.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-800'
                            : chapter.difficulty === 'intermediate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {chapter.difficulty}
                      </Badge>
                      {chapter.locked && (
                        <Badge variant="outline" className="text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:ml-4 sm:items-end">
                    {chapter.locked ? (
                      <Button variant="outline" size="sm" disabled>
                        <Play className="mr-2 h-4 w-4" />
                        Locked
                      </Button>
                    ) : chapter.syllabusModuleHref && chapter.youtubeHref ? (
                      <>
                        <Button size="sm" asChild>
                          <Link href={chapter.syllabusModuleHref}>Open module</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={chapter.youtubeHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 border-border hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white"
                          >
                            <FaYoutube className="h-4 w-4 shrink-0 text-[#FF0000] group-hover:text-white" aria-hidden />
                            YouTube
                          </a>
                        </Button>
                      </>
                    ) : (
                      <Link
                        href={
                          hasPublicMarkdownChapters && !isSignedIn
                            ? `/workshop/${encodeURIComponent(workshopDiskChapterFolderSlug(marketing.slug))}/chapters/${encodeURIComponent(chapter.slug)}`
                            : hasPublicMarkdownChapters && isSignedIn
                              ? `/o/${encodeURIComponent(orgSlug)}/workshop/${encodeURIComponent(marketing.slug)}/chapters/${encodeURIComponent(chapter.slug)}`
                              : `/learn/${workshop.id}/${chapter.slug}`
                        }
                      >
                        <Button size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          {hasPublicMarkdownChapters ? 'Open' : 'Start'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {isIpAgeOfAi ? (
        <Card id="workshop-section-pdf-templates">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden />
              PDF templates — lawyer contracts
            </CardTitle>
            <CardDescription>
              Downloadable agreement shells and checklists for studio workflows. Links activate as each PDF is
              finalized.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              {ipAgeOfAiLawyerContractPdfTemplates.map((tpl) => (
                <li
                  key={tpl.id}
                  className="flex gap-3 rounded-lg border border-border bg-muted/20 p-3 dark:bg-muted/10"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40"
                    aria-hidden
                  >
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug text-foreground">{tpl.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{tpl.description}</p>
                    {tpl.href ? (
                      <a
                        href={tpl.href}
                        className="mt-2 inline-flex text-xs font-medium text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download PDF
                      </a>
                    ) : (
                      <span className="mt-2 inline-block text-xs font-medium text-muted-foreground">Coming soon</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Materials that support this workshop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="cursor-pointer rounded-lg border p-4 hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Course materials</h4>
                  <p className="text-sm text-muted-foreground">Downloadable guides</p>
                </div>
              </div>
            </div>
            <div className="cursor-pointer rounded-lg border p-4 hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                  <Users className="h-5 w-5 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <h4 className="font-medium">Community</h4>
                  <p className="text-sm text-muted-foreground">Connect with learners</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

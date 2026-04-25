import Link from 'next/link'
import { ArtifactBrief } from '@/components/lms/ArtifactBrief'
import { ChapterHero } from '@/components/lms/ChapterHero'
import { ChecklistCard } from '@/components/lms/ChecklistCard'
import { GettingStartedLearnerNotes } from '@/components/lms/GettingStartedLearnerNotes'
import { GlossaryGrid } from '@/components/lms/GlossaryGrid'
import { ModeTabs } from '@/components/lms/ModeTabs'
import { OnboardingHelpDrawers } from '@/components/lms/OnboardingHelpDrawers'
import { OnboardingIntroCallout } from '@/components/lms/OnboardingIntroCallout'
import { OnboardingSectionNav } from '@/components/lms/OnboardingSectionNav'
import { OnboardingWeakStrong } from '@/components/lms/OnboardingWeakStrong'
import { OutcomeList } from '@/components/lms/OutcomeList'
import { PathSelector } from '@/components/lms/PathSelector'
import { PromptPatternCard } from '@/components/lms/PromptPatternCard'
import { ReflectionQuestions } from '@/components/lms/ReflectionQuestions'
import { ToolComparisonGrid } from '@/components/lms/ToolComparisonGrid'
import { Button } from '@/components/ui/button'
import { gettingStartedChapter } from '@/lib/course/gettingStarted'

export const metadata = {
  title: 'Getting Started with Vibecoding | Learn',
  description: gettingStartedChapter.description,
}

export default function GettingStartedWithVibecodingPage() {
  const chapter = gettingStartedChapter

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10 lg:max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <Link href="/workshop/vibe-coding-and-net-art/net-art-primer">← Workshop chapters</Link>
          </Button>
          <p className="text-xs text-muted-foreground">Section navigator — 9 parts</p>
        </div>

        <OnboardingSectionNav />

        <ChapterHero title={chapter.title} subtitle={chapter.subtitle} description={chapter.description} />

        <OnboardingIntroCallout />

        <OutcomeList outcomes={chapter.outcomes} />

        <PathSelector paths={chapter.paths} />

        <OnboardingHelpDrawers />

        <GlossaryGrid terms={chapter.glossary} />

        <section id="onboarding-github" className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">GitHub setup</h2>
          <p className="text-sm text-muted-foreground">
            Official references:{' '}
            <a className="text-primary underline-offset-4 hover:underline" href="https://docs.github.com/">
              GitHub Docs
            </a>
            ,{' '}
            <a
              className="text-primary underline-offset-4 hover:underline"
              href="https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository"
            >
              Creating a repository
            </a>
            ,{' '}
            <a className="text-primary underline-offset-4 hover:underline" href="https://docs.github.com/en/pages">
              GitHub Pages
            </a>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <ChecklistCard
              title="Create your GitHub account"
              items={[
                'Go to GitHub',
                'Create an account',
                'Choose a username',
                'Verify your email',
                'Log in',
                'Save your username in the notes below',
              ]}
            />
            <ChecklistCard
              title="Create your first repo"
              items={[
                'Click New repository',
                'Name your repo',
                'Choose public or private',
                'Add a README',
                'Create repository',
                'Save a screenshot or link',
              ]}
            />
          </div>
        </section>

        <GettingStartedLearnerNotes />

        <ToolComparisonGrid tools={chapter.tools} />

        <section className="space-y-4 rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Weak vs strong prompt</h2>
          <OnboardingWeakStrong />
        </section>

        <PromptPatternCard patterns={chapter.promptPatterns} />

        <ModeTabs modes={chapter.modes} />

        <ArtifactBrief />

        <ReflectionQuestions questions={chapter.reflection} />

        <p className="text-center text-sm text-muted-foreground">
          Next in the workshop chapter flow:{' '}
          <Link className="text-primary underline-offset-4 hover:underline" href="/workshop/vibe-coding-and-net-art/what-is-net-art">
            What Is Net Art?
          </Link>
          , then{' '}
          <Link className="text-primary underline-offset-4 hover:underline" href="/workshop/vibe-coding-and-net-art/the-browser-is-a-medium">
            The Browser as Medium
          </Link>
          . The same sequence exists in the workshop reader as the disk chapter{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">getting-started-with-vibecoding</code> (order 1
          after the net art primer).
        </p>
      </div>
    </main>
  )
}

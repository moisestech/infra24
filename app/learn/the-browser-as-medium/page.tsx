import Link from 'next/link'
import { BrowserQuestionGrid } from '@/components/lms/BrowserQuestionGrid'
import { CanonSampler } from '@/components/lms/CanonSampler'
import { ChapterHero } from '@/components/lms/ChapterHero'
import { DefinitionBlock } from '@/components/lms/DefinitionBlock'
import { MiniArtifactCard } from '@/components/lms/MiniArtifactCard'
import { OutcomeList } from '@/components/lms/OutcomeList'
import { ReflectionQuestions } from '@/components/lms/ReflectionQuestions'
import { SpatialPromptCards } from '@/components/lms/SpatialPromptCards'
import { Button } from '@/components/ui/button'
import { browserAsMediumChapter } from '@/lib/course/browserAsMedium'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'The Browser as Medium | Learn',
  description: browserAsMediumChapter.description,
}

export default function BrowserAsMediumPage() {
  const chapter = browserAsMediumChapter

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10 lg:max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <Link href="/workshop/vibe-coding-and-net-art/net-art-primer">← Workshop chapters</Link>
          </Button>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Link href="/workshop/vibe-coding-and-net-art/what-is-net-art" className="hover:text-foreground hover:underline">
              Previous: What Is Net Art?
            </Link>
          </div>
        </div>

        <div id="bam-hero">
          <ChapterHero
            title={chapter.title}
            subtitle={chapter.subtitle}
            description={chapter.description}
            eyebrow="Chapter"
          />
        </div>

        <OutcomeList outcomes={chapter.outcomes} sectionId="bam-outcomes" />

        <DefinitionBlock
          id="bam-open"
          title="The browser is more than a window"
          body="A browser frames content, crops it, organizes it, scrolls it, and turns code into visible space. It creates expectations about where things go, how they load, and how people move through them. When net artists work with the web, they are often working with the behavior and limits of the browser itself."
          quote="When net artists work with the web, they are often working with the behavior and limits of the browser itself."
        />

        <DefinitionBlock
          id="bam-why"
          title="Why this matters"
          body="If you make a poster and upload it to a website, the internet helps distribute the work. If you make a work that depends on frames, links, scrolling, hovering, page divisions, browser timing, layout shifts, or window behavior, then the browser is doing more than hosting the work—it is helping produce the form."
        />

        {chapter.keyIdeas.map((idea) => (
          <DefinitionBlock key={idea.title} title={idea.title} body={idea.body} />
        ))}

        <section className="rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">References</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {chapter.references.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <CanonSampler
          id="bam-canon"
          artists={chapter.canon}
          heading="Canon for this chapter"
          intro="External links—skim one work, then return to your sketch."
        />

        <DefinitionBlock
          id="bam-notice"
          title="What to notice in browser-based artworks"
          body="Where the eye goes first; whether the page feels like a poster, a room, or a machine; how much the work depends on the visible window; how interaction is staged; how scrolling affects time; whether the interface is helping or resisting you."
        />

        <BrowserQuestionGrid id="bam-questions" questions={chapter.questions} />

        <SpatialPromptCards id="bam-spatial" prompts={chapter.artifact.prompts} />

        <MiniArtifactCard id="bam-artifact" artifact={chapter.artifact} omitPromptList />

        <ReflectionQuestions questions={chapter.reflection} storagePrefix="lms_browser_as_medium_reflect_" />

        <blockquote className={cn('rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center')}>
          <p className="text-sm font-medium text-foreground">Next up</p>
          <p className="mt-2 text-sm text-muted-foreground">
            In the workshop reader, continue to{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">hypertext-and-nonlinear-narrative</code> after
            this chapter (<code className="rounded bg-muted px-1.5 py-0.5 text-xs">the-browser-is-a-medium</code> on
            disk).
          </p>
        </blockquote>
      </div>
    </main>
  )
}

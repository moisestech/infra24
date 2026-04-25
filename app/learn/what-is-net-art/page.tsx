import Link from 'next/link'
import { ChapterHero } from '@/components/lms/ChapterHero'
import { CanonSampler } from '@/components/lms/CanonSampler'
import { ComparisonSplit } from '@/components/lms/ComparisonSplit'
import { DefinitionBlock } from '@/components/lms/DefinitionBlock'
import { MiniArtifactCard } from '@/components/lms/MiniArtifactCard'
import { OutcomeList } from '@/components/lms/OutcomeList'
import { PrincipleGrid } from '@/components/lms/PrincipleGrid'
import { ReflectionQuestions } from '@/components/lms/ReflectionQuestions'
import { WhatIsNetArtSectionNav } from '@/components/lms/WhatIsNetArtSectionNav'
import { Button } from '@/components/ui/button'
import { whatIsNetArtChapter } from '@/lib/course/whatIsNetArt'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'What Is Net Art? | Learn',
  description: whatIsNetArtChapter.description,
}

export default function WhatIsNetArtPage() {
  const chapter = whatIsNetArtChapter

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10 lg:max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <Link href="/workshop/vibe-coding-and-net-art/net-art-primer">← Workshop chapters</Link>
          </Button>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <Link href="/workshop/vibe-coding-and-net-art/getting-started-with-vibecoding" className="hover:text-foreground hover:underline">
              Previous: Vibecoding onboarding
            </Link>
          </div>
        </div>

        <WhatIsNetArtSectionNav />

        <div id="wna-hero">
          <ChapterHero
            title={chapter.title}
            subtitle={chapter.subtitle}
            description={chapter.description}
            eyebrow="Chapter"
          />
        </div>

        <OutcomeList outcomes={chapter.outcomes} sectionId="wna-outcomes" />

        <DefinitionBlock
          id="wna-definition"
          title="What net art is"
          body="Net art is art that uses the internet, the browser, the page, the link, the interface, the network, or digital systems as part of the work itself."
          quote="Net art treats the web as a medium, not just a container."
        />

        <ComparisonSplit
          id="wna-compare"
          leftTitle="Art online"
          leftItems={chapter.artOnline}
          rightTitle="Net art"
          rightItems={chapter.netArt}
        />

        <DefinitionBlock
          id="wna-why"
          title="Why this matters"
          body="A sculpture can be photographed and uploaded to the internet. A painting can be shown on a website. A video can be embedded on a page. But net art asks a different question: what happens when the internet itself becomes the form, the material, or the stage?"
        />

        <section id="wna-ideas" className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Four key ideas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {chapter.keyIdeas.map((idea) => (
              <article key={idea.title} className="rounded-2xl border border-border bg-card/50 p-5 shadow-sm">
                <h3 className="text-lg font-medium text-foreground">{idea.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{idea.body}</p>
              </article>
            ))}
          </div>
        </section>

        <PrincipleGrid id="wna-principles" principles={chapter.principles} />

        <CanonSampler id="wna-canon" artists={chapter.canon} />

        <p className="text-center text-sm text-muted-foreground">
          Institutional primer:{' '}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://www.tate.org.uk/art/art-terms/n/net-art"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tate — Net art
          </a>
        </p>

        <MiniArtifactCard id="wna-artifact" artifact={chapter.artifact} />

        <ReflectionQuestions questions={chapter.reflection} storagePrefix="lms_what_is_net_art_reflect_" />

        <blockquote className={cn('rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center')}>
          <p className="text-sm font-medium text-foreground">Next up</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Workshop chapter flow:{' '}
            <Link className="text-primary underline-offset-4 hover:underline" href="/workshop/vibe-coding-and-net-art/the-browser-is-a-medium">
              The Browser as Medium
            </Link>
            . Workshop reader slug:{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">the-browser-is-a-medium</code>.
          </p>
        </blockquote>

        <p className="text-center text-xs text-muted-foreground">
          Disk slug: <code className="rounded bg-muted px-1.5 py-0.5">what-is-net-art</code> (order 2 in Vibe Coding
          &amp; Net Art).
        </p>
      </div>
    </main>
  )
}

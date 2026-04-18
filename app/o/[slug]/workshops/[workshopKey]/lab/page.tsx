'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  isLearnAiWorkshopSlug,
  learnAiWorkshopPaths,
} from '@/lib/workshops/learn-ai-without-losing-yourself/constants'
import {
  learnAiLabIntro,
  learnAiLabStatus,
  learnAiLabThesis,
  learnAiSessionMap,
  learnAiSkillsGrid,
  learnAiCritiqueTags,
  learnAiHumorMechanics,
  learnAiEducationalMechanics,
  learnAiVisualStrategy,
  learnAiProofChecklist,
  learnAiLabTocIds,
} from '@/lib/workshops/learn-ai-without-losing-yourself/lab-content'
import { LearnAiSubpageShell } from '@/components/workshops/learn-ai/LearnAiSubpageShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function LearnAiLabPage() {
  const params = useParams()
  const orgSlug = params.slug as string
  const workshopKey = params.workshopKey as string

  if (!isLearnAiWorkshopSlug(workshopKey)) {
    notFound()
  }

  const paths = learnAiWorkshopPaths(orgSlug)

  return (
    <LearnAiSubpageShell orgSlug={orgSlug} title="Lab & blueprint" lead={learnAiLabIntro}>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline">{learnAiLabStatus.label}</Badge>
        <span>{learnAiLabStatus.detail}</span>
      </div>

      <div className="mb-8 flex flex-wrap gap-4 text-sm">
        <Link
          href={paths.base}
          className="text-primary underline-offset-4 hover:underline"
        >
          ← Workshop overview
        </Link>
        <Link
          href={paths.curriculum}
          className="text-primary underline-offset-4 hover:underline"
        >
          Curriculum →
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
        <div className="min-w-0 space-y-14">
          <section id="lab-intro" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Thesis</h2>
            <p className="text-muted-foreground leading-relaxed">{learnAiLabThesis.thesis}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {learnAiLabThesis.supports.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="grid gap-3 sm:grid-cols-2">
              {learnAiLabThesis.pullQuotes.map((q) => (
                <blockquote
                  key={q}
                  className="border-l-4 border-primary/60 pl-3 text-sm italic text-foreground/85"
                >
                  {q}
                </blockquote>
              ))}
            </div>
          </section>

          <section id="lab-session-map" className="scroll-mt-24 space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">Session map</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {learnAiSessionMap.map((block) => (
                <Card key={block.id}>
                  <CardHeader className="pb-2">
                    <div className="text-xs font-medium uppercase text-muted-foreground">
                      {block.phase}
                    </div>
                    <CardTitle className="text-base">{block.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">Purpose: </span>
                      {block.purpose}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Tension: </span>
                      {block.tension}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Skill: </span>
                      {block.skill}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Critique: </span>
                      {block.critique}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="lab-skills" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Skills grid</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {learnAiSkillsGrid.map((row) => (
                <Card key={row.skill}>
                  <CardContent className="pt-4">
                    <div className="font-medium">{row.skill}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{row.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="lab-critique" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Critique tags</h2>
            <div className="flex flex-wrap gap-2">
              {learnAiCritiqueTags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </section>

          <section id="lab-mechanics" className="scroll-mt-24 space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">Mechanics</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold">Humor</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {learnAiHumorMechanics.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Educational</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {learnAiEducationalMechanics.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="lab-visual" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Visual strategy</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {learnAiVisualStrategy.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>

          <section id="lab-proof" className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Proof checklist</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {learnAiProofChecklist.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="mt-10 hidden lg:block">
          <nav
            className="sticky top-24 space-y-1 text-sm text-muted-foreground"
            aria-label="On this page"
          >
            <div className="mb-2 font-medium text-foreground">On this page</div>
            {learnAiLabTocIds.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block rounded-md px-2 py-1 hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <Link
              href={paths.rehearse}
              className="mt-4 block rounded-md px-2 py-1 font-medium text-primary hover:underline"
            >
              Rehearse →
            </Link>
          </nav>
        </aside>
      </div>
    </LearnAiSubpageShell>
  )
}

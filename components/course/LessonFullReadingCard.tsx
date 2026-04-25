import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionLabel } from '@/components/course/SectionLabel'

type Props = {
  html: string
  /** Overlay lessons interleave manuscript with concept cards; plain chapters use a shorter hint. */
  variant?: 'overlay' | 'plain'
}

export function LessonFullReadingCard({ html, variant = 'overlay' }: Props) {
  const lead =
    variant === 'overlay'
      ? 'The course markdown lives in the same scroll as the lesson cards above and below—outcomes, prompts, exercises, and reference media.'
      : 'Source markdown for this chapter. Use the sidebar to jump within the manuscript.'

  return (
    <section id="full-reading" className="scroll-mt-28">
      <Card className="overflow-hidden border-neutral-200/90 shadow-md ring-1 ring-black/5 dark:border-neutral-800 dark:ring-white/10">
        <CardHeader className="space-y-0 border-b border-neutral-100 bg-gradient-to-r from-muted/60 via-muted/30 to-transparent pb-5 pt-6 dark:border-neutral-800 dark:from-muted/25 dark:via-muted/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner dark:bg-primary/25">
              <BookOpen className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <SectionLabel className="!tracking-[0.2em]">Manuscript</SectionLabel>
              <CardTitle className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                Full chapter reading
              </CardTitle>
              <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{lead}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-gradient-to-b from-transparent via-transparent to-muted/15 px-4 pb-10 pt-7 sm:px-8">
          <div className="manuscript-prose scroll-mt-28">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

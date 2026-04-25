import Link from 'next/link'
import { Flag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  chapterHref: string
}

export function VcnFinalProjectPreview({ chapterHref }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-200">
          <Flag className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Final project</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Chapter 11 — build, publish, and frame a coherent browser-based artwork.
          </p>
        </div>
      </div>
      <Card className="border-emerald-500/30 bg-emerald-500/[0.04] dark:border-emerald-500/25">
        <CardHeader>
          <CardTitle className="text-lg">What you submit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          <ul className="list-disc space-y-1 pl-5">
            <li>Title and one-paragraph artist statement</li>
            <li>Live URL or publish-ready folder + README</li>
            <li>Repo or commit trail showing iteration</li>
            <li>Influences (artists, tools, exhibitions) and a few screenshots</li>
          </ul>
          <Button asChild>
            <Link href={chapterHref}>Open capstone chapter</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

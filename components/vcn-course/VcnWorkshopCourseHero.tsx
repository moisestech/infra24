import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Props = {
  basePath: string
}

export function VcnWorkshopCourseHero({ basePath }: Props) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-8 shadow-sm dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900 md:p-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        Public course handbook
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl">
        Vibe Coding & Net Art
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
        Learn the canon by making through it — a browser-based path through net art history, creative web
        practice, and disciplined vibecoding workflows.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href={`${basePath}#course-sequence`}>Explore chapters</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={`${basePath}/glossary`}>Open glossary</Link>
        </Button>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { BookOpenText } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  glossaryHref: string
}

export function VcnGlossaryCta({ glossaryHref }: Props) {
  return (
    <section className="rounded-3xl border-2 border-primary/25 bg-primary/5 p-8 dark:border-primary/30 dark:bg-primary/10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BookOpenText className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Glossary</h2>
            <p className="mt-1 max-w-xl text-sm text-neutral-700 dark:text-neutral-300">
              Learn the shared language of net art, browsers, links, systems, liveness, and vibecoding — with
              room to grow into a full course-wide index.
            </p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href={glossaryHref}>Open glossary</Link>
        </Button>
      </div>
    </section>
  )
}

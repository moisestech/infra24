import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
  title: string
  description?: string
  href: string
}

export function NextChapterCard({ title, description, href }: Props) {
  return (
    <section className="rounded-[2rem] border border-neutral-800 bg-neutral-950 p-8 text-white shadow-sm dark:border-neutral-700 md:p-10">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/60">Next chapter</p>
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Continue the course</h2>
          {description ? <p className="mt-3 text-sm text-white/70 md:text-base">{description}</p> : null}
          <p className="mt-4 text-lg leading-7 text-white/85 md:text-xl">{title}</p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Go to chapter
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}

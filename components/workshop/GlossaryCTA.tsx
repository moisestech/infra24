import Link from 'next/link'
import { BookOpenText } from 'lucide-react'
import { handbookHref } from '@/lib/workshop/handbook-href'

export type GlossaryCTAProps = {
  glossary: {
    title: string
    description: string
    segment: string
  }
  basePath: string
}

export function GlossaryCTA({ glossary, basePath }: GlossaryCTAProps) {
  const href = handbookHref(basePath, glossary.segment)
  return (
    <section
      id="glossary-cta"
      className="rounded-[2rem] border border-neutral-800 bg-neutral-950 p-8 text-white shadow-sm md:p-10 dark:border-neutral-700"
    >
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80">
          <BookOpenText className="h-4 w-4" aria-hidden />
          Shared reference
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">{glossary.title}</h2>
        <p className="mt-4 text-base leading-7 text-white/80 md:text-lg">{glossary.description}</p>
        <div className="mt-8">
          <Link
            href={href}
            className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Open glossary
          </Link>
        </div>
      </div>
    </section>
  )
}

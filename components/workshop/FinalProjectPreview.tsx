import Link from 'next/link'
import { Flag } from 'lucide-react'
import { handbookHref } from '@/lib/workshop/handbook-href'

export type FinalProjectPreviewProps = {
  project: {
    title: string
    description: string
    chapterSegment: string
  }
  basePath: string
}

export function FinalProjectPreview({ project, basePath }: FinalProjectPreviewProps) {
  const href = handbookHref(basePath, project.chapterSegment)
  return (
    <section
      id="final-project-preview"
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
    >
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
          <Flag className="h-4 w-4" aria-hidden />
          Capstone
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          {project.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-neutral-700 dark:text-neutral-300 md:text-lg">{project.description}</p>
        <div className="mt-8">
          <Link
            href={href}
            className="inline-flex rounded-full border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            View final project chapter
          </Link>
        </div>
      </div>
    </section>
  )
}

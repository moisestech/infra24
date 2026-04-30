import Link from 'next/link'

type NextLessonNavProps = {
  previousModule?: { id: string; title: string } | null
  nextModule?: { id: string; title: string } | null
  basePath: string
}

export function NextLessonNav({ previousModule, nextModule, basePath }: NextLessonNavProps) {
  return (
    <nav className="flex flex-col gap-3 rounded-xl border bg-card p-5 md:flex-row md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Previous lesson</p>
        {previousModule ? (
          <Link
            href={`${basePath}/${previousModule.id}`}
            className="mt-2 inline-flex text-sm font-medium text-cyan-800 underline-offset-4 hover:underline"
          >
            ← {previousModule.title}
          </Link>
        ) : (
          <p className="mt-2 text-sm text-slate-600">You are at the first module.</p>
        )}
      </div>
      <div className="md:text-right">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next lesson</p>
        {nextModule ? (
          <Link
            href={`${basePath}/${nextModule.id}`}
            className="mt-2 inline-flex text-sm font-medium text-cyan-800 underline-offset-4 hover:underline"
          >
            {nextModule.title} →
          </Link>
        ) : (
          <p className="mt-2 text-sm text-slate-600">You have completed all modules.</p>
        )}
      </div>
    </nav>
  )
}

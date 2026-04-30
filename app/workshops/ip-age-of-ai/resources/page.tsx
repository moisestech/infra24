import Link from 'next/link'
import { ipAgeOfAiResources } from '@/data/ipAgeOfAiWorkshop'

export default function IpAgeOfAiResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-8 md:py-12">
      <p className="text-sm">
        <Link href="/workshops/ip-age-of-ai" className="font-medium text-cyan-800 underline-offset-4 hover:underline">
          ← Back to workshop landing
        </Link>
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Resources</h1>
      <p className="max-w-3xl text-sm leading-relaxed text-slate-700">
        Curated references grouped by topic to support follow-up study and practical implementation.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {ipAgeOfAiResources.map((resource) => (
          <article key={resource.title} className="rounded-xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{resource.category}</p>
            <h2 className="mt-2 text-base font-semibold text-slate-900">{resource.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{resource.description}</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-medium text-cyan-800 underline-offset-4 hover:underline"
            >
              Visit resource
            </a>
          </article>
        ))}
      </div>
    </main>
  )
}

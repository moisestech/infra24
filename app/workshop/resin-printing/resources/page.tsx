import type { Metadata } from 'next'
import Link from 'next/link'
import { RESIN_BOOKLET_DRAFT_HREF, RESIN_GLOSSARY, RESIN_RESOURCES } from '@/lib/workshop-engine/resin-printing'

export const metadata: Metadata = {
  title: 'Resources — Resin Printing',
  description: 'Sample file, slicer, checklist, glossary, and guide links for the resin workshop.',
  alternates: { canonical: '/workshop/resin-printing/resources' },
}

export default function ResinResourcesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-neutral-950">Resources</h1>
        <p className="text-neutral-700">
          Placeholders remain until the validated slicer, profile, and sample STL are entered for
          the venue.
        </p>
      </header>

      <ul className="space-y-3">
        {RESIN_RESOURCES.map((resource) => (
          <li
            key={resource.id}
            className="rounded-md border border-neutral-200 bg-white px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-medium text-neutral-950">{resource.title}</h2>
              <span className="text-xs uppercase tracking-wide text-neutral-500">
                {resource.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-600">{resource.description}</p>
            {resource.href ? (
              <Link className="mt-2 inline-block text-sm underline" href={resource.href}>
                Open
              </Link>
            ) : (
              <p className="mt-2 text-sm text-amber-800">TBD — enter before publish</p>
            )}
          </li>
        ))}
      </ul>

      <section id="glossary" className="space-y-3">
        <h2 className="text-xl font-semibold text-neutral-950">Glossary</h2>
        <dl className="space-y-3">
          {RESIN_GLOSSARY.map((entry) => (
            <div key={entry.term} className="border-b border-neutral-200 pb-3">
              <dt className="font-medium text-neutral-950">{entry.term}</dt>
              <dd className="mt-1 text-sm text-neutral-700">{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-sm text-neutral-600">
        Print-spread guide:{' '}
        <a className="underline" href={RESIN_BOOKLET_DRAFT_HREF} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      </p>
    </div>
  )
}

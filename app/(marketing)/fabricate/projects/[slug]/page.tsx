import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FabricateChrome } from '@/components/dcc/fabrication/FabricateChrome'
import {
  getPublicProject,
  listPublicProjects,
  projectEconomics,
} from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

type Params = { slug: string }

export function generateStaticParams() {
  return listPublicProjects().map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const project = getPublicProject(params.slug)
  if (!project) return { title: 'Fabrication project' }
  return {
    title: project.title,
    description: project.challenge,
    openGraph: {
      title: `${project.title} | ${dccSiteMeta.organizationName}`,
      url: `/fabricate/projects/${project.slug}`,
    },
  }
}

export default function FabricateProjectDetailPage({ params }: { params: Params }) {
  const project = getPublicProject(params.slug)
  if (!project) notFound()
  const economics = projectEconomics(project)

  return (
    <FabricateChrome current="projects">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
        {project.kind === 'dcc-test' ? 'DCC test — not a client commission' : 'Project'}
      </p>
      <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {project.title}
      </h1>

      <dl className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Challenge
          </dt>
          <dd className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            {project.challenge}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Input
          </dt>
          <dd className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            {project.input}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Process
          </dt>
          <dd className="mt-1">
            <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
              {project.process.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Economics
          </dt>
          <dd className="mt-1 space-y-1 font-mono text-sm text-neutral-700 dark:text-neutral-300">
            {economics.lines.map((line) => (
              <p key={line.label} className="flex justify-between gap-4">
                <span>{line.label}</span>
                <span>{line.value}</span>
              </p>
            ))}
            <p className="pt-2 font-sans text-xs text-neutral-500">
              Planning figures from the published estimate formula — not an invoice.
            </p>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Result
          </dt>
          <dd className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            {project.result}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Learning
          </dt>
          <dd className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
            {project.learning}
          </dd>
        </div>
      </dl>

      <p className="mt-10 text-sm">
        <Link href="/fabricate/field-lab" className="text-[var(--cdc-teal)] underline">
          Back to Field Lab
        </Link>
        {' · '}
        <Link href="/fabricate/projects" className="text-[var(--cdc-teal)] underline">
          All tests
        </Link>
      </p>
    </FabricateChrome>
  )
}

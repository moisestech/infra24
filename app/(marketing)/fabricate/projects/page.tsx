import type { Metadata } from 'next'
import Link from 'next/link'
import { FolderKanban } from 'lucide-react'
import { FabricateChrome } from '@/components/dcc/fabrication/FabricateChrome'
import { FabricateSectionHeading } from '@/components/dcc/fabrication/FabricateSectionMedia'
import { listPublicProjects } from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Fabrication projects',
  description:
    'DCC fabrication tests and, later, client case studies. These first entries are internal tests, not commissions.',
  openGraph: {
    title: `Fabrication projects | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/projects',
  },
}

export default function FabricateProjectsPage() {
  const projects = listPublicProjects()

  return (
    <FabricateChrome current="projects">
      <header className="mb-8 max-w-3xl md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          Evidence
        </p>
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Fabrication projects
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
          First entries are DCC tests — not client commissions. Real artist cases replace these as
          the strongest proof.
        </p>
      </header>

      <FabricateSectionHeading
        title="DCC tests"
        description="Each test feeds Field Lab capability stages and the next quote."
        Icon={FolderKanban}
        colorTokenId="slate"
      />

      {projects.length === 0 ? (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No public test projects yet.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/fabricate/projects/${project.slug}`}
                className="flex h-full flex-col rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-4 hover:border-neutral-400 dark:bg-neutral-900/40 sm:p-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  {project.kind === 'dcc-test' ? 'DCC test' : 'Project'}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {project.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {project.challenge}
                </p>
                <span className="mt-4 text-sm font-medium text-[var(--cdc-teal)]">
                  Open case
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </FabricateChrome>
  )
}

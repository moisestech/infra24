import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProposalChrome } from '@/components/dcc/fabrication/proposal/ProposalChrome'
import { FdmStlViewer } from '@/components/dcc/fabrication/proposal/FdmStlViewer'
import { hasFabricateProposalsAccess, proposalPageMetadata } from '@/lib/dcc/fabrication/proposal-auth'
import { CAROL_CLIENT, CAROL_FDM_PROJECTS, isCarolProjectKey } from '@/lib/dcc/fabrication/proposals/carol-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { project: string }
}): Promise<Metadata> {
  if (!isCarolProjectKey(params.project)) return { title: 'Private proposal', robots: { index: false, follow: false } }
  return proposalPageMetadata({
    title: `${CAROL_FDM_PROJECTS[params.project].title} · DCC prototype planning`,
    description: 'Private FDM prototype study. No price has been approved.',
  })
}

export default async function CarolFdmQuotePage({
  params,
}: {
  params: { project: string }
}) {
  if (!(await hasFabricateProposalsAccess())) return null
  if (!isCarolProjectKey(params.project)) notFound()

  const project = CAROL_FDM_PROJECTS[params.project]
  const other = CAROL_CLIENT.projectKeys.find((x) => x !== project.slug)!

  return (
    <ProposalChrome>
      <Link href={CAROL_CLIENT.dashboardPath} className="text-sm font-medium text-[var(--cdc-teal)] hover:underline">
        ← All Carol projects
      </Link>
      <div className="mt-8 space-y-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
          {project.reference} · Private planning page
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {project.title}
        </h1>
        <p className="text-lg text-neutral-700 dark:text-neutral-300">{project.subtitle}</p>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{project.summary}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--cdc-border)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Process</p>
            <p className="mt-2 font-semibold">FDM · PLA filament</p>
            <p className="mt-1 text-xs text-neutral-500">Not resin/SLA</p>
          </div>
          <div className="rounded-xl border border-[var(--cdc-border)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Price</p>
            <p className="mt-2 font-semibold">Quote in preparation</p>
            <p className="mt-1 text-xs text-neutral-500">No payment requested or approved</p>
          </div>
          <div className="rounded-xl border border-[var(--cdc-border)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Quantity</p>
            <p className="mt-2 text-sm font-medium">{project.quantity}</p>
          </div>
        </div>
        <section className="rounded-2xl border border-[var(--cdc-border)] p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Selected direction · Availability pending</p>
          <div className="mt-3 flex items-center gap-3">
            <span aria-hidden="true" className="h-11 w-11 shrink-0 rounded-full border border-black/15" style={{ backgroundColor: project.color.hex }} />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">{project.color.label}</p>
              <p className="text-xs text-neutral-500">Digital color approximation. Actual printer spool, brand and shade to be confirmed.</p>
            </div>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3D model preview</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            We will display the actual STL here after it passes geometry review and is uploaded to private storage.
            The bright green is a preview tint—not a claim that the object has been printed.
          </p>
          <FdmStlViewer
            src={`/api/dcc/fabricate/models/carol/${project.slug}`}
            color={project.color.hex}
            title={project.title}
          />
          <p className="text-xs text-neutral-500">{project.scale}</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What the first test would include</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
            {project.scope.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Before we confirm the quote</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
            {project.dependencies.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <section className="rounded-2xl border border-[var(--cdc-border)] p-5">
          <h2 className="text-lg font-semibold">Not included in this first test</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            {project.exclusions.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="mt-4 text-xs text-neutral-500">{project.note}</p>
        </section>
        <div className="rounded-2xl bg-neutral-100 p-5 dark:bg-neutral-900">
          <p className="font-semibold">Next step</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            DCC validates the STL and requests comparable quotes from available FDM operators. We will confirm
            the final scope, quantity, material, turnaround and price with Carol before any order is placed.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 border-t border-[var(--cdc-border)] pt-5 text-sm">
          <Link href={CAROL_CLIENT.dashboardPath} className="font-medium text-[var(--cdc-teal)] hover:underline">← Back to both projects</Link>
          <Link href={`${CAROL_CLIENT.dashboardPath}/${other}`} className="font-medium text-[var(--cdc-teal)] hover:underline">
            View the other FDM study →
          </Link>
        </div>
      </div>
    </ProposalChrome>
  )
}

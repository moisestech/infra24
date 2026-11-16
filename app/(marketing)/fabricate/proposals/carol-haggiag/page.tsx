import Link from 'next/link'
import type { Metadata } from 'next'
import { ProposalChrome } from '@/components/dcc/fabrication/proposal/ProposalChrome'
import { notFound } from 'next/navigation'
import { hasDccClientWorkspaceAccess } from '@/lib/dcc/fabrication/client-workspace-access'
import { CAROL_CLIENT, CAROL_FDM_PROJECTS, carolProjectPath } from '@/lib/dcc/fabrication/proposals/carol-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  if (!(await hasDccClientWorkspaceAccess(CAROL_CLIENT.id))) {
    return { title: 'Private project', robots: { index: false, follow: false } }
  }
  return {
    title: 'Your DCC projects',
    description: 'Private overview of two individually scoped FDM prototype studies.',
    robots: { index: false, follow: false },
  }
}

/** One client reference, two separately approvable FDM studies.
 * Pages require a real Clerk identity allowlisted to this client or DCC staff.
 */
export default async function CarolProjectsPage() {
  if (!(await hasDccClientWorkspaceAccess(CAROL_CLIENT.id))) notFound()

  return (
    <ProposalChrome>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
            Digital Culture Center Miami · Private project overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {CAROL_CLIENT.name}
          </h1>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Your two fabrication studies, together in one place. Each has its own model preview,
            scope and eventual quote. You can review or approve either independently once prices are ready.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-4 text-sm dark:bg-neutral-900">
          <p className="font-medium text-neutral-900 dark:text-neutral-100">Where we are</p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            We are preparing FDM models and checking local production options. Both prices and printer
            assignments are pending. No order or payment has been authorized.
          </p>
        </div>

        <div className="grid gap-4">
          {CAROL_CLIENT.projectKeys.map((key, index) => {
            const project = CAROL_FDM_PROJECTS[key]
            return (
              <Link
                key={project.slug}
                href={carolProjectPath(project.slug)}
                className="group block rounded-2xl border border-[var(--cdc-border)] bg-white p-5 transition hover:border-[var(--cdc-teal)] hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cdc-teal)] dark:bg-neutral-950"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 font-mono text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                      {project.reference} · FDM / PLA
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-neutral-900 group-hover:underline dark:text-neutral-100">
                      {project.title}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{project.subtitle}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: project.color.hex }} />
                        High-vis lime green · preferred
                      </span>
                      <span>Model awaiting verified STL</span>
                      <span>Quote being prepared</span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-[var(--cdc-teal)]">View project and 3D model →</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <p className="text-xs leading-relaxed text-neutral-500">
          These are two FDM/filament proposal drafts, not resin-print quotes. The earlier
          resin material study was an exploration and its $225 estimate is not being
          presented as an FDM price. The octopus experiment is distinct from the rescheduled
          Moonlighter workshop. Public images or case studies require separate permission.
        </p>
      </div>
    </ProposalChrome>
  )
}

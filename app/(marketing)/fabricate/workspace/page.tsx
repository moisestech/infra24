import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CAROL_CLIENT, CAROL_FDM_PROJECTS, carolProjectPath } from '@/lib/dcc/fabrication/proposals/carol-client'
import { hasDccStaffAccess } from '@/lib/dcc/fabrication/client-workspace-access'
import { cloudinaryProjectFolders } from '@/lib/dcc/fabrication/assets/cloudinary-models'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Private DCC client workspace', robots: { index: false, follow: false } }

export default async function FabricationWorkspacePage() {
  // Public /fabricate marketing URLs are not a security boundary.
  // Staff identity must be explicitly authorized with Clerk user IDs.
  if (!(await hasDccStaffAccess())) notFound()

  const clients = [{
    id: CAROL_CLIENT.id,
    name: CAROL_CLIENT.name,
    dashboardPath: CAROL_CLIENT.dashboardPath,
    projects: CAROL_CLIENT.projectKeys.map((slug) => ({
      slug,
      ...CAROL_FDM_PROJECTS[slug],
      path: carolProjectPath(slug),
      folders: cloudinaryProjectFolders(CAROL_CLIENT.id, slug),
    })),
  }]

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--cdc-teal)]">DCC Miami · Staff only</p>
      <h1 className="mt-3 text-3xl font-semibold">Client projects</h1>
      <p className="mt-3 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
        One client can have multiple independent projects and models. Airtable owns commercial status.
        Cloudinary folders organize approved preview media; originals and unapproved CAD remain private.
      </p>
      <div className="mt-8 space-y-6">
        {clients.map(client => (
          <section key={client.id} className="rounded-2xl border border-[var(--cdc-border)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-neutral-500">Client · {client.id}</p>
                <h2 className="mt-1 text-2xl font-semibold">{client.name}</h2>
              </div>
              <Link className="text-sm text-[var(--cdc-teal)] underline" href={client.dashboardPath}>Client project overview</Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {client.projects.map(project => (
                <article key={project.slug} className="rounded-xl bg-neutral-100 p-4 dark:bg-neutral-900">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{project.subtitle}</p>
                  <p className="mt-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Model pending · quote in preparation
                  </p>
                  <p className="mt-2 break-all font-mono text-[10px] text-neutral-500">
                    Cloudinary: {project.folders?.threeDPreviews}
                  </p>
                  <Link href={project.path} className="mt-3 inline-block text-sm font-medium text-[var(--cdc-teal)] underline">
                    Open project & 3D viewer
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-8 text-xs text-neutral-500">
        This is a first client grouping, not an automated Airtable sync or a production-ready multi-client CMS.
        Only grant access through explicit Clerk identity mapping. Do not paste signed model URLs into source code.
      </p>
    </main>
  )
}

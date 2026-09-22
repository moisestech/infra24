import { existsSync } from 'node:fs'
import Link from 'next/link'
import { resolveProposalMediaFile } from '@/lib/dcc/fabrication/proposal-media'
import { publicOperatorName } from '@/lib/dcc/fabrication/operators'
import type { FabricationJob } from '@/lib/dcc/fabrication/schema'

export function proposalMediaExists(slug: string, filename: string): boolean {
  const file = resolveProposalMediaFile(slug, filename)
  return Boolean(file && existsSync(file))
}

export function ProposalChrome({
  children,
  job,
}: {
  children: React.ReactNode
  job?: FabricationJob
}) {
  const lead = publicOperatorName(job?.projectLeadId)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm">
        <Link
          href="/fabricate"
          className="font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline"
        >
          ← Fabricate
        </Link>
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
        Private proposal · not indexed
      </p>
      {lead ? (
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Project lead: {lead}
        </p>
      ) : null}
      {children}
    </div>
  )
}

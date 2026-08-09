import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dccSiteMeta } from '@/lib/marketing/content'
import { isDccOsConfigured } from '@/lib/dcc/os-config'
import { getMachine, listPublicMachines } from '@/lib/dcc/machines'
import { PLANNED_FLEET } from '@/lib/dcc/planned-fleet'

export const revalidate = 60

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const machine =
    (isDccOsConfigured() ? await getMachine(id).catch(() => null) : null) ??
    PLANNED_FLEET.find((m) => m.id === id)
  return {
    title: machine ? machine.name : 'Machine',
    description: machine?.whatItCanMake ?? 'DCC machine detail',
    openGraph: {
      title: `${machine?.name ?? 'Machine'} | ${dccSiteMeta.organizationName}`,
      url: `/machines/${id}`,
    },
  }
}

export default async function MachineDetailPage({ params }: Props) {
  const { id } = await params
  let machine =
    (isDccOsConfigured() ? await getMachine(id).catch(() => null) : null) ??
    PLANNED_FLEET.find((m) => m.id === id) ??
    null

  if (!machine && isDccOsConfigured()) {
    const all = await listPublicMachines().catch(() => [])
    machine = all.find((m) => m.id === id) ?? null
  }

  if (!machine) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/machines"
        className="text-sm font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline"
      >
        ← Machines
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {machine.name}
      </h1>
      <p className="mt-2 font-mono text-sm text-neutral-500">
        {machine.publicStatus}
        {machine.type ? ` · ${machine.type}` : ''}
      </p>
      <dl className="mt-8 space-y-4 text-sm">
        {machine.buildVolume ? (
          <div>
            <dt className="font-semibold text-neutral-800 dark:text-neutral-200">Build volume</dt>
            <dd className="mt-1 font-mono text-neutral-600 dark:text-neutral-400">
              {machine.buildVolume}
            </dd>
          </div>
        ) : null}
        {machine.materials ? (
          <div>
            <dt className="font-semibold text-neutral-800 dark:text-neutral-200">Materials</dt>
            <dd className="mt-1 text-neutral-600 dark:text-neutral-400">{machine.materials}</dd>
          </div>
        ) : null}
        {machine.whatItCanMake ? (
          <div>
            <dt className="font-semibold text-neutral-800 dark:text-neutral-200">What it can make</dt>
            <dd className="mt-1 text-neutral-600 dark:text-neutral-400">{machine.whatItCanMake}</dd>
          </div>
        ) : null}
      </dl>
      <Link
        href={`/make?machine=${encodeURIComponent(machine.id)}`}
        className="mt-10 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        Make something on this
      </Link>
    </div>
  )
}

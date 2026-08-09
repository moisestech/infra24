import type { Metadata } from 'next'
import Link from 'next/link'
import { dccSiteMeta } from '@/lib/marketing/content'
import { isDccOsConfigured } from '@/lib/dcc/os-config'
import { listPublicMachines } from '@/lib/dcc/machines'
import { PLANNED_FLEET } from '@/lib/dcc/planned-fleet'
import type { DccMachine } from '@/lib/dcc/machines'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Machines',
  description: 'DCC fabrication fleet — status, build volumes, and make requests.',
  openGraph: {
    title: `Machines | ${dccSiteMeta.organizationName}`,
    description: 'Physical capability at Digital Culture Center Miami.',
    url: '/machines',
  },
}

function statusClass(label: DccMachine['publicStatus']): string {
  switch (label) {
    case 'Available':
      return 'bg-emerald-100 text-emerald-900'
    case 'In service':
      return 'bg-amber-100 text-amber-900'
    case 'Offline':
      return 'bg-red-100 text-red-900'
    default:
      return 'bg-neutral-200 text-neutral-700'
  }
}

async function loadMachines(): Promise<{ machines: DccMachine[]; planned: boolean }> {
  if (!isDccOsConfigured()) {
    return { machines: PLANNED_FLEET, planned: true }
  }
  try {
    const live = await listPublicMachines()
    if (live.length === 0) return { machines: PLANNED_FLEET, planned: true }
    return { machines: live, planned: false }
  } catch {
    return { machines: PLANNED_FLEET, planned: true }
  }
}

export default async function MachinesPage() {
  const { machines, planned } = await loadMachines()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          DCC.miami
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Machines
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {planned
            ? 'Installation pending facility approval. Showing the planned fleet with Coming soon status — no invented inventory.'
            : 'Live fleet status from DCC OS. Request fabrication on a machine from /make.'}
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {machines.map((m) => (
          <li
            key={m.id}
            className="flex flex-col border border-[var(--cdc-border)] bg-white/80 p-5 dark:bg-neutral-900/40"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                <Link href={`/machines/${m.id}`} className="hover:underline">
                  {m.name}
                </Link>
              </h2>
              <span
                className={`shrink-0 px-2 py-0.5 text-xs font-medium ${statusClass(m.publicStatus)}`}
              >
                {m.publicStatus}
              </span>
            </div>
            {m.type ? (
              <p className="mt-1 font-mono text-xs text-neutral-500">{m.type}</p>
            ) : null}
            {m.buildVolume ? (
              <p className="mt-3 font-mono text-sm text-neutral-700 dark:text-neutral-300">
                {m.buildVolume}
              </p>
            ) : null}
            {m.whatItCanMake ? (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {m.whatItCanMake}
              </p>
            ) : null}
            <Link
              href={`/make?machine=${encodeURIComponent(m.id)}`}
              className="mt-auto pt-5 text-sm font-semibold text-[var(--cdc-teal)] underline-offset-4 hover:underline"
            >
              Make something on this →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

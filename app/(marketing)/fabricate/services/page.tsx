import type { Metadata } from 'next'
import Link from 'next/link'
import { Route } from 'lucide-react'
import { FabricateChrome } from '@/components/dcc/fabrication/FabricateChrome'
import { FabricateSectionHeading } from '@/components/dcc/fabrication/FabricateSectionMedia'
import { STUDIO_SERVICES, getFabricationColor } from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Fabrication services',
  description:
    'Fabricate My File or Prepare + Fabricate — two studio services for turning files and references into physical prototypes.',
  openGraph: {
    title: `Fabrication services | ${dccSiteMeta.organizationName}`,
    url: '/fabricate/services',
  },
}

export default function FabricateServicesPage() {
  return (
    <FabricateChrome current="services">
      <header className="mb-8 max-w-3xl md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          Studio services
        </p>
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Fabrication services
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
          Two related paths. One starts from a usable 3D file. The other starts from a
          reference, sketch, or partial model.
        </p>
      </header>

      <FabricateSectionHeading
        title="Choose a path"
        Icon={Route}
        colorTokenId="indigo"
      />

      <ul className="grid gap-4 md:grid-cols-2">
        {STUDIO_SERVICES.map((service) => {
          const color = getFabricationColor(service.colorTokenId)
          return (
            <li key={service.id}>
              <Link
                href={service.href}
                className={cn(
                  'flex h-full flex-col rounded-2xl border p-5',
                  color.border,
                  color.surface
                )}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  {service.eyebrow}
                </p>
                <h2 className={cn('mt-2 text-xl font-semibold', color.heading)}>
                  {service.label}
                </h2>
                <p className="mt-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {service.summary}
                </p>
                <span className="mt-4 text-sm font-medium text-[var(--cdc-teal)]">
                  Open service
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </FabricateChrome>
  )
}

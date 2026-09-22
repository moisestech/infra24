import type { Metadata } from 'next'
import Link from 'next/link'
import { FabricateChrome } from '@/components/dcc/fabrication/FabricateChrome'
import { ProcessFlow } from '@/components/dcc/fabrication/proposal/modules'
import { getStudioService } from '@/lib/dcc/fabrication'
import { dccSiteMeta } from '@/lib/marketing/content'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'

const service = getStudioService('FABRICATE_MY_FILE')

export const metadata: Metadata = {
  title: service.label,
  description: service.summary,
  openGraph: {
    title: `${service.label} | ${dccSiteMeta.organizationName}`,
    url: service.href,
  },
}

export default function FabricateMyFilePage() {
  const color = getFabricationColor(service.colorTokenId)

  return (
    <FabricateChrome current="services">
      <header className="mb-8 max-w-3xl md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          {service.eyebrow}
        </p>
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {service.label}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
          {service.youHave} {service.summary}
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Workflow
        </h2>
        <div className="mt-4">
          <ProcessFlow steps={service.workflow} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Suitable for
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {service.suitableFor.map((item) => (
            <li
              key={item}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${color.chip}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <p className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/fabricate/start"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Start a project
        </Link>
        <Link
          href="/fabricate/services/prepare-and-fabricate"
          className="inline-flex min-h-11 items-center text-[var(--cdc-teal)] underline"
        >
          Need modeling first? Prepare + Fabricate
        </Link>
      </p>
    </FabricateChrome>
  )
}

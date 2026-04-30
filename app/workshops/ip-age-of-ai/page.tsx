import Link from 'next/link'
import { ModuleCardGrid } from '@/components/workshops/ModuleCardGrid'
import { WorkshopHero } from '@/components/workshops/WorkshopHero'
import { WorkshopModuleAudit } from '@/components/workshops/WorkshopModuleAudit'
import { WorkshopOverview } from '@/components/workshops/WorkshopOverview'
import { ipAgeOfAiModules, ipAgeOfAiWorkshop } from '@/data/ipAgeOfAiWorkshop'

const BASE_PATH = '/workshops/ip-age-of-ai'

export default function IpAgeOfAiWorkshopPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 md:px-8 md:py-12">
      <WorkshopHero
        title={ipAgeOfAiWorkshop.title}
        label={ipAgeOfAiWorkshop.label}
        description={ipAgeOfAiWorkshop.description}
        startHref={`${BASE_PATH}/module-1`}
        toolkitHref={`${BASE_PATH}/toolkit`}
        glossaryHref={`${BASE_PATH}/glossary`}
      />

      <WorkshopOverview
        about={ipAgeOfAiWorkshop.about}
        audience={ipAgeOfAiWorkshop.audience}
        outcomes={ipAgeOfAiWorkshop.outcomes}
        disclaimer={ipAgeOfAiWorkshop.educationalDisclaimer}
      />

      <ModuleCardGrid modules={ipAgeOfAiModules} basePath={BASE_PATH} />

      <WorkshopModuleAudit basePath={BASE_PATH} />

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground">Course support</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Each lesson separates three layers: what the law says, what remains unsettled, and what artists
          can do in practice. As edited clips are finalized, each module can be updated independently without
          rebuilding the full workshop.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href={`${BASE_PATH}/toolkit`} className="font-medium text-primary-800 underline-offset-4 hover:underline">
            Open toolkit
          </Link>
          <Link href={`${BASE_PATH}/glossary`} className="font-medium text-primary-800 underline-offset-4 hover:underline">
            Open glossary
          </Link>
          <Link href={`${BASE_PATH}/resources`} className="font-medium text-primary-800 underline-offset-4 hover:underline">
            Open resources
          </Link>
        </div>
      </section>
    </main>
  )
}

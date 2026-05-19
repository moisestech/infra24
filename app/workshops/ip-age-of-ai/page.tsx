import Link from 'next/link'
import { ModuleCardGrid } from '@/components/workshops/ModuleCardGrid'
import { WorkshopHero } from '@/components/workshops/WorkshopHero'
import { WorkshopModuleAudit } from '@/components/workshops/WorkshopModuleAudit'
import { WorkshopOverview } from '@/components/workshops/WorkshopOverview'
import { IpAgeOfAiProgramInstructors } from '@/components/workshops/marketing/IpAgeOfAiProgramInstructors'
import { IpAgeOfAiProgramOutline } from '@/components/workshops/marketing/IpAgeOfAiProgramOutline'
import { IpAgeOfAiSkillsYoullLearn } from '@/components/workshops/marketing/IpAgeOfAiSkillsYoullLearn'
import { ipAgeOfAiModules, ipAgeOfAiWorkshop } from '@/data/ipAgeOfAiWorkshop'
import {
  ipAgeOfAiCollaboratorsLine,
  ipAgeOfAiProgramTitle,
  ipAgeOfAiSkillsYoullLearnTags,
  KNIGHT_FOUNDATION_LOGO_SRC,
} from '@/lib/workshops/ip-age-of-ai-program'

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

      <section
        className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8"
        aria-labelledby="ip-age-of-ai-syllabus-heading"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Live session · May 8
        </p>
        <h2
          id="ip-age-of-ai-syllabus-heading"
          className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl"
        >
          {ipAgeOfAiProgramTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">{ipAgeOfAiCollaboratorsLine}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/25 px-4 py-3 dark:bg-muted/10">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Supported by
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={KNIGHT_FOUNDATION_LOGO_SRC}
            alt="Knight Foundation"
            className="h-10 w-auto max-h-12 max-w-[min(100%,220px)] object-contain object-left"
            loading="lazy"
          />
        </div>

        <div className="mt-10 space-y-12">
          <IpAgeOfAiProgramOutline modules={ipAgeOfAiModules} basePath={BASE_PATH} />
          <IpAgeOfAiProgramInstructors sectionId="workshop-section-speakers" />
          <IpAgeOfAiSkillsYoullLearn skills={ipAgeOfAiSkillsYoullLearnTags} />
        </div>
      </section>

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

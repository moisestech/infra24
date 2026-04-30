import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AIUseSelfAudit } from '@/components/workshops/AIUseSelfAudit'
import { ArtistChecklist } from '@/components/workshops/ArtistChecklist'
import { ArtistPracticeTip } from '@/components/workshops/ArtistPracticeTip'
import { ContractClauseSelector } from '@/components/workshops/ContractClauseSelector'
import { DownloadableToolkitPage } from '@/components/workshops/DownloadableToolkitPage'
import { GlossaryPreview } from '@/components/workshops/GlossaryPreview'
import { KeyLessonPoints } from '@/components/workshops/KeyLessonPoints'
import { LegalPracticeTriage } from '@/components/workshops/LegalPracticeTriage'
import { LegalUncertaintyCallout } from '@/components/workshops/LegalUncertaintyCallout'
import { ModuleHeader } from '@/components/workshops/ModuleHeader'
import { NextLessonNav } from '@/components/workshops/NextLessonNav'
import { PracticalTakeaways } from '@/components/workshops/PracticalTakeaways'
import { ReflectionQuestions } from '@/components/workshops/ReflectionQuestions'
import { ResourceLinks } from '@/components/workshops/ResourceLinks'
import { RiskResponseLadder } from '@/components/workshops/RiskResponseLadder'
import { ScenarioLab } from '@/components/workshops/ScenarioLab'
import { TranscriptSegment } from '@/components/workshops/TranscriptSegment'
import { VideoLessonBlock } from '@/components/workshops/VideoLessonBlock'
import {
  getIpAgeOfAiModuleById,
  getIpAgeOfAiResourcesByKeys,
  ipAgeOfAiGlossary,
  ipAgeOfAiModules,
  ipAgeOfAiScenarioLab,
  ipAgeOfAiToolkitAssets,
  ipAgeOfAiWorkshop,
} from '@/data/ipAgeOfAiWorkshop'

const BASE_PATH = '/workshops/ip-age-of-ai'

type ModulePageProps = {
  params: Promise<{ moduleId: string }>
}

export default async function IpAgeOfAiModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params
  const moduleData = getIpAgeOfAiModuleById(moduleId)

  if (!moduleData) {
    notFound()
  }

  const previousModule = moduleData.previousModule
    ? getIpAgeOfAiModuleById(moduleData.previousModule)
    : null
  const nextModule = moduleData.nextModule ? getIpAgeOfAiModuleById(moduleData.nextModule) : null

  const moduleGlossary = ipAgeOfAiGlossary.filter((term) => moduleData.glossaryTerms.includes(term.term))
  const curatedResources = moduleData.resourceLinkKeys?.length
    ? getIpAgeOfAiResourcesByKeys(moduleData.resourceLinkKeys)
    : []

  const showGenericUncertainty =
    !moduleData.suppressGenericUncertaintyCallout && !moduleData.legalPracticeTriage

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 md:px-8 md:py-12">
      <p className="text-sm">
        <Link href={BASE_PATH} className="font-medium text-primary-800 underline-offset-4 hover:underline">
          ← Back to workshop landing
        </Link>
      </p>

      <ModuleHeader
        moduleNumber={moduleData.moduleNumber}
        title={moduleData.title}
        subtitle={moduleData.subtitle}
        thesis={moduleData.thesis}
        videoDuration={moduleData.video.duration}
        currentModule={moduleData.moduleNumber}
        totalModules={ipAgeOfAiWorkshop.totalModules}
      />

      {showGenericUncertainty ? <LegalUncertaintyCallout /> : null}

      <VideoLessonBlock
        videoUrl={moduleData.video.url}
        posterImage={moduleData.video.poster}
        transcriptStartTime={moduleData.video.startTime}
        transcriptEndTime={moduleData.video.endTime}
        caption="Edited module clip placeholder. Final embed will be connected when video segments are published."
        suggestedTitle={moduleData.video.suggestedTitle}
      />

      <TranscriptSegment
        moduleId={moduleData.id}
        cleanedTranscript={moduleData.transcript.cleanedTranscript}
        rawTranscript={moduleData.transcript.rawTranscript}
        lessonText={moduleData.transcript.lessonText}
        lessonSummary={moduleData.transcript.lessonSummary}
        pullQuotes={moduleData.transcript.pullQuotes}
        keyTerms={moduleData.transcript.keyTerms}
        chapterMarkers={moduleData.transcript.chapterMarkers}
        startTime={moduleData.video.startTime}
        endTime={moduleData.video.endTime}
        speakers={moduleData.transcript.speakers}
      />

      {moduleData.legalPracticeTriage ? (
        <LegalPracticeTriage
          lawSays={moduleData.legalPracticeTriage.lawSays}
          unsettled={moduleData.legalPracticeTriage.unsettled}
          artistPractice={moduleData.legalPracticeTriage.artistPractice}
        />
      ) : null}

      {moduleData.showAIUseSelfAudit ? <AIUseSelfAudit /> : null}
      {moduleData.showContractClauseSelector ? <ContractClauseSelector /> : null}
      {moduleData.showRiskResponseLadder ? (
        <div className="rounded-xl border border-border bg-card p-5 md:p-6">
          <RiskResponseLadder />
        </div>
      ) : null}

      {moduleData.scenarioLabMode && moduleData.scenarioLabMode !== 'none' && moduleData.id !== 'module-8' ? (
        <ScenarioLab scenarios={ipAgeOfAiScenarioLab} mode={moduleData.scenarioLabMode} />
      ) : null}

      {moduleData.artistPracticeTips?.map((tip) => (
        <ArtistPracticeTip key={tip}>
          <p>{tip}</p>
        </ArtistPracticeTip>
      ))}

      {moduleData.additionalChecklists?.map((checklist) => (
        <ArtistChecklist
          key={checklist.title}
          title={checklist.title}
          description={checklist.description}
          items={checklist.items}
        />
      ))}

      <KeyLessonPoints points={moduleData.keyLessonPoints} />
      <PracticalTakeaways takeaways={moduleData.practicalTakeaways} />

      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Examples from the panel</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {moduleData.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </section>

      <ArtistChecklist
        title="Artist checklist"
        description="Use this checklist to translate legal awareness into immediate studio and publishing actions."
        items={moduleData.checklist}
      />

      <ReflectionQuestions moduleId={moduleData.id} questions={moduleData.reflectionQuestions} />

      <GlossaryPreview terms={moduleGlossary} />

      {curatedResources.length ? (
        <ResourceLinks links={curatedResources} title="Curated links for this module" />
      ) : null}

      {moduleData.resources.length ? (
        <section className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Related worksheets and guides</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {moduleData.resources.map((resource) => (
              <li key={resource}>{resource}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {moduleData.id === 'module-8' && moduleData.scenarioLabMode === 'full' ? (
        <ScenarioLab scenarios={ipAgeOfAiScenarioLab} mode="full" />
      ) : null}

      {moduleData.id === 'module-8' ? (
        <div className="space-y-6 rounded-xl border border-border bg-card p-5 md:p-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Toolkit and completion</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You have reached the synthesis module. Downloadable files will replace “coming soon” states as they are
              finalized. This is educational material—not legal advice.
            </p>
          </div>
          <DownloadableToolkitPage assets={ipAgeOfAiToolkitAssets} variant="embedded" />
          <section className="rounded-lg border border-primary-200 bg-primary-50/60 p-4">
            <h3 className="text-lg font-semibold text-primary-950">Next steps</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-primary-950/90">
              <li>Pick one workflow—documentation, publishing, or contracting—to implement in the next 30 days.</li>
              <li>Schedule a check-in with a legal clinic or counsel if you are preparing high-stakes agreements.</li>
              <li>Share the glossary and toolkit with collaborators so expectations stay aligned.</li>
            </ul>
          </section>
        </div>
      ) : null}

      <NextLessonNav
        basePath={BASE_PATH}
        previousModule={previousModule ? { id: previousModule.id, title: previousModule.title } : null}
        nextModule={nextModule ? { id: nextModule.id, title: nextModule.title } : null}
      />
    </main>
  )
}

export function generateStaticParams() {
  return ipAgeOfAiModules.map((module) => ({ moduleId: module.id }))
}

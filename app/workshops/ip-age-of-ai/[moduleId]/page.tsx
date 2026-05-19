import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AIUseSelfAudit } from '@/components/workshops/AIUseSelfAudit'
import { ArtistChecklist } from '@/components/workshops/ArtistChecklist'
import { ArtistPracticeTip } from '@/components/workshops/ArtistPracticeTip'
import { ContractClauseSelector } from '@/components/workshops/ContractClauseSelector'
import { DownloadableToolkitPage } from '@/components/workshops/DownloadableToolkitPage'
import { GlossaryPreview } from '@/components/workshops/GlossaryPreview'
import { IpAgeOfAiModuleSectionNav } from '@/components/workshops/IpAgeOfAiModuleSectionNav'
import { IpAgeOfAiModuleSectionShell } from '@/components/workshops/IpAgeOfAiModuleSectionShell'
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
import { IP_AI_SECTION, buildIpAgeOfAiModuleToc } from '@/lib/workshops/ip-age-of-ai-module-toc'
import { ipAgeOfAiModuleSectionPlaceholderBySlug } from '@/lib/workshops/ip-age-of-ai-module-placeholders'
import {
  IP_AGE_OF_AI_LANDSCAPE_BANNER_URL,
  buildIpAgeOfAiYoutubeEmbedSrc,
  buildIpAgeOfAiYoutubeWatchUrl,
  parseWallTimeToSeconds,
} from '@/lib/workshops/ip-age-of-ai-video'

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

  const segmentStartSec = parseWallTimeToSeconds(moduleData.video.startTime)
  const segmentEndSec = parseWallTimeToSeconds(moduleData.video.endTime)
  const youtubeEmbedSrc = buildIpAgeOfAiYoutubeEmbedSrc(segmentStartSec, segmentEndSec)
  const youtubeWatchUrl = buildIpAgeOfAiYoutubeWatchUrl(segmentStartSec)

  const showGenericUncertainty =
    !moduleData.suppressGenericUncertaintyCallout && !moduleData.legalPracticeTriage

  const tocItems = buildIpAgeOfAiModuleToc(moduleData)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
      <p className="text-sm">
        <Link href={BASE_PATH} className="font-medium text-primary underline-offset-4 hover:underline">
          ← Back to workshop landing
        </Link>
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <IpAgeOfAiModuleSectionNav items={tocItems} className="w-full shrink-0 lg:order-first lg:w-56" />

        <div className="min-w-0 flex-1 space-y-8 lg:pl-2">
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
            sectionId={IP_AI_SECTION.video}
            topicBannerSrc={ipAgeOfAiModuleSectionPlaceholderBySlug.video}
            transcriptScrollTargetId={IP_AI_SECTION.transcript}
            videoUrl={youtubeEmbedSrc}
            posterImage={moduleData.video.poster || IP_AGE_OF_AI_LANDSCAPE_BANNER_URL}
            transcriptStartTime={moduleData.video.startTime}
            transcriptEndTime={moduleData.video.endTime}
            caption="Full Skills session recording on YouTube. The embed starts at the segment aligned with this module; open YouTube for a new tab or casting."
            suggestedTitle={moduleData.video.suggestedTitle}
            youtubeWatchUrl={youtubeWatchUrl}
          />

          <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.transcript} bannerKey="transcript">
            <TranscriptSegment
              anchorId={null}
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
          </IpAgeOfAiModuleSectionShell>

          {moduleData.legalPracticeTriage ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.triage} bannerKey="triage">
              <LegalPracticeTriage
                lawSays={moduleData.legalPracticeTriage.lawSays}
                unsettled={moduleData.legalPracticeTriage.unsettled}
                artistPractice={moduleData.legalPracticeTriage.artistPractice}
              />
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          {moduleData.showAIUseSelfAudit ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.aiAudit} bannerKey="aiAudit">
              <AIUseSelfAudit />
            </IpAgeOfAiModuleSectionShell>
          ) : null}
          {moduleData.showContractClauseSelector ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.contract} bannerKey="contract">
              <ContractClauseSelector />
            </IpAgeOfAiModuleSectionShell>
          ) : null}
          {moduleData.showRiskResponseLadder ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.riskLadder} bannerKey="riskLadder">
              <div className="rounded-xl border border-border bg-card p-5 md:p-6">
                <RiskResponseLadder />
              </div>
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          {moduleData.scenarioLabMode && moduleData.scenarioLabMode !== 'none' && moduleData.id !== 'module-8' ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.scenario} bannerKey="scenario">
              <ScenarioLab scenarios={ipAgeOfAiScenarioLab} mode={moduleData.scenarioLabMode} />
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          {moduleData.artistPracticeTips?.length ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.tips} bannerKey="tips">
              {moduleData.artistPracticeTips.map((tip) => (
                <ArtistPracticeTip key={tip}>
                  <p>{tip}</p>
                </ArtistPracticeTip>
              ))}
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          {moduleData.additionalChecklists?.length ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.extraChecklists} bannerKey="extraChecklists">
              {moduleData.additionalChecklists.map((checklist) => (
                <ArtistChecklist
                  key={checklist.title}
                  title={checklist.title}
                  description={checklist.description}
                  items={checklist.items}
                />
              ))}
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.keyPoints} bannerKey="keyPoints">
            <KeyLessonPoints points={moduleData.keyLessonPoints} />
          </IpAgeOfAiModuleSectionShell>

          <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.takeaways} bannerKey="takeaways">
            <PracticalTakeaways takeaways={moduleData.practicalTakeaways} />
          </IpAgeOfAiModuleSectionShell>

          <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.examples} bannerKey="examples">
            <section className="rounded-xl border border-border bg-card p-5 md:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Examples from the panel</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {moduleData.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </section>
          </IpAgeOfAiModuleSectionShell>

          <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.checklist} bannerKey="checklist">
            <ArtistChecklist
              title="Artist checklist"
              description="Use this checklist to translate legal awareness into immediate studio and publishing actions."
              items={moduleData.checklist}
            />
          </IpAgeOfAiModuleSectionShell>

          <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.reflection} bannerKey="reflection">
            <ReflectionQuestions moduleId={moduleData.id} questions={moduleData.reflectionQuestions} />
          </IpAgeOfAiModuleSectionShell>

          <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.glossary} bannerKey="glossary">
            <GlossaryPreview terms={moduleGlossary} />
          </IpAgeOfAiModuleSectionShell>

          {curatedResources.length ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.curatedLinks} bannerKey="curatedLinks">
              <ResourceLinks links={curatedResources} title="Curated links for this module" />
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          {moduleData.resources.length ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.relatedWorksheets} bannerKey="relatedWorksheets">
              <section className="rounded-xl border border-border bg-card p-5 md:p-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Related worksheets and guides</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {moduleData.resources.map((resource) => (
                    <li key={resource}>{resource}</li>
                  ))}
                </ul>
              </section>
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          {moduleData.id === 'module-8' && moduleData.scenarioLabMode === 'full' ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.scenario} bannerKey="scenario">
              <ScenarioLab scenarios={ipAgeOfAiScenarioLab} mode="full" />
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          {moduleData.id === 'module-8' ? (
            <IpAgeOfAiModuleSectionShell id={IP_AI_SECTION.toolkit} bannerKey="toolkit">
              <div className="space-y-6 rounded-xl border border-border bg-card p-5 md:p-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">Toolkit and completion</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You have reached the synthesis module. Downloadable files will replace “coming soon” states as
                    they are finalized. This is educational material—not legal advice.
                  </p>
                </div>
                <DownloadableToolkitPage assets={ipAgeOfAiToolkitAssets} variant="embedded" />
                <section className="rounded-lg border border-primary/30 bg-primary/5 p-4 dark:bg-primary/10">
                  <h3 className="text-lg font-semibold text-foreground">Next steps</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    <li>
                      Pick one workflow—documentation, publishing, or contracting—to implement in the next 30 days.
                    </li>
                    <li>Schedule a check-in with a legal clinic or counsel if you are preparing high-stakes agreements.</li>
                    <li>Share the glossary and toolkit with collaborators so expectations stay aligned.</li>
                  </ul>
                </section>
              </div>
            </IpAgeOfAiModuleSectionShell>
          ) : null}

          <NextLessonNav
            id={IP_AI_SECTION.next}
            basePath={BASE_PATH}
            previousModule={previousModule ? { id: previousModule.id, title: previousModule.title } : null}
            nextModule={nextModule ? { id: nextModule.id, title: nextModule.title } : null}
          />
        </div>
      </div>
    </main>
  )
}

export function generateStaticParams() {
  return ipAgeOfAiModules.map((module) => ({ moduleId: module.id }))
}

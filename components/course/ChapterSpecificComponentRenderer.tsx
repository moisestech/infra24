import type { ComponentProps } from 'react'
import type { ChapterComponentSpec, ChapterLessonSkin } from '@/lib/course/types'
import { FrameSplitDemo } from '@/components/course/chapter-specific/FrameSplitDemo'
import { BranchPathPreview } from '@/components/course/chapter-specific/BranchPathPreview'
import { RemixStack } from '@/components/course/chapter-specific/RemixStack'
import { VernacularMoodBoard } from '@/components/course/chapter-specific/VernacularMoodBoard'
import { LocalVsLivePreview } from '@/components/course/chapter-specific/LocalVsLivePreview'
import { PublishFlowDiagram } from '@/components/course/chapter-specific/PublishFlowDiagram'
import { CanonIntroStrip } from '@/components/course/chapter-specific/CanonIntroStrip'
import { NetArtVsArtOnlineCard } from '@/components/course/chapter-specific/NetArtVsArtOnlineCard'
import { HoverStateDemo } from '@/components/course/chapter-specific/HoverStateDemo'
import { MotionRhythmPreview } from '@/components/course/chapter-specific/MotionRhythmPreview'
import { TraceVsPortraitDemo } from '@/components/course/chapter-specific/TraceVsPortraitDemo'
import { AvatarPresenceCard } from '@/components/course/chapter-specific/AvatarPresenceCard'
import { PathwayChooser } from '@/components/course/chapter-specific/PathwayChooser'
import { ToolComparisonGrid } from '@/components/course/chapter-specific/ToolComparisonGrid'
import { ProjectPlanCanvas } from '@/components/course/chapter-specific/ProjectPlanCanvas'
import { SubmissionChecklist } from '@/components/course/chapter-specific/SubmissionChecklist'
import { CritiqueRubricCards } from '@/components/course/chapter-specific/CritiqueRubricCards'
import { BrowserFrameAnatomy } from '@/components/course/chapter-specific/BrowserFrameAnatomy'
import { PageAsSpaceDemo } from '@/components/course/chapter-specific/PageAsSpaceDemo'
import { InterfaceBreakDemo } from '@/components/course/chapter-specific/InterfaceBreakDemo'
import { LegibilityShiftCard } from '@/components/course/chapter-specific/LegibilityShiftCard'
import { SystemMapPreview } from '@/components/course/chapter-specific/SystemMapPreview'
import { FlowAndFrictionCard } from '@/components/course/chapter-specific/FlowAndFrictionCard'
import { VibecodingQuadrant } from '@/components/course/chapter-specific/VibecodingQuadrant'
import { WebMaterialsStack } from '@/components/course/chapter-specific/WebMaterialsStack'
import { RepoSetupChecklist } from '@/components/course/chapter-specific/RepoSetupChecklist'
import { LearningGuidesStrip } from '@/components/course/chapter-specific/LearningGuidesStrip'

export type ChapterSpecificComponentRendererProps = {
  components: ChapterComponentSpec[]
  /** When set, signature demos pick up chapter-specific surfaces (benchmark polish). */
  presentation?: ChapterLessonSkin
}

export function ChapterSpecificComponentRenderer({
  components,
  presentation,
}: ChapterSpecificComponentRendererProps) {
  if (!components.length) return null

  return (
    <div className="space-y-6">
      {components.map((component, index) => {
        switch (component.kind) {
          case 'frame-split-demo':
            return (
              <FrameSplitDemo
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                {...(component.props as Omit<
                  ComponentProps<typeof FrameSplitDemo>,
                  'title' | 'description'
                >)}
              />
            )
          case 'branch-path-preview':
            return (
              <BranchPathPreview
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof BranchPathPreview>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'remix-stack':
            return (
              <RemixStack
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof RemixStack>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'vernacular-moodboard':
            return (
              <VernacularMoodBoard
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof VernacularMoodBoard>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'local-vs-live-preview':
            return (
              <LocalVsLivePreview
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof LocalVsLivePreview>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'publish-flow-diagram':
            return (
              <PublishFlowDiagram
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof PublishFlowDiagram>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'canon-intro-strip':
            return (
              <CanonIntroStrip
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof CanonIntroStrip>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'net-art-vs-art-online':
            return (
              <NetArtVsArtOnlineCard
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof NetArtVsArtOnlineCard>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'hover-state-demo':
            return (
              <HoverStateDemo
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof HoverStateDemo>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'motion-rhythm-preview':
            return (
              <MotionRhythmPreview
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof MotionRhythmPreview>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'trace-vs-portrait-demo':
            return (
              <TraceVsPortraitDemo
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof TraceVsPortraitDemo>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'avatar-presence-card':
            return (
              <AvatarPresenceCard
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof AvatarPresenceCard>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'pathway-chooser':
            return (
              <PathwayChooser
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof PathwayChooser>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'tool-comparison-grid':
            return (
              <ToolComparisonGrid
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof ToolComparisonGrid>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'project-plan-canvas':
            return (
              <ProjectPlanCanvas
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof ProjectPlanCanvas>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'submission-checklist':
            return (
              <SubmissionChecklist
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof SubmissionChecklist>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'critique-rubric-cards':
            return (
              <CritiqueRubricCards
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof CritiqueRubricCards>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'browser-frame-anatomy':
            return (
              <BrowserFrameAnatomy
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof BrowserFrameAnatomy>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'page-as-space-demo':
            return (
              <PageAsSpaceDemo
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof PageAsSpaceDemo>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'interface-break-demo':
            return (
              <InterfaceBreakDemo
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof InterfaceBreakDemo>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'legibility-shift-card':
            return (
              <LegibilityShiftCard
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof LegibilityShiftCard>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'system-map-preview':
            return (
              <SystemMapPreview
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof SystemMapPreview>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'flow-and-friction-card':
            return (
              <FlowAndFrictionCard
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof FlowAndFrictionCard>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'vibecoding-quadrant':
            return (
              <VibecodingQuadrant
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof VibecodingQuadrant>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'web-materials-stack':
            return (
              <WebMaterialsStack
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof WebMaterialsStack>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'repo-setup-checklist':
            return (
              <RepoSetupChecklist
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof RepoSetupChecklist>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          case 'learning-guides-strip':
            return (
              <LearningGuidesStrip
                key={`${component.kind}-${index}`}
                title={component.title}
                description={component.description}
                presentation={presentation}
                {...(component.props as Omit<
                  ComponentProps<typeof LearningGuidesStrip>,
                  'title' | 'description' | 'presentation'
                >)}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}

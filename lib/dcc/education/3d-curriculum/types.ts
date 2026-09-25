/**
 * DCC 3D School — git-native curriculum records.
 * Presentation components read this module; they do not own copy.
 * Extensible for a later CMS (Airtable, etc.) without rewriting the UI.
 */

import type { StudioServiceId } from '@/lib/dcc/fabrication/studio-services'
import type { FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'

export const THREE_D_SCHOOL_PATH = '/workshop/3d-school'

export type ThreeDCurriculumStatus = 'pilot' | 'coming' | 'in-development'

export type ThreeDCurriculumLevel =
  | 'intro'
  | 'foundation'
  | 'intermediate'
  | 'advanced'

export type ThreeDMentalModelId =
  | 'literacy'
  | 'mesh'
  | 'solid'
  | 'nurbs'
  | 'systems'
  | 'constraints'
  | 'repair'

export type ThreeDCurriculumAssetId =
  | '3D-HERO-001'
  | '3D-MAP-001'
  | '3D-PIPELINE-001'
  | '3D-FOUNDATION-HERO-001'
  | '3D-FOUNDATION-FORMATS-001'
  | '3D-FOUNDATION-PRINTABILITY-001'
  | '3D-BLENDER-HERO-001'
  | '3D-BLENDER-STAGES-001'
  | '3D-BLENDER-OBJECT-001'
  | '3D-PLASTICITY-HERO-001'
  | '3D-PLASTICITY-BOOLEAN-001'
  | '3D-PLASTICITY-STUDIO-OBJECTS-001'
  | '3D-PLASTICITY-BRIDGE-001'
  | '3D-RHINO-HERO-001'
  | '3D-RHINO-JEWELRY-001'
  | '3D-FIX-HERO-001'
  | '3D-FIX-DIAGNOSIS-001'
  | '3D-GRASSHOPPER-HERO-001'
  | '3D-PARAMETRIC-HERO-001'
  | '3D-OPERATOR-PATH-001'
  | '3D-SCHOOL-OVERALL-LANDSCAPE-001'

export type ThreeDCurriculumAspectRatio = '16/9' | '21/9' | '4/3' | '4/5' | '1/1'

export type ThreeDCurriculumAssetStatus = 'placeholder' | 'ready'

export type ThreeDCurriculumAsset = {
  id: ThreeDCurriculumAssetId
  status: ThreeDCurriculumAssetStatus
  filename: string
  aspectRatio: ThreeDCurriculumAspectRatio
  width: number
  height: number
  alt: string
  title: string
  promptPurpose: string
  usedOn: string[]
  /** Public path or CDN URL when delivered. Leave undefined for placeholder UI. */
  src?: string
}

export type ThreeDRelatedPage = {
  href: string
  label: string
}

export type ThreeDCurriculumSession = {
  title: string
  body: string
}

export type ThreeDCurriculumInstructor = {
  name?: string
  role?: string
  image?: string
  bio?: string
}

export type ThreeDCurriculumWorkshop = {
  id: string
  slug: string
  title: string
  subtitle?: string
  order: number
  status: ThreeDCurriculumStatus
  level: ThreeDCurriculumLevel
  mentalModel: ThreeDMentalModelId
  mentalModelLabel: string
  software: string[]
  duration: string
  sessions?: number
  formatNote?: string
  prerequisites: string[]
  outcomes: string[]
  topics: string[]
  applications: string[]
  pipeline: string[]
  projectPrompt?: string
  whatYouMake: string
  skillNext: string[]
  equipment: string[]
  softwareRequirements: string[]
  participantFiles: string[]
  curriculumSessions?: ThreeDCurriculumSession[]
  relatedWorkshopIds: string[]
  relatedServiceIds: StudioServiceId[]
  relatedExistingPages: ThreeDRelatedPage[]
  heroAssetId: ThreeDCurriculumAssetId
  galleryAssetIds: ThreeDCurriculumAssetId[]
  diagramAssetIds: ThreeDCurriculumAssetId[]
  /** Newsletter source slug — `workshop-${interestSlug}`. */
  interestSlug: string
  colorTokenId: FabricationColorTokenId
  /**
   * Reserved for later CMS/ops fields (capacity, venue, pay).
   * Do not put public prices here.
   */
  ops?: Record<string, never>
  instructor?: ThreeDCurriculumInstructor
}

export type ThreeDCurriculumMapNodeKind = 'source' | 'tool' | 'process' | 'output'

export type ThreeDCurriculumMapNode = {
  id: string
  label: string
  sublabel?: string
  href?: string
  workshopId?: string
  kind: ThreeDCurriculumMapNodeKind
}

export type ThreeDCurriculumIntent = {
  id: string
  label: string
  summary: string
  recommendedWorkshopId: string
}

export type ThreeDLearningPathStage = {
  id: string
  kicker: string
  title: string
  body: string
  workshopIds?: string[]
  future?: boolean
}

export type ThreeDFlywheelStep = {
  id: string
  label: string
  detail: string
}

export type ThreeDSmartSignScreen = {
  id: string
  kicker: string
  title: string
  body?: string
  href?: string
  workshopId?: string
}

import type { FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'
import type { CurriculumIconKey } from '@/lib/dcc/education/3d-curriculum/icons'
import type { ThreeDCurriculumAssetId } from '@/lib/dcc/education/3d-curriculum/types'
import { THREE_D_SCHOOL_PATH } from '@/lib/dcc/education/3d-curriculum/types'

export type ThreeDSchoolSectionId =
  | 'overview'
  | 'curriculum-map'
  | 'intent'
  | 'curriculum'
  | 'upcoming'
  | 'path'
  | 'flywheel'
  | 'fabricate'

export type ThreeDSchoolSectionDef = {
  id: ThreeDSchoolSectionId
  kicker: string
  label: string
  title: string
  short: string
  summary: string
  colorTokenId: FabricationColorTokenId
  icon: CurriculumIconKey
  imageAssetId: ThreeDCurriculumAssetId
}

export const THREE_D_SCHOOL_SECTIONS: readonly ThreeDSchoolSectionDef[] = [
  {
    id: 'overview',
    kicker: '01',
    label: 'Overview',
    title: 'Learn how digital objects become physical.',
    short: 'Start',
    summary: 'What 3D School is, and why the goal is choosing a tool — not learning every program.',
    colorTokenId: 'teal',
    icon: 'literacy',
    imageAssetId: '3D-SCHOOL-OVERALL-LANDSCAPE-001',
  },
  {
    id: 'curriculum-map',
    kicker: '02',
    label: 'Curriculum map',
    title: 'One pipeline. Three ways in.',
    short: 'Map',
    summary: 'Mesh, solid, and precision paths share one pipeline: prepare, slice, print.',
    colorTokenId: 'slate',
    icon: 'print',
    imageAssetId: '3D-MAP-001',
  },
  {
    id: 'intent',
    kicker: '03',
    label: 'What to make',
    title: 'What are you trying to make?',
    short: 'Make',
    summary: 'Pick the object first. The recommended workshop follows from that.',
    colorTokenId: 'violet',
    icon: 'mesh',
    imageAssetId: '3D-HERO-001',
  },
  {
    id: 'curriculum',
    kicker: '04',
    label: 'Pilot workshops',
    title: 'Pilot workshops',
    short: 'Pilot',
    summary: 'Three published curricula you can register interest in now.',
    colorTokenId: 'teal',
    icon: 'solid',
    imageAssetId: '3D-BLENDER-HERO-001',
  },
  {
    id: 'upcoming',
    kicker: '05',
    label: 'Coming next',
    title: 'Coming / in development',
    short: 'Coming',
    summary: 'Records for later workshops — not confirmed offerings yet.',
    colorTokenId: 'amber',
    icon: 'nurbs',
    imageAssetId: '3D-GRASSHOPPER-HERO-001',
  },
  {
    id: 'path',
    kicker: '06',
    label: 'Learning path',
    title: 'A path beyond taking a class',
    short: 'Path',
    summary: 'Literacy → a modeling direction → fabrication → a future operator pathway.',
    colorTokenId: 'indigo',
    icon: 'systems',
    imageAssetId: '3D-PIPELINE-001',
  },
  {
    id: 'flywheel',
    kicker: '07',
    label: 'Why we teach this',
    title: 'Why DCC teaches fabrication',
    short: 'Why',
    summary: 'Workshops feed the studio: better files, more capable makers, documented work.',
    colorTokenId: 'emerald',
    icon: 'repair',
    imageAssetId: '3D-PLASTICITY-STUDIO-OBJECTS-001',
  },
  {
    id: 'fabricate',
    kicker: '08',
    label: 'Fabricate a file',
    title: 'File → preparation → quote → fabrication',
    short: 'Make it',
    summary: 'If you already have geometry, DCC fabrication sits next to this school.',
    colorTokenId: 'orange',
    icon: 'print',
    imageAssetId: '3D-FOUNDATION-HERO-001',
  },
] as const

export function schoolSectionHref(id: ThreeDSchoolSectionId): string {
  return `${THREE_D_SCHOOL_PATH}#${id}`
}

export function getSchoolSection(
  id: ThreeDSchoolSectionId
): ThreeDSchoolSectionDef {
  const section = THREE_D_SCHOOL_SECTIONS.find((row) => row.id === id)
  if (!section) {
    throw new Error(`Unknown 3D School section: ${id}`)
  }
  return section
}

import type { ThreeDCurriculumMapNode } from '@/lib/dcc/education/3d-curriculum/types'
import { THREE_D_SCHOOL_PATH } from '@/lib/dcc/education/3d-curriculum/types'
import { curriculumWorkshopPath } from '@/lib/dcc/education/3d-curriculum/workshops'

export const CURRICULUM_MAP_SOURCE: ThreeDCurriculumMapNode = {
  id: 'idea',
  label: 'Idea / image / file',
  sublabel: 'Where an object starts',
  kind: 'source',
  href: `${THREE_D_SCHOOL_PATH}#intent`,
}

export const CURRICULUM_MAP_TOOLS: ThreeDCurriculumMapNode[] = [
  {
    id: 'blender',
    label: 'Blender',
    sublabel: 'Mesh / organic',
    kind: 'tool',
    workshopId: 'blender-for-artists',
    href: curriculumWorkshopPath('blender-for-artists'),
  },
  {
    id: 'plasticity',
    label: 'Plasticity',
    sublabel: 'Solid / direct CAD',
    kind: 'tool',
    workshopId: 'plasticity-for-artists',
    href: curriculumWorkshopPath('plasticity-for-artists'),
  },
  {
    id: 'rhino',
    label: 'Rhino',
    sublabel: 'Precision / NURBS',
    kind: 'tool',
    workshopId: 'rhino-for-artists',
    href: curriculumWorkshopPath('rhino-for-artists'),
  },
]

export const CURRICULUM_MAP_PROCESS: ThreeDCurriculumMapNode[] = [
  {
    id: 'prepare',
    label: 'File preparation',
    sublabel: 'Repair, thickness, orientation',
    kind: 'process',
    workshopId: 'fix-my-3d-file',
    href: curriculumWorkshopPath('fix-my-3d-file'),
  },
  {
    id: 'slice',
    label: 'Slicing',
    sublabel: 'Supports, process choice',
    kind: 'process',
    workshopId: 'from-file-to-physical-object',
    href: curriculumWorkshopPath('from-file-to-physical-object'),
  },
  {
    id: 'machines',
    label: 'FDM / resin / external',
    sublabel: 'Studio or a fabricator',
    kind: 'process',
    href: '/fabricate',
  },
]

export const CURRICULUM_MAP_OUTPUT: ThreeDCurriculumMapNode = {
  id: 'object',
  label: 'Physical object',
  sublabel: 'The thing in the room',
  kind: 'output',
  href: '/fabricate/projects',
}

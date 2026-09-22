import type { ThreeDCurriculumIntent } from '@/lib/dcc/education/3d-curriculum/types'

/**
 * v1 is a set of cards, not a wizard.
 * Stable `id`s so a later routing questionnaire can reuse these records.
 */
export const THREE_D_CURRICULUM_INTENTS: ThreeDCurriculumIntent[] = [
  {
    id: 'organic-sculptural',
    label: 'Organic / sculptural',
    summary: 'Characters, scans, AI meshes, artistic objects.',
    recommendedWorkshopId: 'blender-for-artists',
  },
  {
    id: 'precise-product',
    label: 'Precise / product-like',
    summary: 'Enclosures, brackets, hard-surface forms, functional sculpture.',
    recommendedWorkshopId: 'plasticity-for-artists',
  },
  {
    id: 'jewelry-architecture',
    label: 'Jewelry / architectural / complex surfaces',
    summary: 'Dimensionally sensitive curves and professional surface work.',
    recommendedWorkshopId: 'rhino-for-artists',
  },
  {
    id: 'mechanical-functional',
    label: 'Mechanical / functional',
    summary: 'Assemblies, fixtures, replacement parts, constraints.',
    recommendedWorkshopId: 'parametric-cad-functional-objects',
  },
  {
    id: 'already-have-file',
    label: 'I already have a file',
    summary: 'AI mesh, download, scan, or a model someone sent you.',
    recommendedWorkshopId: 'fix-my-3d-file',
  },
  {
    id: 'dont-know-yet',
    label: 'I don’t know yet',
    summary: 'Start with how digital objects become physical.',
    recommendedWorkshopId: 'from-file-to-physical-object',
  },
]

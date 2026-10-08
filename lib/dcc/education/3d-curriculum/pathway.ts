import type {
  ThreeDFlywheelStep,
  ThreeDLearningPathStage,
} from '@/lib/dcc/education/3d-curriculum/types'

export const THREE_D_LEARNING_PATH: ThreeDLearningPathStage[] = [
  {
    id: 'start',
    kicker: 'Start',
    title: 'From File to Physical Object',
    body: 'The common foundation. How digital objects become physical — before anyone asks you to learn a modeling program.',
    workshopIds: ['from-file-to-physical-object'],
    imageAssetId: '3D-FOUNDATION-HERO-001',
  },
  {
    id: 'finish',
    kicker: 'Finish the object',
    title: 'From Print to Finished Object',
    body: 'After a print exists, decide what the surface needs: accept, remove, add, or reprint. This layer is in development. The practice object and the first real case study are still being validated.',
    workshopIds: ['from-print-to-finished-object'],
    imageAssetId: '3D-FINISH-HERO-001',
  },
  {
    id: 'direction',
    kicker: 'Choose a modeling direction',
    title: 'Blender, Plasticity, or Rhino',
    body: 'Pick the mental model that matches what you are trying to make. You do not need every program.',
    workshopIds: [
      'blender-for-artists',
      'plasticity-for-artists',
      'rhino-for-artists',
    ],
    imageAssetId: '3D-BLENDER-HERO-001',
  },
  {
    id: 'specialize',
    kicker: 'Develop specialization',
    title: 'Grasshopper, parametric CAD, advanced Blender',
    body: 'Later courses for systems, mechanical assemblies, and deeper mesh practice.',
    workshopIds: [
      'grasshopper-computational-objects',
      'parametric-cad-functional-objects',
    ],
    imageAssetId: '3D-GRASSHOPPER-HERO-001',
  },
  {
    id: 'fabrication',
    kicker: 'Fabrication competency',
    title: 'Fix My 3D File, print preparation, machine operation',
    body: 'Diagnosis, slicing, and the studio floor — the shared exit ramp of every modeling path.',
    workshopIds: ['fix-my-3d-file', 'from-file-to-physical-object'],
    imageAssetId: '3D-FIX-HERO-001',
  },
  {
    id: 'operator',
    kicker: 'Potential future role',
    title: 'Future operator pathway',
    body: 'Workshops can contribute toward future DCC operator verification. That verification does not exist as a product yet.',
    future: true,
  },
]

export const THREE_D_FLYWHEEL_STEPS: ThreeDFlywheelStep[] = [
  {
    id: 'workshop',
    label: 'Workshop',
    detail: 'Learn a way of making',
    imageAssetId: '3D-BLENDER-HERO-001',
  },
  {
    id: 'practice',
    label: 'Practice',
    detail: 'Make your own file',
    imageAssetId: '3D-PLASTICITY-STUDIO-OBJECTS-001',
  },
  {
    id: 'supervised',
    label: 'Supervised project',
    detail: 'Work with the studio',
    imageAssetId: '3D-FOUNDATION-HERO-001',
  },
  {
    id: 'experience',
    label: 'Fabrication experience',
    detail: 'Print, finish, check',
    imageAssetId: '3D-PIPELINE-001',
  },
  {
    id: 'capacity',
    label: 'Operator capacity',
    detail: 'Help someone else',
    imageAssetId: '3D-FIX-HERO-001',
  },
  {
    id: 'client',
    label: 'Client project',
    detail: 'Paid DCC work, when it exists',
    imageAssetId: '3D-PLASTICITY-HERO-001',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    detail: 'Case study, reusable example',
    imageAssetId: '3D-FOUNDATION-FORMATS-001',
  },
  {
    id: 'next',
    label: 'New workshop',
    detail: 'The next cohort',
    imageAssetId: '3D-HERO-001',
  },
]

export const THREE_D_FLYWHEEL_LEAD =
  'Workshops are not separate from DCC’s fabrication infrastructure. Every class can produce better files, more capable makers, documented workflows and eventually more people capable of helping others fabricate their work.'

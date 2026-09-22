import type { ThreeDSmartSignScreen } from '@/lib/dcc/education/3d-curriculum/types'
import { THREE_D_SCHOOL_PATH } from '@/lib/dcc/education/3d-curriculum/types'
import { curriculumWorkshopPath } from '@/lib/dcc/education/3d-curriculum/workshops'

export const THREE_D_SMARTSIGN_SCREENS: ThreeDSmartSignScreen[] = [
  {
    id: 'intent',
    kicker: 'DCC 3D School',
    title: 'What are you trying to make?',
    body: 'The right tool depends on the object — not on collecting software.',
    href: `${THREE_D_SCHOOL_PATH}#intent`,
  },
  {
    id: 'organic',
    kicker: 'Organic / sculptural',
    title: 'Blender',
    body: 'Mesh, sculpt, scans, AI meshes.',
    workshopId: 'blender-for-artists',
    href: curriculumWorkshopPath('blender-for-artists'),
  },
  {
    id: 'precise',
    kicker: 'Precise / product-like',
    title: 'Plasticity',
    body: 'Solids, fillets, enclosures, studio objects.',
    workshopId: 'plasticity-for-artists',
    href: curriculumWorkshopPath('plasticity-for-artists'),
  },
  {
    id: 'jewelry',
    kicker: 'Jewelry / complex surface',
    title: 'Rhino',
    body: 'Curves, NURBS, dimensional control.',
    workshopId: 'rhino-for-artists',
    href: curriculumWorkshopPath('rhino-for-artists'),
  },
  {
    id: 'file',
    kicker: 'Already have a file?',
    title: 'Fix My 3D File',
    body: 'Make the thing manufacturable.',
    workshopId: 'fix-my-3d-file',
    href: curriculumWorkshopPath('fix-my-3d-file'),
  },
  {
    id: 'pipeline',
    kicker: 'One pipeline',
    title: 'Model → Prepare → Print',
    body: 'Every modeling path shares the same exit ramp.',
    href: `${THREE_D_SCHOOL_PATH}#curriculum-map`,
  },
  {
    id: 'operate',
    kicker: 'Future pathway',
    title: 'Learn → Practice → Fabricate → Operate',
    body: 'Classes create capacity. Capacity makes services possible.',
    href: `${THREE_D_SCHOOL_PATH}#path`,
  },
]

import type { FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'

export type ServiceLaneId = 'print-my-file' | 'prepare-fabricate' | 'make-it-with-me'

export type FabricationServiceLane = {
  id: ServiceLaneId
  label: string
  summary: string
  includes: string[]
  excludes?: string[]
  typicalTicket: string
  iconKey: 'file' | 'wrench' | 'sparkles'
  colorTokenId: FabricationColorTokenId
}

export const FABRICATION_SERVICE_LANES: FabricationServiceLane[] = [
  {
    id: 'print-my-file',
    label: 'Print My File',
    summary: 'For artists who already have a print-ready STL / 3MF / OBJ.',
    includes: [
      'Basic file check',
      'Slicing',
      'Print estimate',
      'Print execution',
      'Basic support removal',
      'Pickup coordination',
    ],
    excludes: [
      'CAD repair',
      'Segmentation',
      'Finishing',
      'Painting',
      'Assembly beyond basic cleanup',
    ],
    typicalTicket: '$50–$175 early target',
    iconKey: 'file',
    colorTokenId: 'cyan',
  },
  {
    id: 'prepare-fabricate',
    label: 'Prepare + Fabricate',
    summary:
      'Rough file, AI model, scan, broken mesh, sketch, or object that needs digital preparation.',
    includes: [
      'Mesh repair',
      'Scale adjustment',
      'Orientation',
      'Segmentation / registration keys',
      'Support strategy',
      'Assembly plan',
      'Print execution',
    ],
    typicalTicket: '$200–$500 early target',
    iconKey: 'wrench',
    colorTokenId: 'indigo',
  },
  {
    id: 'make-it-with-me',
    label: 'Make It With Me',
    summary:
      'Custom artist projects from idea to physical object with planning and finishing support.',
    includes: [
      'Project intake',
      'Digital modeling / AI-to-3D support',
      'Fabrication planning',
      'Prototype quote',
      'Production quote',
      'Finishing plan',
    ],
    typicalTicket: '$500–$1,500+ custom',
    iconKey: 'sparkles',
    colorTokenId: 'violet',
  },
]

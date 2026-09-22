import {
  Box,
  Clock,
  Cuboid,
  Layers,
  Printer,
  Ruler,
  Scissors,
  Spline,
  User,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { ThreeDMentalModelId } from '@/lib/dcc/education/3d-curriculum/types'

export type CurriculumIconKey =
  | ThreeDMentalModelId
  | 'print'
  | 'slice'
  | 'material'
  | 'machine'
  | 'instructor'
  | 'level'
  | 'time'
  | 'participants'
  | 'repair'
  | 'dimensions'

export const CURRICULUM_ICONS: Record<CurriculumIconKey, LucideIcon> = {
  // ASSET_TODO: custom DCC mesh mental-model icon
  mesh: Box,
  // ASSET_TODO: custom DCC solid mental-model icon
  solid: Cuboid,
  // ASSET_TODO: custom DCC curve / NURBS mental-model icon
  nurbs: Spline,
  // ASSET_TODO: custom DCC parametric / systems icon
  systems: Layers,
  // ASSET_TODO: custom DCC constraint / dimensions icon
  constraints: Ruler,
  dimensions: Ruler,
  // ASSET_TODO: custom DCC 3D-literacy icon
  literacy: Layers,
  // ASSET_TODO: custom DCC repair icon
  repair: Wrench,
  // ASSET_TODO: custom DCC print icon
  print: Printer,
  // ASSET_TODO: custom DCC slice icon
  slice: Scissors,
  // ASSET_TODO: custom DCC material icon
  material: Box,
  // ASSET_TODO: custom DCC machine icon
  machine: Printer,
  // ASSET_TODO: custom DCC instructor icon
  instructor: User,
  // ASSET_TODO: custom DCC skill-level icon
  level: Layers,
  // ASSET_TODO: custom DCC time icon
  time: Clock,
  // ASSET_TODO: custom DCC participants icon
  participants: Users,
}

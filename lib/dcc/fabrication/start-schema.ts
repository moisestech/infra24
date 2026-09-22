import { z } from 'zod'
import {
  PROJECT_STAGES,
  type ProjectStageId,
} from '@/lib/dcc/fabrication/studio-services'

const STAGE_IDS = PROJECT_STAGES.map((s) => s.id) as [ProjectStageId, ...ProjectStageId[]]

export const OBJECT_INTENTS = ['prototype', 'final_object', 'unsure'] as const
export type ObjectIntent = (typeof OBJECT_INTENTS)[number]

export const fabricateStartRequestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  organization: z.string().max(200).optional(),
  projectTitle: z.string().min(1).max(200),
  projectStage: z.enum(STAGE_IDS),
  suggestedServiceId: z
    .enum(['FABRICATE_MY_FILE', 'PREPARE_PLUS_FABRICATE'])
    .optional(),
  description: z.string().min(10).max(4000),
  prototypeLearning: z.string().min(4).max(4000),
  dimensions: z.string().max(200).optional(),
  quantity: z.string().max(40).optional(),
  intendedUse: z.string().max(500).optional(),
  materialPreference: z.string().max(500).optional(),
  deadline: z.string().max(80).optional(),
  objectIntent: z.enum(OBJECT_INTENTS).default('prototype'),
  fileLink: z.string().max(2000).optional(),
  referenceLinks: z.string().max(2000).optional(),
  consentUpdates: z.boolean().default(false),
  isAssociate: z.boolean().default(false),
  planningEstimateNote: z.string().max(500).optional(),
  landingPage: z.string().max(500).optional(),
})

export type FabricateStartRequest = z.infer<typeof fabricateStartRequestSchema>

export const FABRICATE_START_NOTES_PREFIX = '[web:/fabricate/start]'

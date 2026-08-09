import { z } from 'zod'

export const makeRequestSchema = z.object({
  description: z.string().min(10).max(4000),
  dimensions: z.string().max(200).optional(),
  process: z.enum(['FDM', 'Large FDM', 'Resin', 'Scan', 'File prep', 'Consult']),
  finish: z.string().max(200).optional(),
  deadline: z.string().max(40).optional(),
  isAssociate: z.boolean().default(false),
  email: z.string().email(),
  name: z.string().min(1).max(200),
  consentUpdates: z.boolean().default(false),
  machineId: z.string().optional(),
  volumeBracket: z.enum(['small', 'medium', 'large']).default('medium'),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  landingPage: z.string().max(500).optional(),
})

export type MakeRequestInput = z.infer<typeof makeRequestSchema>

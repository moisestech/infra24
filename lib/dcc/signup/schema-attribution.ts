import { z } from 'zod'

export const dccAttributionPayloadSchema = z.object({
  utmSource: z.string().trim().optional(),
  utmMedium: z.string().trim().optional(),
  utmCampaign: z.string().trim().optional(),
  utmContent: z.string().trim().optional(),
  utmTerm: z.string().trim().optional(),
  qrCodeId: z.string().trim().optional(),
  landingPage: z.string().trim().optional(),
  referrer: z.string().trim().optional(),
})

export type DccAttributionPayload = z.infer<typeof dccAttributionPayloadSchema>

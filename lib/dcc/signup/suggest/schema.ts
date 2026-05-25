import { z } from 'zod'
import { PRACTICE_TAG_OPTIONS } from '@/lib/network-builder/demo-select-options'

export const dccSuggestFormSchema = z.object({
  suggestedName: z.string().trim().min(2, 'Name or reference is required'),
  whySuggest: z.string().trim().min(20, 'Please share why this belongs in the Research View'),
  sourceUrl: z.string().trim().optional(),
  website: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  suggestedRole: z.string().trim().optional(),
  practiceTags: z.array(z.string()).optional(),
  miamiConnectionType: z.string().trim().optional(),
  suggesterName: z.string().trim().optional(),
  suggesterEmail: z.string().trim().email().optional().or(z.literal('')),
  source: z.string().trim().optional(),
})

export type DccSuggestFormInput = z.infer<typeof dccSuggestFormSchema>

export { PRACTICE_TAG_OPTIONS, MIAMI_CONNECTION_TYPE_OPTIONS } from '@/lib/network-builder/demo-select-options'

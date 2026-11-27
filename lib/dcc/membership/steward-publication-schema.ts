import { z } from 'zod'
import { ownerPassportSchema, DCC_PUBLIC_PROFILE_DISCLOSURE } from './profile-schema'

/** Server-owned review decisions only. No browser-supplied CRM identifiers. */
export const stewardDecisionSchema = z.object({
  requestId:z.string().uuid(),
  revision:z.number().int().positive(),
  action:z.enum(['approve','reject','return']),
  slug:z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
}).strict().superRefine((value,ctx)=>{
  if(value.action==='approve'&&!value.slug)ctx.addIssue({
    code:'custom',message:'A public slug is required',path:['slug'],
  })
})
export type StewardDecision = z.infer<typeof stewardDecisionSchema>

/** Only pre-existing Airtable select choices can be included in the listing.
 * Member-specified free-text practice never adds new taxonomy choices.
 */
export const PUBLIC_SKILL_CHOICES = [
  'FDM Printing','Resin Printing','3D File Prep','AI Image → 3D',
  'CAD / Modeling','Frontend / Web','AI / Automation',
  'Projection / Exhibition Media','Workshop Facilitation','XR / Immersive',
  'Games / Real-Time','Film / Video','Rendering / Visualization',
  'AI / Generative Media','LED / Lighting Systems','Creative Coding',
  'Electronics / Physical Computing','Interactive Installation',
  'Photography / Imaging','3D Scanning','Data Visualization',
  'Critical Media / Research','Community / Producing',
  'Performance / Movement','Curating / Education','Sound / Music Tech',
  'Animation / Motion',
] as const
const allowed=new Set<string>(PUBLIC_SKILL_CHOICES)

export function proposedPublicFields(input:unknown,slug:string) {
  const draft=ownerPassportSchema.parse(input)
  if(draft.summary.trim().length<10 || draft.practices.length===0)
    throw new Error('incomplete_public_profile')
  const publicSkills=draft.practices.filter(p=>allowed.has(p)).slice(0,10)
  return {
    'Display Name':draft.displayName,
    'Short Bio':draft.summary,
    'Public Skills':publicSkills,
    'Atlas Interests':draft.interests,
    'Atlas Public Links':JSON.stringify(draft.links),
    'Profile Slug':slug,
    'Public Profile?':true,
    'Atlas Publication State':'Approved',
    'Atlas Public Consent':true,
    'Atlas Identity Verified':true,
  } as const
}
export const STEWARD_CONSENT_VERSION=DCC_PUBLIC_PROFILE_DISCLOSURE

export function slugFromName(name:string):string {
  const slug=name.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90).replace(/-$/,'')
  return slug.length>=3?slug:'dcc-member'
}

import { NextResponse } from 'next/server'
import { createHash, randomBytes } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { fiuRatcliffeEvent as event } from '@/lib/dcc/events/fiu-ratcliffe'
import { encryptEventEmail } from '@/lib/dcc/events/mail-crypto'

export const runtime = 'nodejs'
const hash = (value: string) => createHash('sha256').update(value).digest('hex')
export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.DCC_MAIL_ENCRYPTION_KEY) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })
  let token: unknown
  try { ({ token } = await request.json()) } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  const db = createClient()
  const {data:entry,error:lookupError} = await db.from('dcc_event_rsvp_tokens').select('rsvp_id').eq('token_hash',hash(token)).eq('purpose','verify').maybeSingle()
  if (lookupError) return NextResponse.json({ error: 'Temporarily unavailable' }, { status: 503 })
  if (!entry) return NextResponse.json({ error: 'Link expired or already used' }, { status: 410 })
  const {data:rsvp,error:rsvpError}=await db.from('dcc_event_rsvps').select('normalized_email,status').eq('id',entry.rsvp_id).eq('event_id',event.id).maybeSingle()
  if (rsvpError || !rsvp) return NextResponse.json({ error: 'Invalid link' }, { status: 410 })
  const manageToken=randomBytes(32).toString('hex')
  const origin=process.env.DCC_PUBLIC_ORIGIN || 'https://www.dcc.miami'
  const url=origin+event.path+'/manage?token='+manageToken
  let ciphertext:string
  try {ciphertext=encryptEventEmail({to:rsvp.normalized_email,subject:'Your DCC × Ratcliffe RSVP is confirmed',text:'Your RSVP is verified ('+rsvp.status+'). Manage or cancel: '+url,html:'<p>Your RSVP is verified.</p><p><a href="'+url+'">Manage or cancel your RSVP</a></p>'})}catch{return NextResponse.json({error:'Mail configuration unavailable'},{status:503})}
  const {data:queued,error}=await db.rpc('dcc_event_verify_and_queue',{p_event_id:event.id,p_verify_hash:hash(token),p_manage_hash:hash(manageToken),p_ciphertext:ciphertext})
  if(error) return NextResponse.json({error:'Verification temporarily unavailable'},{status:503})
  if(!queued) return NextResponse.json({error:'Link expired or already used'},{status:410})
  return NextResponse.json({ok:true,message:'Your RSVP is verified. Check your email for your management link.'})
}

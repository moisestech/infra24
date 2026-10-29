import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { fiuRatcliffeEvent } from '@/lib/dcc/events/fiu-ratcliffe'
export const runtime = 'nodejs'
const digest = (token: string) => createHash('sha256').update(token).digest('hex')
const validToken = (token: unknown): token is string => typeof token === 'string' && /^[a-f0-9]{64}$/.test(token)
async function resolve(token: string) {
  const db=createClient()
  const {data:entry,error}=await db.from('dcc_event_rsvp_tokens').select('rsvp_id,expires_at,consumed_at').eq('token_hash',digest(token)).eq('purpose','manage').maybeSingle()
  if(error || !entry || entry.consumed_at || Date.parse(entry.expires_at)<=Date.now()) return null
  const {data:rsvp}=await db.from('dcc_event_rsvps').select('id,full_name,status,normalized_email').eq('id',entry.rsvp_id).eq('event_id',fiuRatcliffeEvent.id).not('email_verified_at','is',null).maybeSingle()
  return rsvp ? {db,rsvp} : null
}
function unavailable() {return NextResponse.json({error:'This link has expired or is invalid. Request a new link from the event page.'},{status:410,headers:{'Cache-Control':'no-store'}})}
export async function POST(request:Request) {
  if(!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({error:'Unavailable'},{status:503})
  if(Number(request.headers.get('content-length')||0)>2048) return NextResponse.json({error:'Request too large'},{status:413})
  let body:Record<string,unknown>
  try {body=await request.json()}catch{return NextResponse.json({error:'Invalid request'},{status:400})}
  if(!validToken(body.token))return unavailable()
  const record=await resolve(body.token)
  if(!record)return unavailable()
  if(body.action==='read')return NextResponse.json({ok:true,name:record.rsvp.full_name,status:record.rsvp.status},{headers:{'Cache-Control':'no-store'}})
  if(body.action!=='update' || !['going','maybe','cancelled'].includes(String(body.status)))return NextResponse.json({error:'Invalid RSVP choice'},{status:400})
  const {error}=await record.db.from('dcc_event_rsvps').update({status:body.status,updated_at:new Date().toISOString()}).eq('id',record.rsvp.id).eq('event_id',fiuRatcliffeEvent.id)
  if(error)return NextResponse.json({error:'Unable to update RSVP'},{status:503})
  return NextResponse.json({ok:true,status:body.status,message:body.status==='cancelled'?'Your RSVP was cancelled.':'Your RSVP has been updated.'},{headers:{'Cache-Control':'no-store'}})
}

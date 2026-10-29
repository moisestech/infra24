import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decryptEventEmail } from '@/lib/dcc/events/mail-crypto'
import { sendEmail } from '@/lib/email/resend-client'
export const runtime='nodejs'
export const maxDuration=60
export async function GET(request:Request){
 const authorization=request.headers.get('authorization')
 if(!process.env.CRON_SECRET || authorization!=='Bearer '+process.env.CRON_SECRET)return NextResponse.json({error:'Unauthorized'},{status:401})
 if(!process.env.RESEND_API_KEY||!process.env.DCC_EVENTS_FROM_EMAIL||!process.env.DCC_MAIL_ENCRYPTION_KEY||!process.env.SUPABASE_SERVICE_ROLE_KEY)return NextResponse.json({error:'Mail service unavailable'},{status:503})
 const db=createClient()
 const {data:jobs,error}=await db.rpc('dcc_event_claim_mail',{p_limit:10})
 if(error)return NextResponse.json({error:'Unable to claim queued email'},{status:503})
 let sent=0,failed=0
 for(const job of jobs || []){
  let result:{success:boolean;messageId?:string}={success:false}
  try {
   const message=decryptEventEmail(job.ciphertext)
   result=await sendEmail({...message,from:process.env.DCC_EVENTS_FROM_EMAIL,replyTo:'dccmiami@gmail.com',tags:[{name:'category',value:'dcc-event-rsvp'}]})
  }catch{result={success:false}}
  const {error:finishError}=await db.rpc('dcc_event_finish_mail',{p_id:job.id,p_lease_id:job.lease_id,p_success:result.success,p_provider_id:result.messageId||null})
  if(finishError){failed++;continue}
  if(result.success)sent++;else failed++
 }
 return NextResponse.json({ok:true,claimed:(jobs||[]).length,sent,failed},{headers:{'Cache-Control':'no-store'}})
}

import { NextRequest,NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { validBookingReceipt,validBookingCalendar } from '@/lib/security/booking-receipt'
export const dynamic='force-dynamic'
const headers={'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}
const denied=()=>NextResponse.json({error:'Receipt unavailable'},{status:404,headers})
export async function POST(request:NextRequest,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params
    const {token,purpose='receipt'}=await request.json()
    if(purpose!=='receipt'&&purpose!=='calendar')return denied()
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)||typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return denied()
    const {data:row,error}=await getSupabaseAdmin().from('bookings').select('id,status,start_time,end_time,created_at,metadata').eq('id',id).maybeSingle()
    if(error||!row)return denied()
    const allowed=purpose==='calendar'?row.status==='confirmed'&&validBookingCalendar(id,row.metadata?.reschedule_token,token,row.created_at,row.end_time):validBookingReceipt(id,row.metadata?.reschedule_token,token,row.created_at)
    if(!allowed)return denied()
    // No names, email addresses, private meeting links, mutation credentials or metadata.
    return NextResponse.json({booking:{id:row.id,status:row.status,start_time:row.start_time,end_time:row.end_time}},{headers})
  }catch{return denied()}
}

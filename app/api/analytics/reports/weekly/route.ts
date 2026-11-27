import { NextRequest, NextResponse } from 'next/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store' }
const fail = (error:string,status:number) => NextResponse.json({error},{status,headers})

export async function GET(request: NextRequest) {
  try {
    const orgId=request.nextUrl.searchParams.get('org_id')
    const access=await requireOrganizationStaff(orgId)
    if(!access.ok) return fail(access.error,access.status)
    const input=request.nextUrl.searchParams.get('week_start')
    const now=new Date()
    const start=input ? new Date(input+'T00:00:00.000Z') : new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()-(now.getUTCDay()+6)%7))
    if(!Number.isFinite(start.getTime()) || (input && (!/^\d{4}-\d{2}-\d{2}$/.test(input)||start.toISOString().slice(0,10)!==input))) return fail('Invalid week start',400)
    const end=new Date(start.getTime()+7*86400000)
    const {data:organization,error:orgError}=await access.db.from('organizations').select('name,slug').eq('id',access.orgId).maybeSingle()
    if(orgError || !organization) return fail('Organization unavailable',503)
    const {data:rows,error}=await access.db.from('bookings').select('id,resource_id,resource_type,status,start_time,end_time,price,currency').eq('org_id',access.orgId).gte('start_time',start.toISOString()).lt('start_time',end.toISOString()).limit(1000)
    if(error || !rows || rows.length>=1000) return fail('Weekly report incomplete',503)
    const summarize=(items:typeof rows)=>{
      const totals:Record<string,number>={}
      for(const row of items) if(typeof row.price==='number' && typeof row.currency==='string') totals[row.currency]=(totals[row.currency]||0)+row.price
      return {total_bookings:items.length,confirmed_bookings:items.filter(r=>r.status==='confirmed').length,cancelled_bookings:items.filter(r=>r.status==='cancelled').length,completed_bookings:items.filter(r=>r.status==='completed').length,avg_duration_minutes:items.length?items.reduce((sum,r)=>sum+(Date.parse(r.end_time)-Date.parse(r.start_time))/60000,0)/items.length:0,booking_value_by_currency:totals,total_revenue:null}
    }
    const dates=[...new Set(rows.map(r=>r.start_time.slice(0,10)))].sort()
    const resourceIds=[...new Set(rows.map(r=>r.resource_id))]
    return NextResponse.json({organization,period:{week_start:start.toISOString().slice(0,10),week_end:new Date(end.getTime()-1).toISOString().slice(0,10),timezone:'UTC'},summary:summarize(rows),daily_breakdown:dates.map(date=>({booking_date:date,...summarize(rows.filter(r=>r.start_time.slice(0,10)===date))})),resource_breakdown:resourceIds.map(id=>({resource_id:id,...summarize(rows.filter(r=>r.resource_id===id))})),host_breakdown:[],unavailable_metrics:['actual_revenue','host_breakdown','unique_artists'],generated_at:new Date().toISOString(),report_type:'weekly_booking_summary'},{headers})
  }catch{return fail('Weekly report unavailable',503)}
}

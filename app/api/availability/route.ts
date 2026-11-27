import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { configuredDaySlots,bookingBuffers } from '@/lib/booking/configured-slot'

export const dynamic = 'force-dynamic';

interface AvailabilityWindow {
  by: string
  host: string
  days: string[]
  start: string
  end: string
}

interface AvailabilityRules {
  timezone: string
  slot_minutes: number
  buffer_before: number
  buffer_after: number
  max_per_day_per_host: number
  windows: AvailabilityWindow[]
  blackouts: Array<{ date?: string; range?: string[] }>
  pooling: 'round_robin' | 'least_loaded'
}

interface TimeSlot {
  start: string
  end: string
  host: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('resource_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!resourceId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: resource_id, start_date, end_date' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start || end.getTime()-start.getTime() > 30*86400000) {
      return NextResponse.json({error:'Invalid availability range'}, {status:400})
    }
    const supabaseAdmin = getSupabaseAdmin()

    // Get resource with availability rules
    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .select('id,org_id,availability_rules')
      .eq('id', resourceId)
      .eq('is_active', true)
      .eq('is_bookable', true)
      .single()

    if (resourceError?.code === '42703' || resourceError?.code === 'PGRST204') {
      return NextResponse.json({error:'Booking resource configuration unavailable'},{status:503,headers:{'Cache-Control':'private, no-store'}})
    }
    if (resourceError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found or not bookable' },
        { status: 404 }
      )
    }

    const rules: AvailabilityRules = resource.availability_rules || {}
    
    if (!rules.windows || rules.windows.length === 0) {
      return NextResponse.json(
        { error: 'No availability windows configured for this resource' },
        { status: 400 }
      )
    }

    // Generate available slots
    const availableSlots = await generateAvailableSlots(
      supabaseAdmin,
      resourceId,
      resource.org_id,
      rules,
      start,
      end
    )

    return NextResponse.json({
      resource_id: resourceId,
      timezone: rules.timezone || 'America/New_York',
      slot_minutes: rules.slot_minutes || 30,
      slots: availableSlots.map(({start,end})=>({start,end}))
    }, {headers:{'Cache-Control':'private, no-store'}})

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 503 }
    )
  }
}

async function generateAvailableSlots(db:any,resourceId:string,orgId:string,rules:AvailabilityRules,start:Date,end:Date):Promise<TimeSlot[]>{
 const {before,after}=bookingBuffers(rules)
 const {data:rows,error}=await db.from('bookings').select('start_time,end_time,metadata').eq('resource_id',resourceId).eq('org_id',orgId).eq('status','confirmed').gt('end_time',new Date(start.getTime()-3*86400000).toISOString()).lt('start_time',new Date(end.getTime()+3*86400000).toISOString()).limit(1000)
 if(error||!rows||rows.length>=1000)throw Error('Availability lookup incomplete')
 const slots:TimeSlot[]=[]
 for(let day=start.getTime();day<=end.getTime();day+=86400000){
  const date=new Date(day).toISOString().slice(0,10)
  for(const slot of configuredDaySlots(rules,date)){
   if(rows.some((row:any)=>Date.parse(slot.start)<Date.parse(row.end_time)+after*60000&&Date.parse(slot.end)>Date.parse(row.start_time)-before*60000))continue
   slots.push(slot)
  }
 }
 return [...new Map(slots.map(s=>[s.start,s])).values()]
}

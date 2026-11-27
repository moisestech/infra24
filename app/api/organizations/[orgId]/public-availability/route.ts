import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store' }
export async function GET(request: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const start = Date.parse(request.nextUrl.searchParams.get('start_date') || '')
  const end = Date.parse(request.nextUrl.searchParams.get('end_date') || '')
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orgId) ||
      !Number.isFinite(start) || !Number.isFinite(end) || end <= start || end-start > 31*86400000) {
    return NextResponse.json({error:'Invalid calendar range or organization'}, {status:400,headers})
  }
  try {
    const db = getSupabaseAdmin()
    const {data:org,error:orgError} = await db.from('organizations').select('id').eq('id',orgId).eq('is_active',true).maybeSingle()
    if (orgError) return NextResponse.json({error:'Calendar unavailable'},{status:503,headers})
    if (!org) return NextResponse.json({error:'Organization unavailable'},{status:404,headers})
    const {data:rows,error} = await db.from('resources').select('id,title,type,capacity').eq('org_id',orgId).eq('is_active',true).eq('is_bookable',true).order('title')
    if (error) return NextResponse.json({error:'Calendar unavailable'},{status:503,headers})
    const resources = (rows || []).map(r=>({id:r.id,title:r.title,type:r.type,capacity:r.capacity}))
    if (!resources.length) return NextResponse.json({resources,bookings:[]},{headers})
    const {data:busy,error:busyError} = await db.from('bookings').select('resource_id,start_time,end_time').eq('org_id',orgId).eq('status','confirmed').in('resource_id',resources.map(r=>r.id)).lt('start_time',new Date(end).toISOString()).gt('end_time',new Date(start).toISOString())
    if (busyError) return NextResponse.json({error:'Calendar unavailable'},{status:503,headers})
    const bookings = (busy || []).map((b,i)=>({id:'busy-'+i,resource_id:b.resource_id,start_time:b.start_time,end_time:b.end_time,title:'Unavailable',status:'confirmed'}))
    return NextResponse.json({resources,bookings},{headers})
  } catch {
    return NextResponse.json({error:'Calendar unavailable'},{status:503,headers})
  }
}

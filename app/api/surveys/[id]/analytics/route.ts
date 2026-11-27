import { NextRequest, NextResponse } from 'next/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store' }
const fail = (error:string,status:number) => NextResponse.json({error},{status,headers})
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}){
  try{
    if(!(await auth()).userId) return fail('Sign in required',401)
    const {id}=await params
    const range=request.nextUrl.searchParams.get('dateRange')||'30d'
    const days:Record<string,number>={'7d':7,'30d':30,'90d':90,'1y':365}
    if(!Object.prototype.hasOwnProperty.call(days,range)) return fail('Invalid range',400)
    const {data:form,error:formError}=await getSupabaseAdmin().from('submission_forms').select('id,org_id,title').eq('id',id).eq('type','survey').maybeSingle()
    if(formError) return fail('Survey unavailable',503)
    if(!form) return fail('Survey not found',404)
    const access=await requireOrganizationStaff(form.org_id)
    if(!access.ok) return fail(access.error,access.status)
    const {data:rows,error}=await access.db.from('submissions').select('status,created_at').eq('org_id',access.orgId).eq('form_id',id).gte('created_at',new Date(Date.now()-days[range]*86400000).toISOString()).order('created_at').limit(1000)
    if(error||!rows||rows.length>=1000) return fail('Survey analytics incomplete',503)
    const dates=new Map<string,number>(),statusCounts:Record<string,number>={}
    for(const r of rows){const date=r.created_at.slice(0,10);dates.set(date,(dates.get(date)||0)+1);statusCounts[r.status]=(statusCounts[r.status]||0)+1}
    return NextResponse.json({analytics:{surveyId:id,surveyTitle:form.title,totalResponses:rows.length,statusCounts,timeSeries:[...dates].map(([date,responses])=>({date,responses})),completionRate:null,averageTime:null,responseBreakdown:null,questionAnalytics:[],distributionStats:null,unavailableMetrics:['completion_rate','completion_time','question_analytics','distribution_stats']}},{headers})
  }catch{return fail('Survey analytics unavailable',503)}
}

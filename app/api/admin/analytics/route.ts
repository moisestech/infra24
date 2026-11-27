import { NextRequest, NextResponse } from 'next/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store' }
const fail = (error:string,status:number) => NextResponse.json({error},{status,headers})

export async function GET(request:NextRequest){
  try {
    const access=await requireOrganizationStaff(request.nextUrl.searchParams.get('organization_id'))
    if(!access.ok) return fail(access.error,access.status)
    const range=request.nextUrl.searchParams.get('range')||'30d'
    const days:Record<string,number>={'7d':7,'30d':30,'90d':90,'1y':365}
    if(!Object.prototype.hasOwnProperty.call(days,range)) return fail('Invalid range',400)
    const {data:rows,error}=await access.db.from('bookings').select('id,user_id,resource_id,resource_type,status,created_at,start_time,end_time,price,currency').eq('org_id',access.orgId).gte('created_at',new Date(Date.now()-days[range]*86400000).toISOString()).order('created_at').limit(1000)
    if(error||!rows||rows.length>=1000) return fail('Analytics incomplete',503)
    const users=new Map<string,number>(), dates=new Map<string,number>(),resources=new Map<string,number>(),hours=new Map<number,number>()
    const bookingValue:Record<string,number>={}
    for(const r of rows){
      users.set(r.user_id,(users.get(r.user_id)||0)+1)
      const date=r.created_at.slice(0,10);dates.set(date,(dates.get(date)||0)+1)
      const resource=r.resource_type+' '+r.resource_id;resources.set(resource,(resources.get(resource)||0)+1)
      const hour=new Date(r.start_time).getUTCHours();hours.set(hour,(hours.get(hour)||0)+1)
      if(typeof r.price==='number'&&typeof r.currency==='string') bookingValue[r.currency]=(bookingValue[r.currency]||0)+r.price
    }
    const total=rows.length,retention=users.size?[...users.values()].filter(n=>n>1).length/users.size:0
    const analytics={overview:{total_bookings:total,total_revenue:null,total_users:users.size,average_booking_value:null,booking_success_rate:total?rows.filter(r=>r.status==='confirmed').length/total:0,user_retention_rate:retention},trends:{bookings_over_time:[...dates].map(([date,bookings])=>({date,bookings,revenue:null})),user_growth:[]},top_metrics:{most_popular_resources:[...resources].map(([resource_name,booking_count])=>({resource_name,booking_count,revenue:null})).sort((a,b)=>b.booking_count-a.booking_count).slice(0,10),top_organizations:[],user_roles_distribution:[]},performance:{conversion_rates:{booking_to_payment:null,payment_success:null,user_activation:null},time_metrics:{average_booking_duration:total?rows.reduce((sum,r)=>sum+(Date.parse(r.end_time)-Date.parse(r.start_time))/60000,0)/total:0,peak_booking_hours:[...hours].map(([hour,booking_count])=>({hour,booking_count})).sort((a,b)=>b.booking_count-a.booking_count).slice(0,12)}},booking_value_by_currency:bookingValue,unavailable_metrics:['actual_revenue','payment_conversion','user_growth','role_distribution','cross_organization_metrics'],timezone:'UTC'}
    return NextResponse.json({analytics},{headers})
  }catch{return fail('Analytics unavailable',503)}
}

/** @jest-environment node */
import { NextRequest } from 'next/server'
import { GET as weekly } from '@/app/api/analytics/reports/weekly/route'
import { GET as admin } from '@/app/api/admin/analytics/route'
import { GET as surveyAnalytics } from '@/app/api/surveys/[id]/analytics/route'
import { GET as survey, PUT, DELETE } from '@/app/api/surveys/[id]/route'
import { POST as receipt } from '@/app/api/bookings/[id]/confirmation/route'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { getSupabaseAdmin } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { bookingReceiptToken,validBookingReceipt } from '@/lib/security/booking-receipt'
jest.mock('@/lib/security/require-organization-staff',()=>({requireOrganizationStaff:jest.fn()}))
jest.mock('@/lib/supabase',()=>({getSupabaseAdmin:jest.fn()}))
jest.mock('@clerk/nextjs/server',()=>({auth:jest.fn()}))
const authorize=requireOrganizationStaff as jest.Mock
const db=getSupabaseAdmin as jest.Mock
const clerk=auth as unknown as jest.Mock
const id='11111111-1111-4111-8111-111111111111'
const org='22222222-2222-4222-8222-222222222222'
const context={params:Promise.resolve({id})}
const req=(path:string)=>new NextRequest('https://example.test'+path)
const from=jest.fn()
function query(result:unknown){
 const q={select:jest.fn(),eq:jest.fn(),gte:jest.fn(),lt:jest.fn(),order:jest.fn(),limit:jest.fn(),maybeSingle:jest.fn()}
 for(const k of ['select','eq','gte','lt','order'] as const)q[k].mockReturnValue(q)
 q.limit.mockResolvedValue(result);q.maybeSingle.mockResolvedValue(result)
 return q
}
beforeEach(()=>{jest.resetAllMocks();clerk.mockResolvedValue({userId:null});authorize.mockResolvedValue({ok:false,status:401,error:'Denied'});db.mockReturnValue({from})})
it.each([401,403])('denies weekly and admin analytics without authorized tenant (%i)',async status=>{
 authorize.mockResolvedValue({ok:false,status,error:'Denied'})
 expect((await weekly(req('/api/test?org_id='+org))).status).toBe(status)
 expect((await admin(req('/api/test?organization_id='+org))).status).toBe(status)
 expect(from).not.toHaveBeenCalled()
})
it('weekly uses scoped bounded query and no arbitrary SQL RPC',async()=>{
 authorize.mockResolvedValue({ok:true,db:{from},orgId:org})
 const organization=query({data:{name:'Test'},error:null}),bookings=query({data:[],error:null})
 from.mockImplementation(t=>t==='organizations'?organization:bookings)
 const res=await weekly(req('/api/test?org_id='+org+'&week_start=2026-11-23'))
 expect(res.status).toBe(200);expect(bookings.eq).toHaveBeenCalledWith('org_id',org);expect(bookings.limit).toHaveBeenCalledWith(1000)
 expect((await res.json()).summary.total_revenue).toBeNull()
})
it('admin analytics does not use missing payment columns',async()=>{
 authorize.mockResolvedValue({ok:true,db:{from},orgId:org})
 const q=query({data:[],error:null});from.mockReturnValue(q)
 const res=await admin(req('/api/test?organization_id='+org))
 expect(res.status).toBe(200);expect(q.eq).toHaveBeenCalledWith('org_id',org)
 expect((await res.json()).analytics.overview.total_revenue).toBeNull()
})
it('anonymous survey analytics never reads database',async()=>{expect((await surveyAnalytics(req('/api/test'),context)).status).toBe(401);expect(from).not.toHaveBeenCalled()})
it('cross-tenant survey analytics reads only form selector',async()=>{
 clerk.mockResolvedValue({userId:'user_test'});authorize.mockResolvedValue({ok:false,status:403,error:'Denied'})
 from.mockReturnValue(query({data:{id,org_id:org,title:'Synthetic'},error:null}))
 expect((await surveyAnalytics(req('/api/test'),context)).status).toBe(403);expect(authorize).toHaveBeenCalledWith(org);expect(from).not.toHaveBeenCalledWith('submissions')
})
it('private survey body is not fetched without staff access',async()=>{
 from.mockReturnValue(query({data:{id,org_id:org,is_public:false,requires_authentication:false},error:null}))
 expect((await survey(req('/api/test'),context)).status).toBe(401);expect(from).toHaveBeenCalledTimes(1)
})
it('retired incompatible survey mutations cannot touch storage',async()=>{
 expect((await PUT(req('/api/test'),context)).status).toBe(410);expect((await DELETE(req('/api/test'),context)).status).toBe(410);expect(from).not.toHaveBeenCalled()
})
it('receipt capability is separate from mutation token, bound to id and expires',()=>{
 const key='a'.repeat(64),now=Date.now(),created=new Date(now).toISOString(),token=bookingReceiptToken(id,key)
 expect(validBookingReceipt(id,key,token,created,now)).toBe(true)
 expect(validBookingReceipt(org,key,token,created,now)).toBe(false)
 expect(validBookingReceipt(id,key,key,created,now)).toBe(false)
 expect(validBookingReceipt(id,key,token,created,now+86400001)).toBe(false)
})
it('public receipt rejects missing token before touching storage',async()=>{
 expect((await receipt(new NextRequest('https://example.test',{method:'POST',body:'{}'}),context)).status).toBe(404);expect(from).not.toHaveBeenCalled()
})
it('receipt returns only minimal fields with valid capability',async()=>{
 const key='b'.repeat(64),token=bookingReceiptToken(id,key)
 from.mockReturnValue(query({data:{id,status:'confirmed',start_time:'start',end_time:'end',created_at:new Date().toISOString(),metadata:{reschedule_token:key,artist_email:'private@example.test'}},error:null}))
 const res=await receipt(new NextRequest('https://example.test',{method:'POST',body:JSON.stringify({token})}),context)
 expect(res.status).toBe(200);expect(await res.json()).toEqual({booking:{id,status:'confirmed',start_time:'start',end_time:'end'}})
 expect(res.headers.get('cache-control')).toBe('private, no-store')
})

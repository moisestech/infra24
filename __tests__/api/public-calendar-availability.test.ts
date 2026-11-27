/** @jest-environment node */
import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { GET } from '@/app/api/organizations/[orgId]/public-availability/route'
jest.mock('@/lib/supabase',()=>({getSupabaseAdmin:jest.fn()}))
const orgId='11111111-1111-4111-8111-111111111111'
const params=Promise.resolve({orgId})
const request=(end='2099-01-10')=>new NextRequest('http://localhost/api/test?start_date=2099-01-01&end_date='+end)
const from=jest.fn()
function query(result:object) {
  const q={select:jest.fn(),eq:jest.fn(),in:jest.fn(),lt:jest.fn(),gt:jest.fn(),order:jest.fn(),maybeSingle:jest.fn()}
  for(const method of ['select','eq','in','lt'] as const) q[method].mockReturnValue(q)
  q.gt.mockResolvedValue(result);q.order.mockResolvedValue(result);q.maybeSingle.mockResolvedValue(result)
  return q
}
beforeEach(()=>{jest.resetAllMocks();(getSupabaseAdmin as jest.Mock).mockReturnValue({from})})
test('public response is explicitly projected and scoped',async()=>{
 const org=query({data:{id:orgId},error:null})
 const resources=query({data:[{id:'resource',title:'Printer',type:'equipment',capacity:1,metadata:{secret:'private'}}],error:null})
 const busy=query({data:[{resource_id:'resource',start_time:'2099-01-02T10:00:00Z',end_time:'2099-01-02T11:00:00Z',title:'Private',metadata:{artist_email:'private@example.com'}}],error:null})
 from.mockImplementation(t=>t==='organizations'?org:t==='resources'?resources:busy)
 const res=await GET(request(),{params})
 expect(res.status).toBe(200)
 expect(await res.json()).toEqual({resources:[{id:'resource',title:'Printer',type:'equipment',capacity:1}],bookings:[{id:'busy-0',resource_id:'resource',start_time:'2099-01-02T10:00:00Z',end_time:'2099-01-02T11:00:00Z',title:'Unavailable',status:'confirmed'}]})
 expect(resources.eq).toHaveBeenCalledWith('org_id',orgId)
 expect(busy.eq).toHaveBeenCalledWith('org_id',orgId)
 expect(busy.in).toHaveBeenCalledWith('resource_id',['resource'])
 expect(res.headers.get('cache-control')).toBe('private, no-store')
})
test('oversized range rejected before database access',async()=>{
 expect((await GET(request('2099-03-01'),{params})).status).toBe(400)
 expect(from).not.toHaveBeenCalled()
})
test('inactive or missing organization cannot read resources',async()=>{
 from.mockReturnValue(query({data:null,error:null}))
 expect((await GET(request(),{params})).status).toBe(404)
 expect(from).toHaveBeenCalledTimes(1)
})
test('database failure does not report empty availability',async()=>{
 from.mockReturnValue(query({data:null,error:{message:'private'}}))
 expect((await GET(request(),{params})).status).toBe(503)
})

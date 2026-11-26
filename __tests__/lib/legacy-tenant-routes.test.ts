/** @jest-environment node */
import { NextRequest } from 'next/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GET, POST } from '@/app/api/organizations/[orgId]/resources/route'
import { POST as POSTById } from '@/app/api/organizations/by-id/resources/route'
import { GET as GETAnalytics } from '@/app/api/analytics/bookings/overview/route'
import { PATCH } from '@/app/api/organizations/[orgId]/bookings/[bookingId]/route'
jest.mock('@/lib/security/require-organization-staff', () => ({ requireOrganizationStaff: jest.fn() }))
const guard = requireOrganizationStaff as jest.Mock
const orgId = '11111111-1111-4111-8111-111111111111'
const bookingId = '22222222-2222-4222-8222-222222222222'
const params = Promise.resolve({ orgId, bookingId })
const req = () => new NextRequest('http://localhost/api/test', { method: 'PATCH', body: JSON.stringify({status:'pending'}) })
const get = () => new NextRequest('http://localhost/api/test')
beforeEach(() => jest.resetAllMocks())
test('resource read denies unauthorized staff', async () => {
  guard.mockResolvedValue({ok:false,status:403,error:'Forbidden'})
  expect((await GET(get(), {params})).status).toBe(403)
})
test('resource read uses authorized tenant and bookable filter', async () => {
  const q = {select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),order:jest.fn().mockResolvedValue({data:[{id:'resource'}],error:null})}
  guard.mockResolvedValue({ok:true,orgId,db:{from:jest.fn().mockReturnValue(q)}})
  expect((await GET(get(), {params})).status).toBe(200)
  expect(q.eq.mock.calls).toEqual([['org_id',orgId],['is_bookable',true]])
})
test.each([{data:null,error:null,status:404},{data:null,error:{code:'42883'},status:503},{data:{id:bookingId,org_id:'wrong',title:'Test'},error:null,status:503}])('booking RPC fails closed: $status', async ({data,error,status}) => {
  const rpc = jest.fn().mockReturnValue({maybeSingle:jest.fn().mockResolvedValue({data,error})})
  const from = jest.fn()
  guard.mockResolvedValue({ok:true,orgId,userId:'synthetic-user',db:{rpc,from}})
  expect((await PATCH(req(), {params})).status).toBe(status)
  expect(from).not.toHaveBeenCalled()
})
test('booking RPC uses verified identity and returns authorized result', async () => {
  const rpc = jest.fn().mockReturnValue({maybeSingle:jest.fn().mockResolvedValue({data:{id:bookingId,org_id:orgId,title:'Test'},error:null})})
  const from = jest.fn().mockReturnValue({select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),maybeSingle:jest.fn().mockResolvedValue({data:{id:orgId,name:'Test',slug:'test'}})})
  guard.mockResolvedValue({ok:true,orgId,userId:'synthetic-user',db:{rpc,from}})
  expect((await PATCH(req(), {params})).status).toBe(200)
  expect(rpc).toHaveBeenCalledWith('legacy_review_booking',{p_org_id:orgId,p_booking_id:bookingId,p_reviewer:'synthetic-user',p_status:'pending',p_notes:null})
  expect(from).toHaveBeenCalledWith('organizations')
})

const createResource = (body: object) => new NextRequest('http://localhost/api/test', {method:'POST',body:JSON.stringify(body)})
test('resource creation uses verified tenant and defaults to not bookable', async () => {
  const q = {insert:jest.fn().mockReturnThis(),select:jest.fn().mockReturnThis(),single:jest.fn().mockResolvedValue({data:{id:'synthetic-resource'},error:null})}
  guard.mockResolvedValue({ok:true,orgId,db:{from:jest.fn().mockReturnValue(q)}})
  expect((await POST(createResource({title:' Test ',type:'equipment',org_id:'wrong'}),{params})).status).toBe(201)
  expect(q.insert).toHaveBeenCalledWith({org_id:orgId,title:'Test',type:'equipment',description:'',capacity:1,is_bookable:false})
})
test('resource creation denies unauthorized staff', async () => {
  guard.mockResolvedValue({ok:false,status:403,error:'Forbidden'})
  expect((await POST(createResource({title:'Test',type:'equipment'}),{params})).status).toBe(403)
})
test('resource creation rejects invalid capacity without database access', async () => {
  const from = jest.fn()
  guard.mockResolvedValue({ok:true,orgId,db:{from}})
  expect((await POST(createResource({title:'Test',type:'equipment',capacity:0}),{params})).status).toBe(400)
  expect(from).not.toHaveBeenCalled()
})

const byIdResource = (body: object) => new NextRequest('http://localhost/api/test?org_id='+orgId,{method:'POST',body:JSON.stringify(body)})
test('by-id resource creation uses guarded tenant and private default', async () => {
  const q = {insert:jest.fn().mockReturnThis(),select:jest.fn().mockReturnThis(),single:jest.fn().mockResolvedValue({data:{id:'synthetic-resource'},error:null})}
  guard.mockResolvedValue({ok:true,orgId,db:{from:jest.fn().mockReturnValue(q)}})
  const response = await POSTById(byIdResource({title:' Test ',type:'equipment',org_id:'wrong'}))
  expect(response.status).toBe(201)
  expect(response.headers.get('cache-control')).toContain('no-store')
  expect(guard).toHaveBeenCalledWith(orgId)
  expect(q.insert).toHaveBeenCalledWith({org_id:orgId,title:'Test',type:'equipment',description:'',capacity:1,is_bookable:false})
})
test('by-id resource creation rejects unauthorized staff', async () => {
  guard.mockResolvedValue({ok:false,status:403,error:'Forbidden'})
  expect((await POSTById(byIdResource({title:'Test',type:'equipment'}))).status).toBe(403)
})
test.each([{title:'Test',type:'equipment',capacity:0},{title:' ',type:'equipment'},{title:'Test',type:'invalid'}])('by-id invalid resource never reaches database', async body => {
  const from = jest.fn()
  guard.mockResolvedValue({ok:true,orgId,db:{from}})
  expect((await POSTById(byIdResource(body))).status).toBe(400)
  expect(from).not.toHaveBeenCalled()
})

test('legacy analytics requires organization and denies unauthorized access', async () => {
  expect((await GETAnalytics(get())).status).toBe(400)
  expect(guard).not.toHaveBeenCalled()
  guard.mockResolvedValue({ok:false,status:403,error:'Forbidden'})
  expect((await GETAnalytics(new NextRequest('http://localhost/api/test?org_id='+orgId))).status).toBe(403)
})
test('legacy analytics fails closed without privileged database execution', async () => {
  const rpc = jest.fn()
  const from = jest.fn()
  guard.mockResolvedValue({ok:true,orgId,db:{rpc,from}})
  const response = await GETAnalytics(new NextRequest('http://localhost/api/test?org_id='+orgId))
  expect(response.status).toBe(503)
  expect(response.headers.get('cache-control')).toContain('no-store')
  expect(rpc).not.toHaveBeenCalled()
  expect(from).not.toHaveBeenCalled()
})

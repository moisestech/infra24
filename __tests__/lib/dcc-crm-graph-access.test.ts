import { mayReadDccCrmGraph } from '@/lib/airtable/crm-graph-access'

const off = { DCC_NETWORK_ADMIN_ENABLED:'false', DCC_NETWORK_ADMIN_CLERK_USER_IDS:'user_staff' }
const on = { DCC_NETWORK_ADMIN_ENABLED:'true', DCC_NETWORK_ADMIN_CLERK_USER_IDS:'user_staff, user_second' }

describe('DCC CRM graph API visibility boundary',()=>{
  it('allows only the explicit public active projection by default',()=>{
    expect(mayReadDccCrmGraph('active','public',null,off)).toBe(true)
    for(const mode of ['research','combined','admin'] as const){
      expect(mayReadDccCrmGraph(mode,'public',null,off)).toBe(false)
    }
    expect(mayReadDccCrmGraph('active','internal',null,off)).toBe(false)
  })
  it('rejects unauthenticated internal access even when the admin flag is on',()=>{
    expect(mayReadDccCrmGraph('admin','internal',null,on)).toBe(false)
    expect(mayReadDccCrmGraph('research','public',null,on)).toBe(false)
  })
  it('rejects ordinary signed-in members or incomplete admin setup',()=>{
    expect(mayReadDccCrmGraph('admin','internal','user_member',on)).toBe(false)
    expect(mayReadDccCrmGraph('admin','internal','user_staff',off)).toBe(false)
    expect(mayReadDccCrmGraph('admin','internal','user_staff',{
      DCC_NETWORK_ADMIN_ENABLED:'true', DCC_NETWORK_ADMIN_CLERK_USER_IDS:'',
    })).toBe(false)
  })
  it('permits only explicitly allowlisted and authenticated staff',()=>{
    expect(mayReadDccCrmGraph('research','public','user_staff',on)).toBe(true)
    expect(mayReadDccCrmGraph('admin','internal','user_second',on)).toBe(true)
  })
})

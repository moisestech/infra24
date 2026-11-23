import { ownerPassportSchema } from '@/lib/dcc/membership/profile-schema'
describe('BDD steward disclosure checklist',()=>{
  it('cannot approve data that includes unrecognized private identifiers',()=>{
    const sample={
      displayName:'Network participant',summary:'I experiment with creative coding',
      practices:['Interactive installation'],interests:['code-ai'],links:[],
    }
    expect(ownerPassportSchema.safeParse(sample).success).toBe(true)
    expect(ownerPassportSchema.safeParse({...sample,email:'private@example.org'}).success).toBe(false)
    expect(ownerPassportSchema.safeParse({...sample,clerkUserId:'user_x'}).success).toBe(false)
    expect(ownerPassportSchema.safeParse({...sample,approved:true}).success).toBe(false)
  })
})

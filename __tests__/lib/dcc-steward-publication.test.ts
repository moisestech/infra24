/** @jest-environment node */
import {
  stewardDecisionSchema, proposedPublicFields, slugFromName,
} from '@/lib/dcc/membership/steward-publication-schema'

const draft = {
  displayName:'Example Artist',
  summary:'Interactive sculptures and creative coding in Miami.',
  practices:['Creative Coding','Interactive Installation','Unreviewed personal category'],
  interests:['making','code-ai'],
  links:[{label:'Portfolio',url:'https://example.org/'}],
}

describe('DCC BDD — steward human approval field boundary',()=>{
  it('requires exact consent request reference, revision and public slug for approval',()=>{
    expect(stewardDecisionSchema.safeParse({
      requestId:'f4e3d2c1-1234-4567-8abc-123456789123',
      revision:3,action:'approve',slug:'example-artist',
    }).success).toBe(true)
    for(const input of [
      {requestId:'raw-CRM-record',revision:3,action:'approve',slug:'example-artist'},
      {requestId:'f4e3d2c1-1234-4567-8abc-123456789123',revision:3,action:'approve'},
      {requestId:'f4e3d2c1-1234-4567-8abc-123456789123',revision:3,action:'publish',slug:'example-artist'},
      {requestId:'f4e3d2c1-1234-4567-8abc-123456789123',revision:3,action:'approve',slug:'../../admin'},
      {requestId:'f4e3d2c1-1234-4567-8abc-123456789123',revision:3,action:'approve',slug:'example-artist',email:'private@example.org'},
    ])expect(stewardDecisionSchema.safeParse(input).success).toBe(false)
  })
  it('does not convert unreviewed free-text practices to a new public taxonomy',()=>{
    const fields=proposedPublicFields(draft,'example-artist')
    expect(fields['Public Skills']).toEqual(['Creative Coding','Interactive Installation'])
    expect(fields['Atlas Interests']).toEqual(['making','code-ai'])
    expect(fields['Atlas Publication State']).toBe('Approved')
    expect(fields['Atlas Public Consent']).toBe(true)
    expect(fields['Atlas Identity Verified']).toBe(true)
    expect(JSON.stringify(fields)).not.toContain('Unreviewed personal category')
    expect(JSON.stringify(fields)).not.toContain('binding_id')
    expect(JSON.stringify(fields)).not.toContain('private@example.org')
  })
  it('blocks short or injected profiles, external link credentials and missing practices',()=>{
    expect(()=>proposedPublicFields({...draft,summary:'x'},'example-artist')).toThrow()
    expect(()=>proposedPublicFields({...draft,practices:[]},'example-artist')).toThrow()
    expect(()=>proposedPublicFields({...draft,email:'private@example.org'},'example-artist')).toThrow()
    expect(()=>proposedPublicFields({...draft,links:[{label:'private',url:'https://u:p@example.org'}]},'example-artist')).toThrow()
  })
  it('creates readable slugs without exposing database IDs',()=>{
    expect(slugFromName('José Álvarez')).toBe('jose-alvarez')
    expect(slugFromName('<Anonymous>')).toBe('anonymous')
  })
})

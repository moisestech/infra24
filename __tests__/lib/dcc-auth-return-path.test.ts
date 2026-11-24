import { dccPostAuthPath } from '@/lib/dcc/auth/return-path'
describe('DCC unified auth return path',()=>{
  it('preserves Smart Sign legacy post-auth target',()=>{
    expect(dccPostAuthPath(null,'/dashboard')).toBe('/dashboard')
  })
  it('keeps private Passport deep links local',()=>{
    expect(dccPostAuthPath('/network/your-profile?entry=join','/dashboard'))
      .toBe('/network/your-profile?entry=join')
  })
  it('rejects protocol, host, backslashes and encoded bypass attempts',()=>{
    for(const input of ['https://evil.test','//evil.test','/%2f%2fevil.test',
      '/\\evil.test','/%5cevil.test','/foo\nbar','javascript:alert(1)']) {
      expect(dccPostAuthPath(input,'/dashboard')).toBe('/dashboard')
    }
  })
})
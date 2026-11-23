import { makePeoplePracticeGraph } from '@/lib/dcc/artwork/people-practice-graph'
import { PILOT_PREVIEWS, type AtlasProfile } from '@/lib/dcc/community/atlas'

const approved:AtlasProfile={
  slug:'public-practitioner',
  name:'Public Practitioner',
  summary:'Artist exploring materials and interactive installations',
  practice:['3D printing'],
  interests:['making','interactive'],
}
describe('BDD — member profile affects sculpture only when publicly approved',()=>{
  it('keeps the existing reported WhatsApp backdrop, poll selections and new site cohort independent',()=>{
    const graph=makePeoplePracticeGraph({
      profiles:[...PILOT_PREVIEWS,approved],
      websitePresenceMarks:10,
    })
    expect(graph.marks.filter(x=>x.kind==='anonymous-website-presence')).toHaveLength(10)
    expect(graph.marks.filter(x=>x.kind==='anonymous-presence')).toHaveLength(98)
    expect(graph.pollSelections).toHaveLength(72)
    expect(graph.marks.filter(x=>x.kind==='approved-profile')).toEqual([
      {id:'public-practitioner',label:'Public Practitioner',kind:'approved-profile'},
    ])
    expect(graph.practiceEdges.filter(x=>x.source==='public-practitioner').map(x=>x.target).sort())
      .toEqual(['practice-fabrication','practice-xr'])
  })
  it('a private/unapproved person absent from the public input cannot appear',()=>{
    const graph=makePeoplePracticeGraph({profiles:PILOT_PREVIEWS,websitePresenceMarks:10})
    expect(JSON.stringify(graph)).not.toContain('private-practitioner')
    expect(graph.marks.some(x=>x.kind==='approved-profile')).toBe(false)
  })
  it('cannot create a dot from a single website signup or a malformed aggregate',()=>{
    expect(makePeoplePracticeGraph({websitePresenceMarks:1}).marks.some(
      x=>x.kind==='anonymous-website-presence')).toBe(false)
    expect(makePeoplePracticeGraph({websitePresenceMarks:7}).marks.some(
      x=>x.kind==='anonymous-website-presence')).toBe(false)
  })
  it('deduplicates repeated approved profile slugs',()=>{
    const graph=makePeoplePracticeGraph({profiles:[approved,approved],websitePresenceMarks:0})
    expect(graph.marks.filter(x=>x.kind==='approved-profile')).toHaveLength(1)
    expect(graph.practiceEdges.filter(x=>x.source==='public-practitioner')).toHaveLength(2)
  })
})

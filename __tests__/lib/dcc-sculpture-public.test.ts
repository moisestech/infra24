import {safeWebsitePresenceSnapshot} from '@/lib/dcc/artwork/public-sculpture'

describe('BDD public sculpture aggregate — publication only',()=>{
  it('never infers new website marks from signup events or unknown snapshots',()=>{
    expect(safeWebsitePresenceSnapshot(null)).toEqual({status:'not_published',markCount:0,snapshotWeek:null})
    expect(safeWebsitePresenceSnapshot({memberId:'private_user',joinedAt:'now'}).markCount).toBe(0)
  })
  it('suppress tiny cohorts',()=>{
    expect(safeWebsitePresenceSnapshot({
      snapshot_week:'2026-W47',cohort_state:'suppressed',website_presence_marks:null,
    })).toEqual({status:'suppressed',markCount:0,snapshotWeek:'2026-W47'})
  })
  it('accepts only reviewed coarsened count in a prior snapshot',()=>{
    expect(safeWebsitePresenceSnapshot({
      snapshot_week:'2026-W46',cohort_state:'coarsened',website_presence_marks:10,
    }).markCount).toBe(10)
    for(const value of [0,1,4,7,1025,-5,2.5,'10']){
      expect(safeWebsitePresenceSnapshot({
        snapshot_week:'2026-W46',cohort_state:'coarsened',website_presence_marks:value,
      }).markCount).toBe(0)
    }
  })
})

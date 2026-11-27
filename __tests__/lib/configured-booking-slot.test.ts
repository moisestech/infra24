import {configuredSlot,configuredDaySlots} from '@/lib/booking/configured-slot'
const rules={timezone:'America/New_York',slot_minutes:30,windows:[{host:'host@example.test',days:['Wednesday'],start:'12:00',end:'14:00'}]}
test('local wall-clock slot maps correctly to winter UTC',()=>{
 expect(configuredSlot(rules,'2026-11-25T17:00:00Z','2026-11-25T17:30:00Z')).toBe('host@example.test')
 expect(configuredDaySlots(rules,'2026-11-25')[0]?.start).toBe('2026-11-25T17:00:00.000Z')
})
test('summer DST mapping',()=>expect(configuredDaySlots(rules,'2026-07-01')[0]?.start).toBe('2026-07-01T16:00:00.000Z'))
test.each([['2026-11-25T16:30:00Z','2026-11-25T17:00:00Z'],['2026-11-25T17:05:00Z','2026-11-25T17:35:00Z'],['2026-11-25T17:00:00Z','2026-11-25T18:00:00Z'],['2026-11-26T17:00:00Z','2026-11-26T17:30:00Z']])('rejects invalid configured slot %s', (a,b)=>expect(configuredSlot(rules,a,b)).toBeNull())
test('blackout and host mismatch fail closed',()=>{
 expect(configuredSlot({...rules,blackouts:[{date:'2026-11-25'}]},'2026-11-25T17:00:00Z','2026-11-25T17:30:00Z')).toBeNull()
 expect(configuredSlot(rules,'2026-11-25T17:00:00Z','2026-11-25T17:30:00Z','other@example.test')).toBeNull()
})

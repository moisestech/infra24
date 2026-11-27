// Shared wall-clock schedule contract. No default host or implicit availability.
type Window={host:string,days:string[],start:string,end:string}
type Rules={timezone?:string,slot_minutes?:number,buffer_before?:number,buffer_after?:number,max_per_day_per_host?:number,windows?:Window[],blackouts?:{date?:string,range?:string[]}[]}
const minute=(s:string)=>/^([01]\d|2[0-3]):[0-5]\d$/.test(s)?Number(s.slice(0,2))*60+Number(s.slice(3)):NaN
export function configuredSlot(rules:Rules|null|undefined,start:string,end:string,requiredHost?:string){
 if(!rules||!Array.isArray(rules.windows)||!rules.windows.length)return null
 const a=Date.parse(start),b=Date.parse(end),duration=rules.slot_minutes??30
 if(!Number.isFinite(a)||!Number.isFinite(b)||!Number.isInteger(duration)||duration<1||duration>1440||b-a!==duration*60000||a%60000!==0)return null
 try{
  const fmt=new Intl.DateTimeFormat('en-US',{timeZone:rules.timezone||'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',weekday:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23'})
  const parts=(t:number)=>Object.fromEntries(fmt.formatToParts(t).map(p=>[p.type,p.value]))
  const x=parts(a),y=parts(b),date=x.year+'-'+x.month+'-'+x.day
  if(date!==y.year+'-'+y.month+'-'+y.day)return null
  const from=Number(x.hour)*60+Number(x.minute),to=Number(y.hour)*60+Number(y.minute)
  // Reject DST discontinuity slots rather than advertise a different wall-clock duration.
  if(to-from!==duration)return null
  if(rules.blackouts?.some(v=>v.date===date||(v.range?.length===2&&date>=v.range[0]&&date<=v.range[1])))return null
  for(const w of rules.windows){
   if(typeof w.host!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w.host)||requiredHost&&w.host!==requiredHost||!Array.isArray(w.days)||!w.days.includes(x.weekday))continue
   const lo=minute(w.start),hi=minute(w.end)
   if(Number.isFinite(lo)&&Number.isFinite(hi)&&from>=lo&&to<=hi&&(from-lo)%duration===0)return w.host
  }
  return null
 }catch{return null}
}
export function bookingBuffers(rules:Rules|null|undefined){
 const before=rules?.buffer_before??0,after=rules?.buffer_after??0
 if(!Number.isInteger(before)||!Number.isInteger(after)||before<0||after<0||before>1440||after>1440)throw Error('Invalid booking buffers')
 return {before,after}
}
// Convert a calendar day in configured timezone into matching UTC slots.
// Offset candidates are sampled on either side of the date to handle DST.
export function configuredDaySlots(rules:Rules,date:string){
 const nominal=Date.parse(date+'T00:00:00Z')
 if(!Number.isFinite(nominal))return []
 const duration=rules.slot_minutes??30
 if(!Number.isInteger(duration)||duration<1||duration>1440)return []
 const fmt=new Intl.DateTimeFormat('en-US',{timeZone:rules.timezone||'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'})
 const offsets=new Set<number>()
 for(const t of [nominal-86400000,nominal,nominal+86400000]){
  const p=Object.fromEntries(fmt.formatToParts(t).map(p=>[p.type,p.value]))
  offsets.add(Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day),Number(p.hour),Number(p.minute))-t)
 }
 const slots=new Map<string,{start:string,end:string,host:string}>()
 for(const w of rules.windows||[]){
  const lo=minute(w.start),hi=minute(w.end)
  if(!Number.isFinite(lo)||!Number.isFinite(hi))continue
  for(let m=lo;m+duration<=hi;m+=duration)for(const offset of offsets){
   const a=nominal+m*60000-offset,b=a+duration*60000
   const start=new Date(a).toISOString(),end=new Date(b).toISOString()
   const host=configuredSlot(rules,start,end,w.host)
   if(host)slots.set(start+'|'+host,{start,end,host})
  }
 }
 return [...slots.values()].sort((a,b)=>a.start.localeCompare(b.start)||a.host.localeCompare(b.host))
}

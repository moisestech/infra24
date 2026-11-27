'use client'
import { useEffect,useState } from 'react'
type Analytics={
 overview:{total_bookings:number,total_users:number,booking_success_rate:number,user_retention_rate:number}
 booking_value_by_currency:Record<string,number>
 trends:{bookings_over_time:{date:string,bookings:number}[]}
}
export function AnalyticsDashboard(){
 const [org,setOrg]=useState('')
 const [range,setRange]=useState('30d')
 const [report,setReport]=useState<Analytics|null>(null)
 const [error,setError]=useState('')
 const [loading,setLoading]=useState(false)
 useEffect(()=>{
   const controller=new AbortController()
   setReport(null);setError('');setLoading(false)
   if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(org.trim()))return
   setLoading(true)
   fetch('/api/admin/analytics?organization_id='+encodeURIComponent(org.trim())+'&range='+range,{cache:'no-store',signal:controller.signal})
    .then(async r=>{if(!r.ok)throw Error('Report unavailable or access denied');return (await r.json()).analytics})
    .then(r=>{if(!controller.signal.aborted)setReport(r)})
    .catch(()=>{if(!controller.signal.aborted)setError('Report unavailable or access denied.')})
    .finally(()=>{if(!controller.signal.aborted)setLoading(false)})
   return ()=>controller.abort()
 },[org,range])
 return <section className="space-y-4"><h2 className="text-xl font-semibold">Organization analytics</h2>
 <div className="flex flex-wrap gap-3"><label>Organization ID <input className="border rounded p-2" value={org} onChange={e=>setOrg(e.target.value)} /></label>
 <label>Period <select className="border rounded p-2" value={range} onChange={e=>setRange(e.target.value)}>{['7d','30d','90d','1y'].map(r=><option key={r}>{r}</option>)}</select></label></div>
 <p>Enter an organization ID for which you have staff access.</p>
 {loading&&<p>Loading tenant report…</p>}{error&&<p role="alert">{error}</p>}
 {report&&<div className="space-y-4"><div className="grid grid-cols-2 gap-3">
 <div className="border rounded p-3">Bookings <strong>{report.overview.total_bookings}</strong></div>
 <div className="border rounded p-3">Distinct booking identifiers <strong>{report.overview.total_users}</strong></div>
 <div className="border rounded p-3">Currently confirmed <strong>{Math.round(report.overview.booking_success_rate*100)}%</strong></div>
 <div className="border rounded p-3">Repeat booking identifiers <strong>{Math.round(report.overview.user_retention_rate*100)}%</strong></div></div>
 <h3 className="font-semibold">Recorded booking value (not collected revenue)</h3>
 {Object.entries(report.booking_value_by_currency).map(([currency,value])=><p key={currency}>{currency}: {value.toFixed(2)}</p>)}
 <p>Payment revenue, conversion and user-role metrics are unavailable from the verified booking schema.</p>
 <h3 className="font-semibold">Bookings created by UTC date</h3>
 {report.trends.bookings_over_time.map(row=><p key={row.date}>{row.date}: {row.bookings}</p>)}</div>}
 </section>
}

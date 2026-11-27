'use client'
import { useEffect,useState } from 'react'
import { useParams } from 'next/navigation'
import { UnifiedNavigation,ooliteConfig,bakehouseConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
type Survey={id:string,title:string}
type Report={surveyTitle:string,totalResponses:number,statusCounts:Record<string,number>,timeSeries:{date:string,responses:number}[]}
export default function SurveyAnalyticsPage(){
 const {slug}=useParams<{slug:string}>()
 const [forms,setForms]=useState<Survey[]>([])
 const [selected,setSelected]=useState('')
 const [range,setRange]=useState('30d')
 const [report,setReport]=useState<Report|null>(null)
 const [error,setError]=useState('')
 const [loading,setLoading]=useState(false)
 useEffect(()=>{
  const controller=new AbortController()
  setForms([]);setSelected('');setReport(null);setError('')
  async function load(){
   try{
    const orgResponse=await fetch('/api/organizations/by-slug/'+encodeURIComponent(slug),{signal:controller.signal,cache:'no-store'})
    if(!orgResponse.ok)throw Error()
    const {organization}=await orgResponse.json()
    if(!organization?.id)throw Error()
    const r=await fetch('/api/organizations/by-id/submission-forms?type=survey&is_active=false&org_id='+encodeURIComponent(organization.id),{signal:controller.signal,cache:'no-store'})
    if(!r.ok)throw Error()
    const data=await r.json()
    if(!controller.signal.aborted){setForms(data.forms||[]);setSelected(data.forms?.[0]?.id||'')}
   }catch{if(!controller.signal.aborted)setError('Survey list unavailable or access denied.')}
  }
  void load()
  return ()=>controller.abort()
 },[slug])
 useEffect(()=>{
  const controller=new AbortController()
  setReport(null)
  if(!selected)return
  setLoading(true);setError('')
  fetch('/api/surveys/'+encodeURIComponent(selected)+'/analytics?dateRange='+range,{cache:'no-store',signal:controller.signal})
   .then(async r=>{if(!r.ok)throw Error();return(await r.json()).analytics})
   .then(r=>{if(!controller.signal.aborted)setReport(r)})
   .catch(()=>{if(!controller.signal.aborted)setError('Survey report unavailable or access denied.')})
   .finally(()=>{if(!controller.signal.aborted)setLoading(false)})
  return ()=>controller.abort()
 },[selected,range])
 return <TenantProvider><UnifiedNavigation config={slug==='bakehouse'?bakehouseConfig:ooliteConfig} userRole="admin"/><main className="mx-auto max-w-5xl p-6 space-y-4"><h1 className="text-2xl font-semibold">Survey analytics</h1>
 <label>Survey <select className="border rounded p-2" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Choose survey</option>{forms.map(f=><option key={f.id} value={f.id}>{f.title}</option>)}</select></label>
 <label> Period <select className="border rounded p-2" value={range} onChange={e=>setRange(e.target.value)}>{['7d','30d','90d','1y'].map(r=><option key={r}>{r}</option>)}</select></label>
 {loading&&<p>Loading report…</p>}{error&&<p role="alert">{error}</p>}
 {report&&<section className="space-y-3"><h2 className="font-semibold">{report.surveyTitle}</h2><p>Total submissions: {report.totalResponses}</p><h3 className="font-semibold">Recorded submission status</h3>{Object.entries(report.statusCounts).map(([status,count])=><p key={status}>{status}: {count}</p>)}<h3 className="font-semibold">Submissions by UTC date</h3>{report.timeSeries.map(row=><p key={row.date}>{row.date}: {row.responses}</p>)}<p>Completion time, question-level analysis and email distribution metrics are unavailable from the verified schema.</p></section>}
 </main></TenantProvider>
}

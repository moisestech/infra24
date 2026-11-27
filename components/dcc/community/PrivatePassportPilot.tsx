'use client'
import {useEffect,useState,type FormEvent} from 'react'
import Link from 'next/link'
import {INTERESTS,type InterestId} from '@/lib/dcc/community/atlas'
type Draft={revision:number,displayName:string,summary:string,practices:string[],interests:InterestId[],links:{label:string,url:string}[]}
export function PrivatePassportPilot(){
 const [draft,setDraft]=useState<Draft|null>(null)
 const [message,setMessage]=useState('Loading your private Passport…')
 const [saving,setSaving]=useState(false)
 const [conflict,setConflict]=useState(false)
 useEffect(()=>{
  const controller=new AbortController()
  fetch('/api/dcc/me',{cache:'no-store',signal:controller.signal}).then(async r=>{
   const data=await r.json()
   if(!r.ok)throw Error(data.error||'unavailable')
   if(!controller.signal.aborted){setDraft(data.profile);setMessage('Your draft is private. Publication is not part of this pilot.')}
  }).catch(()=>{if(!controller.signal.aborted)setMessage('Private Passport unavailable. Verify your account or contact DCC.')})
  return()=>controller.abort()
 },[])
 async function save(e:FormEvent){
  e.preventDefault();if(!draft||saving||conflict)return
  setSaving(true)
  try{
   const {revision,displayName,summary,practices,interests,links}=draft
   const r=await fetch('/api/dcc/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision,displayName,summary,practices:practices.map(p=>p.trim()).filter(Boolean),interests,links}),cache:'no-store'})
   if(r.status===409){setConflict(true);setMessage('Your revision changed. Copy unsaved edits before reloading.');return}
   if(!r.ok)throw Error()
   const result=await r.json()
   if(!Number.isInteger(result.profile?.revision)&&!Number.isInteger(result.revision)){setConflict(true);setMessage('Save response could not be verified. Reload before retrying.');return}
   setDraft(current=>current?{...current,revision:result.profile?.revision??result.revision}:current)
   setMessage('Private draft saved.')
  }catch{setMessage('Save unavailable. Your unsaved changes remain here.')}
  finally{setSaving(false)}
 }
 return <main className="mx-auto max-w-2xl space-y-5 px-5 py-10">
  <h1 className="text-3xl font-semibold">Your private DCC Passport</h1>
  <p role="status">{message}</p>
  {draft&&<form onSubmit={save} className="space-y-4">
   <label className="block">Display name<input className="block w-full rounded border p-2" required minLength={2} maxLength={80} value={draft.displayName} onChange={e=>setDraft({...draft,displayName:e.target.value})}/></label>
   <label className="block">Summary<textarea className="block w-full rounded border p-2" maxLength={280} value={draft.summary} onChange={e=>setDraft({...draft,summary:e.target.value})}/></label>
   <label className="block">Practices (one per line)<textarea className="block w-full rounded border p-2" value={draft.practices.join('\n')} onChange={e=>setDraft({...draft,practices:e.target.value.split('\n')})}/></label>
   <fieldset><legend>Interests</legend>{INTERESTS.map(i=><label key={i.id} className="block"><input type="checkbox" checked={draft.interests.includes(i.id)} onChange={e=>setDraft({...draft,interests:e.target.checked?[...draft.interests,i.id]:draft.interests.filter(x=>x!==i.id)})}/> {i.label}</label>)}</fieldset>
   <p>Existing private links are preserved. Link editing and public listing are outside this pilot.</p>
   <button className="rounded bg-[#265b45] px-4 py-3 text-white disabled:opacity-50" disabled={saving||conflict} type="submit">{saving?'Saving…':'Save private draft'}</button>
  </form>}
  <Link className="underline" href="/network/your-dcc">Membership status</Link>
 </main>
}

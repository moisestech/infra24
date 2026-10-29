'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
type Status='going'|'maybe'|'cancelled'
export default function ManageClient(){
 const [token,setToken]=useState('')
 const [status,setStatus]=useState<Status>('going')
 const [name,setName]=useState('')
 const [message,setMessage]=useState('Loading your RSVP…')
 const [loading,setLoading]=useState(true)
 useEffect(()=>{
  const t=new URLSearchParams(window.location.search).get('token') || ''
  window.history.replaceState(null,'',window.location.pathname)
  if(!/^[a-f0-9]{64}$/.test(t)){setLoading(false);setMessage('Missing or invalid management link.');return}
  setToken(t)
  fetch('/api/events/fiu-ratcliffe/manage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:t,action:'read'})})
   .then(async r=>{const data=await r.json();if(!r.ok)throw new Error(data.error);return data})
   .then(data=>{setName(data.name);setStatus(data.status);setMessage('')})
   .catch(e=>setMessage(e.message || 'Unable to load RSVP'))
   .finally(()=>setLoading(false))
 },[])
 async function update(next:Status){
  if(!token)return
  setLoading(true);setMessage('')
  try{const response=await fetch('/api/events/fiu-ratcliffe/manage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,action:'update',status:next})});const data=await response.json();if(!response.ok)throw new Error(data.error);setStatus(next);setMessage(data.message)}
  catch(e){setMessage(e instanceof Error?e.message:'Unable to update')}
  finally{setLoading(false)}
 }
 return <section className="rounded-3xl border border-neutral-200 bg-white p-7 text-neutral-900 shadow-sm"><p className="text-xs font-semibold uppercase tracking-widest text-teal-700">DCC Miami × Ratcliffe</p><h1 className="mt-4 text-2xl font-bold">Manage your RSVP</h1>{name && <p className="mt-3">Hi {name}. Your current response is <strong>{status}</strong>.</p>}{message && <p role="status" className="mt-4 text-sm">{message}</p>}{token && <div className="mt-6 flex flex-col gap-3"><button disabled={loading} onClick={()=>update('going')} className="min-h-12 rounded-full bg-teal-700 px-5 text-white disabled:opacity-50">I'm going</button><button disabled={loading} onClick={()=>update('maybe')} className="min-h-12 rounded-full border border-neutral-300 px-5 disabled:opacity-50">Maybe</button><button disabled={loading} onClick={()=>{if(window.confirm('Cancel your RSVP?'))void update('cancelled')}} className="min-h-12 rounded-full border border-red-300 px-5 text-red-700 disabled:opacity-50">Cancel RSVP</button></div>}<Link className="mt-6 inline-block text-teal-800 underline" href="/events/fiu-ratcliffe-2026-11-10">Return to event</Link></section>
}

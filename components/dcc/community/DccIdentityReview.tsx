'use client'

import { FormEvent, useEffect, useState } from 'react'

type Hold = { requestId:string; stage:string; version:number; reason:string; jobStatus:string; expiresAt:string|null }
type Action = 'challenge'|'approve'|'recover'|'hold'|'return'|'reject'
const inputStyle = 'min-h-11 w-full rounded-lg border bg-transparent px-3'
const buttonStyle = 'min-h-11 rounded-full border px-4 py-2 disabled:opacity-50'

function IdentityCase({item,refresh}:{item:Hold;refresh:()=>Promise<void>}) {
  const [person,setPerson]=useState('')
  const [method,setMethod]=useState('')
  const [code,setCode]=useState('')
  const [message,setMessage]=useState('')
  const [busy,setBusy]=useState(false)
  const uncertain=['confirming','uncertain'].includes(item.stage)
  async function decide(action:Action) {
    setBusy(true)
    setMessage('')
    setCode('')
    try {
      const res=await fetch('/api/dcc/steward/identity-decision',{method:'POST',cache:'no-store',
        headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:item.requestId,version:item.version,action,
          ...(action==='challenge'?{personId:person.trim(),method}:{})})})
      const data=await res.json()
      if(res.ok) {
        if(data.code) setCode(data.code)
        setMessage(data.state==='resolved'?'Private membership confirmed.':data.code?'Give this code to the member using the selected channel. It expires in 30 minutes.':'Decision recorded.')
      } else setMessage(res.status===409?'The case changed or the evidence did not match. Check the current case before taking another action.':'Confirmation is unavailable. Check the current case and provider before continuing.')
      await refresh()
    } catch { setMessage('Connection interrupted. Refresh to check whether the decision was recorded.') }
    finally { setBusy(false) }
  }
  return <article className="space-y-3 rounded-xl border p-4">
    <h3 className="break-all font-medium">Case {item.requestId}</h3>
    <p className="text-sm">{item.stage.replaceAll('_',' ')} · {item.reason.replaceAll('_',' ')} · revision {item.version}</p>
    {item.jobStatus==='needs_inspection'&&<p>Locate the existing provider binding before reviewing this interrupted worker claim.</p>}
    {!uncertain&&<fieldset disabled={busy} className="space-y-3">
      <label className="block">Historical People record ID<input className={inputStyle} value={person} onChange={e=>setPerson(e.target.value)} autoComplete="off"/></label>
      <label className="block">How will you identify the member?<select className={inputStyle} value={method} onChange={e=>setMethod(e.target.value)}>
        <option value="">Choose a channel</option><option value="in_person">In person with someone I know</option>
        <option value="established_channel">A contact channel already verified before signup</option>
      </select></label>
      <p className="text-sm">Match the member’s private case reference. Deliver the code in person or through a previously known channel independent of the signup email.</p>
      <button className={buttonStyle} disabled={!method||!/^rec[A-Za-z0-9]{14}$/.test(person.trim())} onClick={()=>void decide('challenge')}>Issue a fresh code</button>
    </fieldset>}
    {code&&<output className="block break-all rounded border p-3 font-mono" aria-label="Single-use identity code">{code}</output>}
    {message&&<p role="status">{message}</p>}
    <div className="flex flex-wrap gap-2">
      {item.stage==='proven'&&<button disabled={busy} className={buttonStyle} onClick={()=>void decide('approve')}>Approve private binding</button>}
      {uncertain?<button disabled={busy} className={buttonStyle} onClick={()=>void decide('recover')}>Check provider confirmation</button>:
        (['hold','return','reject'] as const).map((action,i)=><button key={action} disabled={busy} className={buttonStyle}
          onClick={()=>void decide(action)}>{['Hold','Return for evidence','Reject match'][i]}</button>)}
    </div>
  </article>
}
export function DccIdentityReview() {
  const [items,setItems]=useState<Hold[]>([])
  const [message,setMessage]=useState('Loading identity cases…')
  async function refresh() {
    try {
      const res=await fetch('/api/dcc/steward/identity-queue',{cache:'no-store'})
      if(!res.ok) throw new Error()
      const data=await res.json()
      setItems(data.requests)
      setMessage(data.requests.length?'':'No held identity cases.')
    } catch { setItems([]);setMessage('The private identity queue is unavailable.') }
  }
  useEffect(()=>{void refresh()},[])
  return <section className="my-8 space-y-4">
    <h2 className="text-2xl">Private membership identity review</h2>
    <button className={buttonStyle} onClick={()=>void refresh()}>Refresh identity cases</button>
    {message&&<p role="status">{message}</p>}
    {items.map(item=><IdentityCase key={item.requestId} item={item} refresh={refresh}/>)}
  </section>
}
export function DccOwnerIdentityProof() {
  const [id,setId]=useState('')
  const [code,setCode]=useState('')
  const [message,setMessage]=useState('')
  const [busy,setBusy]=useState(false)
  useEffect(()=>{
    const controller=new AbortController()
    fetch('/api/dcc/me/identity-proof',{cache:'no-store',signal:controller.signal}).then(async res=>{
      if(res.ok) setId((await res.json()).requestId || '')
    }).catch(()=>{})
    return ()=>controller.abort()
  },[])
  async function submit(event:FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      const res=await fetch('/api/dcc/me/identity-proof',{method:'POST',cache:'no-store',
        headers:{'Content-Type':'application/json'},body:JSON.stringify({code:code.trim()})})
      setMessage(res.ok?'Identity evidence received. A founder will decide your private membership.':'The code could not be confirmed. Check your account and ask the founder for a fresh code.')
      setCode('')
    } catch { setMessage('Connection interrupted. Check with your founder before retrying.') }
    finally {setBusy(false)}
  }
  if(!id) return null
  return <form onSubmit={submit} className="mt-4 space-y-3">
    <p className="break-all text-sm">Your private case reference <strong>{id}</strong></p>
    <label className="block">Code from your DCC founder<input value={code} onChange={e=>setCode(e.target.value)}
      autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={32} className={inputStyle}/></label>
    <button disabled={busy||code.trim().length!==32} className={buttonStyle}>Confirm identity evidence</button>
    {message&&<p role="status">{message}</p>}
  </form>
}

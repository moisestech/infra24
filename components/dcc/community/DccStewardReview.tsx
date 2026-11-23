'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { INTERESTS } from '@/lib/dcc/community/atlas'

type Request = {
  requestId:string
  revision:number
  requestedAt:string|null
  disclosureVersion:string|null
  memberVerified:boolean
  needsReview:boolean
  preview:null|{
    displayName:string
    summary:string
    practices:string[]
    interests:string[]
    links:{label:string,url:string}[]
  }
}
export function DccStewardReview() {
  const [items,setItems]=useState<Request[]>([])
  const [status,setStatus]=useState<'loading'|'ready'|'unavailable'>('loading')
  const [message,setMessage]=useState('')
  async function load(){
    setStatus('loading')
    try {
      const res=await fetch('/api/dcc/steward/review-queue',{cache:'no-store'})
      const result=await res.json()
      if(!res.ok){setMessage(res.status===403?'Your account is not authorized to review public profiles.':'The private reviewer queue is not available yet.');setStatus('unavailable');return}
      setItems(result.requests)
      setStatus('ready')
    }catch {setMessage('Could not load the private review queue.');setStatus('unavailable')}
  }
  useEffect(()=>{void load()},[])
  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
    <Link href="/network/community" className="text-sm underline underline-offset-2">← Community Atlas</Link>
    <h1 className="mt-8 text-3xl font-light sm:text-4xl">DCC public profile review</h1>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
      Private steward queue. A public profile is a decision, not an automatic result of joining.
      These are unpublished requests and do not yet change the Atlas or sculpture.
    </p>
    <div className="mt-5 rounded-xl border border-amber-500/40 px-4 py-3 text-sm" role="status">
      Publication is intentionally disabled in this release. Database verification, reviewer
      authorization tests, existing People identity binding, unique public slugs, consent
      version and withdrawal behavior must pass before any approval action is enabled.
    </div>
    <div className="mt-6 flex items-center justify-between gap-3">
      <p className="text-sm">{status==='ready'?items.length+' requests awaiting review':'Review queue'}</p>
      <button onClick={()=>void load()} className="min-h-11 rounded-full border px-5 py-2 text-sm">Refresh</button>
    </div>
    {status==='loading'&&<p className="mt-8 text-sm" role="status">Loading private requests…</p>}
    {status==='unavailable'&&<p className="mt-8 text-sm" role="alert">{message}</p>}
    {status==='ready'&&items.length===0&&<p className="mt-8 text-sm text-neutral-500">No pending profile requests.</p>}
    <div className="mt-6 space-y-5">
      {items.map(item=><article className="rounded-2xl border p-5 sm:p-6" key={item.requestId}>
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          {item.memberVerified?'Identity binding verified':'Requires identity review'} · Draft revision {item.revision}
        </p>
        <h2 className="mt-3 text-xl">{item.preview?.displayName||'Incomplete private submission'}</h2>
        <p className="mt-2 text-sm leading-relaxed">{item.preview?.summary||'No reviewable introduction.'}</p>
        <p className="mt-4 text-xs text-neutral-500">Declared practices</p>
        <p className="mt-1 text-sm">{item.preview?.practices.join(' · ')||'Not supplied'}</p>
        <p className="mt-4 text-xs text-neutral-500">Public practice connections requested</p>
        <div className="mt-2 flex flex-wrap gap-2">{(item.preview?.interests||[]).map(id=>{
          const category=INTERESTS.find(x=>x.id===id)
          return <span key={id} className="rounded-full border px-3 py-1 text-xs">{category?.label||id}</span>
        })}</div>
        {!!item.preview?.links.length&&<div className="mt-4 text-sm">
          <p className="text-xs text-neutral-500">Requested external links</p>
          {item.preview.links.map(link=><a key={link.url} href={link.url} rel="noopener noreferrer" target="_blank" className="mt-2 block underline">{link.label}</a>)}
        </div>}
        <p className="mt-5 text-xs text-neutral-500">Consent version: {item.disclosureVersion||'Not recorded'} · Requested: {item.requestedAt||'Unknown'}</p>
        <div className="mt-5 rounded-lg border border-dashed p-4 text-xs leading-relaxed">
          Steward checklist: verify canonical People binding, compare requested profile against the owner draft,
          check unique public slug, approve only selected fields and practice hubs, confirm withdrawal/revocation
          plan, then record decision with an immutable audit event. Publication action is not available yet.
        </div>
      </article>)}
    </div>
  </main>
}

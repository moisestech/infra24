'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { INTERESTS } from '@/lib/dcc/community/atlas'
import { slugFromName } from '@/lib/dcc/membership/steward-publication-schema'

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
export function DccStewardReview({canWrite}:{canWrite:boolean}) {
  const [items,setItems]=useState<Request[]>([])
  const [status,setStatus]=useState<'loading'|'ready'|'unavailable'>('loading')
  const [message,setMessage]=useState('')
  const [working,setWorking]=useState<string|null>(null)
  const [slugs,setSlugs]=useState<Record<string,string>>({})
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
  async function decide(item:Request,action:'approve'|'reject'|'return'){
    if(!canWrite || working || (action==='approve'&&(!item.memberVerified||!item.preview)))return
    setMessage('')
    setWorking(item.requestId)
    try {
      const slug=slugs[item.requestId]??slugFromName(item.preview?.displayName||'')
      const res=await fetch('/api/dcc/steward/decision',{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          requestId:item.requestId,revision:item.revision,action,
          ...(action==='approve'?{slug}:{}),
        }),
      })
      const result=await res.json()
      if(!res.ok){
        setMessage(res.status===409
          ?'This request changed, has a duplicate public URL, or needs identity review. Refresh before deciding.'
          :'The decision could not be completed. No new public listing has been confirmed.')
        return
      }
      setMessage(action==='approve'
        ?result.public
          ?'Approved and publicly discoverable. Verify the Atlas profile and withdrawal behavior.'
          :'Approved for publication, but the website-member visibility switch is OFF. This profile is not public yet.'
        :action==='return'
          ?'Returned for edits. This draft is no longer pending public review.'
          :'Review rejected. No new information was published.')
      await load()
    }catch {
      setMessage('Review service unavailable. Verify the pending request and audit before attempting again.')
    }finally {setWorking(null)}
  }

  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
    <Link href="/network/community" className="text-sm underline underline-offset-2">← Community Atlas</Link>
    <h1 className="mt-8 text-3xl font-light sm:text-4xl">DCC public profile review</h1>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
      Private steward queue. A public profile is a decision, not an automatic result of joining.
      These are unpublished requests and do not yet change the Atlas or sculpture.
    </p>
    <div className="mt-5 rounded-xl border border-amber-500/40 px-4 py-3 text-sm" role="status">
      {canWrite ? 'Staff decisions require verified identity, exact consent revision, unique public URL and an audited database grant. An uncertain external write is held for manual reconciliation.' :
        'Publication decisions are disabled until the database and provider acceptance tests pass. You can inspect the private review queue without publishing.'}
    </div>
    {message && <p role="status" className="mt-4 rounded-lg border px-4 py-3 text-sm">{message}</p>}
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
          Verify verified People linkage and the exact consent version. Only approved name, summary,
          supported public skill tags, selected practice categories and HTTPS links are allowed. 
          Each decision records a revision and steward identity; uncertain provider writes stay private.
        </div>
        {canWrite && <div className="mt-5 space-y-3">
          <label className="block text-xs font-semibold" htmlFor={'dcc-profile-slug-'+item.requestId}>
            Proposed shareable profile URL
          </label>
          <input id={'dcc-profile-slug-'+item.requestId}
            className="min-h-11 w-full rounded-lg border bg-transparent px-3 text-sm"
            value={slugs[item.requestId]??slugFromName(item.preview?.displayName||'')}
            onChange={e=>setSlugs(previous=>({...previous,[item.requestId]:e.target.value.toLowerCase()}))}
            aria-describedby={'dcc-profile-slug-help-'+item.requestId}/>
          <p className="text-xs text-neutral-500" id={'dcc-profile-slug-help-'+item.requestId}>
            Visible at /network/community/[slug]. Only lowercase letters, digits and hyphens.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={Boolean(working)||!item.memberVerified||item.needsReview||!item.preview}
              onClick={()=>void decide(item,'approve')}
              className="min-h-11 rounded-full border px-5 py-2 text-sm font-semibold disabled:opacity-40">Approve & publish</button>
            <button type="button" disabled={Boolean(working)} onClick={()=>void decide(item,'return')}
              className="min-h-11 rounded-full border px-5 py-2 text-sm disabled:opacity-40">Return for edits</button>
            <button type="button" disabled={Boolean(working)} onClick={()=>void decide(item,'reject')}
              className="min-h-11 rounded-full border px-5 py-2 text-sm disabled:opacity-40">Reject request</button>
          </div>
        </div>}
      </article>)}
    </div>
  </main>
}

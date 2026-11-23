'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { INTERESTS, type InterestId } from '@/lib/dcc/community/atlas'
import { DCC_PUBLIC_PROFILE_DISCLOSURE } from '@/lib/dcc/membership/profile-schema'

type Draft = {
  displayName: string
  summary: string
  practices: string[]
  interests: InterestId[]
  links: { label: string; url: string }[]
  publication: 'private' | 'pending_review' | 'withdrawal_requested'
}
const empty: Draft = {
  displayName: '',summary:'',practices:[],interests:[],links:[],publication:'private',
}
type Membership = 'active' | 'pending_reconciliation'
function humanizeError(code: string) {
  const descriptions: Record<string,string> = {
    profile_not_enabled: 'Private profiles are being prepared. You can explore the network in the meantime.',
    membership_not_enabled: 'DCC account synchronization is not yet available.',
    membership_pending_sync: 'Your account is still synchronizing. Nothing has been published.',
    verify_account_first: 'Verify your account email before editing your DCC profile.',
    identity_review_required: 'We need to verify an existing DCC identity before editing.',
    membership_restricted: 'This membership cannot currently be edited.',
    profile_save_failed: 'We could not save your changes. Your form remains here for another attempt.',
    request_unavailable: 'The member service is temporarily unavailable.',
  }
  return descriptions[code] ?? 'We could not confirm this action. Try again later.'
}
const inputClass = 'w-full rounded-xl border border-[color:var(--dn-line)] bg-[var(--dn-panel)] px-4 py-3.5 text-base text-[color:var(--dn-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dn-link)]'
const buttonClass = 'min-h-11 rounded-full bg-[var(--dn-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--dn-accent-ink)] disabled:opacity-40'
export function YourDccProfile() {
  const [draft,setDraft] = useState<Draft>(empty)
  const [membership,setMembership] = useState<Membership | null>(null)
  const [status,setStatus] = useState<'loading'|'ready'|'unavailable'|'signed_out'>('loading')
  const [practiceInput,setPracticeInput] = useState('')
  const [linkUrl,setLinkUrl] = useState('')
  const [busy,setBusy] = useState(false)
  const [dirty,setDirty] = useState(false)
  const [feedback,setFeedback] = useState('')
  const [publicConsent,setPublicConsent] = useState(false)
  const [currentlyPublic,setCurrentlyPublic] = useState<boolean | null>(null)
  const fetchMember = useCallback(async () => {
    try {
      const response = await fetch('/api/dcc/me',{cache:'no-store'})
      if (response.status === 401) { setStatus('signed_out'); return }
      const body = await response.json()
      if (!response.ok) { setStatus('unavailable');setFeedback(humanizeError(body.error));return }
      setMembership(body.membership)
      setDraft(body.profile)
      setCurrentlyPublic(typeof body.currentlyPublic==='boolean' ? body.currentlyPublic : null)
      setStatus('ready')
      setFeedback('')
    } catch { setStatus('unavailable');setFeedback('Your private profile is temporarily unavailable.') }
  },[])
  useEffect(() => {void fetchMember()},[fetchMember])
  function change<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(old=>({...old,[key]:value}))
    setDirty(true)
    setPublicConsent(false)
    setFeedback('')
  }
  function toggle(id: InterestId) {
    change('interests',draft.interests.includes(id)
      ? draft.interests.filter(x=>x!==id) : [...draft.interests,id])
  }
  function addPractice() {
    const value=practiceInput.trim()
    if (!value || value.length>80 || draft.practices.length>=12) return
    change('practices',Array.from(new Set([...draft.practices,value])))
    setPracticeInput('')
  }
  function addLink() {
    if (!linkUrl.trim() || draft.links.length>=5) return
    try {
      const u=new URL(linkUrl.trim())
      if (u.protocol!=='https:' || u.username || u.password) throw Error()
      change('links',[...draft.links,{label:'Portfolio',url:u.toString()}])
      setLinkUrl('')
    } catch { setFeedback('Use a full public https:// link.') }
  }
  async function save(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || status!=='ready') return
    setBusy(true);setFeedback('')
    try {
      const response=await fetch('/api/dcc/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        displayName:draft.displayName.trim(),
        summary:draft.summary.trim(),
        practices:draft.practices,
        interests:draft.interests,
        links:draft.links,
      })})
      const result=await response.json()
      if (!response.ok || result.saved!==true) {setFeedback(humanizeError(result.error));return}
      setDirty(false)
      setDraft(old=>({...old,publication:'private'}))
      setFeedback('Private profile saved. It is not public or part of the named sculpture yet.')
    } catch {setFeedback('Could not confirm save. Your changes remain on this screen.')}
    finally {setBusy(false)}
  }
  async function withdrawPublic() {
    if(busy || membership!=='active')return
    setBusy(true);setFeedback('')
    try{
      const response=await fetch('/api/dcc/me/visibility',{method:'POST'})
      const result=await response.json()
      if(!response.ok || result.status!=='withdrawn'){
        setFeedback(humanizeError(result.error))
        return
      }
      setCurrentlyPublic(false)
      setPublicConsent(false)
      setDraft(old=>({...old,publication:'withdrawal_requested'}))
      setFeedback('Public listing withdrawn. Your private DCC membership is unchanged.')
    }catch {
      setFeedback('We could not confirm your public visibility change. Please contact DCC.')
    }finally{setBusy(false)}
  }
  async function requestPublic() {
    if (busy || dirty || membership!=='active' || !publicConsent) return
    setBusy(true);setFeedback('')
    try {
      const response=await fetch('/api/dcc/me/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        consent:true,disclosureVersion:DCC_PUBLIC_PROFILE_DISCLOSURE,
      })})
      const result=await response.json()
      if (!response.ok || result.status!=='pending_review') {setFeedback(humanizeError(result.error));return}
      setDraft(old=>({...old,publication:'pending_review'}))
      setPublicConsent(false)
      setFeedback('Sent for identity and content review. Nothing has been made public yet.')
    } catch {setFeedback('We could not confirm your request. Please try again.')}
    finally {setBusy(false)}
  }

  return <section className="dcc-network-theme min-h-screen bg-[var(--dn-bg)] px-4 py-10 text-[var(--dn-ink)] sm:px-6">
    <div className="mx-auto max-w-2xl">
      <Link href="/network/community" className="text-sm text-[var(--dn-link)] hover:underline">← Explore the Atlas</Link>
      <p className="mt-9 font-mono text-xs uppercase tracking-[.17em] text-[var(--dn-subtle)]">DCC member space</p>
      <h1 className="mt-3 text-4xl font-light tracking-[-.06em] sm:text-5xl">Your Profile <em>/ Passport</em></h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--dn-muted)]">One identity across DCC. Share what you work on, explore the network, and choose whether people can discover you. Your draft starts private.</p>
      {status==='loading' && <p className="mt-8" role="status">Checking your DCC membership…</p>}
      {status==='signed_out' && <div className="mt-8 rounded-2xl border border-[var(--dn-line)] p-6">
        <h2 className="text-xl">Sign in to keep your profile across devices.</h2>
        <p className="mt-2 text-sm text-[var(--dn-muted)]">Your DCC member identity is reused. No separate Passport account.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className={buttonClass} href="/sign-in?redirect_url=%2Fnetwork%2Fyour-profile">Sign in</Link>
          <Link className="min-h-11 rounded-full border border-[var(--dn-line)] px-5 py-3 text-sm" href="/sign-up?redirect_url=%2Fnetwork%2Fyour-profile">Create an account</Link>
        </div>
      </div>}
      {status==='unavailable' && <div className="mt-8 rounded-2xl border border-[var(--dn-line)] p-6" role="status">
        <p>{feedback}</p>
        <p className="mt-2 text-sm text-[var(--dn-muted)]">Your existing membership, if any, has not changed. You can still browse approved public profiles.</p>
        <button className="mt-4 min-h-11 rounded-full border border-[var(--dn-line)] px-5 py-2" onClick={()=>{setStatus('loading');void fetchMember()}}>Retry</button>
      </div>}
      {status==='ready' && <div className="mt-8 space-y-8">
        <div className="rounded-2xl border border-[var(--dn-line)] bg-[var(--dn-panel)] p-5">
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--dn-subtle)]">Your membership</p>
          <p className="mt-1 text-lg">{membership==='active'?'Verified DCC website member':'Identity reconciliation in progress'}</p>
          <p className="mt-2 text-sm text-[var(--dn-muted)]">Your profile draft is private. Joining alone never publishes your name, email or practice connections. An anonymous aggregate may eventually contribute to the artwork in a delayed batch after verified activation.</p>
        </div>
        <form className="space-y-6" onSubmit={save}>
          <div><label htmlFor="dcc-display-name" className="mb-2 block text-sm font-medium">Display name</label>
            <input id="dcc-display-name" className={inputClass} value={draft.displayName} required maxLength={80} autoComplete="name" onChange={e=>change('displayName',e.target.value)} /></div>
          <div><label htmlFor="dcc-summary" className="mb-2 block text-sm font-medium">What do you make, teach, or explore?</label>
            <textarea id="dcc-summary" className={inputClass} rows={3} maxLength={280} value={draft.summary} onChange={e=>change('summary',e.target.value)} placeholder="A sentence or two. You can change this later." /></div>
          <div><label htmlFor="dcc-practice" className="mb-2 block text-sm font-medium">Specific practices</label>
            <div className="flex gap-2"><input id="dcc-practice" className={inputClass} maxLength={80} value={practiceInput} onChange={e=>setPracticeInput(e.target.value)} placeholder="e.g. 3D printing" />
              <button type="button" className="min-h-11 rounded-xl border border-[var(--dn-line)] px-4" onClick={addPractice}>Add</button></div>
            <div className="mt-3 flex flex-wrap gap-2">{draft.practices.map(p=><button type="button" key={p} className="min-h-11 rounded-full border border-[var(--dn-line)] px-3 text-xs" onClick={()=>change('practices',draft.practices.filter(x=>x!==p))}>{p} ×</button>)}</div></div>
          <fieldset><legend className="mb-3 text-sm font-medium">What would you like people to discover you through?</legend>
            <p className="mb-3 text-xs text-[var(--dn-muted)]">Choose any, or none. These are not proof of availability or expertise.</p>
            <div className="grid gap-2 sm:grid-cols-2">{INTERESTS.map(i=><label key={i.id} className="flex min-h-11 items-center gap-3 rounded-xl border border-[var(--dn-line)] p-3 text-sm">
              <input type="checkbox" checked={draft.interests.includes(i.id)} onChange={()=>toggle(i.id)} className="h-5 w-5" />{i.label}
            </label>)}</div></fieldset>
          <div><label htmlFor="dcc-link" className="mb-2 block text-sm font-medium">Portfolio or website (optional)</label>
            <div className="flex gap-2"><input id="dcc-link" className={inputClass} type="url" value={linkUrl} placeholder="https://…" onChange={e=>setLinkUrl(e.target.value)} />
              <button type="button" className="min-h-11 rounded-xl border border-[var(--dn-line)] px-4" onClick={addLink}>Add</button></div>
            <div className="mt-2 space-y-2">{draft.links.map(l=><div key={l.url} className="flex items-center justify-between gap-3 text-xs">
              <span className="min-w-0 truncate">{l.url}</span><button type="button" className="min-h-11 px-3" onClick={()=>change('links',draft.links.filter(x=>x.url!==l.url))}>Remove</button>
            </div>)}</div></div>
          <button className={buttonClass} disabled={busy || !draft.displayName.trim()} type="submit">{busy?'Saving…':dirty?'Save private draft':'Save profile'}</button>
        </form>
        <div className="rounded-2xl border border-[var(--dn-line)] bg-[var(--dn-panel)] p-5">
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--dn-subtle)]">Visibility and sculpture</p>
          <h2 className="mt-2 text-2xl font-light">Be discoverable, on your terms.</h2>
          <p className="mt-3 text-sm text-[var(--dn-muted)]">After identity and content review, your approved display name and selected practices may appear in the directory and become visible connections to practice hubs in the sculpture. Your private draft is never the public graph.</p>
          {currentlyPublic===true && <p className="mt-3 text-sm" role="status">
            An earlier approved version of your profile is currently discoverable.
            Editing this private draft does not automatically update or remove that public version.
          </p>}
          {currentlyPublic===null && membership==='active' && <p className="mt-3 text-xs text-[var(--dn-muted)]">
            Public listing status has not been confirmed yet.
          </p>}
          {draft.publication==='pending_review' && <p className="mt-3 text-sm" role="status">
            Your latest public listing request is pending review; this action did not publish new information.
          </p>}
          {membership!=='active' && <p className="mt-3 text-sm" role="status">Public profile requests become available after your membership is verified.</p>}
          <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={publicConsent} onChange={e=>setPublicConsent(e.target.checked)} disabled={membership!=='active'||dirty}/>
            I ask DCC to review my display name, summary, practices, categories and public links for publication in the public directory and artwork. This is separate from membership and marketing, and does not authorize person-to-person links.</label>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className={buttonClass} disabled={busy||dirty||membership!=='active'||!publicConsent} onClick={()=>void requestPublic()}>Request public listing</button>
            <button type="button" className="min-h-11 rounded-full border border-[var(--dn-line)] px-5 py-3 text-sm" disabled={busy} onClick={()=>void withdrawPublic()}>
              Withdraw public listing
            </button>
          </div>
          {dirty && <p className="mt-2 text-xs text-[var(--dn-subtle)]">Save your private changes before requesting review.</p>}
        </div>
        {feedback && <p role="status" className="text-sm text-[var(--dn-link)]">{feedback}</p>}
        <p className="text-xs text-[var(--dn-muted)]">You can return and edit your draft. If an older profile was already published, a new draft does not automatically replace or withdraw it. Contact DCC to correct or remove approved public information until a verified revocation workflow is available.</p>
      </div>}
    </div>
  </section>
}

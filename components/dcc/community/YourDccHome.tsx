'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type State = 'checking'|'signed_out'|'not_available'|'pending_sync'|'verification_required'|
 'pending_review'|'identity_review'|'active'|'restricted'|'unavailable'

const labels:Record<State,{title:string;description:string}>={
  checking:{title:'Checking your DCC membership',description:'Your private member record is being checked.'},
  signed_out:{title:'Sign in to Your DCC',description:'One account connects your DCC experiences across devices.'},
  not_available:{title:'Membership activation is being prepared',description:'You can explore approved profiles and the collective artwork while the verified membership system is tested.'},
  pending_sync:{title:'Account created — membership synchronizing',description:'Your account is recognized, but your verified DCC membership has not been confirmed. No new public dot is created at signup.'},
  verification_required:{title:'Verify your account first',description:'Finish Clerk email verification. Private membership is not active until verification is complete.'},
  pending_review:{title:'Identity reconciliation in progress',description:'Your verified account is being checked against existing DCC People records to prevent duplicates.'},
  identity_review:{title:'Identity review needed',description:'A previous People record may need human reconciliation. We will not claim it based only on an email match.'},
  active:{title:'Welcome to Your DCC',description:'Your verified website membership is active. Your profile stays private unless you separately request publication.'},
  restricted:{title:'Your membership needs attention',description:'Profile editing is unavailable in this account state. Contact DCC to resolve an identity or membership issue.'},
  unavailable:{title:'Membership status unavailable',description:'Your account remains unchanged. You can explore the public network while we verify the service.'},
}
export function YourDccHome({membershipLive}:{membershipLive:boolean}) {
  const [state,setState]=useState<State>(membershipLive?'checking':'not_available')
  useEffect(()=>{
    if(!membershipLive)return
    const controller=new AbortController()
    async function check(){
      try{
        const res=await fetch('/api/dcc/membership/status',{cache:'no-store',signal:controller.signal})
        if(res.status===401){setState('signed_out');return}
        if(res.status===503){setState('unavailable');return}
        const result=await res.json()
        if(!res.ok)throw Error()
        if(result.memberStatus in labels)setState(result.memberStatus as State)
        else setState('unavailable')
      }catch{if(!controller.signal.aborted)setState('unavailable')}
    }
    void check()
    return()=>controller.abort()
  },[membershipLive])
  useEffect(()=>{
    if(state!=='active' && state!=='pending_review')return
    const params=new URL(window.location.href).searchParams
    const source=params.get('entry')||'app-sign-up'
    const campaign=params.get('campaign')||params.get('utm_campaign')
    // Marketing provenance only. It cannot grant membership or public listing.
    void fetch('/api/dcc/me/entry',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({source,campaign}),
    }).catch(()=>{})
  },[state])
  const current=labels[state]
  return <main className="min-h-screen bg-[#f3f5ee] px-4 py-8 text-[#19382a] sm:px-6 sm:py-14">
    <div className="mx-auto max-w-4xl">
      <Link className="inline-flex min-h-[44px] items-center font-mono text-sm font-semibold uppercase tracking-[.15em]" href="/">◎ DCC Miami</Link>
      <p className="mt-7 font-mono text-xs uppercase tracking-[.15em] text-[#607d6c]">Your network / your place</p>
      <h1 className="mt-3 text-4xl font-medium tracking-[-.055em] sm:text-6xl">Your DCC</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#52685d]">A place to return to, develop your creative identity, and discover the people and practices around you.</p>
      <section className="mt-8 rounded-2xl border border-[#d3dfd5] bg-white p-5 sm:p-8" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-widest text-[#607d6c]">Membership</p>
        <h2 className="mt-3 text-2xl font-medium">{current.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#52685d]">{current.description}</p>
        {state==='signed_out'&&<Link href="/sign-in?redirect_url=%2Fnetwork%2Fyour-dcc" className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-[#265b45] px-6 text-sm font-semibold text-white">Sign in</Link>}
        {state==='pending_sync'&&<p className="mt-4 text-xs text-[#61776b]">You do not need to create another account. Membership status will update after provider synchronization.</p>}
      </section>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-[#d3dfd5] bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#617a69]">01 / Passport</p>
          <h2 className="mt-3 text-2xl font-medium">Develop your profile.</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#52685d]">Describe what you make and what you are interested in. See a private preview of your connections to the sculpture before requesting a listing.</p>
          <Link href="/network/your-profile" className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-[#265b45] px-5 text-sm font-semibold text-[#265b45]">Open your Passport</Link>
        </article>
        <article className="rounded-2xl border border-[#d3dfd5] bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#617a69]">02 / Community</p>
          <h2 className="mt-3 text-2xl font-medium">Discover your network.</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#52685d]">Explore approved member profiles, practice areas, and the evolving collective artwork. Nothing you view is published about you.</p>
          <Link href="/network/community" className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-[#265b45] px-5 text-sm font-semibold text-[#265b45]">Explore Atlas</Link>
        </article>
      </div>
      <p className="mt-6 max-w-xl text-xs leading-relaxed text-[#617a69]">DCC membership is private by default. Approved public profiles and their chosen practice links are separate from the delayed anonymous website-membership cohort. Existing WhatsApp-reported membership is a different count and may overlap.</p>
      <Link href="/network/artwork" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold underline underline-offset-4">See the network sculpture</Link>
    </div>
  </main>
}
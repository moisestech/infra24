'use client'

import { SignIn, SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { dccClerkAppearance } from '@/lib/dcc/auth/appearance'
import { dccPostAuthPath } from '@/lib/dcc/auth/return-path'

type Mode = 'sign-in' | 'sign-up'

function NetworkMotif() {
  const nodes = [[42,72],[121,36],[206,84],[287,35],[354,95],[111,159],[217,170],[314,202]] as const
  const lines = [[0,1],[0,5],[1,2],[1,3],[2,4],[2,6],[3,4],[4,7],[5,6],[6,7]] as const
  return <svg viewBox="0 0 395 246" aria-hidden="true" className="w-full max-w-[390px]">
    <g stroke="#6e9c82" strokeWidth="1.2" opacity=".4">
      {lines.map(([a,b],i)=><line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}/>)}
    </g>
    {nodes.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={i===6?17:7}
      fill={i===6?'#e1b891':'#5d9478'} opacity={i===6?1:.85}/>
      {i===6&&<circle cx={x} cy={y} r="25" stroke="#e1b891" fill="none" opacity=".28"/>}</g>)}
  </svg>
}

/** DCC is the identity, Smart Sign is a product; Clerk remains the auth provider. */
export function DccAuthExperience({
  mode,membershipLive,
}: {mode:Mode;membershipLive:boolean}) {
  const params=useSearchParams()
  const fallback=membershipLive?'/network/your-dcc':'/dashboard'
  const destination=dccPostAuthPath(params.get('redirect_url'),fallback)
  const joinedFromNetwork=destination.startsWith('/network/')
  const otherUrl=(mode==='sign-in'?'/sign-up':'/sign-in')+
    '?redirect_url='+encodeURIComponent(destination)

  return <main className="min-h-screen bg-[#f3f5ee] text-[#1d3328]">
    <div className="mx-auto grid min-h-screen max-w-[1180px] items-center gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(360px,460px)] md:gap-12 md:py-12 lg:gap-20">
      <section className="mx-auto w-full max-w-[480px] md:mx-0">
        <Link href="/" aria-label="Digital Culture Center Miami home"
          className="inline-flex min-h-[44px] items-center gap-3 font-mono text-sm font-semibold uppercase tracking-[.15em] text-[#244b39]">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#789b88] text-xl" aria-hidden="true">◎</span>
          DCC MIAMI
        </Link>
        <div className="mt-5 max-w-[395px]"><NetworkMotif/></div>
        <p className="mt-4 font-mono text-xs uppercase tracking-[.16em] text-[#52705e]">Belonging as infrastructure</p>
        <h1 className="mt-3 text-4xl font-medium leading-[1.09] tracking-[-.055em] sm:text-5xl">
          {mode==='sign-up'?'Join the people making digital culture.':'Welcome back to your network.'}
        </h1>
        <p className="mt-5 max-w-[440px] text-base leading-relaxed text-[#52685d]">
          {mode==='sign-up'
            ? 'One account to explore the community, develop your Passport, and participate in DCC experiences.'
            : 'Sign in to continue where you left off. Your account can connect your DCC experience and tools like Smart Sign.'}
        </p>
        {mode==='sign-up'&&<div className="mt-6 rounded-xl border border-[#c7d6cd] bg-white/70 p-4 text-sm leading-relaxed text-[#33483b]">
          <strong className="block font-semibold text-[#1d3328]">{membershipLive?'Your DCC membership starts private.':'DCC account enrollment is being prepared.'}</strong>
          <p className="mt-1">
            {membershipLive
              ? 'Once your identity is verified, one private DCC member record can be activated. Later, an anonymous aggregate may contribute to the sculpture in delayed batches.'
              : 'This signup currently creates an account for the platform; it does not yet activate verified DCC membership or add a dot to the sculpture.'}
          </p>
          <p className="mt-2">Your name, practices and connections are not made public automatically. A discoverable Atlas profile requires your separate request and review.</p>
        </div>}
        {mode==='sign-in'&&joinedFromNetwork&&<p className="mt-5 rounded-xl border border-[#c7d6cd] bg-white/70 p-4 text-sm">
          Continue to your DCC Passport after signing in.
        </p>}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-[#265b45]">
          <Link href="/network/community" className="min-h-[44px] content-center underline underline-offset-4">Explore Atlas</Link>
          <Link href="/network/artwork" className="min-h-[44px] content-center underline underline-offset-4">See the sculpture</Link>
          <Link href="/privacy" className="min-h-[44px] content-center underline underline-offset-4">Privacy</Link>
        </div>
      </section>
      <section aria-label={mode==='sign-in'?'Sign in to DCC':'Join DCC'} className="w-full">
        <div className="mx-auto max-w-[440px]">
          <p className="mb-3 text-center font-mono text-xs uppercase tracking-[.15em] text-[#52705e]">
            {mode==='sign-up'?'Create your account':'Member sign in'}
          </p>
          {mode==='sign-in'
            ? <SignIn redirectUrl={destination} appearance={dccClerkAppearance}/>
            : <SignUp redirectUrl={destination} appearance={dccClerkAppearance}/>}
          <p className="mt-5 text-center text-sm text-[#52685d]">
            {mode==='sign-in'?'New to DCC?':'Already have an account?'}{' '}
            <Link href={otherUrl} className="min-h-[44px] font-semibold text-[#265b45] underline underline-offset-4">
              {mode==='sign-in'?'Join DCC':'Sign in'}
            </Link>
          </p>
          <p className="mt-3 text-center text-xs leading-relaxed text-[#647a6c]">
            Authentication is securely handled by Clerk. Your public visibility is a separate choice.
          </p>
        </div>
      </section>
    </div>
  </main>
}
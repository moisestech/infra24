'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
export default function VerifyClient() {
  const [message,setMessage] = useState('Verifying your RSVP…')
  const [error,setError] = useState(false)
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    window.history.replaceState(null,'',window.location.pathname)
    if (!token) { setError(true); setMessage('This confirmation link is missing its token.'); return }
    let cancelled = false
    fetch('/api/events/fiu-ratcliffe/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})})
      .then(async r => { const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Unable to confirm'); return data })
      .then(data => { if (!cancelled) setMessage(data.message) })
      .catch(e => { if (!cancelled) {setError(true);setMessage(e.message || 'Please try again')} })
    return () => {cancelled=true}
  },[])
  return <section role="status" className="rounded-3xl border border-neutral-200 bg-white p-7 text-neutral-900 shadow-sm"><p className="text-xs font-semibold uppercase tracking-widest text-teal-700">DCC Miami × Ratcliffe</p><h1 className="mt-4 text-2xl font-bold">{error ? 'Confirmation unavailable' : 'RSVP confirmation'}</h1><p className="mt-4 leading-relaxed">{message}</p><Link className="mt-6 inline-block text-teal-800 underline" href="/events/fiu-ratcliffe-2026-11-10">View event details</Link></section>
}

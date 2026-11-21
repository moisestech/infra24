'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { INTERESTS, PILOT_PREVIEWS, filterProfiles, PASSPORT_PREVIEW_KEY, readPassportPreview, type InterestId, type PassportPreview, type AtlasProfile } from '@/lib/dcc/community/atlas'
import styles from './community.module.css'
import { AtlasProfileForm } from './AtlasProfileForm'

const Field = dynamic(() => import('./CommunityField'), { ssr: false, loading: () => <p className={styles.loading}>Opening the field…</p> })

export function CommunityAtlas() {
  const [interests, setInterests] = useState<InterestId[]>([])
  const [query, setQuery] = useState('')
  const [sourceProfiles, setSourceProfiles] = useState<AtlasProfile[]>(PILOT_PREVIEWS)
  const [mode, setMode] = useState<'preview' | 'live'>('preview')
  const [intakeEnabled, setIntakeEnabled] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [showProfileForm, setShowProfileForm] = useState(false)
  const profileDialog = useRef<HTMLDialogElement>(null)
  const loadId = useRef(0)
  const [selected, setSelected] = useState<string | null>('moises-sanabria')
  const [paused, setPaused] = useState(true)
  const [showPassport, setShowPassport] = useState(false)
  const [passport, setPassport] = useState<PassportPreview | null>(null)
  const [notice, setNotice] = useState('')
  const passportDialog = useRef<HTMLDialogElement>(null)
  const profiles = useMemo(() => filterProfiles(sourceProfiles, interests, query), [sourceProfiles, interests, query])
  const profile = profiles.find((p) => p.slug === selected) ?? profiles[0]

  const refreshProfiles = useCallback(async (signal?: AbortSignal) => {
    const currentLoad = ++loadId.current
    setRefreshing(true)
    try {
      const response = await fetch('/api/marketing/community-atlas', { cache: 'no-store', signal })
      const result = await response.json()
      if (!response.ok || !Array.isArray(result.profiles) || !['preview', 'live'].includes(result.mode)) throw new Error('The network is temporarily unavailable. Please try again.')
      if (signal?.aborted || currentLoad !== loadId.current) return
      setSourceProfiles(result.profiles); setMode(result.mode); setIntakeEnabled(result.intakeEnabled === true); setLoadError('')
    } catch {
      if (!signal?.aborted && currentLoad === loadId.current) { setSourceProfiles([]); setIntakeEnabled(false); setLoadError('The network is temporarily unavailable. Please refresh to try again.') }
    } finally { if (currentLoad === loadId.current) setRefreshing(false) }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void refreshProfiles(controller.signal)
    const refresh = () => { if (!document.hidden) void refreshProfiles(controller.signal) }
    const interval = window.setInterval(refresh, 60000)
    document.addEventListener('visibilitychange', refresh)
    return () => { controller.abort(); window.clearInterval(interval); document.removeEventListener('visibilitychange', refresh) }
  }, [refreshProfiles])

  useEffect(() => {
    if (showProfileForm && profileDialog.current && !profileDialog.current.open) profileDialog.current.showModal()
  }, [showProfileForm])

  useEffect(() => {
    try { setPassport(readPassportPreview(sessionStorage.getItem(PASSPORT_PREVIEW_KEY))) } catch { /* Storage may be disabled. */ }
    setPaused(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (showPassport && passportDialog.current && !passportDialog.current.open) passportDialog.current.showModal()
  }, [showPassport])

  const selectProfile = useCallback((slug: string) => {
    setSelected(slug)
    const url = new URL(window.location.href)
    url.searchParams.set('profile', slug)
    window.history.replaceState(null, '', url)
  }, [])

  useEffect(() => {
    const slug = new URL(window.location.href).searchParams.get('profile')
    if (slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100) setSelected(slug)
  }, [])

  async function copyProfileLink() {
    if (!profile) return
    const url = new URL(window.location.href)
    url.searchParams.set('profile', profile.slug)
    try { await navigator.clipboard.writeText(url.toString()); setNotice('Profile link copied.') }
    catch { setNotice(`Profile link: ${url.toString()}`) }
  }

  function toggleInterest(id: InterestId) {
    setInterests((current) => current.includes(id) ? current.filter((v) => v !== id) : [...current, id])
  }

  function savePassport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const draft = readPassportPreview(JSON.stringify({ name: String(fields.get('name') ?? '').trim(), interests: fields.getAll('interests'), visibility: fields.get('visibility') }))
    if (!draft) { setNotice('Please enter a display name to preview your Passport.'); return }
    setPassport(draft)
    try {
      sessionStorage.setItem(PASSPORT_PREVIEW_KEY, JSON.stringify(draft))
      setNotice('Preview saved for this browser tab. You have not enrolled or published a profile.')
    } catch { setNotice('Preview created for this visit. Browser storage is unavailable; nothing was sent.') }
    setShowPassport(false)
  }

  function clearPassport() {
    try { sessionStorage.removeItem(PASSPORT_PREVIEW_KEY) } catch { /* In-memory preview can still be cleared. */ }
    setPassport(null)
    setNotice('Your local Passport preview has been removed.')
  }

  return <section className={styles.atlas}>
    <div className={styles.topline}><span>DCC MIAMI / COMMUNITY ATLAS</span><span>{mode === 'preview' ? 'DESIGN PREVIEW · 02' : 'PUBLIC COMMUNITY ATLAS'}</span></div>
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>One network. Your way in.</p><h1>Find your<br /><em>constellation.</em></h1><p className={styles.intro}>People, ideas and possibilities across Miami’s creative community. Explore what interests you. Come back when it matters.</p></div>
      <div className={styles.headerActions}><button className={styles.primary} onClick={() => setShowProfileForm(true)}>Add your public profile <span aria-hidden>↗</span></button><button className={styles.textButton} onClick={() => setShowPassport(true)}>Explore your Passport ↗</button><p>Optional participation.<br />No need to follow every conversation.</p></div>
    </header>

    <div className="mb-7 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-[#9bbea4]/40 bg-[#17302b] px-5 py-5 text-[#e7f2e7]">
      <div className="max-w-2xl"><p className="text-[10px] uppercase tracking-[.2em] text-[#a6d2b2]">A related artwork / collective network authorship</p><h2 className="mt-2 text-xl font-light tracking-[-.04em]">The Network Makes Itself</h2><p className="mt-2 text-sm leading-relaxed text-[#b8cfc1]">The Atlas supports opt-in discovery. The separate artwork illustrates a network of people connected to people, without depicting private member identities or real introductions.</p></div>
      <div className="flex flex-wrap gap-3"><Link href="/network/artwork" className="rounded-full bg-[#d3e7d6] px-4 py-3 text-sm font-medium text-[#173127] hover:bg-white">Explore artwork ↗</Link><Link href="/network/artwork/proposal" className="rounded-full border border-[#c4d6c8]/50 px-4 py-3 text-sm text-[#e5f2e5] hover:bg-white/10">Project proposal ↗</Link></div>
    </div>
    <div className={styles.workspace}>
      <aside className={styles.filters} aria-label="Discover by interest">
        <p className={styles.eyebrow}>01 / Follow your curiosity</p>
        <label className={styles.searchLabel}>Find a profile<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or practice…" /></label>
        <div className={styles.interests}>{INTERESTS.map((interest) => <button key={interest.id} aria-pressed={interests.includes(interest.id)} onClick={() => toggleInterest(interest.id)}><span className={styles.dot} style={{ background: interest.color }} /><span>{interest.label}</span><span aria-hidden>{interests.includes(interest.id) ? '−' : '+'}</span></button>)}</div>
        <button className={styles.textButton} onClick={() => { setInterests([]); setQuery('') }}>Reset filters</button>
        <p className={styles.small}>Choose more than one. Results match any selected interest. {mode === 'preview' ? 'These are example profile interests, not recorded poll votes.' : 'Interests are member-declared; they are not verified skills or availability.'}</p>
        <div className={styles.poll}><span className={styles.eyebrow}>Community listening</span><strong>The interest poll is live.</strong><p>Posted November 15 in the Commons. Results will be added after review.</p><span className={styles.pending}>Vote totals not connected</span></div>
      </aside>

      <div className={styles.fieldWrap}>
        <div className={styles.fieldTop}><span>02 / The field</span><button onClick={() => void refreshProfiles()} disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh profiles'}</button><button aria-pressed={paused} onClick={() => setPaused((v) => !v)}>{paused ? 'Resume motion' : 'Pause motion'}</button></div>
        {loadError ? <p className={styles.graphError} role="alert">{loadError}</p> : null}<Field illustrative={mode === 'preview' && !loadError} profiles={profiles} selected={profile?.slug ?? null} paused={paused} onSelect={selectProfile} />
        <div className={styles.fieldBottom}><span><i /> {profiles.length} {mode === 'preview' ? 'pilot previews' : 'public profiles'}</span><span>{mode === 'preview' ? '64 illustrative dots · not a member count' : 'Approved profiles · refreshes every minute'}</span></div>
      </div>

      <aside className={styles.detail} aria-label="Profile details">
        <p className={styles.eyebrow}>03 / A closer look</p>
        {profile ? <><div className={styles.monogram} aria-hidden>{profile.name.split(' ').map((n) => n[0]).join('')}</div><span className={styles.pending}>{mode === 'preview' ? 'Pilot profile preview' : 'Public profile'}</span><h2>{profile.name}</h2><p>{profile.summary}</p><div className={styles.tags}>{profile.practice.map((practice) => <span key={practice}>{practice}</span>)}</div><p className={styles.eyebrow}>{mode === 'preview' ? 'Example interests' : 'Interests'}</p><p>{profile.interests.map((id) => INTERESTS.find((i) => i.id === id)!.short).join(' · ')}</p>{(profile.links?.length ? profile.links : profile.website ? [{ label: 'Artist website', url: profile.website }] : []).map((link) => <a key={link.url} className={styles.external} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}<button className={styles.textButton} onClick={() => void copyProfileLink()}>Copy profile link ↗</button></> : <><h2>Leave room<br />for discovery.</h2><p>No public profiles match these filters yet. Reset or try another interest.</p></>}
        <div className={styles.boundary}><strong>A presence without exposure.</strong><p>Anonymous dots carry no identities. Lines connect profiles to interests. They do not assert personal relationships. Public profile requests are reviewed before appearing.</p></div>
      </aside>
    </div>

    <section className={styles.profileList} aria-label="Accessible profile list"><div><p className={styles.eyebrow}>Find people through their practice</p><h2>Different practices.<br />Shared possibilities.</h2></div><div className={styles.cards}>{profiles.map((p) => <button key={p.slug} onClick={() => selectProfile(p.slug)} aria-pressed={p.slug === profile?.slug}><span className={styles.cardInitials}>{p.name.split(' ').map((n) => n[0]).join('')}</span><strong>{p.name}</strong><span>{p.summary}</span><small>View profile ↗</small></button>)}{!profiles.length ? <p role="status">No matching profiles yet.</p> : null}</div></section>

    <section className={styles.passportBand} id="passport"><div><p className={styles.eyebrow}>Your DCC Passport</p><h2>A place for your practice.<br />At your own pace.</h2><p>Start with what you make and what you’re curious about. Future gatherings, projects and connections are yours to add voluntarily.</p></div><div>{passport ? <div className={styles.passportCard}><span>LOCAL PREVIEW / NOT ENROLLED</span><h3>{passport.name}</h3><p>{passport.interests.map((id) => INTERESTS.find((i) => i.id === id)!.short).join(' · ') || 'Your interests are yours to choose.'}</p><p>Preferred future visibility: {passport.visibility}</p><button onClick={() => setShowPassport(true)}>Edit preview</button><button onClick={clearPassport}>Remove preview</button></div> : <><button className={styles.primary} onClick={() => setShowPassport(true)}>Preview my Passport ↗</button><p className={styles.small}>An exploration, not an account or membership application.</p></>}</div></section>
    <p className={styles.notice} role="status">{notice}</p>
    <footer className={styles.footer}>COMMONS / SIGNAL / ATLAS / LABS / GATHERINGS <span>Built around participation, not constant attention.</span></footer>

    {showProfileForm ? <dialog ref={profileDialog} className={styles.modalShade} aria-labelledby="atlas-form-title" onCancel={() => setShowProfileForm(false)}><section className={styles.passportForm}><div className={styles.modalTop}><span className={styles.eyebrow}>Public profile / request</span><button onClick={() => setShowProfileForm(false)} aria-label="Close profile form">Close ×</button></div><AtlasProfileForm enabled={intakeEnabled} /></section></dialog> : null}
    {showPassport ? <dialog ref={passportDialog} className={styles.modalShade} aria-labelledby="passport-title" onCancel={() => setShowPassport(false)}><section className={styles.passportForm}><div className={styles.modalTop}><span className={styles.eyebrow}>Passport / local preview</span><button onClick={() => setShowPassport(false)} aria-label="Close Passport preview">Close ×</button></div><h2 id="passport-title">Start with your curiosity.</h2><p>This form creates a preview in this browser tab. Nothing is sent to DCC, added to Airtable, or published.</p><form onSubmit={savePassport} key={passport?.name ?? 'new'}><label>Your display name<input name="name" maxLength={80} required defaultValue={passport?.name ?? ''} autoComplete="off" /></label><fieldset><legend>What would you like to explore?</legend>{INTERESTS.map((i) => <label key={i.id}><input type="checkbox" name="interests" value={i.id} defaultChecked={passport?.interests.includes(i.id) ?? false} />{i.label}</label>)}</fieldset><label>Preferred visibility when enrollment opens<select name="visibility" defaultValue={passport?.visibility ?? 'private'}><option value="private">Private: only me and authorized stewards</option><option value="members">Verified members only</option><option value="public">Public profile, after separate approval</option></select></label><p className={styles.small}>This preference is not a consent grant. Public listing, introduction requests, editorial features and updates will have separate choices.</p><button className={styles.primary} type="submit">Create local preview ↗</button></form></section></dialog> : null}
  </section>
}

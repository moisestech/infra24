'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { INTERESTS, PILOT_PREVIEWS, filterProfiles, PASSPORT_PREVIEW_KEY, readPassportPreview, type InterestId, type PassportPreview } from '@/lib/dcc/community/atlas'
import styles from './community.module.css'

const Field = dynamic(() => import('./CommunityField'), { ssr: false, loading: () => <p className={styles.loading}>Opening the field…</p> })

export function CommunityAtlas() {
  const [interests, setInterests] = useState<InterestId[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>('moises-sanabria')
  const [paused, setPaused] = useState(true)
  const [showPassport, setShowPassport] = useState(false)
  const [passport, setPassport] = useState<PassportPreview | null>(null)
  const [notice, setNotice] = useState('')
  const passportDialog = useRef<HTMLDialogElement>(null)
  const profiles = useMemo(() => filterProfiles(PILOT_PREVIEWS, interests, query), [interests, query])
  const profile = profiles.find((p) => p.slug === selected) ?? profiles[0]

  useEffect(() => {
    try { setPassport(readPassportPreview(sessionStorage.getItem(PASSPORT_PREVIEW_KEY))) } catch { /* Storage may be disabled. */ }
    setPaused(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (showPassport && passportDialog.current && !passportDialog.current.open) passportDialog.current.showModal()
  }, [showPassport])

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
    <div className={styles.topline}><span>DCC MIAMI / COMMUNITY ATLAS</span><span>DESIGN PREVIEW · 01</span></div>
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>One network. Your way in.</p><h1>Find your<br /><em>constellation.</em></h1><p className={styles.intro}>People, ideas and possibilities across Miami’s creative community. Explore what interests you. Come back when it matters.</p></div>
      <div className={styles.headerActions}><button className={styles.primary} onClick={() => setShowPassport(true)}>Explore your Passport <span aria-hidden>↗</span></button><p>Optional participation.<br />No need to follow every conversation.</p></div>
    </header>

    <div className={styles.workspace}>
      <aside className={styles.filters} aria-label="Discover by interest">
        <p className={styles.eyebrow}>01 / Follow your curiosity</p>
        <label className={styles.searchLabel}>Find a pilot profile<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or practice…" /></label>
        <div className={styles.interests}>{INTERESTS.map((interest) => <button key={interest.id} aria-pressed={interests.includes(interest.id)} onClick={() => toggleInterest(interest.id)}><span className={styles.dot} style={{ background: interest.color }} /><span>{interest.label}</span><span aria-hidden>{interests.includes(interest.id) ? '−' : '+'}</span></button>)}</div>
        <button className={styles.textButton} onClick={() => { setInterests([]); setQuery('') }}>Reset filters</button>
        <p className={styles.small}>Choose more than one. Results match any selected interest. These are example profile interests, not recorded poll votes.</p>
        <div className={styles.poll}><span className={styles.eyebrow}>Community listening</span><strong>The interest poll is live.</strong><p>Posted November 15 in the Commons. Results will be added after review.</p><span className={styles.pending}>Vote totals not connected</span></div>
      </aside>

      <div className={styles.fieldWrap}>
        <div className={styles.fieldTop}><span>02 / The field</span><button aria-pressed={paused} onClick={() => setPaused((v) => !v)}>{paused ? 'Resume motion' : 'Pause motion'}</button></div>
        <Field profiles={profiles} selected={profile?.slug ?? null} paused={paused} onSelect={setSelected} />
        <div className={styles.fieldBottom}><span><i /> {profiles.length} pilot previews</span><span>64 illustrative dots · not a member count</span></div>
      </div>

      <aside className={styles.detail} aria-label="Profile details">
        <p className={styles.eyebrow}>03 / A closer look</p>
        {profile ? <><div className={styles.monogram} aria-hidden>{profile.name.split(' ').map((n) => n[0]).join('')}</div><span className={styles.pending}>Pilot profile preview</span><h2>{profile.name}</h2><p>{profile.summary}</p><div className={styles.tags}>{profile.practice.map((practice) => <span key={practice}>{practice}</span>)}</div><p className={styles.eyebrow}>Example interests</p><p>{profile.interests.map((id) => INTERESTS.find((i) => i.id === id)!.short).join(' · ')}</p>{profile.website ? <a className={styles.external} href={profile.website} target="_blank" rel="noopener noreferrer">Visit artist website ↗</a> : null}</> : <><h2>Leave room<br />for discovery.</h2><p>No pilot profiles match these filters. Reset or try another interest.</p></>}
        <div className={styles.boundary}><strong>A presence without exposure.</strong><p>Anonymous dots have no member identities, hidden profiles or inferred interests attached. Lines connect example profiles to interests—not people to one another.</p></div>
      </aside>
    </div>

    <section className={styles.profileList} aria-label="Accessible pilot profile list"><div><p className={styles.eyebrow}>The people behind the preview</p><h2>Different practices.<br />Shared possibilities.</h2></div><div className={styles.cards}>{profiles.map((p) => <button key={p.slug} onClick={() => setSelected(p.slug)} aria-pressed={p.slug === profile?.slug}><span className={styles.cardInitials}>{p.name.split(' ').map((n) => n[0]).join('')}</span><strong>{p.name}</strong><span>{p.summary}</span><small>View pilot profile ↗</small></button>)}{!profiles.length ? <p role="status">No matching pilot previews.</p> : null}</div></section>

    <section className={styles.passportBand} id="passport"><div><p className={styles.eyebrow}>Your DCC Passport</p><h2>A place for your practice.<br />At your own pace.</h2><p>Start with what you make and what you’re curious about. Future gatherings, projects and connections are yours to add voluntarily.</p></div><div>{passport ? <div className={styles.passportCard}><span>LOCAL PREVIEW / NOT ENROLLED</span><h3>{passport.name}</h3><p>{passport.interests.map((id) => INTERESTS.find((i) => i.id === id)!.short).join(' · ') || 'Your interests are yours to choose.'}</p><p>Preferred future visibility: {passport.visibility}</p><button onClick={() => setShowPassport(true)}>Edit preview</button><button onClick={clearPassport}>Remove preview</button></div> : <><button className={styles.primary} onClick={() => setShowPassport(true)}>Preview my Passport ↗</button><p className={styles.small}>An exploration, not an account or membership application.</p></>}</div></section>
    <p className={styles.notice} role="status">{notice}</p>
    <footer className={styles.footer}>COMMONS / SIGNAL / ATLAS / LABS / GATHERINGS <span>Built around participation, not constant attention.</span></footer>

    {showPassport ? <dialog ref={passportDialog} className={styles.modalShade} aria-labelledby="passport-title" onCancel={() => setShowPassport(false)}><section className={styles.passportForm}><div className={styles.modalTop}><span className={styles.eyebrow}>Passport / local preview</span><button onClick={() => setShowPassport(false)} aria-label="Close Passport preview">Close ×</button></div><h2 id="passport-title">Start with your curiosity.</h2><p>This form creates a preview in this browser tab. Nothing is sent to DCC, added to Airtable, or published.</p><form onSubmit={savePassport} key={passport?.name ?? 'new'}><label>Your display name<input name="name" maxLength={80} required defaultValue={passport?.name ?? ''} autoComplete="off" /></label><fieldset><legend>What would you like to explore?</legend>{INTERESTS.map((i) => <label key={i.id}><input type="checkbox" name="interests" value={i.id} defaultChecked={passport?.interests.includes(i.id) ?? false} />{i.label}</label>)}</fieldset><label>Preferred visibility when enrollment opens<select name="visibility" defaultValue={passport?.visibility ?? 'private'}><option value="private">Private: only me and authorized stewards</option><option value="members">Verified members only</option><option value="public">Public profile, after separate approval</option></select></label><p className={styles.small}>This preference is not a consent grant. Public listing, introduction requests, editorial features and updates will have separate choices.</p><button className={styles.primary} type="submit">Create local preview ↗</button></form></section></dialog> : null}
  </section>
}

'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import * as Avatar from '@radix-ui/react-avatar'
import { ArrowUpRight, ExternalLink, Search, UserRoundPlus, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  INTERESTS, PILOT_PREVIEWS, filterProfiles, PASSPORT_PREVIEW_KEY,
  readPassportPreview, type InterestId, type PassportPreview, type AtlasProfile,
} from '@/lib/dcc/community/atlas'
import { PollPulse } from './PollPulse'
import { PUBLIC_ARTISTS } from '@/lib/dcc/artwork/member-presence'
import { isDiscoveryChoice, type DiscoveryPollChoiceId } from '@/lib/dcc/artwork/discovery-poll'
import { INTEREST_POLL_CATEGORIES } from '@/lib/dcc/artwork/people-practice-graph'
import { AtlasProfileForm } from './AtlasProfileForm'
import styles from './community.module.css'

const Field = dynamic(() => import('@/components/dcc/artwork/PeopleNetworkField'), {
  ssr: false,
  loading: () => <div className="flex min-h-[360px] items-center justify-center text-sm text-[color:var(--dn-subtle)]">Opening the network…</div>,
})

type GraphSelection = string | null
function isPublicArtist(value: string | null) {
  return Boolean(value && PUBLIC_ARTISTS.some((artist) => artist.id === value))
}
function websiteFor(profile: AtlasProfile): string | null {
  const candidate = profile.website ?? profile.links?.find((link) => /^https:\/\//i.test(link.url))?.url
  return candidate && /^https:\/\//i.test(candidate) ? candidate : null
}
function initials(name: string) {
  return name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()
}
function Portrait({ profile, size = 'card' }: { profile: AtlasProfile; size?: 'card' | 'detail' }) {
  return (
    <Avatar.Root className={'relative block shrink-0 overflow-hidden rounded-xl bg-[var(--dn-panel-soft)] ' +
      (size === 'detail' ? 'h-20 w-20' : 'h-[72px] w-[72px] sm:h-[88px] sm:w-[88px]')}>
      {profile.image ? <Avatar.Image src={profile.image} alt={'Portrait of ' + profile.name}
        loading="lazy" className="h-full w-full object-cover" /> : null}
      <Avatar.Fallback delayMs={250} className="flex h-full w-full items-center justify-center font-mono text-lg text-[color:var(--dn-ink)]">
        {initials(profile.name)}
      </Avatar.Fallback>
    </Avatar.Root>
  )
}

export function CommunityAtlas() {
  const [query, setQuery] = useState('')
  const [interests, setInterests] = useState<InterestId[]>([])
  const [sourceProfiles, setSourceProfiles] = useState<AtlasProfile[]>(PILOT_PREVIEWS)
  const [mode, setMode] = useState<'preview' | 'live'>('preview')
  const [intakeEnabled, setIntakeEnabled] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [selected, setSelected] = useState('moises-sanabria')
  const [graphFocus, setGraphFocus] = useState<GraphSelection>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showPassport, setShowPassport] = useState(false)
  const [passport, setPassport] = useState<PassportPreview | null>(null)
  const [notice, setNotice] = useState('')
  const profileDialog = useRef<HTMLDialogElement>(null)
  const passportDialog = useRef<HTMLDialogElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const loadId = useRef(0)

  // Featured editorial profiles always appear. The public API may also return
  // independently reviewed opt-in profiles, but the graph never maps private CRM IDs.
  const allProfiles = useMemo(() => [
    ...sourceProfiles,
    ...PILOT_PREVIEWS.filter((p) => !sourceProfiles.some((record) => record.slug === p.slug)),
  ], [sourceProfiles])
  const profiles = useMemo(
    () => filterProfiles(allProfiles, interests, query),
    [allProfiles, interests, query],
  )
  const profile = profiles.find((p) => p.slug === selected) ?? profiles[0] ?? null

  const refreshProfiles = useCallback(async (signal?: AbortSignal) => {
    const load = ++loadId.current
    setRefreshing(true)
    try {
      const response = await fetch('/api/marketing/community-atlas', { cache: 'no-store', signal })
      const data = await response.json()
      if (!response.ok || !Array.isArray(data.profiles) || !['preview', 'live'].includes(data.mode)) {
        throw new Error('Unable to load new profiles')
      }
      if (signal?.aborted || load !== loadId.current) return
      setSourceProfiles(data.profiles)
      setMode(data.mode)
      setIntakeEnabled(data.intakeEnabled === true)
      setLoadError('')
    } catch {
      if (!signal?.aborted && load === loadId.current) {
        setLoadError('New profiles are temporarily unavailable. Featured artists are still accessible.')
      }
    } finally {
      if (load === loadId.current) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void refreshProfiles(controller.signal)
    const refresh = () => { if (!document.hidden) void refreshProfiles(controller.signal) }
    const interval = window.setInterval(refresh, 60000)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      controller.abort()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [refreshProfiles])

  useEffect(() => {
    try { setPassport(readPassportPreview(sessionStorage.getItem(PASSPORT_PREVIEW_KEY))) }
    catch { /* Private browsing may block local storage. */ }
    const requested = new URL(window.location.href).searchParams.get('profile')
    if (requested && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requested)) {
      setSelected(requested)
      if (isPublicArtist(requested)) setGraphFocus(requested)
    }
  }, [])

  useEffect(() => {
    if (showProfileForm && profileDialog.current && !profileDialog.current.open) profileDialog.current.showModal()
  }, [showProfileForm])
  useEffect(() => {
    if (showPassport && passportDialog.current && !passportDialog.current.open) passportDialog.current.showModal()
  }, [showPassport])

  function selectProfile(slug: string, scroll = true) {
    setSelected(slug)
    setGraphFocus(isPublicArtist(slug) ? slug : null)
    const url = new URL(window.location.href)
    url.searchParams.set('profile', slug)
    window.history.replaceState(null, '', url)
    if (scroll && window.innerWidth < 1024) {
      window.requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
    }
  }
  function chooseGraphNode(id: GraphSelection) {
    setGraphFocus(id)
    if (id && isPublicArtist(id)) {
      selectProfile(id, false)
    } else if (id?.startsWith('practice-')) {
      const choice = id.slice('practice-'.length)
      if (isDiscoveryChoice(choice)) {
        setInterests(INTERESTS.filter((interest) =>
          INTEREST_POLL_CATEGORIES[interest.id] === choice
        ).map((interest) => interest.id))
      }
    } else if (!id) {
      setInterests([])
    }
  }
  const selectedChoice: DiscoveryPollChoiceId | null =
    graphFocus?.startsWith('practice-') && isDiscoveryChoice(graphFocus.slice(9))
      ? graphFocus.slice(9) as DiscoveryPollChoiceId : null
  function toggleInterest(id: InterestId) {
    setInterests((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }
  function savePassport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const draft = readPassportPreview(JSON.stringify({
      name: String(form.get('name') ?? '').trim(),
      interests: form.getAll('interests'),
      visibility: form.get('visibility'),
    }))
    if (!draft) { setNotice('Add a display name to save your Passport draft.'); return }
    setPassport(draft)
    try {
      sessionStorage.setItem(PASSPORT_PREVIEW_KEY, JSON.stringify(draft))
      setNotice('Your Passport draft is saved in this browser. You can use it to start a public profile.')
    } catch { setNotice('Your Passport draft is available for this visit.') }
    passportDialog.current?.close()
    setShowPassport(false)
  }
  function clearPassport() {
    try { sessionStorage.removeItem(PASSPORT_PREVIEW_KEY) } catch { /* Already local-only. */ }
    setPassport(null)
    setNotice('Passport draft cleared.')
  }
  function continueToProfile() {
    passportDialog.current?.close()
    setShowPassport(false)
    setShowProfileForm(true)
  }

  return (
    <section className="dcc-network-theme min-h-screen bg-[var(--dn-bg)] px-3 pb-14 pt-4 text-[color:var(--dn-ink)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1650px]">
        <nav aria-label="Atlas navigation" className="flex items-center justify-between border-b border-[color:var(--dn-line)] px-2 pb-4 text-xs text-[color:var(--dn-muted)]">
          <Link href="/" className="font-mono font-medium tracking-[.15em] hover:text-[color:var(--dn-ink)]">DCC</Link>
          <div className="flex gap-5">
            <Link href="/network/artwork" className="hover:text-[color:var(--dn-ink)]">Artwork</Link>
            <Link href="/network/artwork/proposal" className="hover:text-[color:var(--dn-ink)]">About</Link>
          </div>
        </nav>

        <header className="flex flex-col justify-between gap-8 py-10 sm:py-16 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.21em] text-[color:var(--dn-subtle)]">Community atlas</p>
            <h1 className="mt-4 text-[clamp(2.95rem,7vw,7rem)] font-light leading-[.88] tracking-[-.075em] text-[color:var(--dn-ink)]">
              Find your<br /><em className="text-[color:var(--dn-title-accent)]">constellation.</em>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[color:var(--dn-muted)]">
              Discover artists, practices and ways to connect across the network.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setShowProfileForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--dn-accent)] px-5 py-3 text-sm font-semibold text-[color:var(--dn-accent-ink)] transition hover:bg-[var(--dn-accent-hover)]">
              <UserRoundPlus size={17} /> Add your profile
            </button>
            <button type="button" onClick={() => setShowPassport(true)}
              className="rounded-full border border-[color:var(--dn-line)] px-5 py-3 text-sm text-[color:var(--dn-muted)] transition hover:border-[color:var(--dn-line-strong)]">
              Your Passport
            </button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(290px,.6fr)]">
          <section className="dn-network-field relative min-w-0 overflow-hidden rounded-2xl border border-[color:var(--dn-line)] bg-[var(--dn-graph-bg)]" aria-label="Network field">
            <div className="pointer-events-none absolute left-5 top-5 z-10 flex flex-col gap-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[.13em] text-[color:var(--dn-graph-muted)]">The network</p>
              <p className="text-xs text-[color:var(--dn-subtle)]">People are dots · practices are larger nodes</p>
            </div>
            <div className="h-[52svh] min-h-[350px] max-h-[660px] sm:h-[60svh] lg:h-[600px]">
              <Field selected={graphFocus} onSelect={chooseGraphNode} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="dn-graph-overlay flex rounded-full border border-[color:var(--dn-line)] bg-[var(--dn-graph-chip)] p-1 shadow-lg backdrop-blur-md" role="group" aria-label="Focus public artist or practice">
                {([
                  { label: 'All', id: null },
                  { label: 'Moises', id: 'moises-sanabria' },
                  { label: 'Fabiola', id: 'fabiola-larios' },
                  { label: 'Angelo', id: 'angelo-caruso' },
                ] as {label:string;id:GraphSelection}[]).map((item) => (
                  <button type="button" key={item.label} aria-pressed={graphFocus === item.id}
                    onClick={() => chooseGraphNode(item.id)}
                    className={'shrink-0 rounded-full px-3.5 py-2.5 text-xs transition ' +
                      (graphFocus === item.id ? 'bg-[var(--dn-accent)] font-semibold text-[color:var(--dn-accent-ink)]' : 'text-[color:var(--dn-muted)] hover:text-[color:var(--dn-ink)]')}>
                    {item.label}
                  </button>
                ))}
              </div>
              <Link href={graphFocus && isPublicArtist(graphFocus) ? '/network/artwork?person=' + graphFocus : selectedChoice ? '/network/artwork?practice=' + selectedChoice : '/network/artwork'} className="dn-graph-overlay inline-flex items-center gap-1 rounded-full border border-[color:var(--dn-line)] bg-[var(--dn-graph-chip)] px-3.5 py-3 text-xs text-[color:var(--dn-muted)] hover:text-[color:var(--dn-ink)]">
                Open artwork <ArrowUpRight size={14} />
              </Link>
            </div>
          </section>

          <aside ref={detailRef} className="min-w-0 rounded-2xl border border-[color:var(--dn-line)] bg-[var(--dn-panel)] p-5 sm:p-7" aria-label="Artist profile">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[color:var(--dn-subtle)]">Artist profile</p>
              <span className="font-mono text-[10px] text-[color:var(--dn-subtle)]">{mode === 'preview' ? 'Featured' : 'Explore'}</span>
            </div>
            {profile ? (
              <div className="mt-6">
                <Portrait key={profile.slug} profile={profile} size="detail" />
                <h2 className="mt-5 text-3xl font-light tracking-[-.05em]">{profile.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--dn-muted)]">{profile.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.practice.map((practice) => (
                    <span key={practice} className="rounded-full border border-[color:var(--dn-line)] px-3 py-1.5 text-xs text-[color:var(--dn-muted)]">{practice}</span>
                  ))}
                </div>
                {websiteFor(profile) ? (
                  <a href={websiteFor(profile)!} target="_blank" rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--dn-link)] hover:text-[color:var(--dn-ink)]">
                    Visit website <ExternalLink size={15} />
                  </a>
                ) : null}
              </div>
            ) : <p className="mt-7 text-sm text-[color:var(--dn-muted)]">No profile matches those filters.</p>}
            <div className="mt-9 border-t border-[color:var(--dn-line)] pt-5 text-xs leading-relaxed text-[color:var(--dn-subtle)]">
              Curated artist examples and approved public profiles. New profiles can be submitted for review.
            </div>
          </aside>
        </div>

        <section id="find-people" className="mt-14 scroll-mt-5">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[color:var(--dn-subtle)]">People / practice</p>
              <h2 className="mt-3 text-3xl font-light tracking-[-.05em] sm:text-4xl">Find people through their practice.</h2>
            </div>
            <button onClick={() => void refreshProfiles()} disabled={refreshing} type="button" title="Refresh public profiles"
              className="inline-flex items-center gap-2 self-start text-xs text-[color:var(--dn-subtle)] hover:text-[color:var(--dn-ink)] disabled:opacity-40">
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh profiles
            </button>
          </div>

          <div className="relative mt-6 max-w-xl">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--dn-subtle)]" />
            <label htmlFor="atlas-search" className="sr-only">Search names or practices</label>
            <input id="atlas-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Search names or practices" className="w-full rounded-xl border border-[color:var(--dn-line)] bg-[var(--dn-panel)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--dn-ink)] placeholder:text-[color:var(--dn-subtle)] focus:border-[color:var(--dn-link)] focus:outline-none" />
          </div>

          <div className="dn-mobile-scroller -mx-3 mt-4 overflow-x-auto px-3 pb-2 sm:mx-0 sm:px-0" role="group" aria-label="Filter people by interest">
            <div className="flex w-max min-w-full gap-2 sm:flex-wrap">
              {INTERESTS.map((item) => (
                <button type="button" key={item.id} aria-pressed={interests.includes(item.id)}
                  onClick={() => toggleInterest(item.id)}
                  className={'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs transition ' +
                    (interests.includes(item.id) ? 'border-[color:var(--dn-line-strong)] bg-[var(--dn-accent)] text-[color:var(--dn-accent-ink)]' : 'border-[color:var(--dn-line)] bg-[var(--dn-panel)] text-[color:var(--dn-muted)] hover:border-[color:var(--dn-line-strong)]')}>
                  <span className="h-2 w-2 rounded-full" style={{ background: item.color }} aria-hidden="true" />
                  {item.short}
                </button>
              ))}
              {(interests.length > 0 || query) && (
                <button onClick={() => { setInterests([]); setQuery('') }} type="button" className="shrink-0 px-2 py-2.5 text-xs text-[color:var(--dn-link)]">Clear</button>
              )}
            </div>
          </div>
          {loadError ? <p role="status" className="mt-3 text-xs text-[color:var(--dn-muted)]">{loadError}</p> : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map((p) => (
              <article key={p.slug} className={'min-w-0 rounded-2xl border bg-[var(--dn-panel)] p-4 transition-colors ' +
                (profile?.slug === p.slug ? 'border-[color:var(--dn-line-strong)]' : 'border-[color:var(--dn-line)] hover:border-[color:var(--dn-line-strong)]')}>
                <button type="button" onClick={() => selectProfile(p.slug)}
                  className="flex w-full items-start gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d2e9ce]">
                  <Portrait profile={p} />
                  <span className="min-w-0 flex-1">
                    <strong className="block text-lg font-normal tracking-[-.03em] text-[color:var(--dn-ink)]">{p.name}</strong>
                    <span className="mt-1 block text-xs leading-relaxed text-[color:var(--dn-subtle)]">{p.practice.slice(0, 2).join(' · ')}</span>
                    <span className="mt-3 block text-xs text-[color:var(--dn-link)]">View profile</span>
                  </span>
                </button>
                {websiteFor(p) ? (
                  <a href={websiteFor(p)!} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-between border-t border-[color:var(--dn-line)] pt-3 text-xs text-[color:var(--dn-muted)] hover:text-[color:var(--dn-ink)]">
                    Website <ExternalLink size={14} />
                  </a>
                ) : null}
              </article>
            ))}
            {profiles.length === 0 ? <p className="col-span-full py-8 text-sm text-[color:var(--dn-subtle)]">No matches. Try another practice.</p> : null}
          </div>
        </section>

        <div className="mt-16 border-t border-[color:var(--dn-line)] pt-10">
          <PollPulse compact title="What the community wants to discover" selectedChoice={selectedChoice} onSelectChoice={(choice) => chooseGraphNode(choice ? 'practice-' + choice : null)} />
        </div>

        <section id="passport" className="mt-16 grid gap-7 rounded-2xl border border-[color:var(--dn-line)] bg-[var(--dn-panel)] p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[color:var(--dn-subtle)]">Your Passport</p>
            <h2 className="mt-3 text-3xl font-light tracking-[-.05em] sm:text-4xl">
              Give your practice a place in the network.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--dn-muted)]">
              Start with your interests. Build a profile, connect to people and develop it as your work changes.
            </p>
            {passport ? <p className="mt-4 text-xs text-[color:var(--dn-link)]">Draft for {passport.name} · {passport.interests.length} interests saved in this browser</p> : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setShowPassport(true)}
              className="rounded-full border border-[color:var(--dn-line)] px-5 py-3 text-sm text-[color:var(--dn-ink)] hover:border-[color:var(--dn-line-strong)]">
              {passport ? 'Edit Passport' : 'Start Passport'}
            </button>
            <button type="button" onClick={() => setShowProfileForm(true)}
              className="rounded-full bg-[var(--dn-accent)] px-5 py-3 text-sm font-semibold text-[color:var(--dn-accent-ink)] hover:bg-[var(--dn-accent-hover)]">
              Add public profile
            </button>
            {passport ? <button type="button" onClick={clearPassport} className="px-2 text-xs text-[color:var(--dn-subtle)] hover:text-[color:var(--dn-ink)]">Clear draft</button> : null}
          </div>
        </section>

        <p aria-live="polite" role="status" className="mt-5 text-xs text-[color:var(--dn-link)]">{notice}</p>
      </div>

      {showProfileForm ? (
        <dialog ref={profileDialog} className={styles.modalShade} onCancel={() => setShowProfileForm(false)} onClose={() => setShowProfileForm(false)} aria-labelledby="atlas-form-title">
          <section className={styles.passportForm}>
            <div className={styles.modalTop}>
              <span className={styles.eyebrow}>Public artist profile</span>
              <button onClick={() => { profileDialog.current?.close(); setShowProfileForm(false) }} aria-label="Close profile form">Close</button>
            </div>
            <AtlasProfileForm enabled={intakeEnabled} initialName={passport?.name} initialInterests={passport?.interests} />
          </section>
        </dialog>
      ) : null}

      {showPassport ? (
        <dialog ref={passportDialog} className={styles.modalShade} onCancel={() => setShowPassport(false)} onClose={() => setShowPassport(false)} aria-labelledby="passport-title">
          <section className={styles.passportForm}>
            <div className={styles.modalTop}>
              <span className={styles.eyebrow}>Your Passport</span>
              <button onClick={() => { passportDialog.current?.close(); setShowPassport(false) }} aria-label="Close Passport">Close</button>
            </div>
            <h2 id="passport-title">Start with your curiosity.</h2>
            <p>Choose what you explore. You can carry this draft into your public profile.</p>
            <form onSubmit={savePassport} key={passport?.name ?? 'new'}>
              <label>Display name<input name="name" maxLength={80} required defaultValue={passport?.name ?? ''} autoComplete="name" /></label>
              <fieldset>
                <legend>Interests</legend>
                {INTERESTS.map((item) => (
                  <label key={item.id}><input type="checkbox" name="interests" value={item.id} defaultChecked={passport?.interests.includes(item.id) ?? false} />{item.label}</label>
                ))}
              </fieldset>
              <label>Profile visibility
                <select name="visibility" defaultValue={passport?.visibility ?? 'private'}>
                  <option value="private">Private draft</option>
                  <option value="members">Visible to members after enrollment</option>
                  <option value="public">Public when approved</option>
                </select>
              </label>
              <button className={styles.primary} type="submit">Save Passport draft</button>
            </form>
            {passport ? <button type="button" onClick={continueToProfile} className={styles.textButton}>Continue to public profile</button> : null}
          </section>
        </dialog>
      ) : null}
    </section>
  )
}

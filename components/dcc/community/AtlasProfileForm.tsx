'use client'

import Link from 'next/link'
import { useRef, useState, type FormEvent } from 'react'
import { INTERESTS, type InterestId } from '@/lib/dcc/community/atlas'
import { ATLAS_DISCLOSURE_VERSION, ATLAS_PUBLIC_CONSENT } from '@/lib/dcc/community/intake'
import styles from './community.module.css'

type Props = { enabled: boolean; initialName?: string; initialInterests?: InterestId[] }
export function AtlasProfileForm({ enabled, initialName = '', initialInterests = [] }: Props) {
  const [linkCount, setLinkCount] = useState(2)
  const [busy, setBusy] = useState(false)
  const [received, setReceived] = useState(false)
  const [error, setError] = useState('')
  const submission = useRef({ payload: '', key: '' })
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !enabled) return
    const form = new FormData(event.currentTarget)
    const urls = form.getAll('linkUrl').map(String)
    const labels = form.getAll('linkLabel').map(String)
    const body = {
      name: String(form.get('name') ?? '').trim(), email: String(form.get('email') ?? '').trim(),
      summary: String(form.get('summary') ?? '').trim(), practice: String(form.get('practice') ?? '').trim(),
      interests: form.getAll('interests').map(String),
      links: urls.flatMap((url, i) => url.trim() ? [{ label: labels[i]?.trim() || 'Website', url: url.trim() }] : []),
      publicConsent: form.get('publicConsent') === 'on', disclosureVersion: ATLAS_DISCLOSURE_VERSION,
      company: String(form.get('company') ?? ''),
    }
    const serialized = JSON.stringify(body)
    if (submission.current.payload !== serialized) submission.current = { payload: serialized, key: crypto.randomUUID() }
    setError(''); setBusy(true)
    try {
      const response = await fetch('/api/dcc/atlas/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, submissionKey: submission.current.key }) })
      const result = await response.json()
      if (response.status !== 202 || result.status !== 'pending') throw new Error(typeof result.error === 'string' ? result.error : 'We could not confirm receipt. Please try again.')
      setReceived(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'We could not confirm receipt. Please try again.') }
    finally { setBusy(false) }
  }
  if (received) return <div role="status"><h2>Received for review.</h2><p>Thank you. Your profile is not public yet. DCC will confirm your identity and review the information and links before adding it to the network.</p><p>You can <Link href="/contact">contact DCC</Link> to change or withdraw your request.</p></div>
  return <><h2 id="atlas-form-title">Put your practice on the map.</h2><p>Share the information you’d like people to find. Your email stays private. A public profile is optional; DCC membership does not depend on it.</p>
    {!enabled ? <p role="status" className={styles.formNotice}>Profile submissions are temporarily unavailable. You can prepare your information here; the form will accept submissions when enrollment is enabled.</p> : null}
    <form onSubmit={submit}>
      <label>Your public display name<input name="name" defaultValue={initialName} required minLength={2} maxLength={80} autoComplete="name" /></label>
      <label>Email for identity confirmation — private<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      <label>Your practice<input name="practice" required minLength={2} maxLength={200} placeholder="e.g. Jewelry, material experiments, 3D printing" /></label>
      <label>A short introduction<textarea name="summary" required minLength={10} maxLength={280} rows={3} placeholder="What do you make, research or explore?" /></label>
      <fieldset><legend>What would you like to explore or be found through?</legend>{INTERESTS.map((i) => <label key={i.id}><input type="checkbox" name="interests" value={i.id} defaultChecked={initialInterests.includes(i.id)} />{i.label}</label>)}</fieldset>
      <fieldset><legend>Your public links — full https:// URLs</legend>{Array.from({ length: linkCount }, (_, index) => <div className={styles.linkRow} key={index}><label>Link {index + 1} label<input name="linkLabel" maxLength={40} placeholder={index ? 'Instagram' : 'Portfolio'} /></label><label>Link {index + 1} URL<input name="linkUrl" type="url" maxLength={600} required={index === 0} placeholder={index ? 'https://instagram.com/…' : 'https://…'} /></label></div>)}{linkCount < 5 ? <button type="button" className={styles.textButton} onClick={() => setLinkCount((n) => n + 1)}>Add another link +</button> : null}</fieldset>
      <div className={styles.honeypot} aria-hidden="true"><label>Company<input name="company" autoComplete="off" tabIndex={-1} /></label></div>
      <label className={styles.consent}><input name="publicConsent" type="checkbox" required />{ATLAS_PUBLIC_CONSENT}</label>
      <p className={styles.small}>Your public listing is reviewed before it appears. Your contact information stays private. <Link href="/contact">Contact DCC</Link> for changes or withdrawal.</p>
      {error ? <p role="alert" className={styles.formError}>{error}</p> : null}
      <button className={styles.primary} type="submit" disabled={busy || !enabled}>{busy ? 'Submitting…' : 'Submit profile for review ↗'}</button>
    </form>
  </>
}

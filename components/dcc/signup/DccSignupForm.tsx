'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { DCC_SIGNUP_COPY } from '@/lib/dcc/signup/copy'
import { SIGNUP_PATHWAYS, type SignupPathwayId } from '@/lib/dcc/signup/pathways'
import {
  CONTACT_CATEGORY_OPTIONS,
  INTEREST_TAG_OPTIONS,
  PRACTICE_TAG_OPTIONS,
} from '@/lib/dcc/signup/schema'
import { MIAMI_CONNECTION_TYPE_OPTIONS, PRACTICE_TAG_OPTIONS as SUGGEST_PRACTICE_TAGS } from '@/lib/dcc/signup/suggest/schema'
import { cn } from '@/lib/utils'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100'
const labelClass = 'block text-sm font-medium text-neutral-800 dark:text-neutral-200'

export type DccSignupFormProps = {
  pathway?: SignupPathwayId
  source?: string
  showPathwayShell?: boolean
  compactHeader?: boolean
}

export function DccSignupForm({
  pathway = 'join_dcc_index',
  source,
  showPathwayShell = true,
  compactHeader = false,
}: DccSignupFormProps) {
  const pathname = usePathname()
  const isResearch = pathway === 'help_build_research_view'
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [contactCategory, setContactCategory] = useState<string>(CONTACT_CATEGORY_OPTIONS[0])
  const [practiceTags, setPracticeTags] = useState<string[]>([])
  const [interestTags, setInterestTags] = useState<string[]>([])
  const [suggestPracticeTags, setSuggestPracticeTags] = useState<string[]>([])
  const [consentAnswer, setConsentAnswer] = useState<'yes' | 'specific' | 'no'>('yes')
  const [publicListingConsent, setPublicListingConsent] = useState<'yes' | 'ask' | 'no'>('ask')
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const [researchContributor, setResearchContributor] = useState(false)
  const [socialWarning, setSocialWarning] = useState(false)

  function pathwayHref(hrefParam: string) {
    const params = new URLSearchParams({ pathway: hrefParam })
    if (source) params.set('source', source)
    return `${pathname}?${params.toString()}`
  }

  async function handleJoinSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage(null)
    setSocialWarning(false)

    const form = e.currentTarget
    const fd = new FormData(form)
    const website = String(fd.get('website') || '').trim()
    const instagram = String(fd.get('instagram') || '').trim()
    const linkedin = String(fd.get('linkedin') || '').trim()

    if (!website && !instagram && !linkedin) setSocialWarning(true)

    const payload = {
      pathway,
      fullName: String(fd.get('fullName') || ''),
      email: String(fd.get('email') || ''),
      city: String(fd.get('city') || ''),
      contactCategory,
      practiceTags,
      digitalOrientationStatement: String(fd.get('digitalOrientationStatement') || ''),
      website: website || undefined,
      instagram: instagram || undefined,
      linkedin: linkedin || undefined,
      interestTags,
      consentAnswer,
      publicListingConsent,
      newsletterOptIn,
      researchContributor,
      source,
    }

    try {
      const res = await fetch('/api/dcc/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as { error?: string; fallback?: boolean }

      if (!res.ok) {
        if (data.fallback) {
          window.location.href = `mailto:m@moises.tech?subject=${encodeURIComponent('DCC signup')}&body=${encodeURIComponent(JSON.stringify(payload, null, 2))}`
          setStatus('success')
          form.reset()
          return
        }
        throw new Error(data.error || 'Submission failed')
      }

      setStatus('success')
      form.reset()
      setPracticeTags([])
      setInterestTags([])
      setConsentAnswer('yes')
      setPublicListingConsent('ask')
      setNewsletterOptIn(false)
      setResearchContributor(false)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  async function handleSuggestSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage(null)

    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      suggestedName: String(fd.get('suggestedName') || ''),
      whySuggest: String(fd.get('whySuggest') || ''),
      sourceUrl: String(fd.get('sourceUrl') || '') || undefined,
      website: String(fd.get('website') || '') || undefined,
      instagram: String(fd.get('instagram') || '') || undefined,
      linkedin: String(fd.get('linkedin') || '') || undefined,
      suggestedRole: String(fd.get('suggestedRole') || '') || undefined,
      practiceTags: suggestPracticeTags.length ? suggestPracticeTags : undefined,
      miamiConnectionType: String(fd.get('miamiConnectionType') || '') || undefined,
      suggesterName: String(fd.get('suggesterName') || '') || undefined,
      suggesterEmail: String(fd.get('suggesterEmail') || '') || undefined,
      source,
    }

    try {
      const res = await fetch('/api/dcc/signup/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as { error?: string; fallback?: boolean }

      if (!res.ok) {
        if (data.fallback) {
          window.location.href = `mailto:m@moises.tech?subject=${encodeURIComponent('Research View suggestion')}&body=${encodeURIComponent(JSON.stringify(payload, null, 2))}`
          setStatus('success')
          form.reset()
          return
        }
        throw new Error(data.error || 'Submission failed')
      }

      setStatus('success')
      form.reset()
      setSuggestPracticeTags([])
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-6 text-sm leading-relaxed text-teal-950 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-100">
        <p className="whitespace-pre-line">
          {isResearch ? DCC_SIGNUP_COPY.suggestConfirmation : DCC_SIGNUP_COPY.confirmation}
        </p>
        <button
          type="button"
          className="mt-4 text-sm font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-200"
          onClick={() => setStatus('idle')}
        >
          Submit another response
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {showPathwayShell ? (
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {SIGNUP_PATHWAYS.map((p) =>
            p.enabled ? (
              <Link
                key={p.id}
                href={pathwayHref(p.hrefParam)}
                className={cn(
                  'rounded-xl border p-4 text-left transition hover:border-[var(--cdc-teal)]',
                  p.id === pathway
                    ? 'border-[var(--cdc-teal)] bg-[var(--cdc-teal)]/10'
                    : 'border-neutral-200 bg-white/60 dark:border-neutral-700 dark:bg-neutral-900/40'
                )}
              >
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{p.label}</p>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{p.description}</p>
              </Link>
            ) : (
              <div
                key={p.id}
                className="cursor-not-allowed rounded-xl border border-neutral-200 bg-white/60 p-4 opacity-60 dark:border-neutral-700 dark:bg-neutral-900/40"
              >
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{p.label}</p>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{p.description}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Coming soon</p>
              </div>
            )
          )}
        </div>
      ) : null}

      {isResearch ? (
        <form onSubmit={handleSuggestSubmit} className="space-y-8">
          {!compactHeader ? (
            <header className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
                {DCC_SIGNUP_COPY.suggestTitle}
              </h1>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {DCC_SIGNUP_COPY.suggestSubtitle}
              </p>
            </header>
          ) : null}

          <div>
            <label htmlFor="suggestedName" className={labelClass}>
              Person, project, exhibition, institution, or reference <span className="text-red-500">*</span>
            </label>
            <input id="suggestedName" name="suggestedName" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="whySuggest" className={labelClass}>
              Why should this be part of the Research View? <span className="text-red-500">*</span>
            </label>
            <textarea id="whySuggest" name="whySuggest" required rows={4} className={inputClass} />
          </div>
          <div>
            <label htmlFor="sourceUrl" className={labelClass}>
              Source URL
            </label>
            <input id="sourceUrl" name="sourceUrl" type="url" className={inputClass} placeholder="https://" />
          </div>
          <div>
            <label htmlFor="suggestedRole" className={labelClass}>
              Suggested role or category
            </label>
            <input id="suggestedRole" name="suggestedRole" className={inputClass} placeholder="Media Artist, Curator…" />
          </div>
          <div>
            <label htmlFor="miamiConnectionType" className={labelClass}>
              Miami connection
            </label>
            <select id="miamiConnectionType" name="miamiConnectionType" className={inputClass} defaultValue="">
              <option value="">Select if known</option>
              {MIAMI_CONNECTION_TYPE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className={labelClass}>Suggested practice tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGEST_PRACTICE_TAGS.slice(0, 12).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSuggestPracticeTags((t) => toggleInList(t, tag))}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs transition',
                    suggestPracticeTags.includes(tag)
                      ? 'border-[var(--cdc-teal)] bg-[var(--cdc-teal)]/15'
                      : 'border-neutral-300 text-neutral-600 dark:border-neutral-600'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <fieldset className="space-y-3">
            <legend className={labelClass}>Optional links</legend>
            <input id="website" name="website" type="url" className={inputClass} placeholder="Website" />
            <input id="instagram" name="instagram" className={inputClass} placeholder="Instagram" />
            <input id="linkedin" name="linkedin" className={inputClass} placeholder="LinkedIn" />
          </fieldset>
          <fieldset className="space-y-3">
            <legend className={labelClass}>Your contact (optional)</legend>
            <input id="suggesterName" name="suggesterName" className={inputClass} placeholder="Your name" />
            <input id="suggesterEmail" name="suggesterEmail" type="email" className={inputClass} placeholder="Your email" />
          </fieldset>

          {errorMessage ? <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:w-auto dark:bg-neutral-100 dark:text-neutral-900"
          >
            {status === 'loading' ? 'Submitting…' : DCC_SIGNUP_COPY.suggestCta}
          </button>
        </form>
      ) : (
        <form onSubmit={handleJoinSubmit} className="space-y-8">
          {!compactHeader ? (
            <header className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
                {DCC_SIGNUP_COPY.title}
              </h1>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{DCC_SIGNUP_COPY.subtitle}</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {DCC_SIGNUP_COPY.intro}
              </p>
            </header>
          ) : null}

          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Basic info</legend>
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name <span className="text-red-500">*</span>
              </label>
              <input id="fullName" name="fullName" required className={inputClass} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email <span className="text-red-500">*</span>
              </label>
              <input id="email" name="email" type="email" required className={inputClass} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="city" className={labelClass}>
                City <span className="text-red-500">*</span>
              </label>
              <input id="city" name="city" required className={inputClass} autoComplete="address-level2" />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Who are you?</legend>
            <div>
              <label htmlFor="contactCategory" className={labelClass}>
                Which best describes you? <span className="text-red-500">*</span>
              </label>
              <select
                id="contactCategory"
                value={contactCategory}
                onChange={(e) => setContactCategory(e.target.value)}
                className={inputClass}
                required
              >
                {CONTACT_CATEGORY_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className={labelClass}>
                What areas does your work touch? <span className="text-red-500">*</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRACTICE_TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setPracticeTags((t) => toggleInList(t, tag))}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs transition',
                      practiceTags.includes(tag)
                        ? 'border-[var(--cdc-teal)] bg-[var(--cdc-teal)]/15'
                        : 'border-neutral-300 text-neutral-600 dark:border-neutral-600'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Digital orientation</legend>
            <div>
              <label htmlFor="digitalOrientationStatement" className={labelClass}>
                What is one way your work connects to digital culture? <span className="text-red-500">*</span>
              </label>
              <textarea id="digitalOrientationStatement" name="digitalOrientationStatement" required rows={4} className={inputClass} />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Public / professional signifier</legend>
            {socialWarning ? <p className="text-xs text-amber-700 dark:text-amber-300">{DCC_SIGNUP_COPY.socialHint}</p> : null}
            <input id="website" name="website" type="url" className={inputClass} placeholder="Website or portfolio" />
            <input id="instagram" name="instagram" className={inputClass} placeholder="Instagram or social link" />
            <input id="linkedin" name="linkedin" className={inputClass} placeholder="LinkedIn or professional profile" />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Interests</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTEREST_TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setInterestTags((t) => toggleInList(t, tag))}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs transition',
                    interestTags.includes(tag)
                      ? 'border-[var(--cdc-teal)] bg-[var(--cdc-teal)]/15'
                      : 'border-neutral-300 text-neutral-600 dark:border-neutral-600'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Consent</legend>
            <div className="space-y-2">
              {(
                [
                  ['yes', 'Yes, DCC can contact me'],
                  ['specific', 'Only about specific opportunities'],
                  ['no', 'No, not right now'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={consentAnswer === value} onChange={() => setConsentAnswer(value)} required />
                  {label}
                </label>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.target.checked)} />
              Would you like to receive occasional DCC updates?
            </label>
            <div className="space-y-2">
              <p className={labelClass}>
                Can DCC eventually list your profile publicly? <span className="text-red-500">*</span>
              </p>
              {(
                [
                  ['yes', 'Yes, you can list my public profile once DCC reviews it'],
                  ['ask', 'Ask me before publishing'],
                  ['no', 'No, do not publish publicly'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={publicListingConsent === value}
                    onChange={() => setPublicListingConsent(value)}
                    required
                  />
                  {label}
                </label>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={researchContributor} onChange={(e) => setResearchContributor(e.target.checked)} />
              I&apos;d also like to help build the Research View
            </label>
          </fieldset>

          {errorMessage ? <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={status === 'loading' || practiceTags.length === 0 || interestTags.length === 0}
            className="w-full rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:w-auto dark:bg-neutral-100 dark:text-neutral-900"
          >
            {status === 'loading' ? 'Submitting…' : DCC_SIGNUP_COPY.cta}
          </button>
        </form>
      )}
    </div>
  )
}

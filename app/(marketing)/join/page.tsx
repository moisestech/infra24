import { redirect } from 'next/navigation'

type Props = {
  searchParams?: Record<string, string | string[] | undefined>
}

/** Canonical short link → network signup (preserves campaign query params). */
export default function JoinRedirectPage({ searchParams }: Props) {
  const params = new URLSearchParams()
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === 'string') params.set(key, value)
      else if (Array.isArray(value)) value.forEach((v) => params.append(key, v))
    }
  }
  if (!params.has('utm_source') && !params.has('source')) {
    params.set('utm_source', 'web')
    params.set('utm_medium', 'link')
    params.set('utm_campaign', 'dcc_general')
  }
  const qs = params.toString()
  redirect(qs ? `/network/signup?${qs}` : '/network/signup')
}

import { redirect } from 'next/navigation'

type SearchParams = Record<string, string | string[] | undefined>

export default function FabricateQuoteRedirectPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (typeof value === 'string') params.set(key, value)
    else if (Array.isArray(value)) value.forEach((v) => params.append(key, v))
  }
  const qs = params.toString()
  redirect(qs ? `/fabricate/start?${qs}` : '/fabricate/start')
}

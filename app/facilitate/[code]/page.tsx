import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FacilitatorConsole } from '@/components/workshop-engine/FacilitatorConsole'
import { getLiveSessionByCode } from '@/lib/workshop-engine/session-store'
import { normalizeJoinCode } from '@/lib/workshop-engine/join-code'
import { headers } from 'next/headers'

type Props = { params: Promise<{ code: string }> | { code: string } }

function originFromHeaders(h: Headers): string {
  const host = h.get('x-forwarded-host') || h.get('host')
  const proto = h.get('x-forwarded-proto') || 'https'
  if (!host) return process.env.NEXT_PUBLIC_APP_URL || 'https://infra24.com'
  return `${proto}://${host}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await Promise.resolve(params)
  return {
    title: `Facilitate ${normalizeJoinCode(code)}`,
    robots: { index: false, follow: false },
  }
}

export default async function FacilitatePage({ params }: Props) {
  const { code: raw } = await Promise.resolve(params)
  const code = normalizeJoinCode(raw)
  const session = await getLiveSessionByCode(code)
  if (!session) notFound()
  const h = await headers()
  const origin = originFromHeaders(h)

  return (
    <FacilitatorConsole code={session.joinCode} initialSession={session} origin={origin} />
  )
}

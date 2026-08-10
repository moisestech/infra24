import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ParticipantSessionClient } from '@/components/workshop-engine/ParticipantSessionClient'
import { getLiveSessionByCode } from '@/lib/workshop-engine/session-store'
import { normalizeJoinCode } from '@/lib/workshop-engine/join-code'

type Props = { params: Promise<{ code: string }> | { code: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await Promise.resolve(params)
  return {
    title: `Join ${normalizeJoinCode(code)}`,
    robots: { index: false, follow: false },
  }
}

export default async function SessionJoinPage({ params }: Props) {
  const { code: raw } = await Promise.resolve(params)
  const code = normalizeJoinCode(raw)
  const session = await getLiveSessionByCode(code)
  if (!session) notFound()

  return <ParticipantSessionClient code={session.joinCode} initialSession={session} />
}

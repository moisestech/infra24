import type { Metadata } from 'next'
import { DccSignupQrDisplay } from '@/components/dcc/signup/DccSignupQrDisplay'

export const metadata: Metadata = {
  title: 'DCC Signup QR',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams?: { source?: string }
}

export default function DccSignupQrPage({ searchParams }: Props) {
  const source = searchParams?.source?.trim() || 'born-digital-era-may'
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-neutral-100 px-4 py-12 dark:bg-neutral-950">
      <DccSignupQrDisplay signupUrl="/dcc/signup" source={source} />
    </div>
  )
}
